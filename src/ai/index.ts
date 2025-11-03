/**
 * SYSOP-13 AI Behavior System
 * Main entry point for AI-driven behaviors
 */

// Export all behaviors
export * from './behaviors';

// Export configuration
export * from './sysopConfig';

// Export templates
export * from './responseTemplates';

// Export lore database
export * from './loreDatabase';

// Export types
export type {
  BehaviorType,
  BehaviorContext,
  BehaviorResult,
  BehaviorAction,
  PersonalityTrait,
  ResponseTemplate,
  LoreEntry,
  LoreInjection,
  SysopConfig,
  ModerationDecision,
  DailyBulletin,
  BulletinSection,
} from '../types/sysop';

import type { BehaviorContext, BehaviorResult } from '../types/sysop';
import { getSysopConfig } from './sysopConfig';
import { processPost } from './behaviors';

/**
 * SYSOP-13 AI Service
 */
export class SysopAI {
  private config = getSysopConfig();

  /**
   * Process a new post through all enabled behaviors
   */
  async processNewPost(context: BehaviorContext): Promise<BehaviorResult[]> {
    return processPost(context, this.config);
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<typeof this.config>) {
    this.config = {
      ...this.config,
      ...updates,
    };
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Reset to default configuration
   */
  resetConfig() {
    this.config = getSysopConfig();
  }
}

/**
 * Create singleton instance
 */
export const sysopAI = new SysopAI();

/**
 * Default export
 */
export default sysopAI;
