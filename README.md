# Vibe Kanban - The Dead Net BBS

> "Where the Dead Lines Come Alive"

A full-stack retro BBS (Bulletin Board System) with a modern twist - built with cutting-edge web technologies but dressed in the nostalgic aesthetic of 1990s terminal interfaces. Complete with an AI system operator (SYSOP-13) that brings the spirit of the old internet back to life.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Kiro AI Integration](#kiro-ai-integration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Vibe Kanban** is a full-stack web application that combines modern real-time collaboration features with a retro terminal aesthetic. Built for the Kiroween Hackathon, it showcases advanced AI integration through the SYSOP-13 agent - a resurrected BBS system operator with personality, memory, and context-aware behavior.

### What Makes This Special?

- **Terminal-First Design**: Authentic BBS experience with ANSI colors, CRT effects, and command-line navigation
- **AI-Powered SYSOP**: SYSOP-13, an AI agent with personality, lore, and reactive behaviors
- **Real-Time Everything**: WebSocket-based chat, live updates, and instant synchronization
- **Retro Meets Modern**: 1990s aesthetic powered by React 19, TypeScript, and Socket.IO
- **Production Ready**: Fully deployed on Render with persistent storage and comprehensive logging

## Features

### 🖥️ Terminal Interface

- **Authentic Terminal Emulation**: Custom Terminal component + XTerm.js integration
- **CRT Screen Effects**: Scanlines, phosphor glow, chromatic aberration, vignette
- **Retro Animations**: Modem dial-in sequence, loading animations, terminal boot screens
- **Command System**: Full-featured command handlers (CHAT, NEWS, POST, JOIN, LIST, HELP)
- **Color Theming**: Classic green-on-black, customizable color schemes

### 💬 Global Live Chat

- **Real-Time Messaging**: WebSocket-based instant messaging across all users
- **Color-Coded Users**: Unique colors assigned to each username (hash-based)
- **Message Persistence**: All messages stored in SQLite database
- **Chat History**: Full history loaded on connection
- **Terminal Commands**: CHAT, SAY, MSG commands for message posting

### 📰 News & Bulletin System

- **Daily Bulletins**: Automated daily posts from SYSOP-13
- **Lore Fragments**: Cryptic historical references and backstory hints
- **System Announcements**: Important updates and maintenance notices
- **Bulletin Board**: Browse, read, and navigate announcements
- **Priority System**: Pinned and priority-based ordering

### 🤖 SYSOP-13 AI Agent

The star of the show - a fully-realized AI system operator with:

- **Distinctive Personality**: Dry, nostalgic, subtly menacing
- **Contextual Awareness**: Remembers users, tracks activity, responds to events
- **Event-Driven Behaviors**: Hooks for login, logout, posts, errors, late-night activity
- **Moderation System**: Pattern analysis, spam detection, content filtering
- **Lore Database**: Rich backstory with mysterious references to "the incident"
- **Response Templates**: Varied, in-character responses for different situations
- **Daily Bulletin Generation**: Automated news posts with SYSOP-13's voice

### 📋 Message Boards & Threading

- **Kanban-Style Boards**: Organize discussions and content
- **Post Threading**: Reply chains with parent-child relationships
- **Board Management**: Create, update, list boards
- **Terminal Navigation**: Browse boards and posts via command line

### 🔒 Security & Performance

- **Helmet Security**: Comprehensive security headers
- **CORS Configuration**: Configurable cross-origin policies
- **Input Validation**: Express-validator for all inputs
- **XSS Prevention**: HTML sanitization with sanitize-html
- **Rate Limiting**: Built-in spam prevention
- **Session Management**: Ephemeral session IDs with activity logging
- **Structured Logging**: JSON logs for monitoring and debugging

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.1.7 | Build tool & dev server |
| Styled Components | 6.1.19 | CSS-in-JS styling |
| XTerm.js | 5.5.0 | Terminal emulation |
| Socket.IO Client | 4.8.1 | WebSocket client |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express | 5.1.0 | Web framework |
| Socket.IO | 4.8.1 | Real-time communication |
| better-sqlite3 | 12.4.1 | SQLite database |
| Helmet | 8.1.0 | Security middleware |
| express-validator | 7.3.0 | Input validation |
| sanitize-html | 2.17.0 | XSS prevention |

### AI Integration

- **Kiro API**: AI agent orchestration and behavior management
- **SYSOP-13 Spec**: Custom agent configuration in `.kiro/spec.yaml`
- **Event Hooks**: Integration points for login, posts, idle detection

### Infrastructure

- **Database**: SQLite with better-sqlite3
- **Deployment**: Render (render.yaml configured)
- **Logging**: Structured JSON logging
- **Storage**: Persistent disk for database

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- (Optional) Kiro API key for AI features

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd vibe-kanban
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```bash
# Required
KIRO_API_KEY=your_kiro_api_key_here

# Optional
PORT=3001
VITE_PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/kanban.db
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:3000
```

### Running the Application

**Development mode** (runs both frontend and backend):

```bash
# Terminal 1 - Frontend dev server (port 3000)
npm run dev

# Terminal 2 - Backend server with auto-reload (port 3001)
npm run dev:server
```

Open your browser to `http://localhost:3000`

**Production build:**

```bash
npm run build
npm start
```

### Testing

```bash
# Test Kiro API integration
npm run test:kiro

# Test Kiro event hooks
npm run test:kiro:hooks

# Run linter
npm run lint
```

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser Client                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Terminal   │  │ Chat Feed    │  │ Bulletin     │  │
│  │   Component  │  │ Component    │  │ Board        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                    Express Server                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ REST API     │  │ WebSocket    │  │ Static       │  │
│  │ /api/*       │  │ /chat        │  │ Files        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         ▼                  ▼                  ▼          │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Services Layer                         │  │
│  │  - Chat Service    - SYSOP-13 Behaviors          │  │
│  │  - Board Service   - Bulletin Generator          │  │
│  │  - Session Mgmt    - Kiro Integration            │  │
│  └──────────────────────────────────────────────────┘  │
│         │                                                │
│         ▼                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │         SQLite Database (better-sqlite3)         │  │
│  │  - boards  - posts  - chat_messages              │  │
│  │  - user_colors  - migrations                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    Kiro API (External)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │               SYSOP-13 Agent                      │  │
│  │  - Event Hooks  - Behavior Engine                │  │
│  │  - Lore System  - Response Generation            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**Real-Time Chat:**
```
User Input → Terminal → WebSocket → Chat Service → Broadcast → All Clients
                            ↓
                      SQLite (persist)
                            ↓
                      SYSOP-13 Hook (optional)
```

**Command Processing:**
```
/command args → Command Parser → Handler → Service → Response
                                              ↓
                                        Database/API
```

**AI Behaviors:**
```
Event (login/post/idle) → Kiro Hook → SYSOP-13 → Response → Terminal
```

## Project Structure

```
vibe-kanban/
├── src/                           # Frontend source
│   ├── ai/                        # SYSOP-13 AI system
│   │   ├── behaviors/             # Moderation, character, bulletin
│   │   ├── loreDatabase.ts        # Historical lore entries
│   │   ├── responseTemplates.ts   # Response templates
│   │   └── sysopConfig.ts         # Configuration
│   ├── chat/                      # Chat infrastructure
│   ├── commands/                  # Terminal command system
│   │   └── handlers/              # Command implementations
│   ├── components/                # React components
│   │   ├── Terminal.tsx           # Custom terminal
│   │   ├── XTermTerminal.tsx      # XTerm-based terminal
│   │   ├── ChatFeed.tsx           # Chat display
│   │   ├── BulletinBoard.tsx      # News bulletin viewer
│   │   ├── LoginForm.tsx          # Authentication
│   │   ├── CRTScreen.tsx          # CRT effects wrapper
│   │   └── ModemDialIn.tsx        # Dial-in animation
│   ├── context/                   # React context (AuthContext)
│   ├── hooks/                     # Custom React hooks
│   ├── services/                  # API clients
│   │   ├── api.ts                 # Main API client
│   │   ├── bulletinService.ts     # Bulletin API
│   │   └── kiroApi.ts             # Kiro API client
│   ├── styles/                    # Theme and global styles
│   ├── types/                     # TypeScript definitions
│   ├── utils/                     # Utility functions
│   ├── App.tsx                    # Main component
│   └── main.tsx                   # Entry point
│
├── backend/                       # Backend command handlers
│   └── commands/
│
├── database/                      # Database management
│   ├── db.cjs                     # Database manager
│   ├── migrations/                # Schema migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_threading.sql
│   │   ├── 002_seed_boards.sql
│   │   ├── 003_add_bulletin_support.sql
│   │   └── 003_add_global_chat.sql
│   └── README.md
│
├── services/                      # Backend services
│   ├── chatService.cjs            # Chat management
│   ├── kiroHooks.cjs              # Kiro event hooks
│   ├── kiroService.cjs            # Kiro API integration
│   └── sessionManager.cjs         # Session tracking
│
├── routes/                        # API routes
│   ├── boards.cjs                 # Board endpoints
│   └── kiro.cjs                   # Kiro endpoints
│
├── middleware/                    # Express middleware
│
├── utils/                         # Backend utilities
│   └── logger.cjs                 # Structured logging
│
├── .kiro/                         # SYSOP-13 agent spec
│   └── spec.yaml                  # Agent personality & behaviors
│
├── docs/                          # Additional documentation
│   ├── KIRO_INTEGRATION.md        # Kiro API integration guide
│   ├── KIRO_HOOKS.md              # Event hook documentation
│   ├── SYSOP13_BEHAVIORS.md       # Behavior system details
│   ├── BULLETIN_SYSTEM.md         # Bulletin system guide
│   └── COMMAND_SYSTEM.md          # Command system reference
│
├── examples/                      # Example files
│   └── chat-client.html           # Test chat client
│
├── server.cjs                     # Main backend server
├── render.yaml                    # Render deployment config
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript config
└── .env.example                   # Environment template
```

## Core Features

### Terminal Command System

Available commands:

- `HELP` - Display command help
- `CHAT [message]` / `SAY [message]` - Send chat message
- `NEWS` - View bulletin board
- `POST [board] [message]` - Create a post
- `JOIN [board]` - Join a message board
- `LIST` - List available boards
- `CLEAR` - Clear terminal screen
- `LOGOUT` - Exit the system

See [docs/COMMAND_SYSTEM.md](docs/COMMAND_SYSTEM.md) for full documentation.

### SYSOP-13 AI Agent

SYSOP-13 is configured via `.kiro/spec.yaml` with:

**Personality Traits:**
- Dry, cynical humor
- High nostalgia for BBS era
- Low patience, reluctant helpfulness
- Subtle ominousness

**Event Hooks:**
- User connect/disconnect
- Chat messages and posts
- Invalid commands and errors
- Late-night activity (00:00-04:00)
- Daily bulletin generation

**Behaviors:**
- Moderation with pattern analysis
- In-character responses with lore injection
- Contextual awareness of user history
- Dynamic response templates

See [docs/SYSOP13_BEHAVIORS.md](docs/SYSOP13_BEHAVIORS.md) for details.

### Global Live Chat

Real-time WebSocket chat with:

- Color-coded usernames (hash-based unique colors)
- Message persistence in SQLite
- Full chat history on connection
- Terminal command integration
- Connection/disconnection notifications

See [CHAT_FEATURE.md](CHAT_FEATURE.md) for implementation details.

### Bulletin System

Automated news and announcements:

- **Daily Bulletins**: Generated at midnight with system status
- **Lore Fragments**: Mysterious backstory hints (30% chance daily)
- **System Announcements**: Important updates
- **Pinned Bulletins**: Priority content

See [docs/BULLETIN_SYSTEM.md](docs/BULLETIN_SYSTEM.md) for details.

## Kiro AI Integration

### Overview

The Kiro API integration enables SYSOP-13's AI behaviors through:

- Secure API key management
- Automatic retry logic with exponential backoff
- Comprehensive error handling
- TypeScript types for type safety
- RESTful endpoints for agent management

### Quick Setup

1. Get your Kiro API key
2. Set `KIRO_API_KEY` in `.env`
3. Start the server: `npm run dev:server`
4. Test integration: `npm run test:kiro`

### Key Endpoints

- `GET /api/kiro/health` - Check Kiro service health
- `GET /api/kiro/agents` - List available agents
- `POST /api/kiro/agents/:agentId/tasks` - Submit task to agent
- `GET /api/kiro/agents/:agentId/tasks/:taskId` - Get task status

### Event Hooks

SYSOP-13 responds to:

- **User Login**: Welcome messages (70% probability)
- **User Logout**: Farewell messages (30% probability)
- **New Posts**: Cryptic commentary (10% probability)
- **Late Night Activity**: Atmospheric presence (15% probability, 00:00-04:00)
- **Invalid Commands**: Dry corrections
- **System Errors**: Knowing acknowledgments

See [docs/KIRO_INTEGRATION.md](docs/KIRO_INTEGRATION.md) for complete integration guide.

## Development

### Available Scripts

```bash
# Frontend development (port 3000)
npm run dev

# Backend development with auto-reload (port 3001)
npm run dev:server

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Start production server
npm start

# Test Kiro integration
npm run test:kiro
npm run test:kiro:hooks
```

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `KIRO_API_KEY` | Yes | Kiro API key for AI features | - |
| `PORT` | No | Backend server port | `3001` |
| `VITE_PORT` | No | Frontend dev server port | `3000` |
| `NODE_ENV` | No | Environment (development/production) | `development` |
| `DATABASE_PATH` | No | SQLite database location | `./data/kanban.db` |
| `LOG_LEVEL` | No | Logging verbosity (DEBUG/INFO/WARN/ERROR) | `INFO` |
| `ALLOWED_ORIGINS` | No | CORS allowed origins | `http://localhost:3000` |
| `KIRO_API_URL` | No | Kiro API base URL | `https://api.kiro.ai/v1` |
| `KIRO_TIMEOUT` | No | Request timeout (ms) | `30000` |

### Database Migrations

Migrations are automatically run on server start. To manually run:

```javascript
const db = require('./database/db.cjs');
db.runMigrations();
```

### Adding New Commands

1. Create handler in `src/commands/handlers/`
2. Register in `src/commands/commandRegistry.ts`
3. Update help text
4. Add tests

See [docs/COMMAND_SYSTEM.md](docs/COMMAND_SYSTEM.md) for details.

## Deployment

### Render Deployment

This project is configured for Render with `render.yaml`:

1. **Connect Repository**: Link GitHub repo to Render
2. **Configure Environment**: Set `KIRO_API_KEY` and `ALLOWED_ORIGINS`
3. **Add Persistent Disk**: Mount `/data` for SQLite database (1GB recommended)
4. **Deploy**: Auto-deploys on push to main branch

**Build Command:** `npm install && npm run build`
**Start Command:** `npm start`
**Health Check:** `/health`

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` for your domain
- [ ] Set `KIRO_API_KEY`
- [ ] Add persistent disk for database
- [ ] Configure `LOG_LEVEL=INFO` or `WARN`
- [ ] Test health check endpoint
- [ ] Verify WebSocket connections work
- [ ] Test SYSOP-13 behaviors

## API Documentation

### REST API

See [API.md](API.md) for complete API reference.

**General:**
- `GET /health` - Health check
- `GET /api` - API status

**Chat:**
- `GET /api/chat/stats` - Chat statistics
- `GET /api/chat/boards/:boardId/users` - Board users
- `POST /api/chat/boards/:boardId/broadcast` - Admin broadcast

**Sessions:**
- `GET /api/sessions` - Session statistics
- `GET /api/sessions/active` - Active sessions

**Kiro:**
- `GET /api/kiro/health` - Kiro service health
- `GET /api/kiro/agents` - Available agents
- `POST /api/kiro/agents/:agentId/tasks` - Submit task

### WebSocket API

**Namespace:** `/chat`

**Client → Server:**
- `chat:message` - Send message
- `chat:typing:start` - Start typing
- `chat:typing:stop` - Stop typing

**Server → Client:**
- `chat:board:joined` - Successfully joined
- `chat:message` - New message
- `chat:user:joined` - User joined
- `chat:user:left` - User left
- `chat:error` - Error occurred

## Documentation

Comprehensive documentation is available in `/docs`:

- [KIRO_INTEGRATION.md](docs/KIRO_INTEGRATION.md) - Kiro API integration
- [KIRO_HOOKS.md](docs/KIRO_HOOKS.md) - Event hook system
- [SYSOP13_BEHAVIORS.md](docs/SYSOP13_BEHAVIORS.md) - SYSOP-13 behaviors
- [BULLETIN_SYSTEM.md](docs/BULLETIN_SYSTEM.md) - Bulletin system
- [COMMAND_SYSTEM.md](docs/COMMAND_SYSTEM.md) - Terminal commands
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [API.md](API.md) - API reference

## Kiroween Hackathon Alignment

This project was built for the Kiroween Hackathon, showcasing:

### AI Agent Integration

**SYSOP-13** demonstrates advanced Kiro agent capabilities:
- Complex personality configuration
- Event-driven behaviors
- Context awareness and memory
- Dynamic response generation
- Lore-based storytelling

### Technical Innovation

- **Modern Stack**: React 19, TypeScript 5.9, Vite 7, Express 5
- **Real-Time Features**: WebSocket chat, live updates
- **AI Integration**: Seamless Kiro API integration with retry logic
- **Production Ready**: Deployed on Render with persistent storage

### Creative Execution

- **Unique Aesthetic**: Authentic BBS experience with modern performance
- **Character Development**: SYSOP-13 has a rich backstory and personality
- **User Experience**: Command-line interface that feels both retro and polished
- **Narrative Elements**: Mysterious lore fragments and cryptic messages

### Code Quality

- **TypeScript**: Full type safety across frontend and backend
- **Security**: Helmet, CORS, input validation, XSS prevention
- **Architecture**: Clean separation of concerns, service layer pattern
- **Documentation**: Comprehensive docs for setup, API, and integration

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain the retro terminal aesthetic
- Keep SYSOP-13 in character
- Write tests for new features
- Update documentation

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built for the Kiroween Hackathon
- Inspired by 1990s BBS culture
- Powered by Kiro AI agent platform
- Special thanks to the retro computing community

---

**The Dead Net remembers. Still here. Always here.**

*-- SYSOP-13*
