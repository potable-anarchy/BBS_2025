/**
 * Session Manager
 * Handles ephemeral session tracking with lightweight in-memory storage
 */

const crypto = require('crypto');
const logger = require('../utils/logger');

class SessionManager {
  constructor() {
    // In-memory session storage: sessionId -> session data
    this.sessions = new Map();
    // Socket to session mapping: socketId -> sessionId
    this.socketToSession = new Map();
  }

  /**
   * Generate ephemeral session ID
   * @returns {string} Unique session ID
   */
  generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Create a new session
   * @param {string} socketId - Socket.IO socket ID
   * @param {string} username - Username from client (LocalStorage)
   * @returns {object} Session data
   */
  createSession(socketId, username = 'Anonymous') {
    const sessionId = this.generateSessionId();
    const session = {
      sessionId,
      socketId,
      username,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      activities: [],
      rooms: [],
      currentBoard: null, // Track current board for command system
    };

    this.sessions.set(sessionId, session);
    this.socketToSession.set(socketId, sessionId);

    logger.logSession('created', sessionId, {
      socketId,
      username,
    });

    return session;
  }

  /**
   * Get session by socket ID
   * @param {string} socketId - Socket.IO socket ID
   * @returns {object|null} Session data or null
   */
  getSessionBySocketId(socketId) {
    const sessionId = this.socketToSession.get(socketId);
    return sessionId ? this.sessions.get(sessionId) : null;
  }

  /**
   * Get session by session ID
   * @param {string} sessionId - Session ID
   * @returns {object|null} Session data or null
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Update session username
   * @param {string} socketId - Socket.IO socket ID
   * @param {string} username - New username
   * @returns {boolean} Success status
   */
  updateUsername(socketId, username) {
    const session = this.getSessionBySocketId(socketId);
    if (!session) return false;

    const oldUsername = session.username;
    session.username = username;
    session.lastActivity = new Date().toISOString();

    logger.info('Username updated', {
      sessionId: session.sessionId,
      oldUsername,
      newUsername: username,
    });

    return true;
  }

  /**
   * Log user activity
   * @param {string} socketId - Socket.IO socket ID
   * @param {string} command - Command/action performed
   * @param {object} data - Additional activity data
   */
  logActivity(socketId, command, data = {}) {
    const session = this.getSessionBySocketId(socketId);
    if (!session) return;

    const activity = {
      timestamp: new Date().toISOString(),
      command,
      ...data,
    };

    session.activities.push(activity);
    session.lastActivity = activity.timestamp;

    logger.logActivity(session.username, command, {
      sessionId: session.sessionId,
      ...data,
    });
  }

  /**
   * Add room to session
   * @param {string} socketId - Socket.IO socket ID
   * @param {string} room - Room name
   */
  joinRoom(socketId, room) {
    const session = this.getSessionBySocketId(socketId);
    if (!session) return;

    if (!session.rooms.includes(room)) {
      session.rooms.push(room);
    }

    this.logActivity(socketId, 'join-room', { room });
  }

  /**
   * Remove room from session
   * @param {string} socketId - Socket.IO socket ID
   * @param {string} room - Room name
   */
  leaveRoom(socketId, room) {
    const session = this.getSessionBySocketId(socketId);
    if (!session) return;

    session.rooms = session.rooms.filter((r) => r !== room);
    this.logActivity(socketId, 'leave-room', { room });
  }

  /**
   * Destroy session
   * @param {string} socketId - Socket.IO socket ID
   */
  destroySession(socketId) {
    const sessionId = this.socketToSession.get(socketId);
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (session) {
      const duration = Date.now() - new Date(session.createdAt).getTime();
      logger.logSession('destroyed', sessionId, {
        username: session.username,
        duration: `${Math.round(duration / 1000)}s`,
        activitiesCount: session.activities.length,
      });
    }

    this.sessions.delete(sessionId);
    this.socketToSession.delete(socketId);
  }

  /**
   * Get all active sessions
   * @returns {Array} Array of session data
   */
  getActiveSessions() {
    return Array.from(this.sessions.values());
  }

  /**
   * Get session statistics
   * @returns {object} Session statistics
   */
  getStats() {
    const sessions = this.getActiveSessions();
    return {
      activeSessions: sessions.length,
      totalActivities: sessions.reduce((sum, s) => sum + s.activities.length, 0),
      usernames: [...new Set(sessions.map((s) => s.username))],
    };
  }
}

// Export singleton instance
module.exports = new SessionManager();
