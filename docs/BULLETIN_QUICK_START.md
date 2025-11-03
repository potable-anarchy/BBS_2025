# Bulletin System - Quick Start Guide

## For Users

### Viewing Bulletins

**On Login:**
The latest bulletin from SYSOP-13 appears automatically when you connect.

**In Terminal:**
```bash
NEWS              # View latest bulletin
NEWS all          # View all recent bulletins
NEWS daily 5      # Last 5 daily updates
NEWS lore         # View lore fragments
BULLETIN          # Same as NEWS
```

**In Board View:**
Recent bulletins appear at the top of the boards page.

### Bulletin Types

- **[DAILY]** - Daily system updates (cyan)
- **[ANNOUNCEMENT]** - Important notices (yellow)
- **[LORE]** - Mysterious story fragments (magenta)
- **[SYSTEM]** - Technical status updates (red)

Pinned bulletins have a **[PINNED]** tag and yellow highlight.

## For Developers

### Backend Setup

**1. Run Database Migration:**
```bash
sqlite3 database.db < database/migrations/003_add_bulletin_support.sql
```

**2. Implement API Routes:**

```javascript
// GET /api/bulletins
app.get('/api/bulletins', async (req, res) => {
  const { limit = 10, includeUnpinned = 'false' } = req.query;

  const bulletins = await db.all(`
    SELECT * FROM posts
    WHERE is_bulletin = 1
      AND (? = 'true' OR is_pinned = 1)
    ORDER BY is_pinned DESC, priority DESC, timestamp DESC
    LIMIT ?
  `, includeUnpinned, parseInt(limit));

  res.json({ success: true, data: bulletins, count: bulletins.length });
});

// GET /api/bulletins/type
app.get('/api/bulletins/type', async (req, res) => {
  const { type, limit = 10 } = req.query;

  const bulletins = await db.all(`
    SELECT * FROM posts
    WHERE is_bulletin = 1 AND bulletin_type = ?
    ORDER BY is_pinned DESC, priority DESC, timestamp DESC
    LIMIT ?
  `, type, parseInt(limit));

  res.json({ success: true, data: bulletins, count: bulletins.length });
});

// POST /api/bulletins
app.post('/api/bulletins', async (req, res) => {
  const { message, bulletin_type, priority = 10, is_pinned = false } = req.body;

  // Get System Bulletins board ID
  const board = await db.get("SELECT id FROM boards WHERE name = 'System Bulletins'");

  const result = await db.run(`
    INSERT INTO posts (
      board_id, user, message, timestamp,
      is_bulletin, bulletin_type, priority, is_pinned
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    board.id,
    'SYSOP-13',
    message,
    new Date().toISOString(),
    1,
    bulletin_type,
    priority,
    is_pinned ? 1 : 0
  );

  const bulletin = await db.get('SELECT * FROM posts WHERE id = ?', result.lastID);
  res.json({ success: true, data: bulletin });
});
```

**3. Schedule Automated Bulletins:**

```javascript
import BulletinService from './src/services/bulletinService';

// In your server startup
BulletinService.scheduleAutomatedBulletins();
```

**4. Create Welcome Bulletin:**

```javascript
await BulletinService.createAnnouncement(
  'The Dead Net is online. System operational. SYSOP-13 active.',
  true  // pinned
);
```

### Using Components

```tsx
// Login screen
import BulletinBoard from './components/BulletinBoard';
<BulletinBoard showLatestOnly={true} compact={true} />

// Board view
<BulletinBoard limit={5} />

// Full bulletin page
<BulletinBoard limit={20} />
```

### Creating Bulletins Programmatically

```typescript
import BulletinService from './services/bulletinService';

// Daily bulletin (automated)
await BulletinService.createDailyBulletin();

// Lore fragment
await BulletinService.createLoreBulletin();

// Announcement
await BulletinService.createAnnouncement(
  'New feature: Thread notifications now available.',
  false  // not pinned
);

// System message
await BulletinService.createSystemBulletin(
  '[SYS] Scheduled maintenance in 1 hour. Service may be interrupted.'
);
```

## Testing

**Manual Test:**
```bash
# 1. Create test bulletin
curl -X POST http://localhost:3001/api/bulletins \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test bulletin from SYSOP-13. The Dead Net is watching.",
    "bulletin_type": "system",
    "priority": 15,
    "is_pinned": true
  }'

# 2. Fetch bulletins
curl http://localhost:3001/api/bulletins?limit=5

# 3. Test in UI
# - Refresh login page
# - Check boards view
# - Run NEWS command in terminal
```

## Troubleshooting

**Bulletins not showing?**
- Check database migration ran: `SELECT * FROM sqlite_master WHERE type='index' AND name LIKE '%bulletin%'`
- Verify System Bulletins board exists: `SELECT * FROM boards WHERE name='System Bulletins'`
- Check API endpoint responds: `curl http://localhost:3001/api/bulletins`

**NEWS command not found?**
- Restart development server
- Check browser console for errors
- Verify `newsCommand` is registered in registry

**Styling broken?**
- Ensure theme provider wraps components
- Check styled-components version
- Verify CRT effects are enabled

## Quick Reference

### Priority Levels
```
5-9   : Normal
10-14 : Daily
15-19 : Announcement
20-24 : Pinned Announcement
25+   : Critical System
```

### Bulletin Types
```
'daily'        : Daily system updates
'announcement' : Important notices
'lore'         : Story fragments
'system'       : Status messages
```

### Color Codes
```
Daily        : Cyan    (#00ffff)
Announcement : Yellow  (#ffff00)
Lore         : Magenta (#ff00ff)
System       : Red     (#ff0000)
Default      : Green   (#00ff00)
```

## Resources

- Full Documentation: `docs/BULLETIN_SYSTEM.md`
- Implementation Summary: `BULLETIN_SYSTEM_SUMMARY.md`
- Component Code: `src/components/BulletinBoard.tsx`
- Command Handler: `src/commands/handlers/news.ts`
- Service Logic: `src/services/bulletinService.ts`
- Database Schema: `database/migrations/003_add_bulletin_support.sql`
