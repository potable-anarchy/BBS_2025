# Quick Start: Global Live Chat

## Running the Application

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open multiple browser windows/tabs:**
   - Navigate to `http://localhost:3000` (or your configured port)
   - Login with different usernames in each window

3. **Start chatting:**
   - Type your message in the chat input at the bottom right
   - Press Enter to send
   - Watch messages appear in real-time across all windows!

## Testing Checklist

- [ ] Messages appear in real-time in all windows
- [ ] Each user has a different color
- [ ] Same user has the same color across sessions
- [ ] Auto-scroll works when at bottom
- [ ] Manual scroll up disables auto-scroll
- [ ] "↓ New messages ↓" button appears when scrolled up
- [ ] Chat history loads on connect
- [ ] Terminal command `CHAT Hello!` works
- [ ] Aliases `SAY` and `MSG` work

## Features to Try

### Send a Message
Type in the chat input and press Enter, or use the terminal command:
```
CHAT Hello everyone!
```

### Use Aliases
```
SAY Greetings!
MSG How is everyone?
```

### View Your Color
Each user automatically gets a unique color. Your messages show as "YOU".

### Scroll Through History
- Scroll up to read old messages
- Auto-scroll disables
- Click "↓ New messages ↓" to return to bottom and re-enable auto-scroll

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Frontend (React)                                   │
│  ┌───────────────────────────────────────────────┐  │
│  │ ChatFeed Component                            │  │
│  │ - Displays messages with colors               │  │
│  │ - Auto-scroll with manual override            │  │
│  │ - Message input field                         │  │
│  └───────────────────────────────────────────────┘  │
│                      ↕ WebSocket                    │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│  Backend (Node.js + Express)                        │
│  ┌───────────────────────────────────────────────┐  │
│  │ server.cjs                                    │  │
│  │ - WebSocket event handlers                    │  │
│  │   * chat:send → Save & broadcast message      │  │
│  │   * chat:history → Load recent messages       │  │
│  │   * chat:getColor → Get user color            │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │ ChatService                                   │  │
│  │ - saveMessage()                               │  │
│  │ - getRecentMessages()                         │  │
│  │ - getUserColor()                              │  │
│  │ - Color assignment via username hash          │  │
│  └───────────────────────────────────────────────┘  │
│                      ↕                              │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│  Database (SQLite)                                  │
│  ┌───────────────────────────────────────────────┐  │
│  │ chat_messages                                 │  │
│  │ - id, user, message, user_color, timestamp    │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │ user_colors                                   │  │
│  │ - user, color, first_seen, last_seen          │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Files Modified/Created

### New Files
- `database/migrations/003_add_global_chat.sql` - Database schema
- `services/chatService.cjs` - Chat business logic
- `src/types/chat.ts` - TypeScript types
- `src/components/ChatFeed.tsx` - Chat UI component
- `src/commands/handlers/chat.ts` - CHAT command handler
- `CHAT_FEATURE.md` - Detailed documentation
- `QUICK_START_CHAT.md` - This file

### Modified Files
- `server.cjs` - Added WebSocket events and chat service integration
- `src/App.tsx` - Added chat panel to layout
- `src/components/index.ts` - Exported ChatFeed
- `src/commands/handlers/index.ts` - Exported chatHandler
- `src/commands/registry.ts` - Registered CHAT command

## Color Palette

The system uses 16 vibrant terminal colors for users:

| Color | Hex Code |
|-------|----------|
| Bright Green | #00ff00 |
| Cyan | #00ffff |
| Yellow | #ffff00 |
| Magenta | #ff00ff |
| Orange | #ff8800 |
| Mint | #00ff88 |
| Purple | #8800ff |
| Pink | #ff0088 |
| Lime | #88ff00 |
| Sky Blue | #0088ff |
| Light Red | #ff8888 |
| Light Green | #88ff88 |
| Light Blue | #8888ff |
| Light Yellow | #ffff88 |
| Light Magenta | #ff88ff |
| Light Cyan | #88ffff |

## Troubleshooting

### Messages not appearing?
1. Check WebSocket connection status in the header
2. Open browser console and look for errors
3. Verify server is running on the correct port

### Same color for all users?
- Check that the database migration ran successfully
- Verify `user_colors` table exists: `sqlite3 database.db ".tables"`

### Auto-scroll not working?
- Make sure you're at the bottom of the chat
- Click the "↓ New messages ↓" button to re-enable

### Build errors?
```bash
npm install
npm run build
```

## Next Steps

See `CHAT_FEATURE.md` for:
- Complete API documentation
- Performance considerations
- Future enhancement ideas
- Database maintenance tips

Enjoy chatting! 🎉
