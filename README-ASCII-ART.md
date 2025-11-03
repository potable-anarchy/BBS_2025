# The Dead Net - ASCII Art Assets & Branding

A complete retro BBS-style ASCII art asset library for The Dead Net project, featuring authentic bulletin board system aesthetics with Unicode box-drawing characters.

## Overview

This ASCII art system provides:

- **Multiple logo variations** for different contexts (splash screens, headers, compact)
- **Themed board headers** for all major sections
- **System messages** for common states (welcome, error, loading, etc.)
- **UI components** (borders, dividers, status indicators, progress bars)
- **Pre-designed menus** for navigation
- **Helper functions** for creating custom content

## Quick Start

### 1. Preview All Assets

Run the demo to see all available ASCII art:

```bash
node ascii-demo.js
```

This displays every logo, header, system message, and UI element with examples.

### 2. Basic Usage

```javascript
const ascii = require('./ascii-art');

// Display welcome screen
console.log(ascii.SYSTEM_MESSAGES.welcome);

// Display a board header
console.log(ascii.BOARD_HEADERS.tech);

// Create a custom box
console.log(ascii.createBox('Hello from The Dead Net!', 60, 'double'));

// Create a progress bar
console.log(ascii.createProgressBar(75, 50));
```

### 3. Socket.IO Integration

See `server-integration-example.js` for complete integration examples.

```javascript
const ascii = require('./ascii-art');

io.on('connection', (socket) => {
  // Send welcome screen
  socket.emit('ascii-art', {
    type: 'welcome',
    content: ascii.SYSTEM_MESSAGES.welcome
  });

  // Send main menu
  socket.emit('menu', ascii.MENUS.main);
});
```

## Files

- **`ascii-art.js`** - Main module with all ASCII art assets and helper functions
- **`ascii-demo.js`** - Interactive demo showcasing all assets
- **`server-integration-example.js`** - Complete Socket.IO integration example
- **`ASCII-ART-GUIDE.md`** - Comprehensive documentation with examples
- **`ASCII-QUICK-REFERENCE.md`** - Quick reference for common operations
- **`README-ASCII-ART.md`** - This file

## Features

### Logos

Multiple logo variations for different use cases:

- **Main** - Full splash screen logo with tagline
- **Compact** - Header-sized logo for repeated use
- **Mini** - Single-line minimal logo
- **Simple** - Text-based logo in a box
- **Banner** - Wide banner-style logo

### Board Headers

Pre-designed headers for each section:

- General Discussion
- Technology
- News Feed
- Private Messages
- File Archives
- User Directory
- Administration (with warning)

### System Messages

Ready-to-use messages for:

- Welcome/splash screen
- Loading indicators
- Connection status
- Login prompts
- Success/error messages
- Access denied
- Goodbye/logout

### UI Components

Complete set of UI elements:

- **Dividers** - 6 different line styles
- **Boxes** - 4 border styles (single, double, heavy, rounded)
- **Indicators** - Arrows, bullets, stars, checkmarks
- **Status** - Online/offline/busy/away indicators
- **Progress bars** - 3 different styles
- **Spinners** - 4 animation styles
- **Patterns** - Decorative elements

### Helper Functions

Utilities for creating custom content:

- `createBox(content, width, style)` - Create bordered boxes
- `createDivider(text, char, width)` - Create dividers with optional text
- `createStatusLine(left, right, width)` - Two-column status lines
- `createMenuItem(key, label, desc, selected)` - Formatted menu items
- `createProgressBar(percent, width, style)` - Progress indicators

## Documentation

### Quick Reference

For common operations and quick lookup, see: **`ASCII-QUICK-REFERENCE.md`**

### Complete Guide

For detailed documentation with examples, see: **`ASCII-ART-GUIDE.md`**

### Integration Examples

For Socket.IO and server integration patterns, see: **`server-integration-example.js`**

## Design Specifications

### Terminal Requirements

- **Width:** 80 columns (most elements use 75 chars)
- **Encoding:** UTF-8 (for Unicode box-drawing characters)
- **Font:** Monospace (Monaco, Consolas, Courier New)
- **Font Size:** 10-12pt recommended

### Character Sets

All ASCII art uses Unicode box-drawing characters (U+2500–U+257F):

```
┌─┬─┐  ╔═╦═╗  ┏━┳━┓  ╭─┬─╮
│ │ │  ║ ║ ║  ┃ ┃ ┃  │ │ │
├─┼─┤  ╠═╬═╣  ┣━╋━┫  ├─┼─┤
│ │ │  ║ ║ ║  ┃ ┃ ┃  │ │ │
└─┴─┘  ╚═╩═╝  ┗━┻━┛  ╰─┴─╯
```

### Color Support (Optional)

While the module provides structure only, you can add ANSI colors:

```javascript
const chalk = require('chalk');

console.log(chalk.cyan(ascii.LOGOS.compact));
console.log(chalk.green(ascii.UI_ELEMENTS.status.online));
```

## Usage Examples

### Welcome Sequence

```javascript
// Display welcome screen
socket.emit('screen', ascii.SYSTEM_MESSAGES.welcome);

// Show connection status
setTimeout(() => {
  socket.emit('screen', ascii.SYSTEM_MESSAGES.connected);
  socket.emit('menu', ascii.MENUS.main);
}, 1000);
```

### Board Navigation

```javascript
// Display board header
console.log(ascii.BOARD_HEADERS.tech);

// Display posts
console.log(ascii.createMenuItem('1', 'JavaScript Tips', 'by: coder - 5m ago'));
console.log(ascii.createMenuItem('2', 'Linux Guide', 'by: penguin - 1h ago'));

// Status line
console.log(ascii.createStatusLine('[N]ew Post', 'Page 1/10'));
```

### Progress Display

```javascript
let progress = 0;
const interval = setInterval(() => {
  process.stdout.write('\r' + ascii.createProgressBar(progress, 60));
  progress += 5;
  if (progress > 100) {
    clearInterval(interval);
    console.log('\n' + ascii.UI_ELEMENTS.status.success);
  }
}, 100);
```

### Error Handling

```javascript
try {
  // ... operation ...
} catch (error) {
  console.log(ascii.SYSTEM_MESSAGES.error);
  console.log(ascii.createBox(error.message, 60, 'single'));
}
```

### User Status Display

```javascript
const users = [
  { name: 'alice', status: 'online' },
  { name: 'bob', status: 'away' },
  { name: 'charlie', status: 'offline' }
];

console.log(ascii.BOARD_HEADERS.users);
users.forEach((user, i) => {
  const status = ascii.UI_ELEMENTS.status[user.status];
  console.log(ascii.createMenuItem((i+1).toString(), user.name, status));
});
```

## Testing

Run the comprehensive demo to verify all assets render correctly:

```bash
node ascii-demo.js
```

Test output can be redirected to a file for inspection:

```bash
node ascii-demo.js > output.txt
```

## Browser/Client Integration

For web-based terminals, ensure:

1. Use a monospace font in CSS
2. Preserve whitespace with `white-space: pre`
3. UTF-8 character encoding
4. Fixed-width characters

Example CSS:

```css
.terminal {
  font-family: 'Monaco', 'Menlo', 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  white-space: pre;
  line-height: 1.2;
  background: #000;
  color: #0f0;
}
```

## Customization

### Adding New Assets

To add new ASCII art:

1. Follow the 75-character width standard
2. Use Unicode box-drawing characters from `UI_ELEMENTS.boxes`
3. Test in the demo file
4. Document in this README

### Creating Custom Boxes

```javascript
const customBox = ascii.createBox(
  'Custom Title\n\nYour content here\nMultiple lines supported',
  70,
  'heavy'
);
```

### Custom Dividers

```javascript
// Plain divider
ascii.createDivider('', '═', 75);

// With centered text
ascii.createDivider('SECTION TITLE', '━', 75);

// Different characters
ascii.createDivider('NEWS', '~', 60);
```

## Performance Notes

- All ASCII art is pre-rendered as strings (no runtime generation)
- Helper functions perform minimal string operations
- Safe for high-frequency use (e.g., real-time updates)
- Total module size: ~40KB uncompressed

## Compatibility

Tested and verified on:

- **Node.js:** v14+
- **Terminals:** iTerm2, Terminal.app, Windows Terminal, GNOME Terminal
- **Operating Systems:** macOS, Linux, Windows 10/11

## Contributing

When contributing new ASCII art:

1. Maintain 75-character width
2. Use only Unicode box-drawing characters (U+2500–U+257F)
3. Test in multiple terminals
4. Add to demo file
5. Update documentation
6. Follow existing naming conventions

## License

Part of The Dead Net project.

---

**The Dead Net** - *Where the Dead Lines Come Alive*

For questions or issues, see the main project documentation.
