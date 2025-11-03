const { validateBoardAccess, validateMessage } = require('./middleware.cjs');
const { SessionManager } = require('./sessionManager.cjs');

class ChatHandler {
  constructor(io) {
    this.io = io;
    this.sessionManager = new SessionManager();
    this.chatNamespace = io.of('/chat');
    this.setupChatNamespace();
  }

  setupChatNamespace() {
    this.chatNamespace.use(validateBoardAccess);

    this.chatNamespace.on('connection', (socket) => {
      console.log(`Chat client connected: ${socket.id}`);

      // Extract user info from handshake
      const { userId, username, boardId } = socket.handshake.auth;

      if (!boardId) {
        socket.disconnect(true);
        return;
      }

      // Track user session
      this.sessionManager.addSession(socket.id, {
        userId,
        username,
        boardId,
        connectedAt: new Date()
      });

      // Join board-specific room
      this.handleJoinBoard(socket, boardId);

      // Set up event handlers
      this.setupEventHandlers(socket);
    });
  }

  setupEventHandlers(socket) {
    const session = this.sessionManager.getSession(socket.id);
    if (!session) return;

    const { boardId, userId, username } = session;

    // Handle chat messages
    socket.on('chat:message', async (data) => {
      try {
        const validatedMessage = validateMessage(data);

        const message = {
          id: this.generateMessageId(),
          boardId,
          userId,
          username,
          content: validatedMessage.content,
          timestamp: new Date().toISOString(),
          type: validatedMessage.type || 'text'
        };

        // Broadcast to all users in the board room
        this.chatNamespace.to(`board:${boardId}`).emit('chat:message', message);

        // Send acknowledgment to sender
        socket.emit('chat:message:ack', { messageId: message.id });

        console.log(`Message sent in board ${boardId} by ${username}: ${message.content}`);
      } catch (error) {
        socket.emit('chat:error', { error: error.message });
        console.error('Message error:', error);
      }
    });

    // Handle typing indicators
    socket.on('chat:typing:start', () => {
      socket.to(`board:${boardId}`).emit('chat:typing:start', {
        userId,
        username
      });
    });

    socket.on('chat:typing:stop', () => {
      socket.to(`board:${boardId}`).emit('chat:typing:stop', {
        userId
      });
    });

    // Handle user presence
    socket.on('chat:presence', (status) => {
      this.sessionManager.updatePresence(socket.id, status);
      socket.to(`board:${boardId}`).emit('chat:user:presence', {
        userId,
        username,
        status
      });
    });

    // Handle message reactions
    socket.on('chat:reaction', (data) => {
      const { messageId, reaction } = data;
      this.chatNamespace.to(`board:${boardId}`).emit('chat:reaction', {
        messageId,
        userId,
        username,
        reaction,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Chat client disconnected: ${socket.id}, reason: ${reason}`);

      // Notify other users in the board
      socket.to(`board:${boardId}`).emit('chat:user:left', {
        userId,
        username,
        timestamp: new Date().toISOString()
      });

      // Clean up session
      this.sessionManager.removeSession(socket.id);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
      socket.emit('chat:error', { error: 'An error occurred' });
    });
  }

  handleJoinBoard(socket, boardId) {
    const roomName = `board:${boardId}`;
    socket.join(roomName);

    const session = this.sessionManager.getSession(socket.id);
    const { userId, username } = session;

    console.log(`User ${username} (${socket.id}) joined board: ${boardId}`);

    // Get current users in the board
    const boardUsers = this.sessionManager.getBoardUsers(boardId);

    // Notify user about who's in the room
    socket.emit('chat:board:joined', {
      boardId,
      users: boardUsers,
      timestamp: new Date().toISOString()
    });

    // Notify others about new user
    socket.to(roomName).emit('chat:user:joined', {
      userId,
      username,
      timestamp: new Date().toISOString()
    });
  }

  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Admin/utility methods
  getBoardConnections(boardId) {
    return this.sessionManager.getBoardUsers(boardId);
  }

  disconnectUser(socketId, reason = 'Admin disconnect') {
    const socket = this.chatNamespace.sockets.get(socketId);
    if (socket) {
      socket.disconnect(true);
    }
  }

  broadcastToBoard(boardId, event, data) {
    this.chatNamespace.to(`board:${boardId}`).emit(event, data);
  }
}

module.exports = { ChatHandler };
