/**
 * The Dead Net - Server Integration Example
 *
 * This file demonstrates how to integrate ASCII art assets into the
 * Socket.IO server for The Dead Net BBS.
 *
 * This is an EXAMPLE file showing integration patterns.
 * Adapt these patterns to your actual server implementation.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const ascii = require('./ascii-art');

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
  cors: corsOptions
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// ASCII ART ENDPOINTS
// ============================================================================

// API endpoint to fetch ASCII art assets
app.get('/api/ascii/logo/:type', (req, res) => {
  const { type } = req.params;
  const logo = ascii.LOGOS[type];

  if (logo) {
    res.json({ art: logo });
  } else {
    res.status(404).json({ error: 'Logo type not found' });
  }
});

// Get board header
app.get('/api/ascii/board/:name', (req, res) => {
  const { name } = req.params;
  const header = ascii.BOARD_HEADERS[name];

  if (header) {
    res.json({ art: header });
  } else {
    res.status(404).json({ error: 'Board header not found' });
  }
});

// Get system message
app.get('/api/ascii/message/:type', (req, res) => {
  const { type } = req.params;
  const message = ascii.SYSTEM_MESSAGES[type];

  if (message) {
    res.json({ art: message });
  } else {
    res.status(404).json({ error: 'System message not found' });
  }
});

// Get all available ASCII art
app.get('/api/ascii/all', (req, res) => {
  res.json({
    logos: Object.keys(ascii.LOGOS),
    boardHeaders: Object.keys(ascii.BOARD_HEADERS),
    systemMessages: Object.keys(ascii.SYSTEM_MESSAGES),
    menus: Object.keys(ascii.MENUS)
  });
});

// ============================================================================
// SOCKET.IO EVENT HANDLERS WITH ASCII ART
// ============================================================================

// Track connected users
const connectedUsers = new Map();
let connectionCounter = 0;

io.on('connection', (socket) => {
  connectionCounter++;
  const userSession = {
    id: socket.id,
    connectedAt: new Date(),
    currentBoard: null,
    username: null
  };

  console.log(`Client connected: ${socket.id} (Total: ${connectionCounter})`);

  // ========================================
  // WELCOME SEQUENCE
  // ========================================

  // Send welcome screen immediately
  socket.emit('ascii-art', {
    type: 'welcome',
    content: ascii.SYSTEM_MESSAGES.welcome
  });

  // Send connection status after short delay
  setTimeout(() => {
    socket.emit('ascii-art', {
      type: 'connected',
      content: ascii.SYSTEM_MESSAGES.connected
    });

    // Send status line with connection info
    socket.emit('ascii-art', {
      type: 'status',
      content: ascii.createStatusLine(
        `Connection #${connectionCounter}`,
        `Users online: ${io.engine.clientsCount}`
      )
    });

    // Send main menu after another delay
    setTimeout(() => {
      socket.emit('ascii-art', {
        type: 'menu',
        content: ascii.MENUS.main
      });
    }, 500);
  }, 1000);

  // ========================================
  // USER AUTHENTICATION
  // ========================================

  socket.on('login-request', (data) => {
    // Show login screen
    socket.emit('ascii-art', {
      type: 'login',
      content: ascii.SYSTEM_MESSAGES.login
    });
  });

  socket.on('login', (credentials) => {
    // Simulate authentication (replace with real auth)
    if (credentials && credentials.username) {
      userSession.username = credentials.username;
      connectedUsers.set(socket.id, userSession);

      // Send success message
      socket.emit('ascii-art', {
        type: 'loginSuccess',
        content: ascii.SYSTEM_MESSAGES.loginSuccess
      });

      // Send personalized welcome
      const welcomeMessage = ascii.createBox(
        `Welcome back, ${credentials.username}!\n\n` +
        `Last login: Never (First time)\n` +
        `Messages: 0 new\n` +
        `Reputation: ${ascii.UI_ELEMENTS.indicators.star.repeat(3)}`,
        60,
        'double'
      );

      socket.emit('ascii-art', {
        type: 'custom',
        content: welcomeMessage
      });

      // Broadcast to others
      socket.broadcast.emit('user-event', {
        message: `${credentials.username} has connected`,
        status: ascii.UI_ELEMENTS.status.online
      });
    } else {
      socket.emit('ascii-art', {
        type: 'error',
        content: ascii.SYSTEM_MESSAGES.error
      });
    }
  });

  // ========================================
  // BOARD NAVIGATION
  // ========================================

  socket.on('list-boards', () => {
    socket.emit('ascii-art', {
      type: 'boardList',
      content: ascii.MENUS.boardList
    });
  });

  socket.on('select-board', (boardName) => {
    const validBoards = Object.keys(ascii.BOARD_HEADERS);

    if (validBoards.includes(boardName)) {
      userSession.currentBoard = boardName;

      // Send board header
      socket.emit('ascii-art', {
        type: 'boardHeader',
        content: ascii.BOARD_HEADERS[boardName]
      });

      // Send sample board content (replace with real data)
      const boardContent = [
        ascii.createMenuItem('1', 'Welcome to the board!', 'by: sysop - 1h ago', false),
        ascii.createMenuItem('2', 'Important announcement', 'by: admin - 2h ago', false),
        ascii.createMenuItem('3', 'General discussion', 'by: user123 - 3h ago', false),
        '',
        ascii.UI_ELEMENTS.dividers.dashed,
        ascii.createStatusLine('[N]ew Post  [R]efresh', 'Page 1/5  [Q]uit')
      ].join('\n');

      socket.emit('ascii-art', {
        type: 'boardContent',
        content: boardContent
      });
    } else {
      socket.emit('ascii-art', {
        type: 'error',
        content: ascii.createBox('Board not found', 50, 'single')
      });
    }
  });

  // ========================================
  // MESSAGING
  // ========================================

  socket.on('send-message', (data) => {
    const username = userSession.username || 'Anonymous';
    const timestamp = new Date().toLocaleTimeString();

    // Format message with ASCII decorations
    const formattedMessage = `[${timestamp}] <${username}> ${data.text}`;

    // Broadcast to room or all users
    if (data.room) {
      io.to(data.room).emit('message', {
        formatted: formattedMessage,
        ...data,
        timestamp,
        username
      });
    } else {
      io.emit('message', {
        formatted: formattedMessage,
        ...data,
        timestamp,
        username
      });
    }
  });

  // ========================================
  // FILE OPERATIONS
  // ========================================

  socket.on('request-file-list', () => {
    socket.emit('ascii-art', {
      type: 'fileHeader',
      content: ascii.BOARD_HEADERS.files
    });

    // Sample file list
    const fileList = [
      ascii.createMenuItem('1', 'retro-games.zip', '2.4 MB - Downloads: 42', false),
      ascii.createMenuItem('2', 'bbs-tools.tar.gz', '1.8 MB - Downloads: 28', false),
      ascii.createMenuItem('3', 'ascii-art-pack.zip', '512 KB - Downloads: 156', false),
      '',
      ascii.createStatusLine('[D]ownload  [U]pload', 'Files: 3  [B]ack')
    ].join('\n');

    socket.emit('ascii-art', {
      type: 'fileList',
      content: fileList
    });
  });

  socket.on('download-file', (fileId) => {
    // Simulate file download with progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;

      const progressBar = ascii.createProgressBar(progress, 60, 'blocks');
      socket.emit('download-progress', {
        progress,
        display: progressBar
      });

      if (progress >= 100) {
        clearInterval(progressInterval);
        socket.emit('ascii-art', {
          type: 'success',
          content: ascii.createBox(
            ascii.UI_ELEMENTS.status.success + '\n\nDownload complete!',
            50,
            'double'
          )
        });
      }
    }, 500);
  });

  // ========================================
  // USER DIRECTORY
  // ========================================

  socket.on('list-users', () => {
    socket.emit('ascii-art', {
      type: 'userHeader',
      content: ascii.BOARD_HEADERS.users
    });

    // List connected users
    const userList = Array.from(connectedUsers.values())
      .map((user, index) => {
        const status = user.username ? ascii.UI_ELEMENTS.status.online : ascii.UI_ELEMENTS.status.connecting;
        const name = user.username || 'Guest';
        return ascii.createMenuItem(
          (index + 1).toString(),
          name,
          status,
          false
        );
      })
      .join('\n');

    socket.emit('ascii-art', {
      type: 'userList',
      content: userList
    });
  });

  // ========================================
  // ROOM MANAGEMENT
  // ========================================

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);

    // Notify room
    const joinMessage = ascii.createBox(
      `${userSession.username || 'A user'} has joined the room`,
      60,
      'single'
    );

    socket.to(room).emit('room-event', {
      type: 'user-joined',
      content: joinMessage,
      socketId: socket.id
    });

    // Send room info to user
    socket.emit('ascii-art', {
      type: 'roomInfo',
      content: ascii.createStatusLine(
        `Joined: ${room}`,
        `Users in room: ${io.sockets.adapter.rooms.get(room)?.size || 0}`
      )
    });
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room: ${room}`);

    socket.to(room).emit('room-event', {
      type: 'user-left',
      socketId: socket.id
    });
  });

  // ========================================
  // ADMIN FUNCTIONS
  // ========================================

  socket.on('admin-access', (credentials) => {
    // Simple admin check (replace with real authentication)
    if (credentials && credentials.isAdmin) {
      socket.emit('ascii-art', {
        type: 'adminHeader',
        content: ascii.BOARD_HEADERS.admin
      });

      const adminMenu = [
        ascii.createMenuItem('1', 'User Management', 'Manage users', false),
        ascii.createMenuItem('2', 'System Status', 'View stats', false),
        ascii.createMenuItem('3', 'Broadcast Message', 'Send to all', false),
        '',
        ascii.createStatusLine(
          `Connected: ${io.engine.clientsCount}`,
          `Total Sessions: ${connectionCounter}`
        )
      ].join('\n');

      socket.emit('ascii-art', {
        type: 'adminMenu',
        content: adminMenu
      });
    } else {
      socket.emit('ascii-art', {
        type: 'accessDenied',
        content: ascii.SYSTEM_MESSAGES.accessDenied
      });
    }
  });

  socket.on('broadcast-message', (data) => {
    // Admin broadcast with special formatting
    const broadcast = ascii.createBox(
      `${ascii.UI_ELEMENTS.indicators.star} SYSTEM ANNOUNCEMENT ${ascii.UI_ELEMENTS.indicators.star}\n\n` +
      data.message,
      75,
      'double'
    );

    io.emit('system-broadcast', {
      content: broadcast,
      timestamp: new Date().toISOString()
    });
  });

  // ========================================
  // DISCONNECT HANDLING
  // ========================================

  socket.on('logout', () => {
    socket.emit('ascii-art', {
      type: 'goodbye',
      content: ascii.SYSTEM_MESSAGES.goodbye
    });

    setTimeout(() => {
      socket.disconnect(true);
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id} (Remaining: ${io.engine.clientsCount})`);

    const user = connectedUsers.get(socket.id);
    if (user && user.username) {
      // Notify others
      socket.broadcast.emit('user-event', {
        message: `${user.username} has disconnected`,
        status: ascii.UI_ELEMENTS.status.offline
      });
    }

    connectedUsers.delete(socket.id);
  });

  // ========================================
  // ERROR HANDLING
  // ========================================

  socket.on('error', (error) => {
    console.error('Socket error:', error);

    socket.emit('ascii-art', {
      type: 'error',
      content: ascii.createBox(
        `${ascii.UI_ELEMENTS.status.error}\n\n${error.message || 'An error occurred'}`,
        60,
        'single'
      )
    });
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.clear();
  console.log(ascii.LOGOS.compact);
  console.log(ascii.createDivider('SERVER STATUS', '═', 60));
  console.log(ascii.createStatusLine(`Port: ${PORT}`, 'Status: ' + ascii.UI_ELEMENTS.status.online));
  console.log(ascii.createStatusLine('Environment: ' + (process.env.NODE_ENV || 'development'), ''));
  console.log(ascii.UI_ELEMENTS.dividers.heavy.substring(0, 60));
  console.log('\nServer ready for connections...\n');
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGTERM', () => {
  console.log('\n' + ascii.createDivider('SHUTDOWN', '═', 60));
  console.log('SIGTERM received, closing server...');

  // Send shutdown message to all connected clients
  io.emit('system-shutdown', {
    content: ascii.createBox(
      'Server is shutting down\nPlease reconnect in a few moments',
      60,
      'double'
    )
  });

  server.close(() => {
    console.log(ascii.UI_ELEMENTS.status.offline + ' Server closed');
    process.exit(0);
  });
});

// Export for testing
module.exports = { app, server, io };
