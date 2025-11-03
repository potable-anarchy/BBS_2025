class SessionManager {
  constructor() {
    // Map of socketId -> session data
    this.sessions = new Map();

    // Map of boardId -> Set of socketIds
    this.boardConnections = new Map();

    // Map of userId -> Set of socketIds (for multi-device support)
    this.userConnections = new Map();
  }

  /**
   * Add a new session
   */
  addSession(socketId, sessionData) {
    const { userId, username, boardId, connectedAt } = sessionData;

    // Store session
    this.sessions.set(socketId, {
      socketId,
      userId,
      username,
      boardId,
      connectedAt,
      lastActivity: new Date(),
      presence: 'online'
    });

    // Track board connections
    if (!this.boardConnections.has(boardId)) {
      this.boardConnections.set(boardId, new Set());
    }
    this.boardConnections.get(boardId).add(socketId);

    // Track user connections (multi-device)
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId).add(socketId);

    console.log(`Session added: ${socketId} for user ${username} on board ${boardId}`);
    return this.sessions.get(socketId);
  }

  /**
   * Get session data by socket ID
   */
  getSession(socketId) {
    return this.sessions.get(socketId);
  }

  /**
   * Remove a session
   */
  removeSession(socketId) {
    const session = this.sessions.get(socketId);
    if (!session) return null;

    const { userId, boardId } = session;

    // Remove from sessions
    this.sessions.delete(socketId);

    // Remove from board connections
    if (this.boardConnections.has(boardId)) {
      this.boardConnections.get(boardId).delete(socketId);
      if (this.boardConnections.get(boardId).size === 0) {
        this.boardConnections.delete(boardId);
      }
    }

    // Remove from user connections
    if (this.userConnections.has(userId)) {
      this.userConnections.get(userId).delete(socketId);
      if (this.userConnections.get(userId).size === 0) {
        this.userConnections.delete(userId);
      }
    }

    console.log(`Session removed: ${socketId}`);
    return session;
  }

  /**
   * Update user presence
   */
  updatePresence(socketId, presence) {
    const session = this.sessions.get(socketId);
    if (session) {
      session.presence = presence;
      session.lastActivity = new Date();
    }
  }

  /**
   * Update last activity timestamp
   */
  updateActivity(socketId) {
    const session = this.sessions.get(socketId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  /**
   * Get all users in a specific board
   */
  getBoardUsers(boardId) {
    const socketIds = this.boardConnections.get(boardId);
    if (!socketIds) return [];

    const users = [];
    const uniqueUsers = new Set();

    for (const socketId of socketIds) {
      const session = this.sessions.get(socketId);
      if (session && !uniqueUsers.has(session.userId)) {
        uniqueUsers.add(session.userId);
        users.push({
          userId: session.userId,
          username: session.username,
          presence: session.presence,
          connectedAt: session.connectedAt,
          lastActivity: session.lastActivity
        });
      }
    }

    return users;
  }

  /**
   * Get all sockets for a specific user (multi-device support)
   */
  getUserSockets(userId) {
    return Array.from(this.userConnections.get(userId) || []);
  }

  /**
   * Check if a user is connected to a board
   */
  isUserInBoard(userId, boardId) {
    const socketIds = this.boardConnections.get(boardId);
    if (!socketIds) return false;

    for (const socketId of socketIds) {
      const session = this.sessions.get(socketId);
      if (session && session.userId === userId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get total connection count
   */
  getTotalConnections() {
    return this.sessions.size;
  }

  /**
   * Get board connection count
   */
  getBoardConnectionCount(boardId) {
    return this.boardConnections.get(boardId)?.size || 0;
  }

  /**
   * Get all active boards
   */
  getActiveBoards() {
    return Array.from(this.boardConnections.keys());
  }

  /**
   * Get session stats
   */
  getStats() {
    return {
      totalConnections: this.sessions.size,
      activeBoards: this.boardConnections.size,
      uniqueUsers: this.userConnections.size,
      boardStats: Array.from(this.boardConnections.entries()).map(([boardId, sockets]) => ({
        boardId,
        connections: sockets.size,
        users: this.getBoardUsers(boardId).length
      }))
    };
  }

  /**
   * Clean up inactive sessions (optional utility)
   */
  cleanupInactiveSessions(maxInactiveMinutes = 30) {
    const now = new Date();
    const sessionsToRemove = [];

    for (const [socketId, session] of this.sessions.entries()) {
      const inactiveMinutes = (now - session.lastActivity) / 1000 / 60;
      if (inactiveMinutes > maxInactiveMinutes) {
        sessionsToRemove.push(socketId);
      }
    }

    sessionsToRemove.forEach(socketId => this.removeSession(socketId));

    if (sessionsToRemove.length > 0) {
      console.log(`Cleaned up ${sessionsToRemove.length} inactive sessions`);
    }

    return sessionsToRemove.length;
  }
}

module.exports = { SessionManager };
