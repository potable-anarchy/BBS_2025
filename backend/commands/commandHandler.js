/**
 * Backend Command Handler
 * Processes commands received via WebSocket
 */

const logger = require('../utils/logger');

class CommandHandler {
  constructor(io, sessionManager) {
    this.io = io;
    this.sessionManager = sessionManager;
  }

  /**
   * Setup command namespace for WebSocket
   */
  setupCommandNamespace() {
    const commandNamespace = this.io.of('/commands');

    commandNamespace.on('connection', (socket) => {
      const { userId, username } = socket.handshake.auth;

      if (!username) {
        socket.emit('command:error', { error: 'Authentication required' });
        socket.disconnect();
        return;
      }

      // Create session for command user
      const session = this.sessionManager.createSession(socket.id, username);
      logger.logInfo(`Command session created for ${username}`, {
        sessionId: session.sessionId,
        socketId: socket.id,
      });

      // Handle command execution
      socket.on('command:execute', async (data) => {
        try {
          await this.handleCommand(socket, data, session);
        } catch (error) {
          logger.logError('Command execution error', error, {
            username,
            sessionId: session.sessionId,
          });
          socket.emit('command:error', {
            error: 'Command execution failed',
            details: error.message,
          });
        }
      });

      // Handle board join via command
      socket.on('command:join_board', async (data) => {
        try {
          await this.handleJoinBoard(socket, data, session);
        } catch (error) {
          logger.logError('Join board error', error, {
            username,
            sessionId: session.sessionId,
          });
          socket.emit('command:error', {
            error: 'Failed to join board',
            details: error.message,
          });
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        this.sessionManager.removeSession(socket.id);
        logger.logInfo(`Command session ended for ${username}`, {
          sessionId: session.sessionId,
        });
      });
    });

    return commandNamespace;
  }

  /**
   * Handle command execution
   */
  async handleCommand(socket, data, session) {
    const { command, args, boardId } = data;

    // Validate input
    if (!command || typeof command !== 'string') {
      socket.emit('command:error', { error: 'Invalid command' });
      return;
    }

    // Log activity
    this.sessionManager.logActivity(socket.id, command, {
      args,
      boardId,
    });

    // Build context
    const context = {
      sessionId: session.sessionId,
      socketId: socket.id,
      username: session.username,
      boardId: boardId || session.currentBoard,
      timestamp: new Date().toISOString(),
    };

    // Command will be processed by the frontend command executor
    // Backend just validates and logs
    socket.emit('command:ack', {
      command,
      timestamp: context.timestamp,
      sessionId: session.sessionId,
    });

    logger.logActivity(session.username, command, {
      sessionId: session.sessionId,
      args,
      boardId: context.boardId,
    });
  }

  /**
   * Handle joining a board
   */
  async handleJoinBoard(socket, data, session) {
    const { boardId } = data;

    if (!boardId || typeof boardId !== 'string') {
      socket.emit('command:error', { error: 'Invalid board ID' });
      return;
    }

    // Validate board ID format
    if (!/^[a-zA-Z0-9_-]+$/.test(boardId)) {
      socket.emit('command:error', {
        error: 'Invalid board ID format',
      });
      return;
    }

    // Leave previous board room if any
    if (session.currentBoard) {
      socket.leave(`board:${session.currentBoard}`);
      this.sessionManager.leaveRoom(socket.id, session.currentBoard);
    }

    // Join new board room
    socket.join(`board:${boardId}`);
    this.sessionManager.joinRoom(socket.id, boardId);
    session.currentBoard = boardId;

    // Notify success
    socket.emit('command:board_joined', {
      boardId,
      timestamp: new Date().toISOString(),
    });

    // Broadcast to board
    socket.to(`board:${boardId}`).emit('command:user_joined', {
      username: session.username,
      boardId,
      timestamp: new Date().toISOString(),
    });

    logger.logActivity(session.username, 'JOIN', {
      sessionId: session.sessionId,
      boardId,
    });
  }
}

module.exports = CommandHandler;
