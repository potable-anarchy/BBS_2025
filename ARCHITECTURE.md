# Architecture Documentation

This document provides a comprehensive technical overview of the Vibe Kanban architecture, design decisions, and implementation details.

## Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Real-Time Communication](#real-time-communication)
- [AI Integration](#ai-integration)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Design Decisions](#design-decisions)
- [Performance Considerations](#performance-considerations)

## System Architecture

### High-Level Overview

Vibe Kanban follows a client-server architecture with real-time bidirectional communication:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Client                           │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │ React UI       │  │ Terminal       │  │ WebSocket       │   │
│  │ (Components)   │  │ Emulation      │  │ Client          │   │
│  └────────────────┘  └────────────────┘  └─────────────────┘   │
│         │                    │                     │             │
│         └────────────────────┴─────────────────────┘             │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                    HTTP/WebSocket over TLS
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                       Express.js Server                           │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │ Static File    │  │ REST API       │  │ WebSocket       │   │
│  │ Server         │  │ Routes         │  │ Server          │   │
│  └────────────────┘  └────────────────┘  └─────────────────┘   │
│         │                    │                     │             │
│         └────────────────────┴─────────────────────┘             │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Services Layer                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ Chat     │ │ Bulletin │ │ Session  │ │ Kiro     │   │   │
│  │  │ Service  │ │ Service  │ │ Manager  │ │ Service  │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Data Layer                              │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │         SQLite Database (better-sqlite3)        │     │   │
│  │  │  Tables: boards, posts, chat_messages,          │     │   │
│  │  │          user_colors, migrations                 │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                          Kiro API
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                    External Kiro Platform                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   SYSOP-13 Agent                          │   │
│  │  - Event Processing  - Behavior Engine                    │   │
│  │  - Lore Generation   - Response Synthesis                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

1. **User Interaction**: User types command in terminal
2. **Frontend Processing**: React component parses and validates command
3. **Network Layer**: Request sent via HTTP or WebSocket
4. **Backend Routing**: Express routes to appropriate handler
5. **Service Layer**: Business logic executed
6. **Data Persistence**: Database operations performed
7. **AI Integration**: Optional Kiro hook triggered
8. **Response**: Data flows back through layers to client

## Technology Stack

### Frontend Stack

```
┌─────────────────────────────────────────┐
│          Application Layer              │
│                                         │
│  React 19 + TypeScript 5.9              │
│  - Functional components                │
│  - Hooks-based state management         │
│  - Context API for global state         │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│           Styling Layer                 │
│                                         │
│  Styled Components 6.1                  │
│  - CSS-in-JS                            │
│  - Theme provider                       │
│  - Dynamic styling                      │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│          Terminal Layer                 │
│                                         │
│  Custom Terminal + XTerm.js 5.5         │
│  - Command parsing                      │
│  - ANSI color support                   │
│  - History management                   │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│       Communication Layer               │
│                                         │
│  Socket.IO Client 4.8                   │
│  - WebSocket connections                │
│  - Event handling                       │
│  - Auto-reconnection                    │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│          Build Layer                    │
│                                         │
│  Vite 7.1                               │
│  - Fast HMR                             │
│  - Optimized bundling                   │
│  - TypeScript compilation               │
└─────────────────────────────────────────┘
```

### Backend Stack

```
┌─────────────────────────────────────────┐
│          Runtime Layer                  │
│                                         │
│  Node.js 18+                            │
│  - Event loop                           │
│  - Async I/O                            │
│  - Module system                        │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│       Application Framework             │
│                                         │
│  Express.js 5.1                         │
│  - Routing                              │
│  - Middleware pipeline                  │
│  - Request handling                     │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│      Real-Time Layer                    │
│                                         │
│  Socket.IO 4.8                          │
│  - WebSocket server                     │
│  - Room management                      │
│  - Broadcasting                         │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Data Layer                      │
│                                         │
│  better-sqlite3 12.4                    │
│  - Synchronous API                      │
│  - High performance                     │
│  - Simple transactions                  │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│        Security Layer                   │
│                                         │
│  Helmet 8.1 + CORS + Validators         │
│  - Security headers                     │
│  - Input sanitization                   │
│  - XSS prevention                       │
└─────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthContext.Provider
│   ├── ModemDialIn (on initial load)
│   ├── LoginForm (unauthenticated)
│   └── MainInterface (authenticated)
│       ├── Header
│       ├── CRTScreen
│       │   ├── Terminal
│       │   │   └── CommandHandlers
│       │   │       ├── ChatHandler
│       │   │       ├── NewsHandler
│       │   │       ├── PostHandler
│       │   │       └── ...
│       │   └── XTermTerminal (alternative)
│       ├── ChatFeed
│       │   └── ChatMessages
│       └── BulletinBoard
│           └── BulletinList
```

### State Management

**Context-Based Global State:**

```typescript
// AuthContext - User authentication
interface AuthContextType {
  user: User | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Usage pattern
const { user, isAuthenticated } = useAuth();
```

**Component-Local State:**

```typescript
// Terminal command history
const [history, setHistory] = useState<string[]>([]);
const [historyIndex, setHistoryIndex] = useState<number>(-1);

// Chat messages
const [messages, setMessages] = useState<ChatMessage[]>([]);
```

### Terminal Command System

**Architecture:**

```
Command Input
    │
    ▼
Parse Command
    │
    ├─→ Extract command name
    ├─→ Extract arguments
    └─→ Validate syntax
    │
    ▼
Command Registry Lookup
    │
    ├─→ Command found
    │   │
    │   ▼
    │   Execute Handler
    │   │
    │   ├─→ Service calls
    │   ├─→ State updates
    │   └─→ Return output
    │
    └─→ Command not found
        │
        └─→ Error message
```

**Implementation:**

```typescript
// Command handler interface
interface CommandHandler {
  name: string;
  description: string;
  usage: string;
  execute: (args: string[], context: CommandContext) => Promise<string>;
}

// Command registry
const commandRegistry: Map<string, CommandHandler> = new Map([
  ['help', helpHandler],
  ['chat', chatHandler],
  ['news', newsHandler],
  // ...
]);

// Command execution
async function executeCommand(input: string): Promise<string> {
  const [command, ...args] = input.trim().split(/\s+/);
  const handler = commandRegistry.get(command.toLowerCase());

  if (!handler) {
    return `Command not found: ${command}`;
  }

  return await handler.execute(args, context);
}
```

### Styling System

**Theme Architecture:**

```typescript
// Theme definition
const theme = {
  colors: {
    primary: '#00ff00',      // Classic terminal green
    background: '#000000',    // Black background
    error: '#ff0000',         // Error red
    warning: '#ffff00',       // Warning yellow
    accent: '#00ffff',        // Cyan accent
  },
  fonts: {
    mono: '"Courier New", monospace',
  },
  effects: {
    scanlines: true,
    phosphorGlow: true,
    chromatic: false,
    vignette: true,
  }
};

// Styled component usage
const Terminal = styled.div`
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.mono};

  /* CRT effects */
  ${props => props.theme.effects.scanlines && css`
    background-image: linear-gradient(
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.25) 50%
    );
    background-size: 100% 4px;
  `}
`;
```

## Backend Architecture

### Service Layer Pattern

```
┌─────────────────────────────────────────┐
│              Routes Layer               │
│  - HTTP endpoint definitions            │
│  - Request validation                   │
│  - Response formatting                  │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│            Services Layer               │
│  - Business logic                       │
│  - Data transformation                  │
│  - External API calls                   │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│           Data Access Layer             │
│  - Database queries                     │
│  - Transaction management               │
│  - Data models                          │
└─────────────────────────────────────────┘
```

### Chat Service Architecture

```javascript
// Chat Service responsibilities
class ChatService {
  // User management
  addUser(userId, username, boardId) { }
  removeUser(userId) { }
  getUsersInBoard(boardId) { }

  // Message handling
  saveMessage(message) { }
  getMessageHistory(boardId, limit) { }

  // Broadcasting
  broadcastToBoard(boardId, event, data) { }

  // Statistics
  getStats() { }
}

// Usage in WebSocket handler
socket.on('chat:message', async (data) => {
  // Validate
  if (!data.content) return;

  // Save to database
  const message = await chatService.saveMessage({
    userId: socket.userId,
    username: socket.username,
    content: data.content,
    boardId: socket.boardId,
  });

  // Broadcast to room
  chatService.broadcastToBoard(socket.boardId, 'chat:message', message);

  // Trigger SYSOP-13 hook
  await kiroHooks.onChatMessage(message);
});
```

### Session Management

```javascript
// Session manager
class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession(userId, username, metadata) {
    const sessionId = generateEphemeralId();
    const session = {
      id: sessionId,
      userId,
      username,
      metadata,
      connectedAt: new Date(),
      lastActivity: new Date(),
    };

    this.sessions.set(sessionId, session);
    logger.info('Session created', { sessionId, userId });

    return session;
  }

  updateActivity(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      logger.info('Session ended', {
        sessionId,
        duration: Date.now() - session.connectedAt
      });
      this.sessions.delete(sessionId);
    }
  }
}
```

### Error Handling Strategy

```javascript
// Centralized error handler
app.use((err, req, res, next) => {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't expose internal errors
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code,
    },
  });
});

// Service layer error handling
async function getBoard(boardId) {
  try {
    const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(boardId);

    if (!board) {
      throw createError(404, 'Board not found', 'BOARD_NOT_FOUND');
    }

    return board;
  } catch (error) {
    if (error.statusCode) throw error;

    logger.error('Database error', { error: error.message });
    throw createError(500, 'Database error', 'DATABASE_ERROR');
  }
}
```

## Database Design

### Schema Overview

```sql
-- Boards table
CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts table with threading support
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id TEXT,  -- For threading
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_bulletin BOOLEAN DEFAULT 0,
  bulletin_type TEXT,  -- 'daily', 'lore', 'announcement', 'system'
  is_pinned BOOLEAN DEFAULT 0,
  priority INTEGER DEFAULT 0,
  FOREIGN KEY (board_id) REFERENCES boards(id),
  FOREIGN KEY (parent_id) REFERENCES posts(id)
);

-- Chat messages table
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  color TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User color assignments
CREATE TABLE user_colors (
  username TEXT PRIMARY KEY,
  color TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Migration tracking
CREATE TABLE migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL UNIQUE,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX idx_posts_board_id ON posts(board_id);
CREATE INDEX idx_posts_parent_id ON posts(parent_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_chat_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_bulletins ON posts(is_bulletin, priority DESC, created_at DESC);
```

### Migration System

```javascript
// Migration runner
function runMigrations() {
  const migrationFiles = fs.readdirSync('./database/migrations')
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    const applied = db.prepare(
      'SELECT 1 FROM migrations WHERE filename = ?'
    ).get(file);

    if (!applied) {
      const sql = fs.readFileSync(`./database/migrations/${file}`, 'utf8');
      db.exec(sql);
      db.prepare('INSERT INTO migrations (filename) VALUES (?)').run(file);
      logger.info('Migration applied', { file });
    }
  }
}
```

## Real-Time Communication

### WebSocket Architecture

```
Client                          Server
  │                               │
  │  Connect to /chat namespace   │
  ├──────────────────────────────>│
  │                               │
  │  Auth with userId, username   │
  │<──────────────────────────────┤
  │                               │
  │   Join board room             │
  ├──────────────────────────────>│
  │                               │
  │  chat:board:joined event      │
  │<──────────────────────────────┤
  │                               │
  │  chat:message                 │
  ├──────────────────────────────>│
  │                               ├─→ Save to DB
  │                               ├─→ Broadcast to room
  │                               └─→ Trigger hooks
  │                               │
  │  chat:message (broadcast)     │
  │<──────────────────────────────┤
  │                               │
```

### Socket.IO Implementation

```javascript
// Namespace configuration
const chatNamespace = io.of('/chat');

chatNamespace.use((socket, next) => {
  // Authentication middleware
  const { userId, username, boardId } = socket.handshake.auth;

  if (!userId || !username || !boardId) {
    return next(new Error('Authentication required'));
  }

  socket.userId = userId;
  socket.username = username;
  socket.boardId = boardId;

  next();
});

chatNamespace.on('connection', (socket) => {
  logger.info('User connected', {
    userId: socket.userId,
    username: socket.username,
    boardId: socket.boardId,
  });

  // Join board room
  socket.join(`board:${socket.boardId}`);

  // Add user to session
  sessionManager.createSession(socket.userId, socket.username, {
    socketId: socket.id,
    boardId: socket.boardId,
  });

  // Notify room
  socket.to(`board:${socket.boardId}`).emit('chat:user:joined', {
    username: socket.username,
    timestamp: new Date(),
  });

  // Handle messages
  socket.on('chat:message', async (data) => {
    // Implementation
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    sessionManager.endSession(socket.userId);
    socket.to(`board:${socket.boardId}`).emit('chat:user:left', {
      username: socket.username,
      timestamp: new Date(),
    });
  });
});
```

### Room Management

```javascript
// Board-specific rooms
const room = `board:${boardId}`;

// Join room
socket.join(room);

// Broadcast to room (excluding sender)
socket.to(room).emit('event', data);

// Broadcast to room (including sender)
io.to(room).emit('event', data);

// Get users in room
const socketsInRoom = await io.in(room).fetchSockets();
const users = socketsInRoom.map(s => s.username);
```

## AI Integration

### SYSOP-13 Hook System

```
Event Occurs
    │
    ▼
Hook Triggered
    │
    ├─→ Check probability (should respond?)
    │   │
    │   ├─→ Yes
    │   │   │
    │   │   ▼
    │   │   Build Context
    │   │   │
    │   │   ├─→ User history
    │   │   ├─→ Recent activity
    │   │   └─→ Lore fragments
    │   │   │
    │   │   ▼
    │   │   Call Kiro API
    │   │   │
    │   │   ▼
    │   │   Generate Response
    │   │   │
    │   │   ├─→ Apply character voice
    │   │   ├─→ Inject lore
    │   │   └─→ Format for terminal
    │   │   │
    │   │   ▼
    │   │   Send to Client
    │   │
    │   └─→ No (silent observation)
    │
    ▼
Continue
```

### Kiro Service Implementation

```javascript
// Kiro service wrapper
class KiroService {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.client = this.createClient();
  }

  async submitTask(agentId, task) {
    try {
      const response = await this.client.post(
        `/agents/${agentId}/tasks`,
        {
          prompt: task.prompt,
          context: task.context,
          priority: task.priority || 'medium',
        },
        {
          timeout: 30000,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Kiro API error', { error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Hook implementation
async function onUserLogin(user) {
  // Check probability
  if (Math.random() > 0.7) return;

  // Build context
  const context = {
    event: 'user_login',
    username: user.username,
    timestamp: new Date(),
  };

  // Call SYSOP-13
  const result = await kiroService.submitTask('sysop-13', {
    prompt: 'User logged in',
    context,
  });

  if (result.success) {
    // Send response to terminal
    sendToTerminal(user.socketId, result.data.response);
  }
}
```

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────┐
│         Network Layer                   │
│  - TLS/HTTPS                            │
│  - Render platform security             │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│       Application Layer                 │
│  - Helmet security headers              │
│  - CORS policies                        │
│  - Rate limiting                        │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Input Layer                     │
│  - express-validator                    │
│  - sanitize-html                        │
│  - Type checking                        │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│          Data Layer                     │
│  - Parameterized queries                │
│  - No SQL injection                     │
│  - Safe file operations                 │
└─────────────────────────────────────────┘
```

### Implementation

```javascript
// Security middleware stack
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));

// Input validation
const { body, validationResult } = require('express-validator');

app.post('/api/chat/message',
  body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process message
  }
);

// XSS prevention
const sanitizeHtml = require('sanitize-html');

function sanitizeMessage(content) {
  return sanitizeHtml(content, {
    allowedTags: [],  // No HTML tags allowed
    allowedAttributes: {},
  });
}
```

## Deployment Architecture

### Render Platform

```
GitHub Repository
        │
        │ (push to main)
        ▼
    Render Build
        │
        ├─→ npm install
        ├─→ npm run build
        └─→ Create container
        │
        ▼
    Deploy Container
        │
        ├─→ Start Node.js server
        ├─→ Serve static files
        └─→ Mount persistent disk
        │
        ▼
    Running Application
        │
        ├─→ /health endpoint (monitoring)
        ├─→ Auto-scaling
        └─→ Persistent database (/data)
```

### Environment Configuration

```bash
# Production environment
NODE_ENV=production
PORT=10000

# Security
ALLOWED_ORIGINS=https://yourdomain.com

# Kiro AI
KIRO_API_KEY=<secret>
KIRO_API_URL=https://api.kiro.ai/v1

# Database
DATABASE_PATH=/data/kanban.db

# Logging
LOG_LEVEL=INFO
```

## Design Decisions

### Why SQLite?

- **Simplicity**: No separate database server needed
- **Performance**: Fast for read-heavy workloads
- **Reliability**: ACID compliant, battle-tested
- **Portability**: Single file database
- **Cost**: No database hosting fees

### Why Socket.IO?

- **Reliability**: Automatic reconnection, fallback to polling
- **Features**: Rooms, namespaces, broadcasting built-in
- **Cross-browser**: Works everywhere
- **TypeScript**: Full type support
- **Ecosystem**: Large community, good documentation

### Why Styled Components?

- **Theming**: Easy theme switching
- **Scoping**: No CSS conflicts
- **Dynamic**: Props-based styling
- **TypeScript**: Type-safe styles
- **SSR Ready**: Works with server rendering

### Why Monorepo?

- **Simplicity**: Frontend and backend in one repo
- **Type Sharing**: Shared TypeScript types
- **Atomic Changes**: Update both in one commit
- **Easier Development**: Single `git clone`
- **Unified Versioning**: One version for both

## Performance Considerations

### Frontend Optimizations

- **Code Splitting**: Lazy load routes and components
- **Memo: ization**: React.memo for expensive components
- **Virtual Scrolling**: For long message lists
- **Debouncing**: Typing indicators, search inputs
- **Asset Optimization**: Minified, tree-shaken bundles

### Backend Optimizations

- **Database Indexes**: On frequently queried columns
- **Connection Pooling**: Reuse SQLite connections
- **Caching**: In-memory cache for frequently accessed data
- **Lazy Loading**: Load data on demand
- **Batch Operations**: Group multiple DB writes

### Network Optimizations

- **Gzip Compression**: Compress HTTP responses
- **WebSocket**: Single persistent connection
- **Message Batching**: Group multiple messages
- **CDN**: Serve static assets from CDN
- **HTTP/2**: Multiplexing, header compression

---

**The architecture persists. The data endures. The Dead Net remembers.**

*-- SYSOP-13*
