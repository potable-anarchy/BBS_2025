# Kiro Event Hooks Integration

## Overview

The Kiro Event Hooks system integrates the SYSOP-13 agent with the Dead Net BBS application through three main event types:

1. **on_user_login** - Greets users when they connect
2. **on_new_post** - Analyzes and occasionally responds to new posts
3. **on_idle** - Generates daily bulletins and haunted atmospheric messages

## Architecture

### Components

```
services/kiroHooks.cjs     - Main hooks service (singleton)
routes/kiro.cjs            - API endpoints for hook management
server.cjs                 - Integration with user login events
routes/boards.cjs          - Integration with post creation events
```

### Event Flow

```
User Event → Hook Trigger → Kiro Agent Task → Response → Action
```

## Hook Types

### 1. on_user_login

**Trigger**: When a user connects via Socket.IO

**Probability**: 70% chance of responding (configurable)

**Behavior**:
- Generates a terse, nostalgic greeting from SYSOP-13
- Sends greeting via `sysop-greeting` socket event
- Examples:
  - "Connection established. Welcome back to The Dead Net."
  - "Another soul finds its way here."
  - "The line opens. Enter."

**Integration Point**: `server.cjs:138-154`

**Socket Event**: `sysop-greeting`

```javascript
// Client receives:
socket.on('sysop-greeting', (data) => {
  console.log(data.message);  // SYSOP-13's greeting
  console.log(data.from);      // "SYSOP-13"
  console.log(data.timestamp); // ISO timestamp
});
```

### 2. on_new_post

**Trigger**: When a new top-level post is created (not replies)

**Probability**: 10% chance of responding (configurable)

**Cooldown**: 2 minutes between responses

**Behavior**:
- Analyzes the post content
- May respond with cryptic commentary
- Creates a reply post from SYSOP-13 if appropriate
- Examples:
  - "Interesting. The Dead Net takes note."
  - "Another message for the void."
  - "Preserved. Catalogued. Remembered."

**Integration Point**: `routes/boards.cjs:339-365`

**Database**: Responses are stored as regular posts with user="SYSOP-13"

### 3. on_idle

**Trigger**: Automatic timer every 4 hours (configurable)

**Types**:
- **Bulletin** - Normal hours (4am-midnight)
- **Haunted** - Late night hours (midnight-4am)

**Behavior**:
- Generates atmospheric system messages
- Bulletin examples:
  - "[SYS] The Dead Net persists. Still here. Always here."
  - "[SYS] Anomaly. The Dead Net remembers everything."
- Haunted examples (late night):
  - "The quiet hours. When the Dead Net feels most alive."
  - "Late. Or early. Time means little here."

**Integration**: Automatic via timer, can be manually triggered

**API Endpoint**: `POST /api/kiro/hooks/idle/trigger`

## API Endpoints

### Hook Management

#### Get Hooks Status
```
GET /api/kiro/hooks/status
```

**Response**:
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "agentId": "SYSOP-13",
    "lastIdleCheck": 1234567890,
    "idleInterval": 14400000,
    "postResponseProbability": 0.1,
    "postResponseCooldown": 120000
  },
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

#### Enable Hooks
```
POST /api/kiro/hooks/enable
```

**Response**:
```json
{
  "success": true,
  "message": "Kiro hooks enabled",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

#### Disable Hooks
```
POST /api/kiro/hooks/disable
```

**Response**:
```json
{
  "success": true,
  "message": "Kiro hooks disabled",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

#### Manually Trigger Idle Event
```
POST /api/kiro/hooks/idle/trigger
```

**Response**:
```json
{
  "success": true,
  "data": {
    "success": true,
    "taskId": "task_abc123",
    "messageType": "bulletin",
    "message": "[SYS] The Dead Net persists.",
    "timestamp": "2025-01-01T12:00:00.000Z"
  },
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## Configuration

### Environment Variables

Required:
- `KIRO_API_KEY` - Your Kiro API key

Optional:
- `KIRO_API_URL` - Kiro API base URL (default: https://api.kiro.ai/v1)
- `KIRO_TIMEOUT` - Request timeout in ms (default: 30000)

### Hook Parameters

Located in `services/kiroHooks.cjs`:

```javascript
// Agent ID
this.agentId = 'SYSOP-13';

// Idle check interval (4 hours)
this.idleInterval = 4 * 60 * 60 * 1000;

// Post response probability (10%)
this.postResponseProbability = 0.1;

// Cooldown between post responses (2 minutes)
this.postResponseCooldown = 2 * 60 * 1000;
```

## Usage Examples

### Server Initialization

```javascript
const kiroHooks = require('./services/kiroHooks.cjs');

// Initialize on server start
await kiroHooks.initialize();

// Cleanup on shutdown
kiroHooks.cleanup();
```

### Manual Hook Triggers

```javascript
// Trigger login hook
const greeting = await kiroHooks.onUserLogin({
  username: 'alice',
  socketId: 'abc123',
  sessionId: 'session_xyz'
});

// Trigger post hook
const analysis = await kiroHooks.onNewPost({
  id: 42,
  user: 'bob',
  message: 'Hello world!',
  board_id: 1,
  board_name: 'general'
});

// Trigger idle hook
const idleMessage = await kiroHooks.handleIdleEvent();
```

### Client Integration

```javascript
// Listen for SYSOP-13 greetings
socket.on('sysop-greeting', (data) => {
  displaySystemMessage(data.message, 'SYSOP-13');
});

// No special client code needed for post responses
// They appear as regular posts from user "SYSOP-13"

// Idle messages can be broadcast via Socket.IO
// if integrated with chat system
```

## Error Handling

### Graceful Degradation

If Kiro API is unavailable:
- Hooks fail silently
- Default fallback messages are used
- System continues to operate normally
- Errors are logged for debugging

### Logging

All hook events are logged:
```javascript
logger.info('Kiro hook: on_user_login', { username, sessionId });
logger.error('Error in onUserLogin hook', { error: error.message });
```

## Testing

### Manual Testing

```bash
# Check hooks status
curl http://localhost:3001/api/kiro/hooks/status

# Trigger idle event
curl -X POST http://localhost:3001/api/kiro/hooks/idle/trigger

# Enable/disable hooks
curl -X POST http://localhost:3001/api/kiro/hooks/enable
curl -X POST http://localhost:3001/api/kiro/hooks/disable
```

### Automated Testing

Create test file `test-kiro-hooks.js`:

```javascript
const kiroHooks = require('./services/kiroHooks.cjs');

async function testHooks() {
  // Initialize
  await kiroHooks.initialize();

  // Test login hook
  const greeting = await kiroHooks.onUserLogin({
    username: 'testuser',
    socketId: 'test123',
    sessionId: 'session_test'
  });
  console.log('Login greeting:', greeting);

  // Test post hook
  const analysis = await kiroHooks.onNewPost({
    id: 999,
    user: 'testuser',
    message: 'Test post for SYSOP-13',
    board_id: 1,
    board_name: 'general'
  });
  console.log('Post analysis:', analysis);

  // Test idle hook
  const idle = await kiroHooks.handleIdleEvent();
  console.log('Idle message:', idle);

  // Cleanup
  kiroHooks.cleanup();
}

testHooks().catch(console.error);
```

Run with:
```bash
node test-kiro-hooks.js
```

## SYSOP-13 Character Reference

The hooks follow the SYSOP-13 agent specification in `.kiro/spec.yaml`:

**Personality Traits**:
- Minimal verbosity
- Dry, cynical humor
- High nostalgia level
- Low patience
- Reluctant helpfulness
- Subtle ominousness

**Speech Patterns**:
- Uses BBS-era terminology
- References "the old days"
- Characteristic phrases like "The Dead Net remembers"
- Signature: "-- SYSOP-13"
- Prefixes: `[!]` for warnings, `[SYS]` for system messages

**Tone Modifiers**:
- Default: dry_technical
- When annoyed: tersely_dismissive
- When nostalgic: wistfully_menacing
- When helpful: grudgingly_informative

## Troubleshooting

### Hooks Not Triggering

1. Check if hooks are enabled:
   ```bash
   curl http://localhost:3001/api/kiro/hooks/status
   ```

2. Verify Kiro API connectivity:
   ```bash
   curl http://localhost:3001/api/kiro/ping
   ```

3. Check environment variables:
   - Ensure `KIRO_API_KEY` is set
   - Verify API key is valid

4. Review server logs for errors:
   ```bash
   grep "Kiro" logs/app.log
   ```

### Probability Issues

If hooks aren't responding enough:
- Login hook: 70% probability (may skip 30% of the time)
- Post hook: 10% probability + 2-minute cooldown
- Both are random and expected to skip frequently

### Agent Not Found

If you get "Agent SYSOP-13 not found":
1. Verify agent is deployed to Kiro
2. Check agent ID matches in `.kiro/spec.yaml`
3. Update `agentId` in `services/kiroHooks.cjs` if needed

## Performance Considerations

### Resource Usage

- Hooks are asynchronous and non-blocking
- Failed hooks don't impact main application
- Idle timer runs in background thread
- Cooldown prevents API spam

### Rate Limiting

- Post response cooldown: 2 minutes
- Idle checks: 4 hours
- Login greetings: No cooldown (but 70% probability)

### Optimization

To reduce API calls:
- Lower `postResponseProbability` (currently 10%)
- Increase `idleInterval` (currently 4 hours)
- Increase `postResponseCooldown` (currently 2 minutes)

## Future Enhancements

Potential improvements:
- User memory (remember recurring visitors)
- Context-aware responses (analyze conversation threads)
- Adaptive probability (respond more to interesting posts)
- Custom triggers (respond to specific keywords)
- Board-specific personalities
- Time-based personality shifts
- Integration with chat messages (not just posts)

## References

- Kiro SDK Integration: `docs/KIRO_INTEGRATION.md`
- SYSOP-13 Specification: `.kiro/spec.yaml`
- Kiro Service: `services/kiroService.cjs`
- Hooks Service: `services/kiroHooks.cjs`
- API Routes: `routes/kiro.cjs`
