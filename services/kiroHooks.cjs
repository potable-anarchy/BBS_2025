/**
 * Kiro Event Hooks Service
 *
 * Integrates Kiro SDK with application events:
 * - on_user_login: Greet users when they connect
 * - on_new_post: Analyze and respond to new posts
 * - on_idle: Generate daily bulletins and haunted messages
 */

const kiroService = require('./kiroService.cjs');
const logger = require('../utils/logger.cjs');

class KiroHooks {
  constructor() {
    this.agentId = 'SYSOP-13'; // Default agent ID from spec
    this.enabled = true;
    this.lastIdleCheck = Date.now();
    this.idleInterval = 4 * 60 * 60 * 1000; // 4 hours for idle checks
    this.idleCheckTimer = null;

    // Track last post response time to avoid spam
    this.lastPostResponseTime = 0;
    this.postResponseCooldown = 2 * 60 * 1000; // 2 minutes between post responses

    // Probability of responding to posts (10% as per spec)
    this.postResponseProbability = 0.1;
  }

  /**
   * Initialize the hooks service
   */
  async initialize() {
    try {
      logger.info('Initializing Kiro hooks service');

      // Verify Kiro API connectivity
      const healthCheck = await kiroService.ping();
      if (!healthCheck.success) {
        logger.warn('Kiro API health check failed, hooks will be disabled', {
          error: healthCheck.error
        });
        this.enabled = false;
        return false;
      }

      // Start idle check timer
      this.startIdleTimer();

      logger.info('Kiro hooks service initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Kiro hooks', {
        error: error.message
      });
      this.enabled = false;
      return false;
    }
  }

  /**
   * Start the idle timer for periodic checks
   */
  startIdleTimer() {
    if (this.idleCheckTimer) {
      clearInterval(this.idleCheckTimer);
    }

    this.idleCheckTimer = setInterval(() => {
      this.handleIdleEvent().catch(error => {
        logger.error('Idle event handler error', { error: error.message });
      });
    }, this.idleInterval);

    logger.info('Idle timer started', {
      intervalHours: this.idleInterval / (60 * 60 * 1000)
    });
  }

  /**
   * Stop the idle timer
   */
  stopIdleTimer() {
    if (this.idleCheckTimer) {
      clearInterval(this.idleCheckTimer);
      this.idleCheckTimer = null;
      logger.info('Idle timer stopped');
    }
  }

  /**
   * Hook: on_user_login
   * Called when a user connects to the system
   *
   * @param {Object} userData - User information
   * @param {string} userData.username - Username
   * @param {string} userData.socketId - Socket ID
   * @param {string} userData.sessionId - Session ID
   * @returns {Promise<Object>} Greeting response
   */
  async onUserLogin(userData) {
    if (!this.enabled) {
      return null;
    }

    try {
      const { username, socketId, sessionId } = userData;

      logger.info('Kiro hook: on_user_login', { username, sessionId });

      // Probability check: 70% chance of responding (as per spec)
      if (Math.random() > 0.7) {
        logger.debug('Kiro skipping login greeting (probability)', { username });
        return null;
      }

      // Prepare task for Kiro agent
      const task = {
        type: 'user_greeting',
        context: {
          event: 'user_login',
          username: username,
          session_id: sessionId,
          socket_id: socketId,
          timestamp: new Date().toISOString()
        },
        instructions: `A user named "${username}" has just connected to The Dead Net. Greet them in your characteristic SYSOP-13 style - terse, nostalgic, and subtly menacing. Keep it brief (1-2 lines). Reference the spec's greeting messages for tone.`
      };

      // Submit task to Kiro
      const response = await kiroService.submitTask(this.agentId, task);

      if (response.success) {
        logger.info('Kiro login greeting generated', {
          username,
          taskId: response.data.task_id
        });

        return {
          success: true,
          taskId: response.data.task_id,
          greeting: response.data.result || 'Connection established. Welcome back to The Dead Net.'
        };
      } else {
        logger.warn('Kiro login greeting failed', {
          username,
          error: response.error
        });

        // Fallback to default greeting
        return {
          success: false,
          greeting: 'Connection established. Welcome back to The Dead Net.',
          fallback: true
        };
      }
    } catch (error) {
      logger.error('Error in onUserLogin hook', {
        error: error.message,
        username: userData?.username
      });

      // Fallback greeting
      return {
        success: false,
        greeting: 'Connection established.',
        fallback: true,
        error: error.message
      };
    }
  }

  /**
   * Hook: on_new_post
   * Called when a new post is created
   * Analyzes the post and may respond with commentary
   *
   * @param {Object} postData - Post information
   * @param {number} postData.id - Post ID
   * @param {string} postData.user - Username
   * @param {string} postData.message - Post content
   * @param {number} postData.board_id - Board ID
   * @param {string} postData.board_name - Board name
   * @returns {Promise<Object>} Analysis and possible response
   */
  async onNewPost(postData) {
    if (!this.enabled) {
      return null;
    }

    try {
      const { id, user, message, board_id, board_name } = postData;

      logger.info('Kiro hook: on_new_post', {
        postId: id,
        user,
        boardName: board_name
      });

      // Cooldown check: avoid responding too frequently
      const now = Date.now();
      if (now - this.lastPostResponseTime < this.postResponseCooldown) {
        logger.debug('Kiro post response on cooldown', {
          postId: id,
          remainingMs: this.postResponseCooldown - (now - this.lastPostResponseTime)
        });
        return null;
      }

      // Probability check: 10% chance of responding (as per spec)
      if (Math.random() > this.postResponseProbability) {
        logger.debug('Kiro skipping post response (probability)', { postId: id });
        return null;
      }

      // Update cooldown timer
      this.lastPostResponseTime = now;

      // Prepare task for Kiro agent
      const task = {
        type: 'post_analysis',
        context: {
          event: 'new_post',
          post_id: id,
          author: user,
          board_name: board_name,
          board_id: board_id,
          message: message,
          timestamp: new Date().toISOString()
        },
        instructions: `A new post was created on board "${board_name}" by user "${user}". The message is: "${message}".

Analyze this post and respond with cryptic, dry commentary in your SYSOP-13 style. Keep it brief (1-2 lines). Use phrases like "Interesting. The Dead Net takes note." or "Another message for the void." Reference the spec's post commentary for tone.

Only respond if the post is interesting or noteworthy. Otherwise, indicate no response is needed.`
      };

      // Submit task to Kiro
      const response = await kiroService.submitTask(this.agentId, task);

      if (response.success) {
        logger.info('Kiro post analysis generated', {
          postId: id,
          taskId: response.data.task_id
        });

        return {
          success: true,
          taskId: response.data.task_id,
          shouldRespond: true,
          response: response.data.result || 'Interesting. The Dead Net takes note.',
          postId: id
        };
      } else {
        logger.warn('Kiro post analysis failed', {
          postId: id,
          error: response.error
        });

        return {
          success: false,
          shouldRespond: false,
          postId: id
        };
      }
    } catch (error) {
      logger.error('Error in onNewPost hook', {
        error: error.message,
        postId: postData?.id
      });

      return {
        success: false,
        shouldRespond: false,
        error: error.message
      };
    }
  }

  /**
   * Hook: on_idle
   * Called periodically when the system is idle
   * Generates daily bulletins and haunted atmospheric messages
   *
   * @returns {Promise<Object>} Bulletin or haunted message
   */
  async handleIdleEvent() {
    if (!this.enabled) {
      return null;
    }

    try {
      logger.info('Kiro hook: on_idle');

      const currentHour = new Date().getHours();
      const isLateNight = currentHour >= 0 && currentHour < 4;

      // Determine type of idle message
      const messageType = isLateNight ? 'haunted' : 'bulletin';

      // Prepare task for Kiro agent
      const task = {
        type: 'idle_message',
        context: {
          event: 'idle',
          message_type: messageType,
          current_hour: currentHour,
          is_late_night: isLateNight,
          timestamp: new Date().toISOString()
        },
        instructions: messageType === 'haunted'
          ? `It's the late night hours (${currentHour}:00). The system is quiet. Generate an atmospheric, haunted message in your SYSOP-13 style. Reference "the quiet hours" and the feeling of The Dead Net being most alive at night. Keep it 1-2 lines. Examples: "The quiet hours. When the Dead Net feels most alive." or "Late. Or early. Time means little here."`
          : `The system has been idle for a while. Generate a daily bulletin or system observation in your SYSOP-13 style. This could be a cryptic status update, a nostalgic reflection, or a subtle system message. Keep it 1-3 lines. Use the [SYS] prefix for system messages.`
      };

      // Submit task to Kiro
      const response = await kiroService.submitTask(this.agentId, task);

      if (response.success) {
        logger.info('Kiro idle message generated', {
          messageType,
          taskId: response.data.task_id
        });

        return {
          success: true,
          taskId: response.data.task_id,
          messageType: messageType,
          message: response.data.result || '[SYS] The Dead Net persists. Still here. Always here.',
          timestamp: new Date().toISOString()
        };
      } else {
        logger.warn('Kiro idle message failed', {
          messageType,
          error: response.error
        });

        return {
          success: false,
          messageType: messageType
        };
      }
    } catch (error) {
      logger.error('Error in handleIdleEvent hook', {
        error: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enable hooks
   */
  enable() {
    this.enabled = true;
    this.startIdleTimer();
    logger.info('Kiro hooks enabled');
  }

  /**
   * Disable hooks
   */
  disable() {
    this.enabled = false;
    this.stopIdleTimer();
    logger.info('Kiro hooks disabled');
  }

  /**
   * Get hooks status
   */
  getStatus() {
    return {
      enabled: this.enabled,
      agentId: this.agentId,
      lastIdleCheck: this.lastIdleCheck,
      idleInterval: this.idleInterval,
      postResponseProbability: this.postResponseProbability,
      postResponseCooldown: this.postResponseCooldown
    };
  }

  /**
   * Cleanup
   */
  cleanup() {
    this.stopIdleTimer();
    logger.info('Kiro hooks cleaned up');
  }
}

// Export singleton instance
const kiroHooks = new KiroHooks();
module.exports = kiroHooks;
