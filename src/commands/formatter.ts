/**
 * Command Response Formatter
 * Formats command output with authentic BBS styling and ANSI colors
 */

export const ANSI = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',

  // Foreground colors
  FG_BLACK: '\x1b[30m',
  FG_RED: '\x1b[31m',
  FG_GREEN: '\x1b[32m',
  FG_YELLOW: '\x1b[33m',
  FG_BLUE: '\x1b[34m',
  FG_MAGENTA: '\x1b[35m',
  FG_CYAN: '\x1b[36m',
  FG_WHITE: '\x1b[37m',

  // Bright foreground colors
  FG_BRIGHT_BLACK: '\x1b[90m',
  FG_BRIGHT_GREEN: '\x1b[92m',
  FG_BRIGHT_YELLOW: '\x1b[93m',
  FG_BRIGHT_CYAN: '\x1b[96m',
};

/**
 * Create a horizontal line separator
 */
export function separator(char: string = '─', length: number = 78): string {
  return char.repeat(length);
}

/**
 * Create a box border
 */
export function box(content: string, width: number = 78): string {
  const lines = content.split('\n');
  const top = '┌' + '─'.repeat(width - 2) + '┐';
  const bottom = '└' + '─'.repeat(width - 2) + '┘';
  const middle = lines.map(line => {
    const stripped = stripAnsi(line);
    const padding = ' '.repeat(Math.max(0, width - 4 - stripped.length));
    return `│ ${line}${padding} │`;
  });

  return [top, ...middle, bottom].join('\n');
}

/**
 * Strip ANSI codes for length calculation
 */
function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Center text within a given width
 */
export function center(text: string, width: number = 78): string {
  const stripped = stripAnsi(text);
  const padding = Math.max(0, Math.floor((width - stripped.length) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * Format error message
 */
export function errorMessage(message: string): string {
  return `${ANSI.FG_RED}${ANSI.BRIGHT}ERROR: ${message}${ANSI.RESET}`;
}

/**
 * Format success message
 */
export function successMessage(message: string): string {
  return `${ANSI.FG_GREEN}${ANSI.BRIGHT}${message}${ANSI.RESET}`;
}

/**
 * Format info message
 */
export function infoMessage(message: string): string {
  return `${ANSI.FG_CYAN}${message}${ANSI.RESET}`;
}

/**
 * Format warning message
 */
export function warningMessage(message: string): string {
  return `${ANSI.FG_YELLOW}${ANSI.BRIGHT}${message}${ANSI.RESET}`;
}

/**
 * Format a header with BBS-style ASCII art borders
 */
export function header(title: string): string {
  const width = 78;
  const titlePadding = Math.max(0, Math.floor((width - title.length - 4) / 2));

  return `
╔${'═'.repeat(width - 2)}╗
║${' '.repeat(titlePadding)}${ANSI.FG_BRIGHT_CYAN}${ANSI.BRIGHT}${title}${ANSI.RESET}${' '.repeat(width - 2 - titlePadding - title.length)}║
╚${'═'.repeat(width - 2)}╝`.trim();
}

/**
 * Format a table with columns
 */
export function table(headers: string[], rows: string[][]): string {
  if (rows.length === 0) {
    return infoMessage('No data to display.');
  }

  // Calculate column widths
  const colWidths = headers.map((header, i) => {
    const maxWidth = Math.max(
      header.length,
      ...rows.map(row => (row[i] || '').length)
    );
    return maxWidth;
  });

  // Format header
  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join(' │ ');
  const headerSep = colWidths.map(w => '─'.repeat(w)).join('─┼─');

  // Format rows
  const dataRows = rows.map(row =>
    row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join(' │ ')
  );

  return [
    ANSI.FG_BRIGHT_CYAN + headerRow + ANSI.RESET,
    headerSep,
    ...dataRows
  ].join('\n');
}

/**
 * Format a list with bullets
 */
export function list(items: string[], bullet: string = '•'): string {
  return items.map(item => `  ${ANSI.FG_GREEN}${bullet}${ANSI.RESET} ${item}`).join('\n');
}

/**
 * Format timestamp in BBS style
 */
export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
