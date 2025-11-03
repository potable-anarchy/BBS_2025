# Vibe Kanban - Full Stack Application

A full-stack Kanban board application with a terminal-style UI built with React, TypeScript, and Vite on the frontend, and Node.js, Express, and Socket.IO on the backend.

## Frontend - React Terminal UI Framework

A modern terminal-style UI framework built with React, TypeScript, and Vite. Features both custom-built terminal components and XTerm.js integration for advanced terminal emulation.

### Frontend Features

- **Custom Terminal Component**: Lightweight, styled terminal with command history and custom command handlers
- **XTerm Terminal**: Full-featured terminal emulator using @xterm/xterm
- **Terminal-style UI**: Retro green-on-black aesthetic with modern React patterns
- **TypeScript**: Full type safety throughout the application
- **Styled Components**: CSS-in-JS styling with themed components
- **Vite**: Lightning-fast development and optimized production builds

### Tech Stack (Frontend)

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **@xterm/xterm** - Terminal emulator
- **ESLint** - Code linting

## Backend - Node.js with Express and Socket.IO

A real-time WebSocket-enabled backend server built with Node.js, Express, and Socket.IO.

### Backend Features

- Express.js REST API framework
- Socket.IO for real-time bidirectional communication
- CORS support for cross-origin requests
- Environment-based configuration
- Health check endpoint
- Room-based messaging support
- Graceful shutdown handling
- SQLite database for data persistence

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

**Note:** The server will not start if required environment variables are missing.

### Running the Application

#### Frontend Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000`

#### Backend Server (Development)

```bash
npm run dev
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
│   ├── styles/
│   │   └── GlobalStyles.ts    # Global styles
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
├── server.js                  # Backend server
├── data/                      # SQLite database files
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
└── README.md                  # This file
```

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
    // Handle custom commands
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

## API Endpoints

### REST API

- `GET /health` - Health check endpoint
- `GET /api` - Basic API status

### WebSocket Events

#### Client to Server

- `message` - Send a message (broadcasts to all clients)
- `join-room` - Join a specific room
- `leave-room` - Leave a specific room

#### Server to Client

- `message` - Receive a broadcasted message
- `user-joined` - Notification when a user joins a room
- `user-left` - Notification when a user leaves a room

## Example Socket.IO Client Usage

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Listen for connection
socket.on('connect', () => {
  console.log('Connected to server');
});

// Send a message
socket.emit('message', { text: 'Hello, World!' });

// Listen for messages
socket.on('message', (data) => {
  console.log('Message received:', data);
});

// Join a room
socket.emit('join-room', 'room1');
```

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm start` - Start backend server (production)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
