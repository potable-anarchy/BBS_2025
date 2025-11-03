/**
 * Type definitions for SYSOP-13 AI behaviors and responses
 */

import type { Post } from './post';

/**
 * Available AI behavior types
 */
export type BehaviorType =
  | 'moderate_discussion'
  | 'respond_in_character'
  | 'post_daily_bulletin';

/**
 * Behavior execution context
 */
export interface BehaviorContext {
  user?: string;
  board?: string;
  post?: Post;
  posts?: Post[];
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Behavior execution result
 */
export interface BehaviorResult {
  success: boolean;
  action?: BehaviorAction;
  response?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Actions that behaviors can trigger
 */
export type BehaviorAction =
  | 'post_message'
  | 'moderate_content'
  | 'send_bulletin'
  | 'no_action';

/**
 * SYSOP-13 personality traits
 */
export interface PersonalityTrait {
  name: string;
  weight: number; // 0-1
  description: string;
}

/**
 * Response template configuration
 */
export interface ResponseTemplate {
  type: string;
  templates: string[];
  variables?: string[];
  tone: 'formal' | 'casual' | 'technical' | 'nostalgic';
}

/**
 * Lore data structure
 */
export interface LoreEntry {
  id: string;
  category: 'history' | 'technology' | 'culture' | 'event';
  title: string;
  content: string;
  era?: string;
  keywords: string[];
  relevance: number; // 0-1
}

/**
 * Lore injection configuration
 */
export interface LoreInjection {
  enabled: boolean;
  maxEntriesPerResponse: number;
  minRelevanceScore: number;
  categories?: string[];
}

/**
 * SYSOP-13 configuration
 */
export interface SysopConfig {
  agentId: string;
  personality: PersonalityTrait[];
  loreInjection: LoreInjection;
  behaviors: {
    moderate_discussion: {
      enabled: boolean;
      sensitivity: 'low' | 'medium' | 'high';
      autoModerate: boolean;
    };
    respond_in_character: {
      enabled: boolean;
      responseRate: number; // 0-1
      contextWindow: number; // number of posts to consider
    };
    post_daily_bulletin: {
      enabled: boolean;
      schedule: string; // cron format
      boards: string[];
    };
  };
}

/**
 * Moderation decision
 */
export interface ModerationDecision {
  action: 'allow' | 'flag' | 'remove';
  reason?: string;
  severity?: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
}

/**
 * Daily bulletin content
 */
export interface DailyBulletin {
  title: string;
  sections: BulletinSection[];
  footer?: string;
  timestamp: string;
}

/**
 * Bulletin section
 */
export interface BulletinSection {
  heading: string;
  content: string;
  type: 'news' | 'stats' | 'lore' | 'announcement';
}
