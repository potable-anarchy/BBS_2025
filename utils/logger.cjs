/**
 * Lightweight logging utility for session and activity tracking
 * Provides structured logging with timestamps and levels
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL
      ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()]
      : LOG_LEVELS.INFO;
  }

  /**
   * Format log entry with timestamp and structured data
   */
  formatLog(level, message, data = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data,
    });
  }

  /**
   * Check if log level should be output
   */
  shouldLog(level) {
    return LOG_LEVELS[level] >= this.level;
  }

  debug(message, data = {}) {
    if (this.shouldLog('DEBUG')) {
      console.log(this.formatLog('DEBUG', message, data));
    }
  }

  info(message, data = {}) {
    if (this.shouldLog('INFO')) {
      console.log(this.formatLog('INFO', message, data));
    }
  }

  warn(message, data = {}) {
    if (this.shouldLog('WARN')) {
      console.warn(this.formatLog('WARN', message, data));
    }
  }

  error(message, data = {}) {
    if (this.shouldLog('ERROR')) {
      console.error(this.formatLog('ERROR', message, data));
    }
  }

  /**
   * Log user activity (commands, events)
   */
  logActivity(username, command, data = {}) {
    this.info('User activity', {
      username,
      command,
      ...data,
    });
  }

  /**
   * Log session events
   */
  logSession(event, sessionId, data = {}) {
    this.info(`Session ${event}`, {
      sessionId,
      event,
      ...data,
    });
  }
}

// Export singleton instance
module.exports = new Logger();
