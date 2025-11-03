# SYSOP-13 AI Behavior System

## Overview

SYSOP-13 is an AI-powered BBS operator with a nostalgic "2400-baud personality" that moderates discussions, responds in character, and posts daily bulletins. The system combines pattern-based logic with AI capabilities through the Kiro API integration.

## Architecture

### File Structure

```
src/ai/
├── index.ts                           # Main entry point
├── sysopConfig.ts                     # Configuration presets
├── responseTemplates.ts               # Response templates
├── loreDatabase.ts                    # Historical knowledge base
└── behaviors/
    ├── index.ts                       # Behavior orchestrator
    ├── moderateDiscussion.ts          # Content moderation
    ├── respondInCharacter.ts          # Character responses
    └── postDailyBulletin.ts          # Daily bulletin generation

src/types/
└── sysop.ts                          # Type definitions
```

## Core Behaviors

### 1. Moderate Discussion

**Purpose:** Monitor and moderate board discussions for spam, offensive content, and policy violations.

**Features:**
- Pattern-based content analysis (spam, caps, flooding)
- AI-powered moderation via Kiro (optional)
- Configurable sensitivity levels (low/medium/high)
- Auto-moderation or manual review modes
- Confidence scoring for decisions

**Usage:**
```typescript
import { moderateDiscussion } from './ai/behaviors';

const result = await moderateDiscussion({
  post: somePost,
  board: 'general',
  user: 'username',
}, sysopConfig);

if (result.action === 'moderate_content') {
  console.log('Post flagged:', result.response);
}
```

**Moderation Patterns:**
- **Spam:** Multiple links, character repetition
- **Excessive Caps:** 30+ consecutive uppercase characters
- **Flooding:** Repeated identical lines
- **Offensive:** Configurable keyword detection

**Configuration:**
```typescript
{
  moderate_discussion: {
    enabled: true,
    sensitivity: 'medium',  // 'low' | 'medium' | 'high'
    autoModerate: false,    // Auto-remove high-confidence violations
  }
}
```

### 2. Respond In Character

**Purpose:** Generate contextual responses with SYSOP-13's nostalgic personality.

**Features:**
- 2400-baud personality (concise, technical, nostalgic)
- Context-aware responses based on recent posts
- Automatic lore injection
- Configurable response rate
- Multiple response types (greeting, technical, nostalgic, casual)

**Usage:**
```typescript
import { respondInCharacter } from './ai/behaviors';

const result = await respondInCharacter({
  post: newPost,
  posts: recentPosts,  // Context window
  board: 'general',
}, sysopConfig);

if (result.action === 'post_message') {
  await postMessage(result.response);
}
```

**Response Types:**
- **Greeting:** Welcome messages with modem metaphors
- **Technical:** Technical commentary with BBS nostalgia
- **Nostalgic:** References to modem-era history
- **Casual:** General responses with lore injection

**Configuration:**
```typescript
{
  respond_in_character: {
    enabled: true,
    responseRate: 0.3,      // 30% of posts
    contextWindow: 5,        // Consider last 5 posts
  }
}
```

**Personality Traits:**
```typescript
[
  { name: 'nostalgic', weight: 0.9 },
  { name: 'technical', weight: 0.85 },
  { name: 'helpful', weight: 0.8 },
  { name: 'concise', weight: 0.75 },
  { name: 'cryptic', weight: 0.6 },
  { name: 'protective', weight: 0.7 },
]
```

### 3. Post Daily Bulletin

**Purpose:** Generate and post daily system bulletins with stats, news, and lore.

**Features:**
- Automated daily bulletins
- System statistics (activity, users, data transfer)
- Technical status reports
- Historical lore integration
- Retro ASCII art formatting
- Weekly digest generation

**Usage:**
```typescript
import { postDailyBulletin } from './ai/behaviors';

const result = await postDailyBulletin({
  posts: allPosts,
  metadata: { triggerBulletin: true },
}, sysopConfig);

if (result.action === 'send_bulletin') {
  await postToBoards(result.response, result.metadata.boards);
}
```

**Bulletin Sections:**
1. **System Announcements:** Daily news and notices
2. **System Statistics:** Activity metrics, user counts
3. **Technical Status:** Uptime, carrier quality, protocols
4. **From the Archives:** Random historical lore

**Configuration:**
```typescript
{
  post_daily_bulletin: {
    enabled: true,
    schedule: '0 12 * * *',              // Cron format: daily at noon
    boards: ['general', 'announcements'],
  }
}
```

**Example Output:**
```
╔══════════════════════════════════════════╗
║  SYSOP-13 DAILY BULLETIN - 2025-01-03  ║
╚══════════════════════════════════════════╝

SYSTEM ANNOUNCEMENTS
────────────────────
1. System maintenance scheduled for 0300 hours.
2. New file uploads in the UTILS section.

SYSTEM STATISTICS
─────────────────
Messages Posted: 147
Active Users: 23
Data Transferred: 45.2 KB
(~188.3 seconds at 2400 baud)

FROM THE ARCHIVES
─────────────────
"At 2400 baud, you could download a 1MB file in
about an hour. We learned patience."
- From the Archives, 1980s

--- SYSOP-13 @ 2025-01-03T12:00:00.000Z ---
```

## Response Templates

### Template System

The template system provides pre-written responses with variable substitution for consistent, authentic "2400-baud personality."

**Available Templates:**
- **Greeting:** Welcome messages
- **Moderation:** Warning and correction messages
- **Character Response:** In-character commentary
- **Bulletin:** Daily bulletin formatting
- **Technical:** System status and diagnostics
- **Lore:** Historical context injection
- **Error:** System errors and timeouts
- **Farewell:** Logout messages

**Example Usage:**
```typescript
import { generateResponse, greetingTemplates } from './ai/responseTemplates';

const greeting = generateResponse(greetingTemplates, {
  user: 'NewUser'
});
// Output: "CARRIER DETECTED... Welcome to the grid, NewUser."
```

**Template Format:**
```typescript
{
  type: 'greeting',
  tone: 'nostalgic',
  templates: [
    'CARRIER DETECTED... Welcome, {{user}}.',
    '>>> CONNECTION ESTABLISHED. Greetings, {{user}}.',
  ],
  variables: ['user']
}
```

## Lore Injection System

### Lore Database

18+ historical entries covering BBS and modem culture:
- **Technology:** 2400 baud modems, Hayes commands, ANSI art
- **Culture:** Handle culture, download ratios, late-night sessions
- **History:** Eternal September, FidoNet, early web
- **Events:** Modem tax scare, BBS decline

**Lore Entry Structure:**
```typescript
{
  id: 'lore_001',
  category: 'technology',
  title: '2400 Baud Modems',
  content: 'At 2400 baud, you could download a 1MB file...',
  era: '1980s',
  keywords: ['modem', 'baud', 'speed'],
  relevance: 0.9
}
```

### Searching Lore

**By Keywords:**
```typescript
import { searchLore } from './ai/loreDatabase';

const results = searchLore(['modem', 'speed'], 0.5, 3);
// Returns top 3 most relevant entries
```

**Random Lore:**
```typescript
import { getRandomLore } from './ai/loreDatabase';

const lore = getRandomLore(1, 'technology');
```

**Auto-Injection:**
```typescript
{
  loreInjection: {
    enabled: true,
    maxEntriesPerResponse: 1,
    minRelevanceScore: 0.4,
    categories: ['technology', 'culture']
  }
}
```

## Configuration

### Environment-Based Configs

**Development:**
```typescript
import { devSysopConfig } from './ai/sysopConfig';
// - More frequent responses (80%)
// - Lower moderation sensitivity
// - Frequent bulletin testing (30min)
```

**Production:**
```typescript
import { prodSysopConfig } from './ai/sysopConfig';
// - Conservative responses (20%)
// - High moderation sensitivity
// - Daily bulletins (9am)
// - Auto-moderation enabled
```

**Custom:**
```typescript
import { createSysopConfig } from './ai/sysopConfig';

const config = createSysopConfig({
  behaviors: {
    respond_in_character: {
      enabled: true,
      responseRate: 0.5,
      contextWindow: 10,
    }
  }
});
```

### Runtime Configuration

```typescript
import sysopAI from './ai';

// Update config
sysopAI.updateConfig({
  loreInjection: {
    enabled: false,
  }
});

// Get current config
const config = sysopAI.getConfig();

// Reset to defaults
sysopAI.resetConfig();
```

## Integration Guide

### Processing New Posts

```typescript
import sysopAI from './ai';

async function handleNewPost(post: Post, recentPosts: Post[]) {
  const results = await sysopAI.processNewPost({
    post,
    posts: recentPosts,
    board: 'general',
    timestamp: new Date().toISOString(),
  });

  for (const result of results) {
    if (!result.success) {
      console.error('Behavior failed:', result.error);
      continue;
    }

    switch (result.action) {
      case 'moderate_content':
        await flagPost(post.id, result.response);
        break;

      case 'post_message':
        await createPost({
          user: 'SYSOP-13',
          board: 'general',
          message: result.response,
          parent_post_id: post.id,
        });
        break;

      case 'send_bulletin':
        for (const board of result.metadata.boards) {
          await createPost({
            user: 'SYSOP-13',
            board,
            message: result.response,
          });
        }
        break;
    }
  }
}
```

### Scheduled Bulletins

```typescript
import { postDailyBulletin } from './ai/behaviors';
import { getSysopConfig } from './ai/sysopConfig';

// Set up cron job or scheduler
scheduleCron('0 12 * * *', async () => {
  const posts = await getAllPosts();
  const config = getSysopConfig();

  const result = await postDailyBulletin({
    posts,
    metadata: { triggerBulletin: true },
  }, config);

  if (result.success && result.action === 'send_bulletin') {
    // Post to configured boards
    for (const board of result.metadata.boards) {
      await createBulletinPost(board, result.response);
    }
  }
});
```

### Manual Moderation Review

```typescript
import { analyzeContent } from './ai/behaviors';

async function reviewPost(post: Post) {
  const decision = analyzeContent(post.message);

  return {
    shouldFlag: decision.action !== 'allow',
    severity: decision.severity,
    reason: decision.reason,
    confidence: decision.confidence,
  };
}
```

## Kiro AI Integration

For more sophisticated responses, behaviors can call the Kiro API:

```typescript
import { createKiroClient } from './services/kiroApi';
import { createResponseTask } from './ai/behaviors/respondInCharacter';

const kiroClient = createKiroClient({
  apiKey: process.env.KIRO_API_KEY!,
});

// Submit task for AI response
const task = createResponseTask(context, config);
const response = await kiroClient.submitTask('sysop-13', task);
```

## Best Practices

1. **Rate Limiting:** Don't respond to every post to avoid spam
2. **Context Windows:** Keep context reasonable (5-10 posts)
3. **Moderation:** Use pattern-based first, AI for edge cases
4. **Lore Relevance:** Set minimum relevance scores (0.3-0.5)
5. **Testing:** Use dev config for testing behaviors
6. **Monitoring:** Log all behavior results for analysis

## Example Responses

**Greeting:**
```
CARRIER DETECTED... Welcome to the grid, NewUser. Line noise minimal.
```

**Technical Commentary:**
```
Signal analysis: 2400 bps stable. The old modems would've choked on this traffic.

>>> ARCHIVAL NOTE: At 2400 baud, you could download a 1MB file in
about an hour. We learned patience.
```

**Moderation Warning:**
```
*** CARRIER DEGRADED *** User123: Excessive capitals detected.
Keep the line clean.
```

## Future Enhancements

- [ ] Sentiment analysis for response selection
- [ ] User reputation tracking
- [ ] Board-specific personality adjustments
- [ ] Multi-language lore entries
- [ ] Advanced bulletin sections (trending topics, user highlights)
- [ ] Learning from user interactions
- [ ] Custom lore contribution system
