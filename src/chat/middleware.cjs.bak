/**
 * Middleware for validating board access
 * This runs before a socket connection is established
 */
function validateBoardAccess(socket, next) {
  const { userId, username, boardId } = socket.handshake.auth;

  // Validate required authentication fields
  if (!userId) {
    return next(new Error('Authentication error: userId is required'));
  }

  if (!username) {
    return next(new Error('Authentication error: username is required'));
  }

  if (!boardId) {
    return next(new Error('Authentication error: boardId is required'));
  }

  // Basic validation
  if (typeof userId !== 'string' || userId.trim() === '') {
    return next(new Error('Authentication error: Invalid userId'));
  }

  if (typeof username !== 'string' || username.trim() === '') {
    return next(new Error('Authentication error: Invalid username'));
  }

  if (typeof boardId !== 'string' || boardId.trim() === '') {
    return next(new Error('Authentication error: Invalid boardId'));
  }

  // TODO: Add actual board access validation here
  // Example: Check if user has permission to access this board
  // const hasAccess = await checkBoardPermission(userId, boardId);
  // if (!hasAccess) {
  //   return next(new Error('Authorization error: Access denied to this board'));
  // }

  console.log(`Board access validated for user ${username} (${userId}) on board ${boardId}`);
  next();
}

/**
 * Validate chat message data
 */
function validateMessage(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid message data');
  }

  const { content, type } = data;

  // Validate content
  if (!content || typeof content !== 'string') {
    throw new Error('Message content is required and must be a string');
  }

  const trimmedContent = content.trim();
  if (trimmedContent === '') {
    throw new Error('Message content cannot be empty');
  }

  if (trimmedContent.length > 5000) {
    throw new Error('Message content exceeds maximum length of 5000 characters');
  }

  // Validate type if provided
  const validTypes = ['text', 'system', 'notification'];
  const messageType = type || 'text';

  if (!validTypes.includes(messageType)) {
    throw new Error(`Invalid message type. Must be one of: ${validTypes.join(', ')}`);
  }

  // Return sanitized message
  return {
    content: sanitizeContent(trimmedContent),
    type: messageType
  };
}

/**
 * Sanitize message content
 * Basic XSS prevention
 */
function sanitizeContent(content) {
  // Replace potentially dangerous characters
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate reaction data
 */
function validateReaction(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid reaction data');
  }

  const { messageId, reaction } = data;

  if (!messageId || typeof messageId !== 'string') {
    throw new Error('Message ID is required');
  }

  if (!reaction || typeof reaction !== 'string') {
    throw new Error('Reaction is required');
  }

  const validReactions = ['👍', '👎', '❤️', '😂', '😮', '😢', '🎉', '🔥'];
  if (!validReactions.includes(reaction)) {
    throw new Error('Invalid reaction');
  }

  return { messageId, reaction };
}

/**
 * Rate limiting middleware
 * Prevents spam by limiting message frequency
 */
class RateLimiter {
  constructor(maxMessages = 10, windowMs = 10000) {
    this.maxMessages = maxMessages;
    this.windowMs = windowMs;
    this.messageCount = new Map(); // socketId -> array of timestamps
  }

  check(socketId) {
    const now = Date.now();
    const messages = this.messageCount.get(socketId) || [];

    // Remove old messages outside the time window
    const recentMessages = messages.filter(time => now - time < this.windowMs);

    if (recentMessages.length >= this.maxMessages) {
      return {
        allowed: false,
        resetIn: this.windowMs - (now - recentMessages[0])
      };
    }

    // Add current message
    recentMessages.push(now);
    this.messageCount.set(socketId, recentMessages);

    return {
      allowed: true,
      remaining: this.maxMessages - recentMessages.length
    };
  }

  reset(socketId) {
    this.messageCount.delete(socketId);
  }

  cleanup() {
    const now = Date.now();
    for (const [socketId, messages] of this.messageCount.entries()) {
      const recentMessages = messages.filter(time => now - time < this.windowMs);
      if (recentMessages.length === 0) {
        this.messageCount.delete(socketId);
      } else {
        this.messageCount.set(socketId, recentMessages);
      }
    }
  }
}

module.exports = {
  validateBoardAccess,
  validateMessage,
  validateReaction,
  sanitizeContent,
  RateLimiter
};
