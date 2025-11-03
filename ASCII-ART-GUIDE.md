# The Dead Net - ASCII Art Assets Guide

## Overview

This guide documents all ASCII art assets and branding elements for The Dead Net BBS system. These retro-styled elements create an authentic bulletin board system aesthetic.

## Installation

Import the ASCII art module in your Node.js application:

```javascript
const {
  LOGOS,
  BOARD_HEADERS,
  SYSTEM_MESSAGES,
  UI_ELEMENTS,
  MENUS,
  createBox,
  createDivider,
  createStatusLine,
  createMenuItem,
  createProgressBar
} = require('./ascii-art');
```

## Assets Reference

### 1. Logos

The Dead Net has multiple logo variations for different contexts:

#### Main Logo (`LOGOS.main`)
The primary large logo featuring the full "THE DEAD NET" text with the tagline "Where the Dead Lines Come Alive". Best used for:
- Splash screens
- Initial connection screens
- Welcome pages

```javascript
console.log(LOGOS.main);
```

#### Compact Logo (`LOGOS.compact`)
A smaller version suitable for headers and repeated use:
```javascript
console.log(LOGOS.compact);
```

#### Mini Logo (`LOGOS.mini`)
Minimal single-line logo for constrained spaces:
```javascript
console.log(LOGOS.mini);
// Output: ┌─[ THE DEAD NET ]─┐
```

#### Simple Logo (`LOGOS.simple`)
Text-based logo in a simple box:
```javascript
console.log(LOGOS.simple);
```

#### Banner Logo (`LOGOS.banner`)
Wide banner-style logo for headers:
```javascript
console.log(LOGOS.banner);
```

### 2. Board Headers

Themed headers for different bulletin board sections:

#### Available Headers
- `BOARD_HEADERS.general` - General Discussion
- `BOARD_HEADERS.tech` - Technology
- `BOARD_HEADERS.news` - News Feed
- `BOARD_HEADERS.messages` - Private Messages
- `BOARD_HEADERS.files` - File Archives
- `BOARD_HEADERS.users` - User Directory
- `BOARD_HEADERS.admin` - Administration (with warning)

#### Usage Example
```javascript
// Display technology board header
console.log(BOARD_HEADERS.tech);

// Display admin header for restricted areas
console.log(BOARD_HEADERS.admin);
```

### 3. System Messages

Pre-designed messages for common system states:

#### Available Messages

**Welcome Screen** (`SYSTEM_MESSAGES.welcome`)
- Full splash screen with logo and tagline
- Use on initial connection

**Loading** (`SYSTEM_MESSAGES.loading`)
- Displays loading progress indicator
- Use during data fetching or connection setup

**Connected** (`SYSTEM_MESSAGES.connected`)
- Success message after connection established
- Confirms terminal is ready

**Error** (`SYSTEM_MESSAGES.error`)
- Generic error notification
- Use with custom error messages

**Disconnected** (`SYSTEM_MESSAGES.disconnected`)
- Connection lost notification
- Shows reconnection attempt status

**Access Denied** (`SYSTEM_MESSAGES.accessDenied`)
- Authorization failure message
- Use for permission errors

**Login** (`SYSTEM_MESSAGES.login`)
- Login prompt screen
- Use before credential entry

**Login Success** (`SYSTEM_MESSAGES.loginSuccess`)
- Authentication confirmation
- Welcome back message

**Goodbye** (`SYSTEM_MESSAGES.goodbye`)
- Exit/logout screen
- Final message before disconnection

#### Usage Example
```javascript
// Show welcome screen
console.log(SYSTEM_MESSAGES.welcome);

// Show error
console.log(SYSTEM_MESSAGES.error);

// Show goodbye
console.log(SYSTEM_MESSAGES.goodbye);
```

### 4. UI Elements

#### Dividers

Various line styles for visual separation:

```javascript
// Heavy double-line divider
console.log(UI_ELEMENTS.dividers.heavy);

// Light single-line divider
console.log(UI_ELEMENTS.dividers.light);

// Double-width divider
console.log(UI_ELEMENTS.dividers.double);

// Dashed line
console.log(UI_ELEMENTS.dividers.dashed);

// Dotted line
console.log(UI_ELEMENTS.dividers.dotted);

// Wave pattern
console.log(UI_ELEMENTS.dividers.wave);
```

#### Box Drawing Characters

Complete sets for creating custom boxes:

```javascript
const { double } = UI_ELEMENTS.boxes;

// Create a simple box
console.log(double.topLeft + double.horizontal.repeat(20) + double.topRight);
console.log(double.vertical + ' Content Here        ' + double.vertical);
console.log(double.bottomLeft + double.horizontal.repeat(20) + double.bottomRight);
```

**Available Box Styles:**
- `single` - Single-line box (┌─┐)
- `double` - Double-line box (╔═╗)
- `heavy` - Heavy/bold box (┏━┓)
- `rounded` - Rounded corners (╭─╮)

#### Indicators

Symbols for lists, status, and navigation:

```javascript
// Menu bullets
console.log(UI_ELEMENTS.indicators.arrow + ' Menu Item');
console.log(UI_ELEMENTS.indicators.pointer + ' Selected Item');

// Status symbols
console.log(UI_ELEMENTS.indicators.check + ' Complete');
console.log(UI_ELEMENTS.indicators.cross + ' Failed');
console.log(UI_ELEMENTS.indicators.star + ' Featured');

// Navigation
console.log(UI_ELEMENTS.indicators.arrowRight + ' Next Page');
console.log(UI_ELEMENTS.indicators.arrowLeft + ' Previous Page');
```

#### Status Indicators

Pre-formatted status messages:

```javascript
console.log(UI_ELEMENTS.status.online);      // ● ONLINE
console.log(UI_ELEMENTS.status.offline);     // ○ OFFLINE
console.log(UI_ELEMENTS.status.away);        // ◐ AWAY
console.log(UI_ELEMENTS.status.busy);        // ⊗ BUSY
console.log(UI_ELEMENTS.status.connecting);  // ◔ CONNECTING...
console.log(UI_ELEMENTS.status.error);       // ⚠ ERROR
console.log(UI_ELEMENTS.status.success);     // ✓ SUCCESS
console.log(UI_ELEMENTS.status.warning);     // ⚠ WARNING
console.log(UI_ELEMENTS.status.info);        // ℹ INFO
```

#### Progress Bars

Character sets for loading/progress animations:

```javascript
// Block-style progress
UI_ELEMENTS.progressBars.blocks; // ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']

// Shade-style progress
UI_ELEMENTS.progressBars.bars; // ['░', '▒', '▓', '█']

// Use with createProgressBar helper
console.log(createProgressBar(75)); // [█████████████████████████░░░░░] 75%
```

#### Spinners

Frames for animated loading indicators:

```javascript
// Cycle through spinner frames
const spinner = UI_ELEMENTS.spinners.dots;
let frame = 0;

setInterval(() => {
  process.stdout.write('\r' + spinner[frame] + ' Loading...');
  frame = (frame + 1) % spinner.length;
}, 100);
```

**Available Spinners:**
- `dots` - Braille dot spinner
- `line` - Rotating line
- `arrow` - Rotating arrow
- `bounce` - Bouncing dots

#### Decorative Patterns

Visual patterns for backgrounds and accents:

```javascript
console.log(UI_ELEMENTS.patterns.shade);   // ['░', '▒', '▓', '█']
console.log(UI_ELEMENTS.patterns.wave);    // '≈≈≈'
console.log(UI_ELEMENTS.patterns.stars);   // '★☆★☆★'
console.log(UI_ELEMENTS.patterns.blocks);  // '▓▒░'
```

### 5. Menus

Pre-designed menu templates:

#### Main Menu (`MENUS.main`)
Complete main menu with navigation options:
```javascript
console.log(MENUS.main);
```

#### Board List (`MENUS.boardList`)
Bulletin board selection menu:
```javascript
console.log(MENUS.boardList);
```

## Helper Functions

### createBox(content, width, boxStyle)

Creates a bordered box around content.

**Parameters:**
- `content` (string) - Text to display in the box
- `width` (number) - Total width of the box (default: 75)
- `boxStyle` (string) - Box style: 'single', 'double', 'heavy', or 'rounded' (default: 'double')

**Example:**
```javascript
const message = 'Hello, Dead Net!';
console.log(createBox(message, 50, 'double'));
```

**Output:**
```
╔════════════════════════════════════════════════╗
║  Hello, Dead Net!                              ║
╚════════════════════════════════════════════════╝
```

### createDivider(text, char, width)

Creates a horizontal divider with optional centered text.

**Parameters:**
- `text` (string) - Optional text to display in center (default: '')
- `char` (string) - Character to use for divider (default: '═')
- `width` (number) - Width of divider (default: 75)

**Examples:**
```javascript
// Plain divider
console.log(createDivider());
// ═══════════════════════════════════════════════════════════════════════════

// Divider with text
console.log(createDivider('SECTION TITLE', '═', 75));
// ════════════════════════════ SECTION TITLE ════════════════════════════

// Custom character
console.log(createDivider('NEWS', '─', 60));
// ─────────────────────────── NEWS ───────────────────────────
```

### createStatusLine(left, right, width)

Creates a line with left and right-aligned text.

**Parameters:**
- `left` (string) - Left-aligned text (default: '')
- `right` (string) - Right-aligned text (default: '')
- `width` (number) - Total width (default: 75)

**Example:**
```javascript
console.log(createStatusLine('User: ghost_rider', 'Online: 42 users', 75));
// User: ghost_rider                                      Online: 42 users
```

### createMenuItem(key, label, description, selected)

Creates a formatted menu item.

**Parameters:**
- `key` (string) - Menu key/number
- `label` (string) - Item label
- `description` (string) - Optional description (default: '')
- `selected` (boolean) - Whether item is selected (default: false)

**Examples:**
```javascript
// Simple menu item
console.log(createMenuItem('1', 'Main Board'));
//   [1]   Main Board

// Selected menu item
console.log(createMenuItem('2', 'Messages', '', true));
//   [2] ► Messages

// With description
console.log(createMenuItem('3', 'Tech Board', 'Last post: 5 min ago'));
//   [3]   Tech Board              Last post: 5 min ago
```

### createProgressBar(percent, width, style)

Creates a visual progress bar.

**Parameters:**
- `percent` (number) - Percentage complete (0-100)
- `width` (number) - Bar width in characters (default: 50)
- `style` (string) - Bar style: 'blocks', 'bars', 'dots' (default: 'blocks')

**Examples:**
```javascript
// Block style progress bar
console.log(createProgressBar(60, 50, 'blocks'));
// [██████████████████████████████░░░░░░░░░░░░░░░░░░░░] 60%

// Shade style
console.log(createProgressBar(75, 40, 'bars'));
// [███████████████████████████████░░░░░░░░░] 75%

// Different percentages
console.log(createProgressBar(25));  // 25% complete
console.log(createProgressBar(50));  // 50% complete
console.log(createProgressBar(100)); // 100% complete
```

## Usage Examples

### Creating a Welcome Screen

```javascript
const ascii = require('./ascii-art');

// Display welcome message
console.log(ascii.SYSTEM_MESSAGES.welcome);
console.log('\n');
console.log(ascii.createStatusLine('Connected from: 192.168.1.100', 'Users online: 42'));
console.log(ascii.UI_ELEMENTS.dividers.heavy);
```

### Building a Custom Menu

```javascript
const ascii = require('./ascii-art');

const menuContent = [
  ascii.createMenuItem('1', 'Read Messages', '3 new messages', false),
  ascii.createMenuItem('2', 'Post Message', '', true),
  ascii.createMenuItem('3', 'View Users', '42 online', false),
  '',
  ascii.createMenuItem('B', 'Back', '', false)
].join('\n');

console.log(ascii.createBox(menuContent, 60, 'double'));
```

### Progress Indicator

```javascript
const ascii = require('./ascii-art');

let progress = 0;
const interval = setInterval(() => {
  process.stdout.write('\r' + ascii.createProgressBar(progress, 50));
  progress += 5;

  if (progress > 100) {
    clearInterval(interval);
    console.log('\n' + ascii.UI_ELEMENTS.status.success);
  }
}, 100);
```

### Board Header with Content

```javascript
const ascii = require('./ascii-art');

// Display board
console.log(ascii.BOARD_HEADERS.tech);
console.log('\n');

// Display posts
console.log(ascii.createMenuItem('1', 'New JavaScript Framework', 'by: coder42', false));
console.log(ascii.createMenuItem('2', 'Linux Tips & Tricks', 'by: penguin_lover', false));
console.log(ascii.createMenuItem('3', 'AI Discussion Thread', 'by: neural_net', true));

console.log('\n' + ascii.UI_ELEMENTS.dividers.dashed);
console.log(ascii.createStatusLine('Page 1/5', 'Press N for next'));
```

### Error Handling

```javascript
const ascii = require('./ascii-art');

function handleError(errorMessage) {
  console.log(ascii.SYSTEM_MESSAGES.error);
  console.log('\n');
  console.log(ascii.createBox(errorMessage, 60, 'single'));
}

// Usage
handleError('Connection timeout. Please try again.');
```

### Socket.IO Integration Example

```javascript
const ascii = require('./ascii-art');

io.on('connection', (socket) => {
  // Send welcome screen
  socket.emit('ascii-art', ascii.SYSTEM_MESSAGES.welcome);

  // Send main menu
  socket.emit('ascii-art', ascii.MENUS.main);

  socket.on('select-board', (boardName) => {
    // Send board header
    const header = ascii.BOARD_HEADERS[boardName] || ascii.BOARD_HEADERS.general;
    socket.emit('ascii-art', header);
  });

  socket.on('disconnect', () => {
    socket.emit('ascii-art', ascii.SYSTEM_MESSAGES.goodbye);
  });
});
```

## Design Guidelines

### Character Width

All ASCII art is designed for standard 80-column terminals. The default width for most elements is 75 characters (leaving margin).

### Font Requirements

For best results, use a monospace font in your terminal:
- **Recommended:** Monaco, Menlo, Consolas, Courier New
- **Font Size:** 10-12pt
- **Line Height:** 1.2-1.5

### Color Support

While this module provides the ASCII art structure, you can add ANSI colors for enhanced visual appeal:

```javascript
// Example with chalk library
const chalk = require('chalk');

console.log(chalk.cyan(LOGOS.compact));
console.log(chalk.red(SYSTEM_MESSAGES.error));
console.log(chalk.green(UI_ELEMENTS.status.online));
```

### Terminal Compatibility

All ASCII art uses Unicode box-drawing characters (U+2500 to U+257F). Ensure your terminal supports UTF-8 encoding.

## File Structure

```
ascii-art.js                 # Main ASCII art module
ASCII-ART-GUIDE.md          # This documentation file
examples/                   # Example usage files (optional)
```

## Contributing

When adding new ASCII art assets:

1. Maintain consistent width (75 characters default)
2. Use box-drawing characters from UI_ELEMENTS.boxes
3. Test in multiple terminals for compatibility
4. Document new assets in this guide
5. Provide usage examples

## License

These ASCII art assets are part of The Dead Net project.

---

**The Dead Net** - Where the Dead Lines Come Alive
