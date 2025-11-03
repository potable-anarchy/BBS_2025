# Bulletin System Documentation

## Overview

The bulletin system allows **SYSOP-13** to post daily updates, lore fragments, announcements, and system messages to users. Bulletins are displayed prominently on the login screen and accessible via the `NEWS` command.

## Features

- **Daily Bulletins**: Automated daily posts summarizing system activity
- **Lore Bulletins**: Occasional cryptic fragments revealing the mysterious history of The Dead Net
- **Announcements**: Important system-wide announcements
- **System Messages**: Status updates and technical notifications
- **Pinned Bulletins**: High-priority messages that stay at the top
- **Multiple Display Modes**: Login screen, board view, and terminal command

## Database Schema

### Posts Table Extensions

The bulletin system extends the existing `posts` table with the following columns:

```sql
is_bulletin BOOLEAN DEFAULT 0        -- Marks post as a bulletin
is_pinned BOOLEAN DEFAULT 0          -- Pins bulletin to top
priority INTEGER DEFAULT 0           -- Sort priority (higher = more important)
bulletin_type TEXT DEFAULT NULL      -- Type: 'daily', 'announcement', 'lore', 'system'
```

### Bulletin Board

A dedicated "System Bulletins" board (created in migration `003_add_bulletin_support.sql`) stores all bulletins.

## API Endpoints

### Get Bulletins

```typescript
GET /api/bulletins?limit=10&includeUnpinned=true
```

Returns bulletins sorted by:
1. Pinned status (pinned first)
2. Priority (descending)
3. Timestamp (newest first)

### Get Latest Bulletin

```typescript
GET /api/bulletins (with limit=1)
```

Returns the single most recent bulletin for display on login screen.

### Get Bulletins by Type

```typescript
GET /api/bulletins/type?type=daily&limit=10
```

Filters bulletins by type: `daily`, `announcement`, `lore`, or `system`.

### Create Bulletin

```typescript
POST /api/bulletins
{
  "message": "Bulletin content",
  "bulletin_type": "daily",
  "priority": 10,
  "is_pinned": false
}
```

Creates a new bulletin (typically used by SYSOP-13 automated processes).

## Components

### BulletinBoard Component

React component for displaying bulletins with retro terminal styling.

**Props:**
- `limit?: number` - Maximum number of bulletins to display (default: 10)
- `showLatestOnly?: boolean` - Show only the latest bulletin (default: false)
- `compact?: boolean` - Use compact display mode (default: false)

**Usage:**

```tsx
// Login screen - show latest only
<BulletinBoard showLatestOnly={true} compact={true} />

// Board view - show recent bulletins
<BulletinBoard limit={5} />

// Dedicated bulletin page
<BulletinBoard limit={20} />
```

**Styling:**
- Color-coded by bulletin type:
  - `daily`: Cyan (#00ffff)
  - `announcement`: Yellow (#ffff00)
  - `lore`: Magenta (#ff00ff)
  - `system`: Red (#ff0000)
- Pinned bulletins have yellow border and background highlight
- Retro terminal aesthetic with CRT-style borders

## Terminal Commands

### NEWS Command

Display system bulletins from the terminal.

**Syntax:**
```
NEWS [latest|all|daily|lore|announcement|system] [count]
```

**Examples:**
```
NEWS              # View latest bulletin
NEWS all          # View all recent bulletins
NEWS daily 5      # View last 5 daily bulletins
NEWS lore         # View all lore bulletins
BULLETIN          # Alias for NEWS
```

**Aliases:** `BULLETIN`, `BULLETINS`

**Output Format:**
- Header with bulletin type and filter
- Color-coded bulletin type tags
- Timestamp in `MM/DD/YYYY HH:MM` format
- Pinned indicator for pinned bulletins
- Message content with proper line wrapping
- Summary footer with total count

## SYSOP-13 Integration

### BulletinService

The `BulletinService` class handles automated bulletin generation and posting.

**Methods:**

```typescript
// Create daily bulletin
BulletinService.createDailyBulletin()

// Create lore bulletin
BulletinService.createLoreBulletin()

// Create announcement
BulletinService.createAnnouncement(message, pinned)

// Create system bulletin
BulletinService.createSystemBulletin(message)

// Schedule automated posting
BulletinService.scheduleAutomatedBulletins()
```

### Automated Posting

The service includes scheduling logic for automated bulletin posting:

- **Daily Bulletins**: Posted automatically at midnight (00:00)
- **Lore Bulletins**: Posted randomly with 30% probability each day
- **Announcements**: Manually triggered via API or admin interface
- **System Messages**: Posted on system events (errors, maintenance, etc.)

### Content Generation

Current implementation uses template-based messages. Future enhancements will integrate with Kiro AI API for dynamic content generation based on:
- Active user count
- Recent post activity
- System status
- Historical patterns
- Time of day
- Seasonal themes

### SYSOP-13 Voice

All bulletins maintain SYSOP-13's characteristic voice:
- **Terse and technical**: Brief, to-the-point messages
- **Dry and cryptic**: Subtle hints, knowing observations
- **Nostalgic**: References to "the old days" and BBS history
- **Subtly menacing**: Underlying sense of mystery and unease
- **BBS-era vocabulary**: Authentic retro terminology

**Example Daily Bulletin:**
```
Systems check complete. 47 active connections detected.
The boards remember everything.
```

**Example Lore Bulletin:**
```
I remember the last transmission. 1997. The carrier signal
died mid-packet. Then... nothing. Until now.
```

## UI Integration

### Login Screen

The latest bulletin is displayed prominently above the login form:

```tsx
<BulletinBoard showLatestOnly={true} compact={true} />
```

This gives users immediate context and atmosphere upon connecting to the system.

### Board View

Recent bulletins (5 most recent) are displayed at the top of the boards listing:

```tsx
<BulletinBoard limit={5} />
```

Users can see important updates before browsing boards.

### Dedicated Bulletin View

A full bulletin board view can be created for browsing all historical bulletins:

```tsx
<BulletinBoard limit={50} />
```

## Backend Implementation Notes

### Required Backend Routes

The following API routes need to be implemented in the backend:

```
GET  /api/bulletins
GET  /api/bulletins/type
POST /api/bulletins
```

### Database Queries

**Get bulletins with proper sorting:**
```sql
SELECT * FROM posts
WHERE is_bulletin = 1
  AND (? OR is_pinned = 1)  -- includeUnpinned filter
ORDER BY
  is_pinned DESC,
  priority DESC,
  timestamp DESC
LIMIT ?
```

**Get bulletins by type:**
```sql
SELECT * FROM posts
WHERE is_bulletin = 1
  AND bulletin_type = ?
ORDER BY
  is_pinned DESC,
  priority DESC,
  timestamp DESC
LIMIT ?
```

### Creating Bulletins

When creating bulletins via the API:
1. User field is set to "SYSOP-13"
2. Board is set to "System Bulletins" board
3. `is_bulletin` is set to `true`
4. Type, priority, and pinned status are set from request
5. Timestamp is set to current time

## Best Practices

### Content Guidelines

**Daily Bulletins:**
- Keep to 3-5 sentences
- Include system metrics when relevant
- Maintain cryptic, observational tone
- Reference technical details
- Avoid explicit exposition

**Lore Bulletins:**
- 4-6 sentences
- Reveal small fragments of backstory
- Use specific dates/times for authenticity
- Maintain mystery - never fully explain
- Technical details add credibility

**Announcements:**
- 2-4 sentences
- Clear and direct (but still in SYSOP voice)
- Use system prefix `[SYS]` or warning `[!]` when appropriate
- Pin important announcements

**System Messages:**
- Brief (1-3 sentences)
- Technical and factual
- Higher priority for critical issues
- Use system prefix `[SYS]`

### Frequency Recommendations

- **Daily**: Once per day at consistent time (midnight)
- **Lore**: 2-3 times per week (random)
- **Announcements**: As needed, but avoid overuse
- **System**: Event-triggered only

### Priority Levels

```
5-9   : Normal bulletins
10-14 : Daily bulletins
15-19 : Announcements
20-24 : Pinned announcements
25+   : Critical system messages
```

## Future Enhancements

### Kiro AI Integration

Replace template-based content with AI-generated bulletins:
1. Pass context (active users, recent activity, time) to Kiro API
2. Use SYSOP-13 personality spec for consistent voice
3. Generate dynamic, contextual bulletins
4. Learn from user engagement patterns

### User Interaction

- Allow users to react to bulletins
- Track bulletin read status per user
- Notification system for new bulletins
- Archive view with search

### Advanced Features

- Scheduled future bulletins
- Bulletin templates for different events
- A/B testing for bulletin content
- Analytics on bulletin engagement
- Admin interface for manual bulletin creation

### Backend Automation

- Cron job for scheduled bulletins
- Event listeners for system bulletins
- Activity monitoring for contextual content
- Error tracking for system message triggers

## Troubleshooting

### Bulletins Not Displaying

1. Check database migration ran successfully
2. Verify "System Bulletins" board exists
3. Check API endpoint is accessible
4. Verify bulletin data structure matches schema

### Command Not Working

1. Ensure `newsCommand` is registered in command registry
2. Check import in handlers/index.ts
3. Verify API service methods are implemented
4. Test API endpoints directly

### Styling Issues

1. Check theme provider is wrapping component
2. Verify styled-components is imported
3. Test with CRT effects disabled
4. Check for CSS conflicts

## Testing

### Manual Testing

1. Create test bulletin via API
2. Verify display on login screen
3. Test NEWS command with various filters
4. Check bulletin sorting (pinned first)
5. Verify type color coding
6. Test with no bulletins available

### Automated Testing

```typescript
// API tests
test('GET /api/bulletins returns bulletins', async () => {
  const response = await api.getBulletins({ limit: 5 });
  expect(response).toBeDefined();
  expect(response.length).toBeLessThanOrEqual(5);
});

// Component tests
test('BulletinBoard renders latest bulletin', () => {
  render(<BulletinBoard showLatestOnly={true} />);
  expect(screen.getByText(/Latest Bulletin/i)).toBeInTheDocument();
});

// Command tests
test('NEWS command displays bulletins', async () => {
  const result = await newsCommand.execute([], context);
  expect(result.success).toBe(true);
  expect(result.output).toContain('BULLETIN');
});
```

## Migration Checklist

- [x] Create database migration
- [x] Extend Post type definitions
- [x] Add API methods to ApiService
- [x] Create BulletinBoard component
- [x] Integrate into LoginForm
- [x] Integrate into board view
- [x] Create NEWS command handler
- [x] Register command in registry
- [x] Update help text
- [x] Create BulletinService
- [x] Update Kiro spec
- [ ] Implement backend API routes
- [ ] Run database migration
- [ ] Test bulletin creation
- [ ] Test display components
- [ ] Test NEWS command
- [ ] Deploy and monitor

## Support

For issues or questions about the bulletin system:
- Check this documentation first
- Review the code in `src/components/BulletinBoard.tsx`
- Check command handler in `src/commands/handlers/news.ts`
- Review service in `src/services/bulletinService.ts`
- Inspect database schema in `database/migrations/003_add_bulletin_support.sql`
