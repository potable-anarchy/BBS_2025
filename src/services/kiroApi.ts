/**
 * Kiro API client service
 * Handles secure communication with Kiro agent API
 */

import type {
  KiroConfig,
  KiroAgent,
  KiroTaskRequest,
  KiroTaskResponse,
  KiroApiResponse,
  KiroApiError,
} from '../types/kiro';

export class KiroApiClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: KiroConfig) {
    if (!config.apiKey) {
      throw new Error('Kiro API key is required');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.kiro.ai/v1';
    this.timeout = config.timeout || 30000; // 30 seconds default
  }

  /**
   * Generic fetch wrapper with authentication and error handling
   */
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<KiroApiResponse<T>> {
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
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const error: KiroApiError = {
          code: `HTTP_${response.status}`,
          message: data.error?.message || data.message || `HTTP ${response.status}: ${response.statusText}`,
          details: data.error?.details || data.details,
        };

        return {
          success: false,
          error,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: data as T,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      clearTimeout(timeoutId);

      const kiroError: KiroApiError = {
        code: error instanceof Error && error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: { originalError: error },
      };

      console.error(`Kiro API Error [${endpoint}]:`, kiroError);

      return {
        success: false,
        error: kiroError,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Test API connectivity
   */
  async ping(): Promise<KiroApiResponse<{ status: string; version: string }>> {
    return this.fetch('/ping');
  }

  /**
   * Get available agents
   */
  async getAgents(): Promise<KiroApiResponse<KiroAgent[]>> {
    return this.fetch('/agents');
  }

  /**
   * Get specific agent by ID
   */
  async getAgent(agentId: string): Promise<KiroApiResponse<KiroAgent>> {
    return this.fetch(`/agents/${encodeURIComponent(agentId)}`);
  }

  /**
   * Check agent health status
   */
  async checkAgentHealth(agentId: string): Promise<KiroApiResponse<{ healthy: boolean; status: string }>> {
    return this.fetch(`/agents/${encodeURIComponent(agentId)}/health`);
  }

  /**
   * Submit a task to an agent
   */
  async submitTask(
    agentId: string,
    task: KiroTaskRequest
  ): Promise<KiroApiResponse<KiroTaskResponse>> {
    return this.fetch(`/agents/${encodeURIComponent(agentId)}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  /**
   * Get task status
   */
  async getTaskStatus(
    agentId: string,
    taskId: string
  ): Promise<KiroApiResponse<KiroTaskResponse>> {
    return this.fetch(
      `/agents/${encodeURIComponent(agentId)}/tasks/${encodeURIComponent(taskId)}`
    );
  }

  /**
   * Cancel a running task
   */
  async cancelTask(
    agentId: string,
    taskId: string
  ): Promise<KiroApiResponse<{ cancelled: boolean }>> {
    return this.fetch(
      `/agents/${encodeURIComponent(agentId)}/tasks/${encodeURIComponent(taskId)}`,
      { method: 'DELETE' }
    );
  }

  /**
   * Get task history for an agent
   */
  async getTaskHistory(
    agentId: string,
    limit: number = 50
  ): Promise<KiroApiResponse<KiroTaskResponse[]>> {
    return this.fetch(
      `/agents/${encodeURIComponent(agentId)}/tasks?limit=${limit}`
    );
  }
}

/**
 * Create and export a singleton instance
 * This will be initialized with environment variables on the server
 */
export function createKiroClient(config: KiroConfig): KiroApiClient {
  return new KiroApiClient(config);
}

export default KiroApiClient;
