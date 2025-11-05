/**
 * SYSOP-13 Moderate Discussion Behavior
 * Monitors and moderates board discussions
 */

import type {
  BehaviorContext,
  BehaviorResult,
  ModerationDecision,
  SysopConfig,
} from '../../types/sysop';
import { generateResponse, moderationTemplates } from '../responseTemplates';

/**
 * Content patterns that require moderation
 */
const MODERATION_PATTERNS = {
  spam: /(.)\1{10,}|https?:\/\/[^\s]+\s+https?:\/\/[^\s]+/gi,
  excessive_caps: /[A-Z\s]{30,}/g,
  offensive: /\b(abuse|attack|hate)\b/gi, // Simplified for example
  flood: /^(.+)(\r?\n\1){3,}$/m,
};

/**
 * Analyze content for moderation issues
 */
export function analyzeContent(content: string): ModerationDecision {
  let severity: 'low' | 'medium' | 'high' = 'low';
  let reason = '';
  let confidence = 0;

  // Check for spam patterns
  if (MODERATION_PATTERNS.spam.test(content)) {
    severity = 'high';
    reason = 'Spam pattern detected';
    confidence = 0.85;
    return { action: 'flag', reason, severity, confidence };
  }

  // Check for excessive caps
  if (MODERATION_PATTERNS.excessive_caps.test(content)) {
    severity = 'low';
    reason = 'Excessive capitals (shouting)';
    confidence = 0.7;
    return { action: 'flag', reason, severity, confidence };
  }

  // Check for offensive content
  if (MODERATION_PATTERNS.offensive.test(content)) {
    severity = 'medium';
    reason = 'Potentially offensive content';
    confidence = 0.6;
    return { action: 'flag', reason, severity, confidence };
  }

  // Check for flooding
  if (MODERATION_PATTERNS.flood.test(content)) {
    severity = 'medium';
    reason = 'Message flooding detected';
    confidence = 0.8;
    return { action: 'flag', reason, severity, confidence };
  }

  // Content appears clean
  return { action: 'allow', confidence: 0.9 };
}

/**
 * Create task request for AI-based moderation
 */
export function createModerationTask(
  context: BehaviorContext,
  config: SysopConfig
): any {
  const post = context.post;
  if (!post) {
    throw new Error('No post provided for moderation');
  }

  const prompt = `Analyze this BBS post for moderation:

User: ${post.user}
Board: ${context.board || 'unknown'}
Content: ${post.message}

Evaluate for:
1. Spam or commercial solicitation
2. Offensive or harassing language
3. Off-topic content
4. Excessive formatting or flooding

Respond with JSON:
{
  "action": "allow" | "flag" | "remove",
  "severity": "low" | "medium" | "high",
  "reason": "brief explanation",
  "confidence": 0.0-1.0
}

Apply ${config.behaviors.moderate_discussion.sensitivity} sensitivity standards.`;

  return {
    prompt,
    context: {
      postId: post.id,
      user: post.user,
      board: context.board,
      behavior: 'moderate_discussion',
    },
    priority: 'high',
    timeout: 10000, // 10 seconds
  };
}

/**
 * Process moderation decision
 */
export function processModerationDecision(
  decision: ModerationDecision,
  context: BehaviorContext,
  config: SysopConfig
): BehaviorResult {
  const post = context.post;
  if (!post) {
    return {
      success: false,
      error: 'No post provided',
    };
  }

  // If content is allowed, no action needed
  if (decision.action === 'allow') {
    return {
      success: true,
      action: 'no_action',
      metadata: { decision },
    };
  }

  // Generate moderation response
  const response = generateResponse(moderationTemplates, {
    user: post.user,
    reason: decision.reason || 'Content policy violation',
  });

  // Determine action based on severity and auto-moderate setting
  const shouldAutoModerate =
    config.behaviors.moderate_discussion.autoModerate &&
    decision.severity === 'high' &&
    decision.confidence >= 0.8;

  return {
    success: true,
    action: shouldAutoModerate ? 'moderate_content' : 'post_message',
    response,
    metadata: {
      decision,
      autoModerated: shouldAutoModerate,
    },
  };
}

/**
 * Main moderation behavior execution
 */
export async function moderateDiscussion(
  context: BehaviorContext,
  config: SysopConfig
): Promise<BehaviorResult> {
  try {
    // First, do quick pattern-based analysis
    const post = context.post;
    if (!post) {
      return {
        success: false,
        error: 'No post provided for moderation',
      };
    }

    const quickDecision = analyzeContent(post.message);

    // If pattern matching finds severe issues, return immediately
    if (quickDecision.action !== 'allow' && quickDecision.severity === 'high') {
      return processModerationDecision(quickDecision, context, config);
    }

    // For borderline cases, we could call Gemini AI for deeper analysis
    // This would require integration with the AI service
    // For now, use pattern-based decision
    return processModerationDecision(quickDecision, context, config);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if user has recent moderation flags
 */
export function checkUserHistory(
  user: string,
  recentFlags: Map<string, number>
): boolean {
  const flagCount = recentFlags.get(user) || 0;
  return flagCount >= 3; // Threshold for repeat offenders
}

/**
 * Generate moderation report
 */
export function generateModerationReport(
  decisions: ModerationDecision[],
  timeframe: string
): string {
  const flagged = decisions.filter(d => d.action === 'flag').length;
  const removed = decisions.filter(d => d.action === 'remove').length;
  const allowed = decisions.filter(d => d.action === 'allow').length;

  return `
MODERATION REPORT - ${timeframe}
═══════════════════════════════════════
Total Posts Analyzed: ${decisions.length}
Allowed: ${allowed}
Flagged: ${flagged}
Removed: ${removed}

Severity Distribution:
- High: ${decisions.filter(d => d.severity === 'high').length}
- Medium: ${decisions.filter(d => d.severity === 'medium').length}
- Low: ${decisions.filter(d => d.severity === 'low').length}

Average Confidence: ${(
    decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length
  ).toFixed(2)}
`;
}
