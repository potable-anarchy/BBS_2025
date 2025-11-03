/**
 * Kiro API Service (Node.js backend)
 * Handles server-side Kiro API integration with secure key management
 */

const fetch = require('node-fetch');
const logger = require('../utils/logger.cjs');

class KiroService {
  constructor() {
    this.apiKey = process.env.KIRO_API_KEY;
    this.baseUrl = process.env.KIRO_API_URL || 'https://api.kiro.ai/v1';
    this.timeout = parseInt(process.env.KIRO_TIMEOUT || '30000', 10);
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second

    if (!this.apiKey) {
      throw new Error('KIRO_API_KEY environment variable is required');
    }

    logger.info('Kiro API Service initialized', {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
    });
  }

  /**
   * Sleep utility for retry delays
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make API request with retry logic
   */
  async makeRequest(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'vibe-kanban/1.0',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting with retry
        if (response.status === 429 && retryCount < this.maxRetries) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || this.retryDelay, 10);
          logger.warn('Rate limited, retrying...', {
            endpoint,
            retryAfter,
            attempt: retryCount + 1,
          });
          await this.sleep(retryAfter);
          return this.makeRequest(endpoint, options, retryCount + 1);
        }

        // Handle server errors with retry
        if (response.status >= 500 && retryCount < this.maxRetries) {
          logger.warn('Server error, retrying...', {
            endpoint,
            status: response.status,
            attempt: retryCount + 1,
          });
          await this.sleep(this.retryDelay * (retryCount + 1));
          return this.makeRequest(endpoint, options, retryCount + 1);
        }

        const error = new Error(
          data.error?.message || data.message || `HTTP ${response.status}: ${response.statusText}`
        );
        error.status = response.status;
        error.code = data.error?.code || `HTTP_${response.status}`;
        error.details = data.error?.details || data.details;
        throw error;
      }

      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry on network errors
      if (error.name === 'FetchError' && retryCount < this.maxRetries) {
        logger.warn('Network error, retrying...', {
          endpoint,
          error: error.message,
          attempt: retryCount + 1,
        });
        await this.sleep(this.retryDelay * (retryCount + 1));
        return this.makeRequest(endpoint, options, retryCount + 1);
      }

      logger.error('Kiro API request failed', {
        endpoint,
        error: error.message,
        retryCount,
      });

      return {
        success: false,
        error: {
          code: error.name === 'AbortError' ? 'TIMEOUT' : error.code || 'NETWORK_ERROR',
          message: error.message,
          details: error.details,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Test API connectivity
   */
  async ping() {
    logger.debug('Testing Kiro API connectivity');
    return this.makeRequest('/ping');
  }

  /**
   * Get available agents
   */
  async getAgents() {
    logger.debug('Fetching available agents');
    return this.makeRequest('/agents');
  }

  /**
   * Get specific agent by ID
   */
  async getAgent(agentId) {
    logger.debug('Fetching agent', { agentId });
    return this.makeRequest(`/agents/${encodeURIComponent(agentId)}`);
  }

  /**
   * Check agent health
   */
  async checkAgentHealth(agentId) {
    logger.debug('Checking agent health', { agentId });
    return this.makeRequest(`/agents/${encodeURIComponent(agentId)}/health`);
  }

  /**
   * Submit task to agent
   */
  async submitTask(agentId, task) {
    logger.info('Submitting task to agent', {
      agentId,
      priority: task.priority,
    });

    return this.makeRequest(`/agents/${encodeURIComponent(agentId)}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  /**
   * Get task status
   */
  async getTaskStatus(agentId, taskId) {
    logger.debug('Fetching task status', { agentId, taskId });
    return this.makeRequest(
      `/agents/${encodeURIComponent(agentId)}/tasks/${encodeURIComponent(taskId)}`
    );
  }

  /**
   * Cancel task
   */
  async cancelTask(agentId, taskId) {
    logger.info('Cancelling task', { agentId, taskId });
    return this.makeRequest(
      `/agents/${encodeURIComponent(agentId)}/tasks/${encodeURIComponent(taskId)}`,
      { method: 'DELETE' }
    );
  }

  /**
   * Get task history
   */
  async getTaskHistory(agentId, limit = 50) {
    logger.debug('Fetching task history', { agentId, limit });
    return this.makeRequest(
      `/agents/${encodeURIComponent(agentId)}/tasks?limit=${limit}`
    );
  }

  /**
   * Health check - tests connectivity and returns service status
   */
  async healthCheck() {
    try {
      const result = await this.ping();
      return {
        healthy: result.success,
        timestamp: new Date().toISOString(),
        details: result.success ? result.data : { error: result.error },
      };
    } catch (error) {
      return {
        healthy: false,
        timestamp: new Date().toISOString(),
        details: { error: error.message },
      };
    }
  }
}

// Export singleton instance
let kiroService = null;

function getKiroService() {
  if (!kiroService) {
    kiroService = new KiroService();
  }
  return kiroService;
}

module.exports = getKiroService();
module.exports.KiroService = KiroService;
