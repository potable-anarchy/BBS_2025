# Vibe Kanban - Full Stack Application

A full-stack Kanban board application with a terminal-style UI built with React, TypeScript, and Vite on the frontend, and Node.js, Express, and Socket.IO on the backend.

## Features

### Frontend - React Terminal UI Framework

A modern terminal-style UI framework built with React, TypeScript, and Vite. Features both custom-built terminal components and XTerm.js integration for advanced terminal emulation.

#### Frontend Features

- **Custom Terminal Component**: Lightweight, styled terminal with command history and custom command handlers
- **XTerm Terminal**: Full-featured terminal emulator using @xterm/xterm
- **Terminal-style UI**: Retro green-on-black aesthetic with modern React patterns
- **TypeScript**: Full type safety throughout the application
- **Styled Components**: CSS-in-JS styling with themed components
- **Vite**: Lightning-fast development and optimized production builds

### Backend - WebSocket Chat Infrastructure

Real-time chat system built with Socket.IO, featuring board-specific rooms, user session tracking, and comprehensive connection management.

#### Backend Features

- **WebSocket Endpoint**: `/chat` namespace for real-time communication
- **Board-Specific Rooms**: Isolated chat rooms per board
- **Connection Management**: Automatic session tracking and cleanup
- **User Presence**: Track online users and their status
- **Typing Indicators**: Real-time typing notifications
- **Message Broadcasting**: Efficient room-based message delivery
- **Rate Limiting**: Built-in spam prevention
- **Multi-Device Support**: Users can connect from multiple devices
- **RESTful API**: HTTP endpoints for stats and management
- **Message Validation**: XSS prevention and content sanitization
- **Session Management**: Comprehensive user session tracking with ephemeral IDs
- **Activity Logging**: Structured JSON logs for all user actions
- **SQLite Database**: Data persistence for boards and posts
- **Graceful Shutdown**: Clean connection cleanup on shutdown

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **@xterm/xterm** - Terminal emulator
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **Socket.IO 4.8** - Real-time communication
- **SQLite** - Database
- **dotenv** - Environment configuration
- **helmet** - Security middleware

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `PORT` | No | Backend server port | `3001` |
| `VITE_PORT` | No | Frontend dev server port | `3000` |
| `ALLOWED_ORIGINS` | No | CORS allowed origins | `http://localhost:3000` |
| `NODE_ENV` | No | Node environment | `development` |
| `KIRO_API_KEY` | **Yes** | API key for KIRO service | - |
| `DATABASE_PATH` | No | SQLite database path | `./data/kanban.db` |
| `LOG_LEVEL` | No | Logging level (DEBUG, INFO, WARN, ERROR) | `INFO` |

**Note:** The server will not start if required environment variables are missing.

### Running the Application

#### Frontend Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000`

#### Backend Server (Development)

```bash
npm run dev:server
```

Runs on port `3001` (configurable via `.env`)

#### Backend Server (Production)

```bash
npm start
```

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Project Structure

```
.
├── src/                       # Frontend source
│   ├── components/
│   │   ├── Terminal.tsx       # Custom terminal component
│   │   └── XTermTerminal.tsx  # XTerm-based terminal
│   ├── chat/                  # Chat infrastructure
│   │   ├── chatHandler.js     # WebSocket event handling
│   │   ├── sessionManager.js  # User session tracking (chat-specific)
│   │   └── middleware.js      # Authentication & validation
│   ├── styles/
│   │   └── GlobalStyles.ts    # Global styles
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
├── server.js                  # Backend server
├── services/
│   └── sessionManager.js      # General session management service
├── utils/
│   └── logger.js              # Structured logging utility
├── database/
│   └── db.js                  # Database manager
├── routes/
│   └── boards.js              # Board API routes
├── data/                      # SQLite database files
├── examples/
│   └── chat-client.html       # Test client for chat
├── test-client.js             # Test client for chat functionality
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── CLIENT_INTEGRATION.md      # Frontend integration guide
└── README.md                  # This file
```

## WebSocket Chat API

For detailed chat API documentation, see [QUICKSTART.md](QUICKSTART.md) and [IMPLEMENTATION.md](IMPLEMENTATION.md).

### Quick Connection Example

Connect to the `/chat` namespace with authentication:

```javascript
const socket = io('http://localhost:3001/chat', {
  auth: {
    userId: 'user-123',
    username: 'John Doe',
    boardId: 'board-abc'
  }
});

// Send message
socket.emit('chat:message', {
  content: 'Hello, world!'
});

// Receive messages
socket.on('chat:message', (message) => {
  console.log(`${message.username}: ${message.content}`);
});
```

### Chat Events

#### Client → Server
- `chat:message` - Send a chat message
- `chat:typing:start` - Indicate user is typing
- `chat:typing:stop` - Indicate user stopped typing
- `chat:presence` - Update presence status
- `chat:reaction` - React to a message

#### Server → Client
- `chat:board:joined` - Successfully joined board
- `chat:message` - New message received
- `chat:user:joined` - User joined the board
- `chat:user:left` - User left the board
- `chat:typing:start` - User started typing
- `chat:error` - Error occurred

### REST API Endpoints

#### General Endpoints
- `GET /health` - Health check endpoint
- `GET /api` - Basic API status

#### Chat Endpoints
- `GET /api/chat/stats` - Real-time chat statistics
- `GET /api/chat/boards/:boardId/users` - Get board users
- `POST /api/chat/boards/:boardId/broadcast` - Admin broadcast

#### Session Management Endpoints
- `GET /api/sessions` - Get general session statistics
- `GET /api/sessions/active` - Get all active sessions

## Testing the Chat

### Browser Test Client

Open `examples/chat-client.html` in multiple browser windows to test real-time chat.

### Automated Test

```bash
node test-client.js
```

This tests the chat functionality with multiple clients, typing indicators, and message broadcasting.

## Frontend Components

### Terminal Component

A custom-built terminal component with the following features:

- Command input with history (up/down arrow keys)
- Custom command handlers
- Built-in commands: `help`, `clear`, `echo`, `date`
- Customizable prompt
- Auto-scrolling output
- Retro terminal styling

**Usage:**

```tsx
import Terminal from './components/Terminal';

<Terminal
  prompt="$"
  welcomeMessage="Welcome to the terminal!"
  onCommand={(cmd) => {
    if (cmd === 'custom') {
      return 'Custom command output';
    }
    return 'Command not found';
  }}
/>
```

### XTermTerminal Component

A terminal emulator using the industry-standard XTerm.js library:

- Full terminal emulation
- ANSI color support
- Configurable theme
- Standard terminal keybindings

**Usage:**

```tsx
import XTermTerminal from './components/XTermTerminal';

<XTermTerminal
  welcomeMessage="Welcome to XTerm!"
  onCommand={(cmd) => {
    console.log('Command:', cmd);
  }}
/>
```

## Session Management & Logging

The server includes comprehensive session management and activity logging systems:

### Features

- **Ephemeral Session IDs**: Each connection gets a unique, randomly generated session ID
- **Username Tracking**: Usernames are tracked via Socket.IO handshake auth
- **Activity Logging**: All user actions are logged with timestamps
- **Structured Logs**: JSON-formatted logs for easy parsing and analysis
- **Session Statistics**: Real-time session data available via REST API
- **Multiple Session Systems**: Separate session management for chat (board-specific) and general connections

### Client Integration

For detailed information on integrating session management with your frontend, see [CLIENT_INTEGRATION.md](CLIENT_INTEGRATION.md).

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend server with auto-reload
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm start` - Start backend server (production)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide for chat API
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Detailed implementation documentation
- [CLIENT_INTEGRATION.md](CLIENT_INTEGRATION.md) - Frontend session management integration

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
