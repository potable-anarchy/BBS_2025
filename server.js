const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const dbManager = require('./database/db');
const { ChatHandler } = require('./src/chat/chatHandler');
const CommandHandler = require('./backend/commands/commandHandler');

// Import session management and logging
const sessionManager = require('./services/sessionManager');
const logger = require('./utils/logger');

// Environment variable validation
const requiredEnvVars = ['KIRO_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('ERROR: Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`  - ${varName}`);
  });
  console.error('\nPlease create a .env file based on .env.example and set all required variables.');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: corsOptions,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Initialize chat handler
const chatHandler = new ChatHandler(io);

// Initialize command handler
const commandHandler = new CommandHandler(io, sessionManager);
commandHandler.setupCommandNamespace();

// Security middleware
app.use(helmet());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Import and use board routes
const boardRoutes = require('./routes/boards');
app.use('/api', boardRoutes);

// Chat stats endpoint
app.get('/api/chat/stats', (req, res) => {
  const stats = chatHandler.sessionManager.getStats();
  res.json(stats);
});

// Get board connections
app.get('/api/chat/boards/:boardId/users', (req, res) => {
  const { boardId } = req.params;
  const users = chatHandler.getBoardConnections(boardId);
  res.json({ boardId, users });
});

// Broadcast message to board (admin endpoint)
app.post('/api/chat/boards/:boardId/broadcast', (req, res) => {
  const { boardId } = req.params;
  const { event, data } = req.body;

  if (!event || !data) {
    return res.status(400).json({ error: 'Event and data are required' });
  }

  chatHandler.broadcastToBoard(boardId, event, data);
  res.json({ success: true, boardId, event });
});

// Session statistics endpoint (for legacy/general session management)
app.get('/api/sessions', (req, res) => {
  const stats = sessionManager.getStats();
  res.json(stats);
});

// Active sessions endpoint (for legacy/general session management)
app.get('/api/sessions/active', (req, res) => {
  const sessions = sessionManager.getActiveSessions();
  res.json(sessions);
});

// Socket.IO connection handling for general purpose (non-chat)
io.on('connection', (socket) => {
  // Extract username from handshake auth or use 'Anonymous'
  const username = socket.handshake.auth?.username || 'Anonymous';

  // Create session for new connection
  const session = sessionManager.createSession(socket.id, username);

  logger.info('Client connected', {
    socketId: socket.id,
    sessionId: session.sessionId,
    username: session.username,
  });

  // Send session info to client
  socket.emit('session-created', {
    sessionId: session.sessionId,
    username: session.username,
  });

  // Handle username update
  socket.on('update-username', (newUsername) => {
    const success = sessionManager.updateUsername(socket.id, newUsername);
    if (success) {
      socket.emit('username-updated', { username: newUsername });
    }
  });

  // Handle custom events
  socket.on('message', (data) => {
    const session = sessionManager.getSessionBySocketId(socket.id);
    logger.debug('Message received', {
      username: session?.username,
      data,
    });

    // Log activity
    sessionManager.logActivity(socket.id, 'message', {
      messageLength: data?.message?.length || 0
    });

    // Broadcast to all clients
    io.emit('message', {
      ...data,
      username: session?.username || 'Anonymous',
      timestamp: new Date().toISOString()
    });
  });

  // Handle room joining
  socket.on('join-room', (room) => {
    const session = sessionManager.getSessionBySocketId(socket.id);
    socket.join(room);

    // Track room in session
    sessionManager.joinRoom(socket.id, room);

    logger.info('User joined room', {
      socketId: socket.id,
      username: session?.username,
      room,
    });

    socket.to(room).emit('user-joined', {
      socketId: socket.id,
      username: session?.username || 'Anonymous',
    });
  });

  // Handle room leaving
  socket.on('leave-room', (room) => {
    const session = sessionManager.getSessionBySocketId(socket.id);
    socket.leave(room);

    // Remove room from session
    sessionManager.leaveRoom(socket.id, room);

    logger.info('User left room', {
      socketId: socket.id,
      username: session?.username,
      room,
    });

    socket.to(room).emit('user-left', {
      socketId: socket.id,
      username: session?.username || 'Anonymous',
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const session = sessionManager.getSessionBySocketId(socket.id);

    logger.info('Client disconnected', {
      socketId: socket.id,
      username: session?.username,
      sessionId: session?.sessionId,
    });

    // Clean up session
    sessionManager.destroySession(socket.id);
  });

  // Error handling
  socket.on('error', (error) => {
    const session = sessionManager.getSessionBySocketId(socket.id);

    logger.error('Socket error', {
      socketId: socket.id,
      username: session?.username,
      error: error.message,
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Express error', {
    error: err.message,
    stack: err.stack,
  });
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

// Initialize database before starting server
try {
  dbManager.initialize();
  console.log('Database initialized successfully');
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

server.listen(PORT, () => {
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
  });
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, initiating graceful shutdown');

  server.close(() => {
    dbManager.close();
    logger.info('Server closed successfully');
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing server...');
  server.close(() => {
    dbManager.close();
    console.log('Server closed');
    process.exit(0);
  });
});
