const logger = require('../utils/logger.cjs');

/**
 * Chat Service
 * Manages global chat messages and user color assignments
 */
class ChatService {
  constructor(db) {
    this.db = db;
    this.colors = [
      '#00ff00', // Bright Green
      '#00ffff', // Cyan
      '#ffff00', // Yellow
      '#ff00ff', // Magenta
      '#ff8800', // Orange
      '#00ff88', // Mint
      '#8800ff', // Purple
      '#ff0088', // Pink
      '#88ff00', // Lime
      '#0088ff', // Sky Blue
      '#ff8888', // Light Red
      '#88ff88', // Light Green
      '#8888ff', // Light Blue
      '#ffff88', // Light Yellow
      '#ff88ff', // Light Magenta
      '#88ffff', // Light Cyan
    ];
  }

  /**
   * Initialize the chat service (run migrations)
   */
  async initialize() {
    try {
      const fs = require('fs');
      const path = require('path');
      const migrationPath = path.join(__dirname, '../database/migrations/003_add_global_chat.sql');

      if (fs.existsSync(migrationPath)) {
        const migration = fs.readFileSync(migrationPath, 'utf8');
        const statements = migration.split(';').filter(stmt => stmt.trim());

        for (const statement of statements) {
          if (statement.trim()) {
            await this.db.run(statement);
          }
        }
        logger.info('Chat service initialized successfully');
      }
    } catch (error) {
      logger.error('Failed to initialize chat service:', error);
      throw error;
    }
  }

  /**
   * Get or assign a color for a user
   * @param {string} username - The username
   * @returns {Promise<string>} The assigned color
   */
  async getUserColor(username) {
    try {
      // Check if user already has a color
      const existing = await this.db.get(
        'SELECT color FROM user_colors WHERE user = ?',
        [username]
      );

      if (existing) {
        // Update last seen
        await this.db.run(
          'UPDATE user_colors SET last_seen = CURRENT_TIMESTAMP WHERE user = ?',
          [username]
        );
        return existing.color;
      }

      // Assign a new color based on hash of username
      const colorIndex = this._hashUsername(username) % this.colors.length;
      const color = this.colors[colorIndex];

      // Save the color assignment
      await this.db.run(
        'INSERT INTO user_colors (user, color) VALUES (?, ?)',
        [username, color]
      );

      logger.info(`Assigned color ${color} to user ${username}`);
      return color;
    } catch (error) {
      logger.error('Error getting user color:', error);
      // Fallback to default green
      return '#00ff00';
    }
  }

  /**
   * Simple hash function for consistent color assignment
   * @param {string} str - String to hash
   * @returns {number} Hash value
   */
  _hashUsername(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Save a chat message
   * @param {string} user - Username
   * @param {string} message - Message content
   * @param {string} sessionId - Session ID (optional)
   * @returns {Promise<object>} The saved message
   */
  async saveMessage(user, message, sessionId = null) {
    try {
      const userColor = await this.getUserColor(user);

      const result = await this.db.run(
        `INSERT INTO chat_messages (user, message, user_color, session_id)
         VALUES (?, ?, ?, ?)`,
        [user, message, userColor, sessionId]
      );

      const savedMessage = await this.db.get(
        'SELECT * FROM chat_messages WHERE id = ?',
        [result.lastID]
      );

      logger.info(`Chat message saved: ${user}: ${message.substring(0, 50)}`);
      return savedMessage;
    } catch (error) {
      logger.error('Error saving chat message:', error);
      throw error;
    }
  }

  /**
   * Get recent chat messages
   * @param {number} limit - Number of messages to retrieve (default: 50)
   * @returns {Promise<Array>} Array of chat messages
   */
  async getRecentMessages(limit = 50) {
    try {
      const messages = await this.db.all(
        `SELECT id, user, message, user_color, timestamp
         FROM chat_messages
         ORDER BY timestamp DESC
         LIMIT ?`,
        [limit]
      );

      // Reverse to get chronological order
      return messages.reverse();
    } catch (error) {
      logger.error('Error getting recent messages:', error);
      return [];
    }
  }

  /**
   * Get messages since a specific timestamp
   * @param {string} since - ISO timestamp
   * @returns {Promise<Array>} Array of chat messages
   */
  async getMessagesSince(since) {
    try {
      const messages = await this.db.all(
        `SELECT id, user, message, user_color, timestamp
         FROM chat_messages
         WHERE timestamp > ?
         ORDER BY timestamp ASC`,
        [since]
      );

      return messages;
    } catch (error) {
      logger.error('Error getting messages since:', error);
      return [];
    }
  }

  /**
   * Get all user colors
   * @returns {Promise<object>} Map of username to color
   */
  async getAllUserColors() {
    try {
      const rows = await this.db.all('SELECT user, color FROM user_colors');
      const colorMap = {};
      rows.forEach(row => {
        colorMap[row.user] = row.color;
      });
      return colorMap;
    } catch (error) {
      logger.error('Error getting user colors:', error);
      return {};
    }
  }

  /**
   * Delete old messages (cleanup)
   * @param {number} daysOld - Delete messages older than this many days
   * @returns {Promise<number>} Number of deleted messages
   */
  async deleteOldMessages(daysOld = 30) {
    try {
      const result = await this.db.run(
        `DELETE FROM chat_messages
         WHERE timestamp < datetime('now', '-' || ? || ' days')`,
        [daysOld]
      );

      logger.info(`Deleted ${result.changes} old chat messages`);
      return result.changes;
    } catch (error) {
      logger.error('Error deleting old messages:', error);
      return 0;
    }
  }
}

module.exports = ChatService;
