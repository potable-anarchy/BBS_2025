/**
 * Command Middleware
 * Validation and rate limiting for commands
 */

const logger = require('../utils/logger');

/**
 * Command rate limiter
 */
class CommandRateLimiter {
  constructor(maxCommands = 20, windowMs = 10000) {
    this.maxCommands = maxCommands;
    this.windowMs = windowMs;
    this.commandCount = new Map();
  }

  check(socketId) {
    const now = Date.now();
    const commands = this.commandCount.get(socketId) || [];
    const recentCommands = commands.filter(time => now - time < this.windowMs);

    if (recentCommands.length >= this.maxCommands) {
      const oldestCommand = Math.min(...recentCommands);
      const resetIn = this.windowMs - (now - oldestCommand);

      return {
        allowed: false,
        resetIn: Math.ceil(resetIn / 1000),
        remaining: 0,
      };
    }

    recentCommands.push(now);
    this.commandCount.set(socketId, recentCommands);

    return {
      allowed: true,
      remaining: this.maxCommands - recentCommands.length,
      resetIn: Math.ceil(this.windowMs / 1000),
    };
  }

  reset(socketId) {
    this.commandCount.delete(socketId);
  }
}

/**
 * Validate command data
 */
function validateCommand(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid command data');
  }

  const { command, args } = data;

  if (!command || typeof command !== 'string') {
    throw new Error('Command is required and must be a string');
  }

  if (command.length > 100) {
    throw new Error('Command name too long');
  }

  if (args && !Array.isArray(args)) {
    throw new Error('Arguments must be an array');
  }

  if (args && args.length > 50) {
    throw new Error('Too many arguments');
  }

  // Validate each argument
  if (args) {
    args.forEach((arg, index) => {
      if (typeof arg !== 'string') {
        throw new Error(`Argument ${index} must be a string`);
      }
      if (arg.length > 1000) {
        throw new Error(`Argument ${index} is too long`);
      }
    });
  }

  return {
    command: sanitizeCommand(command),
    args: args ? args.map(arg => sanitizeArgument(arg)) : [],
    boardId: data.boardId ? sanitizeBoardId(data.boardId) : undefined,
  };
}

/**
 * Sanitize command name
 */
function sanitizeCommand(command) {
  return command
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '');
}

/**
 * Sanitize command argument
 */
function sanitizeArgument(arg) {
  return arg
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Sanitize board ID
 */
function sanitizeBoardId(boardId) {
  if (typeof boardId !== 'string') {
    throw new Error('Board ID must be a string');
  }

  const sanitized = boardId.trim().toLowerCase();

  if (!/^[a-z0-9_-]+$/.test(sanitized)) {
    throw new Error('Invalid board ID format');
  }

  if (sanitized.length > 50) {
    throw new Error('Board ID too long');
  }

  return sanitized;
}

/**
 * Create rate limiting middleware
 */
function createRateLimitMiddleware(rateLimiter) {
  return (socket, next) => {
    const check = rateLimiter.check(socket.id);

    if (!check.allowed) {
      const error = new Error('Rate limit exceeded');
      error.data = {
        type: 'RATE_LIMIT',
        resetIn: check.resetIn,
      };
      return next(error);
    }

    socket.rateLimitInfo = check;
    next();
  };
}

/**
 * Command validation middleware
 */
function validateCommandMiddleware(socket, data, callback) {
  try {
    const validated = validateCommand(data);
    callback(null, validated);
  } catch (error) {
    logger.logError('Command validation failed', error, {
      socketId: socket.id,
      data,
    });
    callback(error);
  }
}

module.exports = {
  CommandRateLimiter,
  validateCommand,
  sanitizeCommand,
  sanitizeArgument,
  sanitizeBoardId,
  createRateLimitMiddleware,
  validateCommandMiddleware,
};
