/**
 * SYSOP-13 Behavior System Index
 * Orchestrates all AI behaviors
 */

export { moderateDiscussion, analyzeContent } from './moderateDiscussion';
export { respondInCharacter, shouldRespond } from './respondInCharacter';
export { postDailyBulletin, generateDailyBulletin } from './postDailyBulletin';

import type {
  BehaviorType,
  BehaviorContext,
  BehaviorResult,
  SysopConfig,
} from '../../types/sysop';
import { moderateDiscussion } from './moderateDiscussion';
import { respondInCharacter } from './respondInCharacter';
import { postDailyBulletin } from './postDailyBulletin';

/**
 * Behavior execution map
 */
const BEHAVIORS = {
  moderate_discussion: moderateDiscussion,
  respond_in_character: respondInCharacter,
  post_daily_bulletin: postDailyBulletin,
} as const;

/**
 * Execute a specific behavior
 */
export async function executeBehavior(
  behaviorType: BehaviorType,
  context: BehaviorContext,
  config: SysopConfig
): Promise<BehaviorResult> {
  const behavior = BEHAVIORS[behaviorType];

  if (!behavior) {
    return {
      success: false,
      error: `Unknown behavior type: ${behaviorType}`,
    };
  }

  try {
    return await behavior(context, config);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute multiple behaviors in sequence
 */
export async function executeBehaviors(
  behaviors: BehaviorType[],
  context: BehaviorContext,
  config: SysopConfig
): Promise<BehaviorResult[]> {
  const results: BehaviorResult[] = [];

  for (const behaviorType of behaviors) {
    const result = await executeBehavior(behaviorType, context, config);
    results.push(result);

    // Stop on first error if critical
    if (!result.success && behaviorType === 'moderate_discussion') {
      break;
    }
  }

  return results;
}

/**
 * Check which behaviors should run for a given context
 */
export function determineBehaviors(
  context: BehaviorContext,
  config: SysopConfig
): BehaviorType[] {
  const behaviors: BehaviorType[] = [];

  // Always run moderation if enabled and there's a post
  if (
    context.post &&
    config.behaviors.moderate_discussion.enabled
  ) {
    behaviors.push('moderate_discussion');
  }

  // Check if should respond in character
  if (
    context.post &&
    config.behaviors.respond_in_character.enabled
  ) {
    behaviors.push('respond_in_character');
  }

  // Bulletin is typically triggered by schedule, not per-post
  // Only include if explicitly requested in context
  if (
    context.metadata?.triggerBulletin &&
    config.behaviors.post_daily_bulletin.enabled
  ) {
    behaviors.push('post_daily_bulletin');
  }

  return behaviors;
}

/**
 * Process a new post with all relevant behaviors
 */
export async function processPost(
  context: BehaviorContext,
  config: SysopConfig
): Promise<BehaviorResult[]> {
  const behaviors = determineBehaviors(context, config);
  return executeBehaviors(behaviors, context, config);
}
