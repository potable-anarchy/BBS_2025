/**
 * The Dead Net - ASCII Art Assets and Branding
 * Retro BBS-style ASCII art for logos, headers, and UI elements
 */

// Main logo variations
const LOGOS = {
  // Primary large logo for splash screen
  main: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║  ████████╗██╗  ██╗███████╗    ██████╗ ███████╗ █████╗ ██████╗            ║
║  ╚══██╔══╝██║  ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔══██╗           ║
║     ██║   ███████║█████╗      ██║  ██║█████╗  ███████║██║  ██║           ║
║     ██║   ██╔══██║██╔══╝      ██║  ██║██╔══╝  ██╔══██║██║  ██║           ║
║     ██║   ██║  ██║███████╗    ██████╔╝███████╗██║  ██║██████╔╝           ║
║     ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝            ║
║                                                                           ║
║                         ███╗   ██╗███████╗████████╗                      ║
║                         ████╗  ██║██╔════╝╚══██╔══╝                      ║
║                         ██╔██╗ ██║█████╗     ██║                         ║
║                         ██║╚██╗██║██╔══╝     ██║                         ║
║                         ██║ ╚████║███████╗   ██║                         ║
║                         ╚═╝  ╚═══╝╚══════╝   ╚═╝                         ║
║                                                                           ║
║               ░▒▓█  Where the Dead Lines Come Alive  █▓▒░               ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,

  // Compact logo for headers
  compact: `
╔════════════════════════════════════════════════════════════╗
║  ▀█▀ █  █ █▀▀   █▀▄ █▀▀ ▄▀█ █▀▄   █▄ █ █▀▀ ▀█▀          ║
║   █  █▀█ ██▄   █▄▀ ██▄ █▀█ █▄▀   █ ▀█ ██▄  █           ║
╚════════════════════════════════════════════════════════════╝`,

  // Mini logo for small headers
  mini: `┌─[ THE DEAD NET ]─┐`,

  // Simple text logo
  simple: `
╔═══════════════════════════════════════╗
║   THE DEAD NET                        ║
║   Where the Dead Lines Come Alive     ║
╚═══════════════════════════════════════╝`,

  // Banner style
  banner: `
  ▄▄▄█████▓ ██░ ██ ▓█████    ▓█████▄ ▓█████ ▄▄▄      ▓█████▄    ███▄    █ ▓█████▄▄▄█████▓
  ▓  ██▒ ▓▒▓██░ ██▒▓█   ▀    ▒██▀ ██▌▓█   ▀▒████▄    ▒██▀ ██▌   ██ ▀█   █ ▓█   ▀▓  ██▒ ▓▒
  ▒ ▓██░ ▒░▒██▀▀██░▒███      ░██   █▌▒███  ▒██  ▀█▄  ░██   █▌  ▓██  ▀█ ██▒▒███  ▒ ▓██░ ▒░
  ░ ▓██▓ ░ ░▓█ ░██ ▒▓█  ▄    ░▓█▄   ▌▒▓█  ▄░██▄▄▄▄██ ░▓█▄   ▌  ▓██▒  ▐▌██▒▒▓█  ▄░ ▓██▓ ░
    ▒██▒ ░ ░▓█▒░██▓░▒████▒   ░▒████▓ ░▒████▒▓█   ▓██▒░▒████▓   ▒██░   ▓██░░▒████▒ ▒██▒ ░
    ▒ ░░    ▒ ░░▒░▒░░ ▒░ ░    ▒▒▓  ▒ ░░ ▒░ ░▒▒   ▓▒█░ ▒▒▓  ▒   ░ ▒░   ▒ ▒ ░░ ▒░ ░ ▒ ░░
      ░     ▒ ░▒░ ░ ░ ░  ░    ░ ▒  ▒  ░ ░  ░ ▒   ▒▒ ░ ░ ▒  ▒   ░ ░░   ░ ▒░ ░ ░  ░   ░
    ░       ░  ░░ ░   ░       ░ ░  ░    ░    ░   ▒    ░ ░  ░      ░   ░ ░    ░    ░
            ░  ░  ░   ░  ░      ░       ░  ░     ░  ░   ░               ░    ░  ░
                               ░                       ░                                  `
};

// Board headers for different sections
const BOARD_HEADERS = {
  // General discussion board
  general: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   ▄▀  ██▀ █▄ █ ██▀ █▀▄ ▄▀▄ █         █▀▄ █ ▄▀▀ ▄▀▀ █ █ ▄▀▀ ▄▀▀ █ ▄▀▄ █▄ █ ║
║   ▀▄█ █▄▄ █ ▀█ █▄▄ █▀▄ █▀█ █▄▄       █▄▀ █ ▄██ ▀▄▄ ▀▄█ ▄██ ▄██ █ ▀▄▀ █ ▀█ ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,

  // Technology board
  tech: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║         ▀█▀ █▀▀ ▄▀▀ █▄█ █▄ █ ▄▀▄ █   ▄▀▄ ▄▀  █ █                        ║
║          █  █▄▄ ▀▄▄ █ █ █ ▀█ ▀▄▀ █▄▄ ▀▄▀ ▀▄█ ▀▄█                        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,

  // News board
  news: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║              █▄ █ █▀▀ █   █ ▄▀▀   ██▀ █▀▀ █▀▀ █▀▄                       ║
║              █ ▀█ █▄▄ ▀▄▀▄▀ ▀▄█   █▄▄ █▄▄ █▄▄ █▄▀                       ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,

  // Private messages
  messages: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║    █▀█ █▀▄ █ █ █ ▄▀▄ ▀█▀ █▀▀   █▄ ▄█ █▀▀ ▄▀▀ ▄▀▀ ▄▀▄ ▄▀  █▀▀ ▄▀▀        ║
║    █▀▀ █▀▄ █ ▀▄▀ █▀█  █  █▄▄   █ ▀ █ █▄▄ ▄██ ▄██ █▀█ ▀▄█ █▄▄ ▀▄█        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,

  // File archives
  files: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║       █▀▀ █ █   █▀▀   ▄▀▄ █▀▄ ▄▀▀ █ █ █ █ █ █ █▀▀ ▄▀▀                   ║
║       █▄▄ █ █▄▄ █▄▄   █▀█ █▀▄ ▀▄▄ █▀█ █ ▀▄▀ █▄▄ ▄██                   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,

  // User profiles
  users: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║           █ █ ▄▀▀ █▀▀ █▀▄   █▀▄ █ █▀▄ █▀▀ ▄▀▀ ▀█▀ ▄▀▄ █▀▄ █ █            ║
║           ▀▄█ ▀▄█ █▄▄ █▀▄   █▄▀ █ █▀▄ █▄▄ ▀▄▄  █  ▀▄▀ █▀▄ ▀▄█            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,

  // Administration
  admin: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║      ▄▀▄ █▀▄ █▄ ▄█ █ █▄ █ █ ▄▀▀ ▀█▀ █▀▄ ▄▀▄ ▀█▀ █ ▄▀▄ █▄ █                ║
║      █▀█ █▄▀ █ ▀ █ █ █ ▀█ █ ▄██  █  █▀▄ █▀█  █  █ ▀▄▀ █ ▀█                ║
║                                                                           ║
║                     ⚠ AUTHORIZED ACCESS ONLY ⚠                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`
};

// System messages
const SYSTEM_MESSAGES = {
  // Welcome message
  welcome: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║                          ░▒▓  WELCOME TO  ▓▒░                            ║
║                                                                           ║
║  ████████╗██╗  ██╗███████╗    ██████╗ ███████╗ █████╗ ██████╗            ║
║  ╚══██╔══╝██║  ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔══██╗           ║
║     ██║   ███████║█████╗      ██║  ██║█████╗  ███████║██║  ██║           ║
║     ██║   ██╔══██║██╔══╝      ██║  ██║██╔══╝  ██╔══██║██║  ██║           ║
║     ██║   ██║  ██║███████╗    ██████╔╝███████╗██║  ██║██████╔╝           ║
║     ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝            ║
║                         ███╗   ██╗███████╗████████╗                      ║
║                         ████╗  ██║██╔════╝╚══██╔══╝                      ║
║                         ██╔██╗ ██║█████╗     ██║                         ║
║                         ██║╚██╗██║██╔══╝     ██║                         ║
║                         ██║ ╚████║███████╗   ██║                         ║
║                         ╚═╝  ╚═══╝╚══════╝   ╚═╝                         ║
║                                                                           ║
║               ░▒▓█  Where the Dead Lines Come Alive  █▓▒░               ║
║                                                                           ║
║                      System Online • EST. 2025                           ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,

  // Loading indicator
  loading: `
╔════════════════════════════════════════╗
║                                        ║
║      ▄▀▀ ▄▀▄ █▄ █ █▄ █ █▀▀ ▄▀▀ ▀█▀    ║
║      ▀▄▄ ▀▄▀ █ ▀█ █ ▀█ █▄▄ ▀▄▄  █     ║
║                                        ║
║          ░░░░░░░░░░░░░░░░░░            ║
║          ▓▓▓▓▓▓▓▓▓▓                    ║
║          Loading...                    ║
║                                        ║
╚════════════════════════════════════════╝`,

  // Connection established
  connected: `
╔════════════════════════════════════════╗
║  ✓ CONNECTION ESTABLISHED              ║
║                                        ║
║  ▄▀▀ ▄▀▄ █▄ █ █▄ █ █▀▀ ▄▀▀ ▀█▀ █▀▀ █▀▄ ║
║  ▀▄▄ ▀▄▀ █ ▀█ █ ▀█ █▄▄ ▀▄▄  █  █▄▄ █▄▀ ║
║                                        ║
║  Terminal Ready                        ║
╚════════════════════════════════════════╝`,

  // Error message
  error: `
╔════════════════════════════════════════╗
║  ⚠ ERROR                               ║
║                                        ║
║  █▀▀ █▀▄ █▀▄ ▄▀▄ █▀▄                   ║
║  █▄▄ █▀▄ █▀▄ ▀▄▀ █▀▄                   ║
║                                        ║
║  Please try again                      ║
╚════════════════════════════════════════╝`,

  // Disconnected
  disconnected: `
╔════════════════════════════════════════╗
║  ✗ CONNECTION LOST                     ║
║                                        ║
║  █▀▄ █ ▄▀▀ ▄▀▀ ▄▀▄ █▄ █ █▄ █ █▀▀ ▄▀▀   ║
║  █▄▀ █ ▄██ ▀▄▄ ▀▄▀ █ ▀█ █ ▀█ █▄▄ ▀▄▄   ║
║                                        ║
║  Attempting to reconnect...            ║
╚════════════════════════════════════════╝`,

  // Access denied
  accessDenied: `
╔════════════════════════════════════════╗
║  ⛔ ACCESS DENIED                      ║
║                                        ║
║  █ █ █▄ █ ▄▀▄ █ █ ▀█▀ █▄█ ▄▀▄ █▀▄ █ ▀█ ║
║  ▀▄█ █ ▀█ █▀█ ▀▄█  █  █ █ ▀▄▀ █▀▄ █ █▄ ║
║                                        ║
║  Insufficient privileges               ║
╚════════════════════════════════════════╝`,

  // Logging in
  login: `
╔════════════════════════════════════════╗
║                                        ║
║      █   ▄▀▄ ▄▀  █ █▄ █               ║
║      █▄▄ ▀▄▀ ▀▄█ █ █ ▀█               ║
║                                        ║
║  Enter your credentials:               ║
║                                        ║
╚════════════════════════════════════════╝`,

  // Logged in successfully
  loginSuccess: `
╔════════════════════════════════════════╗
║  ✓ AUTHENTICATION SUCCESSFUL           ║
║                                        ║
║  █   ▄▀▄ ▄▀  ▄▀  █▀▀ █▀▄   █ █▄ █     ║
║  █▄▄ ▀▄▀ ▀▄█ ▀▄█ █▄▄ █▄▀   █ █ ▀█     ║
║                                        ║
║  Welcome back!                         ║
╚════════════════════════════════════════╝`,

  // Goodbye
  goodbye: `
╔════════════════════════════════════════╗
║                                        ║
║    ▄▀  ▄▀▄ ▄▀▄ █▀▄ █▀▄ █ █ █▀▀        ║
║    ▀▄█ ▀▄▀ ▀▄▀ █▄▀ █▀▄ ▀▄█ █▄▄        ║
║                                        ║
║  Thanks for visiting The Dead Net!     ║
║                                        ║
║  Connection terminated.                ║
║                                        ║
╚════════════════════════════════════════╝`
};

// UI borders and decorative elements
const UI_ELEMENTS = {
  // Dividers
  dividers: {
    heavy: '═══════════════════════════════════════════════════════════════════════════',
    light: '───────────────────────────────────────────────────────────────────────────',
    double: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    dashed: '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄',
    dotted: '·········································································',
    wave: '≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈'
  },

  // Box corners and edges
  boxes: {
    // Standard single-line box
    single: {
      topLeft: '┌',
      topRight: '┐',
      bottomLeft: '└',
      bottomRight: '┘',
      horizontal: '─',
      vertical: '│',
      cross: '┼',
      teeLeft: '├',
      teeRight: '┤',
      teeTop: '┬',
      teeBottom: '┴'
    },
    // Double-line box
    double: {
      topLeft: '╔',
      topRight: '╗',
      bottomLeft: '╚',
      bottomRight: '╝',
      horizontal: '═',
      vertical: '║',
      cross: '╬',
      teeLeft: '╠',
      teeRight: '╣',
      teeTop: '╦',
      teeBottom: '╩'
    },
    // Heavy box
    heavy: {
      topLeft: '┏',
      topRight: '┓',
      bottomLeft: '┗',
      bottomRight: '┛',
      horizontal: '━',
      vertical: '┃',
      cross: '╋',
      teeLeft: '┣',
      teeRight: '┫',
      teeTop: '┳',
      teeBottom: '┻'
    },
    // Rounded box
    rounded: {
      topLeft: '╭',
      topRight: '╮',
      bottomLeft: '╰',
      bottomRight: '╯',
      horizontal: '─',
      vertical: '│'
    }
  },

  // Menu indicators
  indicators: {
    bullet: '•',
    arrow: '►',
    arrowRight: '→',
    arrowLeft: '←',
    arrowUp: '↑',
    arrowDown: '↓',
    check: '✓',
    cross: '✗',
    star: '★',
    starEmpty: '☆',
    pointer: '▶',
    diamond: '◆',
    circle: '●',
    circleEmpty: '○',
    square: '■',
    squareEmpty: '□'
  },

  // Status indicators
  status: {
    online: '● ONLINE',
    offline: '○ OFFLINE',
    away: '◐ AWAY',
    busy: '⊗ BUSY',
    connecting: '◔ CONNECTING...',
    error: '⚠ ERROR',
    success: '✓ SUCCESS',
    warning: '⚠ WARNING',
    info: 'ℹ INFO'
  },

  // Progress bars
  progressBars: {
    blocks: ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'],
    bars: ['░', '▒', '▓', '█'],
    dots: ['⠀', '⠁', '⠃', '⠇', '⠏', '⠟', '⠿', '⡿', '⣿'],
    arrows: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙']
  },

  // Spinners for loading animations
  spinners: {
    dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    line: ['|', '/', '─', '\\'],
    arrow: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
    bounce: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈']
  },

  // Decorative patterns
  patterns: {
    shade: ['░', '▒', '▓', '█'],
    wave: '≈≈≈',
    zigzag: '<<<>>>',
    stars: '★☆★☆★',
    dots: '···',
    blocks: '▓▒░',
    pixel: '▀▄'
  }
};

// Menu templates
const MENUS = {
  // Main menu
  main: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                            MAIN MENU                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  [1] ► Bulletin Boards          [5] ► File Archives                      ║
║  [2] ► Private Messages          [6] ► User Directory                     ║
║  [3] ► News Feed                 [7] ► Settings                           ║
║  [4] ► Live Chat                 [8] ► About                              ║
║                                                                           ║
║  [L] ► Logout                    [H] ► Help                               ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Select option:                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,

  // Board list
  boardList: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                         BULLETIN BOARDS                                   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  [1] ► General Discussion        Last: 2 min ago   Posts: 1,234          ║
║  [2] ► Technology & Computing    Last: 5 min ago   Posts: 2,567          ║
║  [3] ► News & Current Events     Last: 10 min ago  Posts: 890            ║
║  [4] ► Creative Corner           Last: 1 hr ago    Posts: 445            ║
║  [5] ► Games & Entertainment     Last: 30 min ago  Posts: 1,789          ║
║                                                                           ║
║  [B] ► Back to Main Menu                                                  ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Select board:                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝`
};

// Helper function to create custom boxes
function createBox(content, width = 75, boxStyle = 'double') {
  const style = UI_ELEMENTS.boxes[boxStyle];
  const padding = 2;
  const innerWidth = width - (padding * 2) - 2; // Account for borders

  const lines = content.split('\n');
  const paddedLines = lines.map(line => {
    const spaces = innerWidth - line.length;
    return `${style.vertical}${' '.repeat(padding)}${line}${' '.repeat(spaces + padding)}${style.vertical}`;
  });

  const topBorder = style.topLeft + style.horizontal.repeat(width - 2) + style.topRight;
  const bottomBorder = style.bottomLeft + style.horizontal.repeat(width - 2) + style.bottomRight;

  return [topBorder, ...paddedLines, bottomBorder].join('\n');
}

// Helper function to create divider with text
function createDivider(text = '', char = '═', width = 75) {
  if (!text) {
    return char.repeat(width);
  }
  const textWithPadding = ` ${text} `;
  const sideLength = Math.floor((width - textWithPadding.length) / 2);
  const extra = width - (sideLength * 2 + textWithPadding.length);
  return char.repeat(sideLength) + textWithPadding + char.repeat(sideLength + extra);
}

// Helper function to create status line
function createStatusLine(left = '', right = '', width = 75) {
  const spaces = width - left.length - right.length;
  return left + ' '.repeat(Math.max(0, spaces)) + right;
}

// Helper function to create menu item
function createMenuItem(key, label, description = '', selected = false) {
  const pointer = selected ? '►' : ' ';
  if (description) {
    return `  [${key}] ${pointer} ${label.padEnd(25)} ${description}`;
  }
  return `  [${key}] ${pointer} ${label}`;
}

// Helper function to create progress bar
function createProgressBar(percent, width = 50, style = 'blocks') {
  const bars = UI_ELEMENTS.progressBars[style];
  const filledWidth = Math.floor((percent / 100) * width);
  const emptyWidth = width - filledWidth;
  const filledChar = bars[bars.length - 1];
  const emptyChar = bars[0];

  return `[${filledChar.repeat(filledWidth)}${emptyChar.repeat(emptyWidth)}] ${percent}%`;
}

// Export everything
module.exports = {
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
};
