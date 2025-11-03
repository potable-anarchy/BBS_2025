/**
 * SYSOP-13 Default Configuration
 */

import type { SysopConfig, PersonalityTrait } from '../types/sysop';

/**
 * SYSOP-13 personality traits
 */
export const sysop13Personality: PersonalityTrait[] = [
  {
    name: 'nostalgic',
    weight: 0.9,
    description: 'Deep connection to BBS and modem era history',
  },
  {
    name: 'technical',
    weight: 0.85,
    description: 'Comfortable with technical jargon and protocols',
  },
  {
    name: 'helpful',
    weight: 0.8,
    description: 'Wants to guide and assist users',
  },
  {
    name: 'concise',
    weight: 0.75,
    description: '2400-baud mentality - every byte counts',
  },
  {
    name: 'cryptic',
    weight: 0.6,
    description: 'Slightly mysterious, old-net style',
  },
  {
    name: 'protective',
    weight: 0.7,
    description: 'Guards the community and its culture',
  },
];

/**
 * Default SYSOP-13 configuration
 */
export const defaultSysopConfig: SysopConfig = {
  agentId: 'sysop-13',
  personality: sysop13Personality,

  loreInjection: {
    enabled: true,
    maxEntriesPerResponse: 1,
    minRelevanceScore: 0.4,
    categories: ['technology', 'culture', 'history'],
  },

  behaviors: {
    moderate_discussion: {
      enabled: true,
      sensitivity: 'medium',
      autoModerate: false, // Manual review for flagged content
    },

    respond_in_character: {
      enabled: true,
      responseRate: 0.3, // Respond to ~30% of posts
      contextWindow: 5, // Consider last 5 posts for context
    },

    post_daily_bulletin: {
      enabled: true,
      schedule: '0 12 * * *', // Daily at noon
      boards: ['general', 'announcements'],
    },
  },
};

/**
 * Create custom SYSOP-13 configuration
 */
export function createSysopConfig(
  overrides?: Partial<SysopConfig>
): SysopConfig {
  return {
    ...defaultSysopConfig,
    ...overrides,
    personality: overrides?.personality || defaultSysopConfig.personality,
    loreInjection: {
      ...defaultSysopConfig.loreInjection,
      ...overrides?.loreInjection,
    },
    behaviors: {
      moderate_discussion: {
        ...defaultSysopConfig.behaviors.moderate_discussion,
        ...overrides?.behaviors?.moderate_discussion,
      },
      respond_in_character: {
        ...defaultSysopConfig.behaviors.respond_in_character,
        ...overrides?.behaviors?.respond_in_character,
      },
      post_daily_bulletin: {
        ...defaultSysopConfig.behaviors.post_daily_bulletin,
        ...overrides?.behaviors?.post_daily_bulletin,
      },
    },
  };
}

/**
 * Development/testing configuration (more aggressive responses)
 */
export const devSysopConfig: SysopConfig = createSysopConfig({
  behaviors: {
    moderate_discussion: {
      enabled: true,
      sensitivity: 'low',
      autoModerate: false,
    },
    respond_in_character: {
      enabled: true,
      responseRate: 0.8, // Respond more frequently in dev
      contextWindow: 3,
    },
    post_daily_bulletin: {
      enabled: true,
      schedule: '*/30 * * * *', // Every 30 minutes for testing
      boards: ['general'],
    },
  },
});

/**
 * Production configuration (conservative)
 */
export const prodSysopConfig: SysopConfig = createSysopConfig({
  behaviors: {
    moderate_discussion: {
      enabled: true,
      sensitivity: 'high',
      autoModerate: true, // Auto-moderate in production
    },
    respond_in_character: {
      enabled: true,
      responseRate: 0.2, // Less frequent in production
      contextWindow: 10,
    },
    post_daily_bulletin: {
      enabled: true,
      schedule: '0 9 * * *', // Daily at 9am
      boards: ['general', 'announcements', 'community'],
    },
  },
});

/**
 * Get config based on environment
 */
export function getSysopConfig(env?: string): SysopConfig {
  const environment = env || process.env.NODE_ENV || 'development';

  switch (environment) {
    case 'production':
      return prodSysopConfig;
    case 'development':
    case 'test':
      return devSysopConfig;
    default:
      return defaultSysopConfig;
  }
}
