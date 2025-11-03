# Command System Documentation

## Overview

The Vibe Kanban Command System provides an authentic BBS-style terminal interface for interacting with boards and posts. It features a robust command parser, validation middleware, WebSocket integration, and activity logging.

## Architecture

### Frontend Components

```
src/commands/
├── types.ts              # TypeScript type definitions
├── parser.ts             # Command parsing and validation
├── formatter.ts          # BBS-style output formatting with ANSI colors
├── registry.ts           # Command registration and lookup
├── executor.ts           # Command execution engine
├── handlers/             # Command handler implementations
│   ├── help.ts           # HELP command
│   ├── join.ts           # JOIN command
│   ├── list.ts           # LIST command
│   ├── post.ts           # POST command
│   └── index.ts          # Handler exports
└── index.ts              # Main entry point

src/hooks/
└── useCommandSystem.ts   # React hook for command integration

src/components/
└── CommandTerminal.tsx   # Terminal component with command system
```

### Backend Components

```
backend/commands/
├── commandHandler.js     # WebSocket command handler
└── middleware.js         # Validation and rate limiting

services/
└── sessionManager.js     # Session tracking with currentBoard property
```

## Available Commands

### HELP [command]

Display available commands or detailed help for a specific command.

**Usage:**
```
HELP
HELP JOIN
HELP LIST
? (alias)
COMMANDS (alias)
```

**Examples:**
```
> HELP
> HELP POST
> ?
```

### JOIN <board_id>

Join a discussion board to participate in conversations.

**Usage:**
```
JOIN <board_id>
```

**Parameters:**
- `board_id` - Board identifier (alphanumeric, hyphens, underscores)

**Examples:**
```
> JOIN general
> JOIN dev-chat
> JOIN announcements
```

**Response:**
```
═══════════════════════════════════════════════════════════════════════════
Joining board: general
───────────────────────────────────────────────────────────────────────────

Connecting to board...

You are now in board: general
Type LIST posts to view recent posts
Type POST "title" "message" to create a new post

═══════════════════════════════════════════════════════════════════════════
```

### LIST [boards|posts]

List available boards or posts in the current board.

**Usage:**
```
LIST
LIST boards
LIST posts
```

**Parameters:**
- `boards` - List all available boards (default)
- `posts` - List posts in current board (requires active board)

**Examples:**
```
> LIST
> LIST boards
> LIST posts
```

**Response (boards):**
```
╔═══════════════════════════════════════════════════════════════════════════╗
║                          AVAILABLE BOARDS                                 ║
╚═══════════════════════════════════════════════════════════════════════════╝

Board ID        │ Name                    │ Posts │ Users
────────────────┼─────────────────────────┼───────┼──────
general         │ General Discussion      │ 42    │ 12
announcements   │ Announcements           │ 8     │ 156
dev-chat        │ Development Chat        │ 234   │ 18
support         │ Support & Help          │ 67    │ 34

───────────────────────────────────────────────────────────────────────────
Total boards: 4
Type JOIN <board_id> to join a board
```

**Response (posts):**
```
╔═══════════════════════════════════════════════════════════════════════════╗
║                      POSTS IN BOARD: GENERAL                              ║
╚═══════════════════════════════════════════════════════════════════════════╝

ID │ Title                      │ Author    │ Date            │ Replies
───┼────────────────────────────┼───────────┼─────────────────┼────────
1  │ Welcome to Vibe Kanban!    │ admin     │ 2025-01-01 12:00│ 5
2  │ Feature request: Dark mode │ user123   │ 2025-01-02 14:30│ 12
3  │ Bug: Terminal scrolling    │ debugger  │ 2025-01-03 09:15│ 3

───────────────────────────────────────────────────────────────────────────
Total posts: 3
Type POST "title" "message" to create a new post
```

### POST <title> [message]

Create a new post on the current board.

**Usage:**
```
POST <title> [message]
```

**Parameters:**
- `title` - Post title (required, max 200 chars, use quotes for multi-word)
- `message` - Post content (optional, max 10000 chars, use quotes for multi-word)

**Requirements:**
- Must be joined to a board
- Must be authenticated

**Examples:**
```
> POST "Hello World"
> POST "Bug Report" "Found a critical bug in the login system"
> POST Welcome
```

**Response:**
```
═══════════════════════════════════════════════════════════════════════════
POST CREATED SUCCESSFULLY
───────────────────────────────────────────────────────────────────────────

Post Details:

  ID:        #1234
  Board:     general
  Author:    username
  Title:     Hello World
  Date:      2025-01-03 10:30

Message:
This is my first post!

═══════════════════════════════════════════════════════════════════════════
Your post has been published to general
```

## Command Parser

### Input Parsing

The parser handles:
- **Quoted arguments**: Supports single and double quotes
- **Whitespace handling**: Proper tokenization
- **Case insensitivity**: Commands normalized to uppercase
- **Special characters**: Sanitized for security

**Examples:**
```javascript
parseCommand('JOIN general')
// { name: 'JOIN', args: ['general'], rawInput: 'JOIN general' }

parseCommand('POST "Hello World" "My first post"')
// { name: 'POST', args: ['Hello World', 'My first post'], rawInput: '...' }

parseCommand('list posts')
// { name: 'LIST', args: ['posts'], rawInput: 'list posts' }
```

### Input Validation

Validation rules:
- **Length**: Max 1000 characters
- **Characters**: Alphanumeric, spaces, quotes, hyphens, underscores, punctuation
- **Sanitization**: XSS prevention via HTML entity encoding

```javascript
validateInput(input)
// Returns: { valid: boolean, error?: string }

sanitizeInput(input)
// Returns: sanitized string with HTML entities encoded
```

## Output Formatting

### ANSI Colors

The formatter supports authentic terminal colors:

```javascript
ANSI.FG_GREEN       // Standard colors
ANSI.FG_BRIGHT_GREEN // Bright colors
ANSI.BRIGHT         // Bold text
ANSI.RESET          // Reset formatting
```

### Formatting Utilities

**Headers:**
```javascript
header('VIBE KANBAN BBS')
// Creates box-border header with centered text
```

**Tables:**
```javascript
table(
  ['ID', 'Title', 'Author'],
  [['1', 'Hello', 'user'], ['2', 'World', 'admin']]
)
// Creates formatted table with column alignment
```

**Messages:**
```javascript
errorMessage('Command failed')
successMessage('Post created')
infoMessage('Type HELP for commands')
warningMessage('Rate limit reached')
```

**Separators:**
```javascript
separator('─', 78)  // Horizontal line
box(content, 78)    // Box with border
center(text, 78)    // Centered text
```

## WebSocket Integration

### Connection

The command system uses a dedicated WebSocket namespace:

```javascript
const socket = io('http://localhost:3001/commands', {
  auth: {
    username: 'user123'
  }
});
```

### Events

**Client → Server:**
- `command:execute` - Execute a command
- `command:join_board` - Join a board

**Server → Client:**
- `command:ack` - Command acknowledged
- `command:board_joined` - Board join success
- `command:user_joined` - User joined board
- `command:error` - Command error

### Example

```javascript
// Execute command
socket.emit('command:execute', {
  command: 'LIST',
  args: ['boards'],
  boardId: 'general'
});

// Listen for acknowledgment
socket.on('command:ack', (data) => {
  console.log('Command executed:', data.command);
});

// Join board
socket.emit('command:join_board', { boardId: 'general' });

socket.on('command:board_joined', (data) => {
  console.log('Joined board:', data.boardId);
});
```

## Validation & Security

### Rate Limiting

Commands are rate-limited to prevent abuse:

```javascript
const rateLimiter = new CommandRateLimiter(
  20,     // Max 20 commands
  10000   // Per 10 seconds
);

const check = rateLimiter.check(socketId);
// Returns: { allowed: boolean, remaining: number, resetIn: number }
```

### Input Sanitization

All inputs are sanitized before processing:

**Command names:**
- Uppercase conversion
- Strip non-alphanumeric (except hyphens/underscores)

**Arguments:**
- HTML entity encoding
- Length validation
- Type checking

**Board IDs:**
- Lowercase conversion
- Alphanumeric + hyphens + underscores only
- Max 50 characters

### Middleware

```javascript
validateCommandMiddleware(socket, data, callback)
// Validates command structure and arguments

createRateLimitMiddleware(rateLimiter)
// Creates rate limiting middleware for Socket.IO
```

## React Integration

### useCommandSystem Hook

```typescript
const {
  executeCommand,
  getAvailableCommands,
  currentBoard,
  username,
  isConnected
} = useCommandSystem({
  username: 'user123',
  boardId: 'general',
  serverUrl: 'http://localhost:3001'
});
```

**Methods:**
- `executeCommand(input: string): Promise<CommandResult>` - Execute command
- `getAvailableCommands(): string[]` - Get available commands for context

**State:**
- `currentBoard?: string` - Current active board
- `username: string` - Current username
- `isConnected: boolean` - WebSocket connection status

### CommandTerminal Component

```tsx
<CommandTerminal
  username="user123"
  boardId="general"
  serverUrl="http://localhost:3001"
  welcomeMessage="Custom welcome message"
/>
```

**Props:**
- `username?: string` - Username for authentication
- `boardId?: string` - Initial board to join
- `serverUrl?: string` - WebSocket server URL
- `welcomeMessage?: string` - Custom welcome message

## Adding Custom Commands

### 1. Create Command Handler

```typescript
// src/commands/handlers/mycommand.ts
import { CommandHandler, CommandContext, CommandResult } from '../types';
import * as fmt from '../formatter';

export const myCommand: CommandHandler = {
  name: 'MYCOMMAND',
  description: 'Does something cool',
  usage: 'MYCOMMAND <arg>',
  aliases: ['MC'],
  requiresAuth: true,
  requiresBoard: false,

  execute: async (args, context): Promise<CommandResult> => {
    if (args.length === 0) {
      return {
        success: false,
        output: fmt.errorMessage('Argument required'),
        error: 'Missing argument',
      };
    }

    const output = fmt.successMessage(`Executed with: ${args[0]}`);

    return {
      success: true,
      output,
      data: { arg: args[0] },
    };
  },
};
```

### 2. Register Command

```typescript
// src/commands/handlers/index.ts
export { myCommand } from './mycommand';

// src/commands/registry.ts
import { myCommand } from './handlers';

constructor() {
  this.register(helpCommand);
  this.register(joinCommand);
  this.register(listCommand);
  this.register(postCommand);
  this.register(myCommand); // Add here
}
```

### 3. Update HELP Command

```typescript
// src/commands/handlers/help.ts
const helpTexts: Record<string, string> = {
  // ... existing commands
  MYCOMMAND: `
${fmt.header('MYCOMMAND')}

${fmt.ANSI.FG_BRIGHT_YELLOW}USAGE:${fmt.ANSI.RESET}
  MYCOMMAND <arg>

${fmt.ANSI.FG_BRIGHT_YELLOW}DESCRIPTION:${fmt.ANSI.RESET}
  Does something cool with the provided argument.
`,
};
```

## Activity Logging

All command executions are logged for auditing:

```javascript
sessionManager.logActivity(socketId, 'JOIN', {
  boardId: 'general',
  timestamp: '2025-01-03T10:30:00Z'
});

// Logged as:
{
  username: 'user123',
  command: 'JOIN',
  sessionId: 'abc123...',
  boardId: 'general',
  timestamp: '2025-01-03T10:30:00Z'
}
```

### Activity Structure

```typescript
{
  timestamp: string;      // ISO 8601 timestamp
  command: string;        // Command name
  ...data: any;          // Additional data
}
```

### Retrieving Activity

```javascript
// Get session statistics
const stats = sessionManager.getStats();
// { activeSessions: 5, totalActivities: 123, usernames: [...] }

// Get specific session
const session = sessionManager.getSessionBySocketId(socketId);
console.log(session.activities);
// [ { timestamp: '...', command: 'JOIN', ... }, ... ]
```

## Testing

### Manual Testing

1. Start the server:
```bash
npm start
```

2. Connect with a test client:
```bash
node test-client.js
```

3. Execute commands:
```
> HELP
> LIST boards
> JOIN general
> LIST posts
> POST "Test" "Test message"
```

### Unit Testing

```javascript
// Test command parser
const parsed = parseCommand('JOIN general');
expect(parsed.name).toBe('JOIN');
expect(parsed.args).toEqual(['general']);

// Test validation
const result = validateInput('HELP');
expect(result.valid).toBe(true);

// Test sanitization
const sanitized = sanitizeInput('<script>alert("xss")</script>');
expect(sanitized).not.toContain('<script>');
```

## Performance Considerations

### Rate Limiting

- Default: 20 commands per 10 seconds per user
- Prevents command spam and DoS attacks
- Configurable per environment

### Session Management

- In-memory storage for low latency
- Automatic cleanup on disconnect
- Lightweight session structure

### Command Execution

- Async handlers for I/O operations
- Non-blocking execution
- Error isolation per command

## Troubleshooting

### Command Not Found

**Issue:** `Unknown command: XYZ`

**Solution:**
1. Check command name is uppercase
2. Verify command is registered in registry
3. Check for typos

### Authentication Required

**Issue:** `Authentication required for this command`

**Solution:**
1. Ensure WebSocket connection includes auth
2. Verify username is set
3. Check session is created

### Rate Limit Exceeded

**Issue:** `Rate limit exceeded`

**Solution:**
1. Wait for rate limit reset
2. Reduce command frequency
3. Contact admin to adjust limits

### WebSocket Disconnected

**Issue:** Commands not executing

**Solution:**
1. Check WebSocket connection status
2. Verify server is running
3. Check network connectivity
4. Review browser console for errors

## Future Enhancements

- [ ] Command history persistence
- [ ] Command autocomplete
- [ ] Custom command aliases per user
- [ ] Command templates/macros
- [ ] Batch command execution
- [ ] Command scheduling
- [ ] Interactive prompts for commands
- [ ] File upload via commands
- [ ] Admin commands (ban, kick, etc.)
- [ ] Command permissions system
- [ ] Command analytics dashboard

## References

- [WebSocket Documentation](../docs/WEBSOCKET.md)
- [Session Management](../docs/SESSIONS.md)
- [Terminal Components](../src/components/README.md)
- [BBS Style Guide](../docs/BBS_STYLING.md)
