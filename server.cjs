const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const dbManager = require('./database/db.cjs');
const { ChatHandler } = require('./src/chat/chatHandler.cjs');
const CommandHandler = require('./backend/commands/commandHandler');
const ChatService = require('./services/chatService.cjs');

// Import session management, logging, and Kiro hooks
const sessionManager = require('./services/sessionManager.cjs');
const logger = require('./utils/logger.cjs');
const sysop = require('./services/sysopInstance.cjs');

// Environment variable validation - removed KIRO_API_KEY requirement
const requiredEnvVars = [];
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
  pingTimeout: 30000,  // Reduced from 60s to 30s for faster dead connection detection
  pingInterval: 15000  // Reduced from 25s to 15s for more frequent health checks
});

// Initialize chat handler
const chatHandler = new ChatHandler(io);

// Initialize command handler
const commandHandler = new CommandHandler(io, sessionManager);
commandHandler.setupCommandNamespace();

// Security middleware (with CSP adjusted for production)
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  } : false,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from Vite build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Import and use board routes
const boardRoutes = require('./routes/boards.cjs');
app.use('/api', boardRoutes);

// Kiro API routes removed - using Gemini AI instead

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

  // Trigger SysOp AI on user login
  sysop.onUserLogin(session.username, session.sessionId).then(greeting => {
    if (greeting) {
      // Send SYSOP-13 greeting to the user
      socket.emit('sysop-message', {
        message: greeting,
        from: 'SYSOP-13',
        timestamp: new Date().toISOString(),
        type: 'greeting'
      });
      
      // Also broadcast to all users that someone connected
      io.emit('system-message', {
        message: `${session.username} has connected to The Dead Net`,
        type: 'user-join',
        timestamp: new Date().toISOString()
      });
    }
  }).catch(error => {
    logger.error('Error in SysOp login hook', { error: error.message });
  });
  
  // Set up idle detection (5 minutes)
  let idleTimer;
  const IDLE_TIME = 5 * 60 * 1000; // 5 minutes
  
  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      // Send haunted message to idle user
      sysop.onIdle(session.username).then(message => {
        if (message) {
          socket.emit('sysop-message', {
            message: message,
            from: 'SYSTEM',
            timestamp: new Date().toISOString(),
            type: 'idle-haunting'
          });
        }
      });
    }, IDLE_TIME);
  };
  
  // Start idle timer
  resetIdleTimer();
  
  // Reset idle timer on any user activity
  socket.on('user-activity', resetIdleTimer);
  socket.on('message', resetIdleTimer);
  socket.on('chat:send', resetIdleTimer);
  socket.on('update-username', resetIdleTimer);

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

  // Handle global chat message
  socket.on('chat:send', async (data) => {
    const session = sessionManager.getSessionBySocketId(socket.id);
    const username = session?.username || 'Anonymous';

    try {
      // Save message to database
      const savedMessage = await chatService.saveMessage(
        username,
        data.message,
        session?.sessionId
      );

      // Broadcast to all connected clients
      io.emit('chat:message', {
        id: savedMessage.id,
        user: savedMessage.user,
        message: savedMessage.message,
        userColor: savedMessage.user_color,
        timestamp: savedMessage.timestamp
      });

      logger.info('Chat message broadcasted', {
        username,
        messageId: savedMessage.id
      });

      // Log activity
      sessionManager.logActivity(socket.id, 'chat:send', {
        messageLength: data.message.length
      });
    } catch (error) {
      logger.error('Error handling chat message:', error);
      socket.emit('chat:error', {
        error: 'Failed to send message'
      });
    }
  });

  // Handle request for recent chat messages
  socket.on('chat:history', async (data) => {
    try {
      const limit = data?.limit || 50;
      const messages = await chatService.getRecentMessages(limit);

      socket.emit('chat:history', messages);

      logger.debug('Chat history sent', {
        socketId: socket.id,
        messageCount: messages.length
      });
    } catch (error) {
      logger.error('Error fetching chat history:', error);
      socket.emit('chat:error', {
        error: 'Failed to fetch chat history'
      });
    }
  });

  // Handle request for user color
  socket.on('chat:getColor', async (data) => {
    try {
      const username = data?.username || session?.username || 'Anonymous';
      const color = await chatService.getUserColor(username);

      socket.emit('chat:color', { username, color });
    } catch (error) {
      logger.error('Error getting user color:', error);
      socket.emit('chat:error', {
        error: 'Failed to get user color'
      });
    }
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
    
    // Clear idle timer
    clearTimeout(idleTimer);

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

// 404 handler for all environments
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

// Initialize database and chat service before starting server
let chatService;

(async () => {
  try {
    dbManager.initialize();
    console.log('Database initialized successfully');

    // Create chat service after database is initialized
    chatService = new ChatService(dbManager.db);
    await chatService.initialize();
    console.log('Chat service initialized successfully');
  } catch (error) {
    console.error('Failed to initialize:', error);
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
})();

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
