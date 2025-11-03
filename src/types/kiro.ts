/**
 * Type definitions for Kiro API integration
 */

/**
 * Kiro API configuration
 */
export interface KiroConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

/**
 * Kiro Agent status
 */
export type AgentStatus = 'idle' | 'busy' | 'offline' | 'error';

/**
 * Kiro Agent information
 */
export interface KiroAgent {
  id: string;
  name: string;
  status: AgentStatus;
  capabilities: string[];
  lastActive?: string;
}

/**
 * Kiro Task request
 */
export interface KiroTaskRequest {
  prompt: string;
  context?: Record<string, unknown>;
  priority?: 'low' | 'medium' | 'high';
  timeout?: number;
}

/**
 * Kiro Task response
 */
export interface KiroTaskResponse {
  taskId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

/**
 * Kiro API Error
 */
export interface KiroApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Generic Kiro API response wrapper
 */
export interface KiroApiResponse<T> {
  success: boolean;
  data?: T;
  error?: KiroApiError;
  timestamp: string;
}
