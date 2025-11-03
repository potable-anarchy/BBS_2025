# Quick Start Guide - WebSocket Chat

## 5-Minute Setup

### 1. Install and Start

```bash
npm install
npm start
```

Server runs on `http://localhost:3001`

### 2. Test with HTML Client

Open `examples/chat-client.html` in 2+ browser windows:

1. Enter different usernames
2. Use the same Board ID
3. Start chatting!

### 3. Test with Node Client

```bash
node test-client.js
```

This runs an automated test with 2 simulated users.

## Quick Integration

### Connect to Chat

```javascript
const socket = io('http://localhost:3001/chat', {
  auth: {
    userId: 'user-123',        // Unique user identifier
    username: 'Alice',          // Display name
    boardId: 'board-abc'        // Board/room to join
  }
});
```

### Send a Message

```javascript
socket.emit('chat:message', {
  content: 'Hello, world!'
});
```

### Receive Messages

```javascript
socket.on('chat:message', (message) => {
  console.log(`${message.username}: ${message.content}`);
});
```

### Show Typing Indicator

```javascript
// User starts typing
socket.emit('chat:typing:start');

// User stops typing
socket.emit('chat:typing:stop');
```

### Listen for Typing

```javascript
socket.on('chat:typing:start', (data) => {
  console.log(`${data.username} is typing...`);
});
```

## Essential Events

### Must Handle:
- `connect` - Connected to server
- `chat:board:joined` - Successfully joined board
- `chat:message` - New message received
- `chat:error` - Error occurred
- `disconnect` - Disconnected from server

### Optional:
- `chat:user:joined` - User joined board
- `chat:user:left` - User left board
- `chat:typing:start` - User typing
- `chat:typing:stop` - User stopped typing

## REST API Quick Reference

```bash
# Health check
curl http://localhost:3001/health

# Get stats
curl http://localhost:3001/api/chat/stats

# Get board users
curl http://localhost:3001/api/chat/boards/board-abc/users

# Broadcast to board (POST)
curl -X POST http://localhost:3001/api/chat/boards/board-abc/broadcast \
  -H "Content-Type: application/json" \
  -d '{"event":"announcement","data":{"message":"Test"}}'
```

## Common Patterns

### Basic Chat Component

```javascript
class ChatClient {
  constructor(userId, username, boardId) {
    this.socket = io('http://localhost:3001/chat', {
      auth: { userId, username, boardId }
    });

    this.setupListeners();
  }

  setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected!');
    });

    this.socket.on('chat:message', (msg) => {
      this.displayMessage(msg);
    });

    this.socket.on('chat:user:joined', (data) => {
      this.showNotification(`${data.username} joined`);
    });
  }

  sendMessage(content) {
    this.socket.emit('chat:message', { content });
  }

  disconnect() {
    this.socket.disconnect();
  }
}

// Usage
const chat = new ChatClient('user-1', 'Alice', 'board-abc');
chat.sendMessage('Hello!');
```

### Typing Indicator

```javascript
let typingTimeout;

messageInput.addEventListener('input', () => {
  socket.emit('chat:typing:start');

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('chat:typing:stop');
  }, 1000);
});
```

### Presence Updates

```javascript
// Update presence
socket.emit('chat:presence', 'away');

// Listen for presence changes
socket.on('chat:user:presence', (data) => {
  updateUserStatus(data.userId, data.status);
});
```

## Troubleshooting

### Connection Fails
- Check server is running: `curl http://localhost:3001/health`
- Verify CORS settings in `.env`
- Check browser console for errors

### Messages Not Appearing
- Ensure both users have same `boardId`
- Check for `chat:error` events
- Verify message content is not empty

### Frequent Disconnects
- Check network stability
- Increase `pingTimeout` in `server.js:21`
- Monitor server logs for errors

## Configuration

### Environment Variables (.env)

```env
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
NODE_ENV=development
```

### Customization Points

- **Rate Limiting**: `src/chat/middleware.js:105` - Adjust message limits
- **Message Length**: `src/chat/middleware.js:67` - Change max length
- **Ping Settings**: `server.js:21-24` - Connection health monitoring
- **Session Cleanup**: `src/chat/sessionManager.js:164` - Inactive session timeout

## Next Steps

1. Read full documentation: `README.md`
2. Review implementation details: `IMPLEMENTATION.md`
3. Explore the example client: `examples/chat-client.html`
4. Check security middleware: `src/chat/middleware.js`
5. Customize for your needs

## Support

- Check server logs for detailed error messages
- Review browser console for client-side issues
- Test with `test-client.js` to isolate problems
- Verify API endpoints with curl commands

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `ALLOWED_ORIGINS`
- [ ] Implement actual authentication
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting for your needs
- [ ] Consider Redis adapter for scaling
- [ ] Set up SSL/TLS certificates
- [ ] Test load and performance
- [ ] Backup and recovery plan

## Resources

- Socket.IO Docs: https://socket.io/docs/v4/
- Example Client: `examples/chat-client.html`
- Test Script: `test-client.js`
- Full API Reference: `README.md`

---

**Ready to chat! 🚀**
