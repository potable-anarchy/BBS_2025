# The Dead Net - ASCII Art Quick Reference

## Quick Import

```javascript
const ascii = require('./ascii-art');
```

## Most Common Elements

### Display Welcome Screen
```javascript
console.log(ascii.SYSTEM_MESSAGES.welcome);
```

### Display Main Logo
```javascript
console.log(ascii.LOGOS.main);        // Full logo
console.log(ascii.LOGOS.compact);     // Header-sized
console.log(ascii.LOGOS.mini);        // Single line
```

### Board Headers
```javascript
console.log(ascii.BOARD_HEADERS.general);    // General discussion
console.log(ascii.BOARD_HEADERS.tech);       // Technology
console.log(ascii.BOARD_HEADERS.news);       // News
console.log(ascii.BOARD_HEADERS.messages);   // Private messages
console.log(ascii.BOARD_HEADERS.files);      // File archives
console.log(ascii.BOARD_HEADERS.users);      // User directory
console.log(ascii.BOARD_HEADERS.admin);      // Admin panel
```

### System Messages
```javascript
ascii.SYSTEM_MESSAGES.welcome          // Welcome screen
ascii.SYSTEM_MESSAGES.loading          // Loading indicator
ascii.SYSTEM_MESSAGES.connected        // Connection success
ascii.SYSTEM_MESSAGES.error            // Error message
ascii.SYSTEM_MESSAGES.disconnected     // Connection lost
ascii.SYSTEM_MESSAGES.accessDenied     // Access denied
ascii.SYSTEM_MESSAGES.login            // Login prompt
ascii.SYSTEM_MESSAGES.loginSuccess     // Login success
ascii.SYSTEM_MESSAGES.goodbye          // Logout/exit
```

### Menus
```javascript
console.log(ascii.MENUS.main);         // Main menu
console.log(ascii.MENUS.boardList);    // Board selection
```

## Helper Functions

### Create Custom Box
```javascript
ascii.createBox(content, width, style)

// Examples:
ascii.createBox('Hello!', 50, 'double')
ascii.createBox('Message\nMultiple lines', 60, 'single')
```

**Styles:** `'single'`, `'double'`, `'heavy'`, `'rounded'`

### Create Divider
```javascript
ascii.createDivider(text, char, width)

// Examples:
ascii.createDivider()                           // Plain divider
ascii.createDivider('TITLE', '═', 75)          // Divider with text
ascii.createDivider('SECTION', '─', 60)        // Custom character
```

### Create Status Line
```javascript
ascii.createStatusLine(left, right, width)

// Example:
ascii.createStatusLine('User: alice', 'Online: 42', 75)
// Output: User: alice                                      Online: 42
```

### Create Menu Item
```javascript
ascii.createMenuItem(key, label, description, selected)

// Examples:
ascii.createMenuItem('1', 'Option One')
ascii.createMenuItem('2', 'Option Two', 'Description', true)
```

### Create Progress Bar
```javascript
ascii.createProgressBar(percent, width, style)

// Examples:
ascii.createProgressBar(60)                    // Default
ascii.createProgressBar(75, 50, 'blocks')      // Custom width
ascii.createProgressBar(80, 40, 'bars')        // Different style
```

**Styles:** `'blocks'`, `'bars'`, `'dots'`

## UI Elements Quick Access

### Status Indicators
```javascript
ascii.UI_ELEMENTS.status.online        // ● ONLINE
ascii.UI_ELEMENTS.status.offline       // ○ OFFLINE
ascii.UI_ELEMENTS.status.away          // ◐ AWAY
ascii.UI_ELEMENTS.status.busy          // ⊗ BUSY
ascii.UI_ELEMENTS.status.connecting    // ◔ CONNECTING...
ascii.UI_ELEMENTS.status.error         // ⚠ ERROR
ascii.UI_ELEMENTS.status.success       // ✓ SUCCESS
ascii.UI_ELEMENTS.status.warning       // ⚠ WARNING
ascii.UI_ELEMENTS.status.info          // ℹ INFO
```

### Common Indicators
```javascript
ascii.UI_ELEMENTS.indicators.arrow       // ►
ascii.UI_ELEMENTS.indicators.pointer     // ▶
ascii.UI_ELEMENTS.indicators.check       // ✓
ascii.UI_ELEMENTS.indicators.cross       // ✗
ascii.UI_ELEMENTS.indicators.star        // ★
ascii.UI_ELEMENTS.indicators.bullet      // •
ascii.UI_ELEMENTS.indicators.arrowRight  // →
ascii.UI_ELEMENTS.indicators.arrowLeft   // ←
```

### Divider Lines
```javascript
ascii.UI_ELEMENTS.dividers.heavy    // ═══════
ascii.UI_ELEMENTS.dividers.light    // ───────
ascii.UI_ELEMENTS.dividers.double   // ━━━━━━━
ascii.UI_ELEMENTS.dividers.dashed   // ┄┄┄┄┄┄┄
ascii.UI_ELEMENTS.dividers.dotted   // ·······
ascii.UI_ELEMENTS.dividers.wave     // ≈≈≈≈≈≈≈
```

### Box Characters
```javascript
const box = ascii.UI_ELEMENTS.boxes.double;

box.topLeft       // ╔
box.topRight      // ╗
box.bottomLeft    // ╚
box.bottomRight   // ╝
box.horizontal    // ═
box.vertical      // ║
```

**Available box styles:** `single`, `double`, `heavy`, `rounded`

### Spinners (for animations)
```javascript
ascii.UI_ELEMENTS.spinners.dots     // ['⠋', '⠙', '⠹', '⠸', ...]
ascii.UI_ELEMENTS.spinners.line     // ['|', '/', '─', '\\']
ascii.UI_ELEMENTS.spinners.arrow    // ['←', '↖', '↑', '↗', ...]
```

## Common Patterns

### Welcome Sequence
```javascript
socket.emit('welcome', ascii.SYSTEM_MESSAGES.welcome);
socket.emit('status', ascii.SYSTEM_MESSAGES.connected);
socket.emit('menu', ascii.MENUS.main);
```

### Error Display
```javascript
console.log(ascii.SYSTEM_MESSAGES.error);
console.log(ascii.createBox('Error: Connection timeout', 60, 'single'));
```

### Board Display
```javascript
console.log(ascii.BOARD_HEADERS.tech);
console.log(ascii.createMenuItem('1', 'First Post', 'by: user - 1h ago'));
console.log(ascii.createStatusLine('[N]ew', 'Page 1/5'));
```

### Progress Display
```javascript
let progress = 0;
const interval = setInterval(() => {
  process.stdout.write('\r' + ascii.createProgressBar(progress));
  progress += 10;
  if (progress > 100) clearInterval(interval);
}, 500);
```

### User List
```javascript
console.log(ascii.BOARD_HEADERS.users);
console.log(ascii.createMenuItem('1', 'alice', ascii.UI_ELEMENTS.status.online));
console.log(ascii.createMenuItem('2', 'bob', ascii.UI_ELEMENTS.status.away));
```

## Socket.IO Integration

### Sending ASCII Art
```javascript
socket.emit('ascii-art', {
  type: 'welcome',
  content: ascii.SYSTEM_MESSAGES.welcome
});
```

### Displaying Board
```javascript
socket.on('select-board', (board) => {
  socket.emit('board-header', ascii.BOARD_HEADERS[board]);
});
```

### Status Updates
```javascript
socket.emit('status', ascii.createStatusLine(
  'User: ' + username,
  'Online: ' + userCount
));
```

## Terminal Colors (Optional)

Using with the `chalk` library:

```javascript
const chalk = require('chalk');

console.log(chalk.cyan(ascii.LOGOS.compact));
console.log(chalk.green(ascii.UI_ELEMENTS.status.online));
console.log(chalk.red(ascii.SYSTEM_MESSAGES.error));
console.log(chalk.yellow(ascii.UI_ELEMENTS.status.warning));
```

## File List

- `ascii-art.js` - Main ASCII art module
- `ascii-demo.js` - Interactive demo (run with `node ascii-demo.js`)
- `server-integration-example.js` - Full server integration example
- `ASCII-ART-GUIDE.md` - Complete documentation
- `ASCII-QUICK-REFERENCE.md` - This file

## Tips

1. **Default Width:** Most elements are 75 characters wide (fits 80-column terminals)
2. **Monospace Fonts:** Required for proper display (Monaco, Consolas, Courier)
3. **UTF-8 Encoding:** Ensure terminal supports Unicode box-drawing characters
4. **Line Breaks:** Use `\n` within strings for multi-line content
5. **Testing:** Run `node ascii-demo.js` to preview all assets

## Resources

- Full documentation: `ASCII-ART-GUIDE.md`
- Demo file: `ascii-demo.js`
- Integration example: `server-integration-example.js`
- Main module: `ascii-art.js`
