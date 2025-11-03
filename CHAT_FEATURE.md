# Global Live Chat Feature

## Overview

The global live chat feature provides real-time communication between all connected users with color-coded usernames for easy identification.

## Features

✅ **Real-time messaging** - Instant message delivery via WebSocket
✅ **Color-coded users** - Each user gets a unique, consistent color
✅ **Message persistence** - Chat history stored in database
✅ **Auto-scrolling** - Smooth scroll to latest messages
✅ **Message history** - Load recent messages on connect
✅ **Retro terminal styling** - Matches the overall terminal aesthetic

## Architecture

### Database Schema

Two new tables have been added:

1. **chat_messages** - Stores all chat messages
   - id (INTEGER PRIMARY KEY)
   - user (TEXT)
   - message (TEXT)
   - user_color (TEXT)
   - timestamp (DATETIME)
   - session_id (TEXT)

2. **user_colors** - Persistent color assignments
   - user (TEXT PRIMARY KEY)
   - color (TEXT)
   - first_seen (DATETIME)
   - last_seen (DATETIME)

### Backend Components

1. **ChatService** (`services/chatService.cjs`)
   - Manages chat messages and user colors
   - Handles database operations
   - Assigns consistent colors via username hash

2. **Server WebSocket Events** (`server.cjs`)
   - `chat:send` - Receive message from client
   - `chat:message` - Broadcast message to all clients
   - `chat:history` - Request recent messages
   - `chat:getColor` - Request user color
   - `chat:error` - Error handling

### Frontend Components

1. **ChatFeed Component** (`src/components/ChatFeed.tsx`)
   - Real-time message display
   - Color-coded usernames
   - Auto-scroll with manual override
   - Message input with validation
   - Smooth animations

2. **Chat Types** (`src/types/chat.ts`)
   - TypeScript interfaces for chat data
   - Request/response types

3. **CHAT Command** (`src/commands/handlers/chat.ts`)
   - Terminal command for sending messages
   - Aliases: SAY, MSG
   - Usage: `CHAT <message>`

## User Colors

The system uses 16 vibrant terminal colors:

- Bright Green (#00ff00)
- Cyan (#00ffff)
- Yellow (#ffff00)
- Magenta (#ff00ff)
- Orange (#ff8800)
- Mint (#00ff88)
- Purple (#8800ff)
- Pink (#ff0088)
- Lime (#88ff00)
- Sky Blue (#0088ff)
- Light Red (#ff8888)
- Light Green (#88ff88)
- Light Blue (#8888ff)
- Light Yellow (#ffff88)
- Light Magenta (#ff88ff)
- Light Cyan (#88ffff)

Colors are assigned based on a hash of the username, ensuring:
- Same user always gets the same color
- Different users get different colors (usually)
- Distribution is reasonably uniform

## WebSocket Events

### Client → Server

```typescript
// Send a chat message
socket.emit('chat:send', {
  message: string
});

// Request chat history
socket.emit('chat:history', {
  limit?: number  // Default: 50
});

// Get user color
socket.emit('chat:getColor', {
  username?: string
});
```

### Server → Client

```typescript
// Receive a chat message
socket.on('chat:message', (data) => {
  id: number
  user: string
  message: string
  userColor: string
  timestamp: string
});

// Receive chat history
socket.on('chat:history', (messages: ChatMessage[]) => {
  // Array of recent messages
});

// Receive user color
socket.on('chat:color', (data) => {
  username: string
  color: string
});

// Receive error
socket.on('chat:error', (error) => {
  error: string
});
```

## UI Integration

The chat feed appears in a side panel next to the main content:

```
┌─────────────────────────────────────┐
│ Header (User Info, Connection)     │
├─────────────────┬───────────────────┤
│                 │  GLOBAL CHAT      │
│                 │  ● LIVE           │
│  Main Content   ├───────────────────┤
│                 │ [12:34] USER1:    │
│  (Terminals,    │         message   │
│   Boards, etc)  │ [12:35] USER2:    │
│                 │         message   │
│                 ├───────────────────┤
│                 │ > [input field]   │
└─────────────────┴───────────────────┘
```

## Usage

### For Users

1. **View Chat**: Chat is always visible on the right side
2. **Send Message**: Type in the input field and press Enter
3. **Use Command**: `CHAT Hello everyone!` or `SAY Hello!`
4. **Scroll Control**:
   - Auto-scrolls to new messages by default
   - Manual scroll up disables auto-scroll
   - Click "↓ New messages ↓" to re-enable

### For Developers

**Initialize Chat Service:**
```javascript
const ChatService = require('./services/chatService.cjs');
const chatService = new ChatService(db);
await chatService.initialize();
```

**Use in React:**
```tsx
import { ChatFeed } from './components';

<ChatFeed
  socket={socket}
  currentUsername={username}
  maxMessages={100}
/>
```

## Testing

To test the chat feature:

1. Start the server:
   ```bash
   npm run dev
   ```

2. Open multiple browser windows/tabs

3. Log in with different usernames

4. Send messages from each window

5. Verify:
   - Messages appear in real-time
   - Each user has a different color
   - Same user has the same color across sessions
   - Auto-scroll works
   - Message history loads on connect

## Performance Considerations

- **Message Limit**: Frontend keeps only last 100 messages in memory
- **History Limit**: Default 50 messages loaded on connect
- **Database Cleanup**: Use `deleteOldMessages(30)` to clean messages older than 30 days
- **Smooth Scrolling**: CSS-based smooth scrolling for performance

## Future Enhancements

Potential improvements:

1. **User List**: Show online users with their colors
2. **Typing Indicators**: Show when users are typing
3. **Private Messages**: Direct messaging between users
4. **Message Reactions**: Add emoji reactions to messages
5. **User Mentions**: @username mentions with notifications
6. **Message Search**: Search through chat history
7. **Rich Text**: Support for markdown or formatting
8. **File Sharing**: Upload and share files in chat
9. **Message Editing**: Edit or delete sent messages
10. **Chat Rooms**: Multiple chat channels/rooms

## Migration

The migration file `003_add_global_chat.sql` is automatically run when the server starts. If you need to run it manually:

```bash
sqlite3 database.db < database/migrations/003_add_global_chat.sql
```

## Troubleshooting

**Messages not appearing:**
- Check WebSocket connection status in Header
- Verify server is running
- Check browser console for errors

**Colors not showing:**
- Verify database migration ran successfully
- Check that `user_colors` table exists

**Auto-scroll not working:**
- Try clicking the "↓ New messages ↓" button
- Verify you're at the bottom of chat

**Performance issues:**
- Reduce `maxMessages` prop on ChatFeed
- Check for memory leaks in browser dev tools
- Consider implementing virtual scrolling for very long chats
