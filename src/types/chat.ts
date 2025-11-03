/**
 * Chat Types
 * Type definitions for the global chat system
 */

export interface ChatMessage {
  id: number;
  user: string;
  message: string;
  userColor: string;
  timestamp: string;
  sessionId?: string;
}

export interface ChatUser {
  username: string;
  color: string;
  lastSeen: string;
}

export interface SendChatMessageRequest {
  message: string;
}

export interface ChatHistoryRequest {
  limit?: number;
}

export interface ChatColorRequest {
  username?: string;
}

export interface ChatErrorResponse {
  error: string;
}
