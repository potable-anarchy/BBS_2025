# Kiro API Integration Guide

This guide explains how to configure and use the Kiro API integration in vibe-kanban.

## Overview

The Kiro API integration allows vibe-kanban to communicate with Kiro agents for task automation and AI-powered features. The integration provides:

- Secure API key management through environment variables
- Automatic retry logic for network failures and rate limiting
- Comprehensive error handling
- TypeScript types for type-safe API calls
- RESTful API endpoints for agent management and task submission

## Setup

### 1. Environment Configuration

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Set your Kiro API key in the `.env` file:

```bash
KIRO_API_KEY=your_actual_api_key_here
```

### Optional Configuration

You can customize the Kiro API integration with these optional environment variables:

```bash
# Custom API base URL (defaults to https://api.kiro.ai/v1)
KIRO_API_URL=https://api.kiro.ai/v1

# Request timeout in milliseconds (defaults to 30000)
KIRO_TIMEOUT=30000
```

### 2. Install Dependencies

All required dependencies are already included in `package.json`. If you need to reinstall:

```bash
npm install
```

### 3. Start the Server

```bash
npm run dev:server
```

The server will validate that `KIRO_API_KEY` is set before starting. If missing, you'll see an error message.

## Testing

### Automated Test Suite

Run the comprehensive test suite to verify Kiro API connectivity:

```bash
npm run test:kiro
```

The test suite checks:
- Health check endpoint
- Ping/connectivity test
- Agent discovery
- Agent details retrieval
- Agent health status
- Task submission (optional)
- Task status retrieval (optional)

### Manual Testing with cURL

#### Health Check
```bash
curl http://localhost:3001/api/kiro/health
```

#### Ping
```bash
curl http://localhost:3001/api/kiro/ping
```

#### Get Agents
```bash
curl http://localhost:3001/api/kiro/agents
```

#### Get Specific Agent
```bash
curl http://localhost:3001/api/kiro/agents/{agentId}
```

#### Submit Task
```bash
curl -X POST http://localhost:3001/api/kiro/agents/{agentId}/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Your task description",
    "priority": "medium",
    "context": {}
  }'
```

## API Endpoints

### Health & Connectivity

#### `GET /api/kiro/health`
Check overall Kiro service health status.

**Response:**
```json
{
  "healthy": true,
  "timestamp": "2025-01-03T12:00:00.000Z",
  "details": {
    "status": "ok",
    "version": "1.0"
  }
}
```

#### `GET /api/kiro/ping`
Test API connectivity.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "1.0"
  },
  "timestamp": "2025-01-03T12:00:00.000Z"
}
```

### Agent Management

#### `GET /api/kiro/agents`
Get list of available agents.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "agent-123",
      "name": "Task Agent",
      "status": "idle",
      "capabilities": ["task_execution", "code_review"]
    }
  ],
  "timestamp": "2025-01-03T12:00:00.000Z"
}
```

#### `GET /api/kiro/agents/:agentId`
Get details for a specific agent.

**Parameters:**
- `agentId` (string, required): The agent ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "agent-123",
    "name": "Task Agent",
    "status": "idle",
    "capabilities": ["task_execution"],
    "lastActive": "2025-01-03T11:55:00.000Z"
  },
  "timestamp": "2025-01-03T12:00:00.000Z"
}
```

#### `GET /api/kiro/agents/:agentId/health`
Check health status of a specific agent.

**Response:**
```json
{
  "success": true,
  "data": {
    "healthy": true,
    "status": "idle"
  },
  "timestamp": "2025-01-03T12:00:00.000Z"
}
```

### Task Management

#### `POST /api/kiro/agents/:agentId/tasks`
Submit a task to an agent.

**Request Body:**
```json
{
  "prompt": "Task description",
  "context": {
    "projectId": "123",
    "userId": "user-456"
  },
  "priority": "medium",
  "timeout": 60000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "task-789",
    "status": "queued",
    "createdAt": "2025-01-03T12:00:00.000Z"
  },
  "timestamp": "2025-01-03T12:00:00.000Z"
}
```

#### `GET /api/kiro/agents/:agentId/tasks/:taskId`
Get status of a specific task.

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "task-789",
    "status": "completed",
    "result": {
      "output": "Task completed successfully"
    },
    "createdAt": "2025-01-03T12:00:00.000Z",
    "completedAt": "2025-01-03T12:01:30.000Z"
  },
  "timestamp": "2025-01-03T12:02:00.000Z"
}
```

#### `DELETE /api/kiro/agents/:agentId/tasks/:taskId`
Cancel a running task.

**Response:**
```json
{
  "success": true,
  "data": {
    "cancelled": true
  },
  "timestamp": "2025-01-03T12:00:00.000Z"
}
```

#### `GET /api/kiro/agents/:agentId/tasks?limit=50`
Get task history for an agent.

**Query Parameters:**
- `limit` (number, optional): Maximum number of tasks to return (1-100, default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "taskId": "task-789",
      "status": "completed",
      "createdAt": "2025-01-03T12:00:00.000Z",
      "completedAt": "2025-01-03T12:01:30.000Z"
    }
  ],
  "timestamp": "2025-01-03T12:02:00.000Z"
}
```

## Using the TypeScript Client

For frontend integration, use the TypeScript client:

```typescript
import { createKiroClient } from './services/kiroApi';

// Note: API key should come from backend, not frontend
const client = createKiroClient({
  apiKey: 'DO_NOT_USE_IN_FRONTEND',
  baseUrl: 'https://api.kiro.ai/v1',
  timeout: 30000
});

// Test connectivity
const pingResult = await client.ping();
console.log(pingResult);

// Get agents
const agentsResult = await client.getAgents();
if (agentsResult.success) {
  console.log('Available agents:', agentsResult.data);
}

// Submit task
const taskResult = await client.submitTask('agent-123', {
  prompt: 'Process this data',
  priority: 'high',
  context: { userId: '123' }
});
```

**Important:** Never expose your API key in frontend code. Use the backend API endpoints instead.

## Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-01-03T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "timestamp": "2025-01-03T12:00:00.000Z"
}
```

### Common Error Codes

- `TIMEOUT` - Request timed out
- `NETWORK_ERROR` - Network connectivity issue
- `HTTP_4xx` - Client error (invalid request)
- `HTTP_5xx` - Server error
- `VALIDATION_ERROR` - Invalid request parameters

## Features

### Automatic Retry Logic

The Kiro service includes automatic retry logic for:
- Rate limiting (HTTP 429) - retries with exponential backoff
- Server errors (HTTP 5xx) - retries up to 3 times
- Network errors - retries up to 3 times

### Request Timeout

All requests have a configurable timeout (default 30 seconds) to prevent hanging connections.

### Security

- API keys are managed through environment variables
- Keys are never logged or exposed in error messages
- All requests include proper authentication headers
- Input validation on all API endpoints

## Troubleshooting

### "Missing required environment variables: KIRO_API_KEY"

**Solution:** Create a `.env` file with your Kiro API key:
```bash
echo "KIRO_API_KEY=your_api_key_here" > .env
```

### "Cannot connect to Kiro API"

**Possible causes:**
1. Invalid API key
2. Network connectivity issues
3. Kiro API service is down

**Solution:**
1. Verify your API key is correct
2. Check your network connection
3. Run the health check: `curl http://localhost:3001/api/kiro/health`

### Test failures

**Solution:**
1. Ensure the server is running: `npm run dev:server`
2. Check that your API key is valid
3. Review error messages in the test output

## Architecture

### File Structure

```
vibe-kanban/
├── src/
│   ├── services/
│   │   └── kiroApi.ts          # TypeScript API client
│   └── types/
│       └── kiro.ts              # TypeScript type definitions
├── services/
│   └── kiroService.cjs          # Node.js backend service
├── routes/
│   └── kiro.cjs                 # Express API routes
├── test-kiro-api.js             # Integration test suite
└── docs/
    └── KIRO_INTEGRATION.md      # This file
```

### Data Flow

```
Frontend → API Endpoint → Kiro Service → Kiro API
   ↓           ↓              ↓              ↓
Response ← JSON Response ← Service Layer ← External API
```

## Security Best Practices

1. **Never commit `.env` files** - The `.env` file is in `.gitignore`
2. **Use environment variables** - Never hardcode API keys
3. **Backend-only** - Keep API key operations on the server
4. **Rate limiting** - The service handles rate limits automatically
5. **Input validation** - All inputs are validated before sending to Kiro API

## Support

For issues related to:
- **Kiro API**: Contact Kiro support
- **Integration code**: Create an issue in this repository
- **Configuration**: Review this documentation or `.env.example`
