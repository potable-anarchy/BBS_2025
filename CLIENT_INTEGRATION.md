# Client Integration Guide

## Session Management & Username Storage

This guide explains how to integrate the session management system with your frontend application.

## Overview

The backend now supports:
- **Ephemeral session IDs**: Automatically generated for each connection
- **Username tracking**: Usernames sent from client via Socket.IO handshake
- **Activity logging**: All user actions are logged with timestamps
- **Session statistics**: Real-time session data via REST API

## Client-Side Implementation

### 1. Username Storage in LocalStorage

Store and retrieve the username in browser LocalStorage:

```javascript
// Get username from LocalStorage or prompt user
function getUsername() {
  let username = localStorage.getItem('username');

  if (!username) {
    username = prompt('Enter your username:') || 'Anonymous';
    localStorage.setItem('username', username);
  }

  return username;
}

// Update username
function updateUsername(newUsername) {
  localStorage.setItem('username', newUsername);
  return newUsername;
}
```

### 2. Socket.IO Connection with Username

Pass the username during Socket.IO connection via the `auth` object:

```javascript
import { io } from 'socket.io-client';

// Get username from LocalStorage
const username = getUsername();

// Connect to server with username in auth
const socket = io('http://localhost:3001', {
  auth: {
    username: username
  }
});

// Listen for session creation
socket.on('session-created', (data) => {
  console.log('Session created:', data);
  // data = { sessionId: '...', username: '...' }

  // Optionally store session ID
  sessionStorage.setItem('sessionId', data.sessionId);
});
```

### 3. Update Username at Runtime

Allow users to change their username during an active session:

```javascript
function changeUsername(newUsername) {
  // Update LocalStorage
  localStorage.setItem('username', newUsername);

  // Notify server
  socket.emit('update-username', newUsername);
}

// Listen for confirmation
socket.on('username-updated', (data) => {
  console.log('Username updated to:', data.username);
  // Update UI to reflect new username
});
```

### 4. Send Messages with Session Context

Messages automatically include username from the server:

```javascript
// Send message
function sendMessage(message) {
  socket.emit('message', {
    message: message
  });
}

// Receive messages (now includes username)
socket.on('message', (data) => {
  console.log(`${data.username}: ${data.message}`);
  // data = { message: '...', username: '...', timestamp: '...' }
});
```

### 5. Room Management with Session

Join and leave rooms with automatic session tracking:

```javascript
// Join room
function joinRoom(roomName) {
  socket.emit('join-room', roomName);
}

// Leave room
function leaveRoom(roomName) {
  socket.emit('leave-room', roomName);
}

// Listen for room events (now includes username)
socket.on('user-joined', (data) => {
  console.log(`${data.username} joined the room`);
  // data = { socketId: '...', username: '...' }
});

socket.on('user-left', (data) => {
  console.log(`${data.username} left the room`);
  // data = { socketId: '...', username: '...' }
});
```

## REST API Endpoints

### Get Session Statistics

```javascript
// Fetch session stats
fetch('http://localhost:3001/api/sessions')
  .then(res => res.json())
  .then(stats => {
    console.log('Active sessions:', stats.activeSessions);
    console.log('Total activities:', stats.totalActivities);
    console.log('Active users:', stats.usernames);
  });
```

Response:
```json
{
  "activeSessions": 5,
  "totalActivities": 42,
  "usernames": ["Alice", "Bob", "Charlie"]
}
```

### Get Active Sessions

```javascript
// Fetch detailed session data
fetch('http://localhost:3001/api/sessions/active')
  .then(res => res.json())
  .then(sessions => {
    sessions.forEach(session => {
      console.log(`User: ${session.username}`);
      console.log(`Session ID: ${session.sessionId}`);
      console.log(`Activities: ${session.activities.length}`);
    });
  });
```

Response:
```json
[
  {
    "sessionId": "a1b2c3d4...",
    "socketId": "xyz123...",
    "username": "Alice",
    "createdAt": "2025-11-03T10:00:00.000Z",
    "lastActivity": "2025-11-03T10:05:00.000Z",
    "activities": [
      {
        "timestamp": "2025-11-03T10:01:00.000Z",
        "command": "message",
        "messageLength": 25
      }
    ],
    "rooms": ["general", "dev"]
  }
]
```

## Complete Example

```javascript
import { io } from 'socket.io-client';

// Username management
function getUsername() {
  return localStorage.getItem('username') || 'Anonymous';
}

function setUsername(name) {
  localStorage.setItem('username', name);
}

// Initialize connection
const username = getUsername();
const socket = io('http://localhost:3001', {
  auth: { username }
});

// Handle connection
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('session-created', (data) => {
  console.log('Session:', data);
  sessionStorage.setItem('sessionId', data.sessionId);
});

// Message handling
socket.on('message', (data) => {
  displayMessage(data.username, data.message, data.timestamp);
});

function sendMessage(text) {
  socket.emit('message', { message: text });
}

// Username update
function updateUsername(newName) {
  setUsername(newName);
  socket.emit('update-username', newName);
}

socket.on('username-updated', (data) => {
  console.log('Username changed to:', data.username);
});

// Room management
function joinRoom(room) {
  socket.emit('join-room', room);
}

socket.on('user-joined', (data) => {
  console.log(`${data.username} joined`);
});

socket.on('user-left', (data) => {
  console.log(`${data.username} left`);
});

// Disconnect
socket.on('disconnect', () => {
  console.log('Disconnected from server');
  sessionStorage.removeItem('sessionId');
});
```

## React Example

```jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Get username from LocalStorage
    const storedUsername = localStorage.getItem('username') || 'Anonymous';
    setUsername(storedUsername);

    // Connect with username
    const newSocket = io('http://localhost:3001', {
      auth: { username: storedUsername }
    });

    newSocket.on('session-created', (data) => {
      console.log('Session created:', data);
    });

    newSocket.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handleSendMessage = (text) => {
    socket?.emit('message', { message: text });
  };

  const handleUpdateUsername = (newName) => {
    localStorage.setItem('username', newName);
    setUsername(newName);
    socket?.emit('update-username', newName);
  };

  return (
    <div>
      <h1>Chat App - {username}</h1>
      {/* Your UI components */}
    </div>
  );
}
```

## Security Notes

1. **Username Validation**: The server accepts any username. Add validation as needed.
2. **Session Storage**: Sessions are stored in-memory and will be lost on server restart.
3. **No Authentication**: This is a basic session system. Add proper authentication for production.
4. **LocalStorage**: Usernames in LocalStorage persist across sessions but can be cleared by users.

## Troubleshooting

### Username not appearing
- Check that `auth.username` is passed during connection
- Verify LocalStorage has the username stored
- Check browser console for Socket.IO connection errors

### Session not created
- Ensure server is running and accessible
- Check CORS settings in `.env` file
- Verify Socket.IO client version compatibility (v4.x)

### Activities not logging
- Ensure you're emitting proper event names (`message`, `join-room`, etc.)
- Check server logs for structured JSON output
- Verify LOG_LEVEL is set to INFO or DEBUG
