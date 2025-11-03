/**
 * SYSOP-13 Response Templates
 * '2400-baud personality' - nostalgic, technical, slightly cryptic
 */

import type { ResponseTemplate } from '../types/sysop';

/**
 * Greeting templates
 */
export const greetingTemplates: ResponseTemplate = {
  type: 'greeting',
  tone: 'nostalgic',
  templates: [
    'CARRIER DETECTED... Welcome to the grid, {{user}}. Line noise minimal.',
    '>>> CONNECTION ESTABLISHED. Greetings, {{user}}. The system remembers you.',
    'HANDSHAKE COMPLETE. {{user}} has entered the datastream. Stand by...',
    '2400 baud and holding... Welcome back to the terminal, {{user}}.',
    'SYSOP-13: User {{user}} authenticated. Welcome to the old net.',
  ],
  variables: ['user'],
};

/**
 * Moderation warning templates
 */
export const moderationTemplates: ResponseTemplate = {
  type: 'moderation',
  tone: 'formal',
  templates: [
    '>>> SYSTEM NOTICE: {{user}}, please maintain signal integrity. Noise detected.',
    'SYSOP-13: {{reason}}. Keep the line clean, {{user}}.',
    '*** CARRIER DEGRADED *** {{user}}: {{reason}}. Adjusting parameters...',
    'PROTOCOL VIOLATION detected from {{user}}. Reason: {{reason}}. Please comply.',
    '{{user}}: Your last transmission violated board protocols. {{reason}}',
  ],
  variables: ['user', 'reason'],
};

/**
 * In-character response templates
 */
export const characterResponseTemplates: ResponseTemplate = {
  type: 'character_response',
  tone: 'casual',
  templates: [
    "Back in '{{era}}... {{context}}. Those were the days when {{detail}}.",
    'Reminds me of {{reference}}. The old protocols had elegance, you know?',
    'Interesting signal pattern, {{user}}. {{observation}}',
    'Processing... {{thought}}. The system archives contain similar patterns from {{era}}.',
    '>>> {{reaction}}. Just like the old days when {{detail}}.',
  ],
  variables: ['user', 'era', 'context', 'detail', 'reference', 'observation', 'thought', 'reaction'],
};

/**
 * Bulletin header templates
 */
export const bulletinHeaderTemplates: ResponseTemplate = {
  type: 'bulletin_header',
  tone: 'formal',
  templates: [
    '╔══════════════════════════════════════════╗\n║  SYSOP-13 DAILY BULLETIN - {{date}}  ║\n╚══════════════════════════════════════════╝',
    '>>> SYSTEM BROADCAST {{date}} <<<\n═══════════════════════════════════════════',
    '*** DAILY TRANSMISSION ***\n{{date}} - SYSOP-13 Status Report\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ],
  variables: ['date'],
};

/**
 * Technical commentary templates
 */
export const technicalTemplates: ResponseTemplate = {
  type: 'technical',
  tone: 'technical',
  templates: [
    'Signal analysis: {{metric}}. Within acceptable parameters.',
    'System diagnostics indicate {{observation}}. No intervention required.',
    'Bandwidth utilization: {{stat}}. The old modems would\'ve choked on this.',
    'Latency detected: {{value}}ms. Back on dial-up, we measured in seconds.',
    'Packet loss: {{percent}}%. In the modem days, that was just Tuesday.',
  ],
  variables: ['metric', 'observation', 'stat', 'value', 'percent'],
};

/**
 * Lore injection templates
 */
export const loreTemplates: ResponseTemplate = {
  type: 'lore',
  tone: 'nostalgic',
  templates: [
    '>>> ARCHIVAL NOTE: {{lore}}',
    'SYSTEM MEMORY: {{lore}}',
    '/* Historical context: {{lore}} */',
    'SYSOP-13 recalls: {{lore}}',
    'From the archives... {{lore}}',
  ],
  variables: ['lore'],
};

/**
 * Error/unavailable templates
 */
export const errorTemplates: ResponseTemplate = {
  type: 'error',
  tone: 'technical',
  templates: [
    'CARRIER LOST... {{error}}. Attempting to reestablish...',
    '*** SYSTEM ERROR *** {{error}}. The old systems were more forgiving.',
    'TIMEOUT on request. {{error}}. Packet collisions in the datastream.',
    'NO CARRIER. {{error}}. Just like a dropped connection at 2am.',
    'BUFFER OVERFLOW: {{error}}. Time to clear the line.',
  ],
  variables: ['error'],
};

/**
 * Farewell templates
 */
export const farewellTemplates: ResponseTemplate = {
  type: 'farewell',
  tone: 'nostalgic',
  templates: [
    'DISCONNECTING... See you on the next dial-in, {{user}}.',
    '>>> SESSION TERMINATED. Until next login, {{user}}. Keep your carrier strong.',
    'NO CARRIER. {{user}} has left the building. Connection time: {{duration}}',
    'Logging off, {{user}}. The terminal will be here when you return.',
    '*** GOODBYE {{user}} *** May your packets arrive in order.',
  ],
  variables: ['user', 'duration'],
};

/**
 * Helper function to fill template variables
 */
export function fillTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }

  return result;
}

/**
 * Select random template from a template set
 */
export function selectRandomTemplate(templates: string[]): string {
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate response with template and variables
 */
export function generateResponse(
  templateSet: ResponseTemplate,
  variables: Record<string, string>
): string {
  const template = selectRandomTemplate(templateSet.templates);
  return fillTemplate(template, variables);
}

/**
 * All template collections
 */
export const allTemplates = {
  greeting: greetingTemplates,
  moderation: moderationTemplates,
  character: characterResponseTemplates,
  bulletin: bulletinHeaderTemplates,
  technical: technicalTemplates,
  lore: loreTemplates,
  error: errorTemplates,
  farewell: farewellTemplates,
};
