/**
 * HELP Command Handler
 * Displays available commands and usage information
 */

import { CommandHandler, CommandResult } from '../types';
import * as fmt from '../formatter';

export const helpCommand: CommandHandler = {
  name: 'HELP',
  description: 'Display available commands and usage information',
  usage: 'HELP [command]',
  aliases: ['?', 'COMMANDS'],

  execute: (args): CommandResult => {
    const specificCommand = args[0]?.toUpperCase();

    if (specificCommand) {
      return getSpecificHelp(specificCommand);
    }

    return getGeneralHelp();
  },
};

function getGeneralHelp(): CommandResult {
  const output = `
${fmt.header('VIBE KANBAN BBS - COMMAND REFERENCE')}

${fmt.ANSI.FG_BRIGHT_YELLOW}AVAILABLE COMMANDS:${fmt.ANSI.RESET}

  ${fmt.ANSI.FG_BRIGHT_GREEN}HELP${fmt.ANSI.RESET} [command]
    Display this help message or help for a specific command
    Aliases: ?, COMMANDS

  ${fmt.ANSI.FG_BRIGHT_GREEN}JOIN${fmt.ANSI.RESET} <board_id>
    Join a board to participate in discussions
    Example: JOIN general

  ${fmt.ANSI.FG_BRIGHT_GREEN}LIST${fmt.ANSI.RESET} [boards|posts]
    List available boards or posts in current board
    Examples: LIST boards, LIST posts, LIST

  ${fmt.ANSI.FG_BRIGHT_GREEN}POST${fmt.ANSI.RESET} <title> [message]
    Create a new post on the current board
    Example: POST "Hello World" "This is my first post"

  ${fmt.ANSI.FG_BRIGHT_GREEN}CLEAR${fmt.ANSI.RESET}
    Clear the terminal screen

  ${fmt.ANSI.FG_BRIGHT_GREEN}WHOAMI${fmt.ANSI.RESET}
    Display current user information

  ${fmt.ANSI.FG_BRIGHT_GREEN}EXIT${fmt.ANSI.RESET} | ${fmt.ANSI.FG_BRIGHT_GREEN}QUIT${fmt.ANSI.RESET}
    Exit the current board or terminal session

${fmt.separator('─')}

${fmt.ANSI.FG_CYAN}Type ${fmt.ANSI.BRIGHT}HELP <command>${fmt.ANSI.RESET}${fmt.ANSI.FG_CYAN} for detailed information about a specific command.${fmt.ANSI.RESET}
`.trim();

  return {
    success: true,
    output,
  };
}

function getSpecificHelp(command: string): CommandResult {
  const helpTexts: Record<string, string> = {
    HELP: `
${fmt.header('HELP COMMAND')}

${fmt.ANSI.FG_BRIGHT_YELLOW}USAGE:${fmt.ANSI.RESET}
  HELP [command]

${fmt.ANSI.FG_BRIGHT_YELLOW}DESCRIPTION:${fmt.ANSI.RESET}
  Display general help or detailed information about a specific command.

${fmt.ANSI.FG_BRIGHT_YELLOW}EXAMPLES:${fmt.ANSI.RESET}
  HELP          - Show all available commands
  HELP JOIN     - Show detailed help for JOIN command
  ?             - Alias for HELP
`,

    JOIN: `
${fmt.header('JOIN COMMAND')}

${fmt.ANSI.FG_BRIGHT_YELLOW}USAGE:${fmt.ANSI.RESET}
  JOIN <board_id>

${fmt.ANSI.FG_BRIGHT_YELLOW}DESCRIPTION:${fmt.ANSI.RESET}
  Join a discussion board to view and create posts. You must join a board
  before you can post messages or interact with other users.

${fmt.ANSI.FG_BRIGHT_YELLOW}PARAMETERS:${fmt.ANSI.RESET}
  board_id - The unique identifier or name of the board to join

${fmt.ANSI.FG_BRIGHT_YELLOW}EXAMPLES:${fmt.ANSI.RESET}
  JOIN general           - Join the general discussion board
  JOIN announcements     - Join the announcements board
  JOIN dev-chat          - Join the dev-chat board
`,

    LIST: `
${fmt.header('LIST COMMAND')}

${fmt.ANSI.FG_BRIGHT_YELLOW}USAGE:${fmt.ANSI.RESET}
  LIST [boards|posts]

${fmt.ANSI.FG_BRIGHT_YELLOW}DESCRIPTION:${fmt.ANSI.RESET}
  Display available boards or posts. Without arguments, defaults to listing
  boards. Use "posts" to list posts in your current board.

${fmt.ANSI.FG_BRIGHT_YELLOW}PARAMETERS:${fmt.ANSI.RESET}
  boards - List all available boards (default)
  posts  - List posts in the current board (requires active board)

${fmt.ANSI.FG_BRIGHT_YELLOW}EXAMPLES:${fmt.ANSI.RESET}
  LIST               - List all boards
  LIST boards        - List all boards
  LIST posts         - List posts in current board
`,

    POST: `
${fmt.header('POST COMMAND')}

${fmt.ANSI.FG_BRIGHT_YELLOW}USAGE:${fmt.ANSI.RESET}
  POST <title> [message]

${fmt.ANSI.FG_BRIGHT_YELLOW}DESCRIPTION:${fmt.ANSI.RESET}
  Create a new post on the current board. You must be joined to a board
  before posting. Use quotes for multi-word titles or messages.

${fmt.ANSI.FG_BRIGHT_YELLOW}PARAMETERS:${fmt.ANSI.RESET}
  title   - Post title (required, use quotes for multiple words)
  message - Post content (optional, use quotes for multiple words)

${fmt.ANSI.FG_BRIGHT_YELLOW}EXAMPLES:${fmt.ANSI.RESET}
  POST "Hello World"                        - Create post with title only
  POST "Bug Report" "Found a critical bug"  - Create post with message
  POST Welcome                              - Single-word title
`,

    CLEAR: `
${fmt.header('CLEAR COMMAND')}

${fmt.ANSI.FG_BRIGHT_YELLOW}USAGE:${fmt.ANSI.RESET}
  CLEAR

${fmt.ANSI.FG_BRIGHT_YELLOW}DESCRIPTION:${fmt.ANSI.RESET}
  Clear the terminal screen and remove command history from view.
`,

    WHOAMI: `
${fmt.header('WHOAMI COMMAND')}

${fmt.ANSI.FG_BRIGHT_YELLOW}USAGE:${fmt.ANSI.RESET}
  WHOAMI

${fmt.ANSI.FG_BRIGHT_YELLOW}DESCRIPTION:${fmt.ANSI.RESET}
  Display information about your current session including username,
  session ID, current board, and connection status.
`,

    EXIT: `
${fmt.header('EXIT COMMAND')}

${fmt.ANSI.FG_BRIGHT_YELLOW}USAGE:${fmt.ANSI.RESET}
  EXIT | QUIT

${fmt.ANSI.FG_BRIGHT_YELLOW}DESCRIPTION:${fmt.ANSI.RESET}
  Leave the current board or exit the terminal session.

${fmt.ANSI.FG_BRIGHT_YELLOW}ALIASES:${fmt.ANSI.RESET}
  QUIT - Same as EXIT
`,
  };

  const helpText = helpTexts[command];

  if (!helpText) {
    return {
      success: false,
      output: fmt.errorMessage(`Unknown command: ${command}`),
      error: 'Unknown command',
    };
  }

  return {
    success: true,
    output: helpText.trim(),
  };
}
