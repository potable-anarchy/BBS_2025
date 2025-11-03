const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const dbManager = require('./database/db');
const { ChatHandler } = require('./src/chat/chatHandler');

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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

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

// Default Socket.IO connection handling (for backward compatibility)
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle custom events
  socket.on('message', (data) => {
    console.log('Message received:', data);
    // Broadcast to all clients
    io.emit('message', { ...data, timestamp: new Date().toISOString() });
  });

  // Handle room joining
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
    socket.to(room).emit('user-joined', { socketId: socket.id });
  });

  // Handle room leaving
  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room: ${room}`);
    socket.to(room).emit('user-left', { socketId: socket.id });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
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
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    dbManager.close();
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
