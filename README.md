# Node.js Backend with Express and Socket.IO

A real-time WebSocket-enabled backend server built with Node.js, Express, and Socket.IO.

## Features

- Express.js REST API framework
- Socket.IO for real-time bidirectional communication
- CORS support for cross-origin requests
- Environment-based configuration
- Health check endpoint
- Room-based messaging support
- Graceful shutdown handling
- Development mode with auto-reload

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`

## Configuration

Edit the `.env` file with your settings:

```env
# Server Configuration
PORT=3001

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Node Environment
NODE_ENV=development

# API Keys (REQUIRED)
KIRO_API_KEY=your_kiro_api_key_here
```

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `PORT` | No | Server port number | `3001` |
| `ALLOWED_ORIGINS` | No | Comma-separated list of allowed CORS origins | `http://localhost:3000` |
| `NODE_ENV` | No | Node environment (development/production) | `development` |
| `KIRO_API_KEY` | **Yes** | API key for KIRO service integration | - |

**Note:** The server will not start if required environment variables are missing.

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3001).

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

## Example Client Usage

### Using Socket.IO Client

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

// Leave a room
socket.emit('leave-room', 'room1');
```

## Project Structure

```
.
├── server.js           # Main server file
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Dependencies

- **express**: Fast, unopinionated web framework
- **socket.io**: Real-time bidirectional event-based communication
- **cors**: Enable CORS with various options
- **dotenv**: Load environment variables from .env file

## Development Dependencies

- **nodemon**: Auto-reload server on file changes

## License

ISC
