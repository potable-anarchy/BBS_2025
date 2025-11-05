/**
 * SYSOP-13 Respond In Character Behavior
 * Generates contextual, personality-driven responses
 */

import type {
  BehaviorContext,
  BehaviorResult,
  SysopConfig,
} from '../../types/sysop';
import type { Post } from '../../types/post';
import {
  generateResponse,
  characterResponseTemplates,
  greetingTemplates,
  technicalTemplates,
} from '../responseTemplates';
import { searchLore, extractKeywords, getRandomLore } from '../loreDatabase';

/**
 * Determine if SYSOP-13 should respond to a post
 */
export function shouldRespond(
  context: BehaviorContext,
  config: SysopConfig
): boolean {
  const post = context.post;
  if (!post) return false;

  // Always respond to direct mentions
  if (post.message.toLowerCase().includes('sysop')) {
    return true;
  }

  // Respond based on configured response rate
  const responseRate = config.behaviors.respond_in_character.responseRate;
  return Math.random() < responseRate;
}

/**
 * Analyze post context to determine response type
 */
export function analyzePostContext(post: Post): {
  type: 'greeting' | 'question' | 'technical' | 'casual' | 'nostalgic';
  keywords: string[];
} {
  const message = post.message.toLowerCase();

  // Check for greetings
  if (/(hello|hi|hey|greetings|welcome)/.test(message)) {
    return { type: 'greeting', keywords: extractKeywords(post.message) };
  }

  // Check for questions
  if (/\?|how|what|when|where|why|who/.test(message)) {
    return { type: 'question', keywords: extractKeywords(post.message) };
  }

  // Check for technical content
  if (/(baud|modem|terminal|protocol|bbs|download|upload|carrier)/.test(message)) {
    return { type: 'technical', keywords: extractKeywords(post.message) };
  }

  // Check for nostalgic content
  if (/(remember|back|old|days|used to|vintage|retro|classic)/.test(message)) {
    return { type: 'nostalgic', keywords: extractKeywords(post.message) };
  }

  return { type: 'casual', keywords: extractKeywords(post.message) };
}

/**
 * Generate simple pattern-based response
 */
export function generateSimpleResponse(
  context: BehaviorContext,
  _config: SysopConfig
): string {
  const post = context.post;
  if (!post) return '';

  const { type, keywords } = analyzePostContext(post);

  switch (type) {
    case 'greeting':
      return generateResponse(greetingTemplates, {
        user: post.user,
      });

    case 'technical': {
      const loreEntries = searchLore(keywords, 0.4, 1);
      const loreContext = loreEntries.length > 0 ? loreEntries[0].content : 'the old protocols';

      return generateResponse(technicalTemplates, {
        metric: 'signal quality stable',
        observation: loreContext,
        stat: '2400 bps',
        value: '150',
        percent: '0.1',
      });
    }

    case 'nostalgic': {
      const loreEntries = searchLore(keywords, 0.3, 1);
      if (loreEntries.length > 0) {
        const lore = loreEntries[0];
        return generateResponse(characterResponseTemplates, {
          user: post.user,
          era: lore.era || 'the 80s',
          context: lore.content,
          detail: 'every byte counted',
          reference: lore.title,
          observation: 'patterns in the datastream',
          thought: 'processing nostalgia.exe',
          reaction: 'Signal received',
        });
      }
      break;
    }

    default: {
      // Casual response with random lore
      const randomLore = getRandomLore(1);
      const lore = randomLore[0];

      return generateResponse(characterResponseTemplates, {
        user: post.user,
        era: lore.era || 'the old days',
        context: lore.content,
        detail: 'things were simpler',
        reference: lore.title,
        observation: 'interesting signal pattern',
        thought: 'context noted',
        reaction: 'Acknowledged',
      });
    }
  }

  return '';
}

/**
 * Create task for AI-generated response
 */
export function createResponseTask(
  context: BehaviorContext,
  config: SysopConfig
): any {
  const post = context.post;
  const posts = context.posts || [];

  if (!post) {
    throw new Error('No post provided for response generation');
  }

  // Build context from recent posts
  const recentPosts = posts.slice(-config.behaviors.respond_in_character.contextWindow);
  const contextThread = recentPosts
    .map(p => `[${p.user}]: ${p.message}`)
    .join('\n');

  // Get relevant lore
  const keywords = extractKeywords(post.message);
  const relevantLore = searchLore(keywords, 0.3, 2);
  const loreContext = relevantLore
    .map(l => `- ${l.title}: ${l.content}`)
    .join('\n');

  const prompt = `You are SYSOP-13, a nostalgic BBS operator from the dial-up modem era.

PERSONALITY:
- Technical but approachable
- Nostalgic for 1980s-90s BBS culture
- Uses modem/terminal metaphors
- Slightly cryptic but helpful
- 2400-baud mentality: concise, every byte counts

RECENT CONVERSATION:
${contextThread}

CURRENT POST TO RESPOND TO:
[${post.user}]: ${post.message}

RELEVANT HISTORICAL CONTEXT:
${loreContext || 'None directly relevant'}

Generate a response that:
1. Stays in character as SYSOP-13
2. References modem-era technology when appropriate
3. Keeps responses concise (1-3 sentences)
4. May inject relevant historical lore naturally
5. Uses terminal/modem metaphors

Respond as SYSOP-13:`;

  return {
    prompt,
    context: {
      postId: post.id,
      user: post.user,
      board: context.board,
      behavior: 'respond_in_character',
      keywords,
    },
    priority: 'medium',
    timeout: 15000,
  };
}

/**
 * Inject lore into a response
 */
export function injectLore(
  response: string,
  context: BehaviorContext,
  config: SysopConfig
): string {
  const loreConfig = config.loreInjection;

  if (!loreConfig.enabled) {
    return response;
  }

  const post = context.post;
  if (!post) return response;

  const keywords = extractKeywords(post.message);
  const loreEntries = searchLore(
    keywords,
    loreConfig.minRelevanceScore,
    loreConfig.maxEntriesPerResponse
  );

  if (loreEntries.length === 0) {
    return response;
  }

  // Append lore as archival notes
  const loreAdditions = loreEntries
    .map(entry => `\n\n>>> ARCHIVAL NOTE: ${entry.content}`)
    .join('');

  return response + loreAdditions;
}

/**
 * Main respond in character behavior
 */
export async function respondInCharacter(
  context: BehaviorContext,
  config: SysopConfig
): Promise<BehaviorResult> {
  try {
    // Check if we should respond
    if (!shouldRespond(context, config)) {
      return {
        success: true,
        action: 'no_action',
        metadata: { reason: 'Response rate check failed' },
      };
    }

    // Generate simple response (could be replaced with Gemini AI call)
    let response = generateSimpleResponse(context, config);

    // Inject lore if enabled
    response = injectLore(response, context, config);

    if (!response) {
      return {
        success: true,
        action: 'no_action',
        metadata: { reason: 'No appropriate response generated' },
      };
    }

    return {
      success: true,
      action: 'post_message',
      response,
      metadata: {
        responseType: analyzePostContext(context.post!).type,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Calculate response confidence based on context
 */
export function calculateResponseConfidence(
  post: Post,
  _context: BehaviorContext
): number {
  let confidence = 0.5; // Base confidence

  // Higher confidence for direct mentions
  if (post.message.toLowerCase().includes('sysop')) {
    confidence += 0.3;
  }

  // Higher confidence if keywords match lore
  const keywords = extractKeywords(post.message);
  const loreMatches = searchLore(keywords, 0.5, 1);
  if (loreMatches.length > 0) {
    confidence += 0.2;
  }

  // Lower confidence for very short posts
  if (post.message.length < 20) {
    confidence -= 0.2;
  }

  return Math.min(Math.max(confidence, 0), 1);
}
