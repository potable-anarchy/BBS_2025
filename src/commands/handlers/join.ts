/**
 * JOIN Command Handler
 * Allows users to join a discussion board
 */

import type { CommandHandler, CommandResult } from '../types';
import * as fmt from '../formatter';

export const joinCommand: CommandHandler = {
  name: 'JOIN',
  description: 'Join a discussion board',
  usage: 'JOIN <board_id>',
  requiresAuth: true,

  execute: async (args, _context): Promise<CommandResult> => {
    if (args.length === 0) {
      return {
        success: false,
        output: fmt.errorMessage('Board ID required. Usage: JOIN <board_id>'),
        error: 'Missing board_id parameter',
      };
    }

    const boardId = args[0];

    // Validate board ID format
    if (!/^[a-zA-Z0-9_-]+$/.test(boardId)) {
      return {
        success: false,
        output: fmt.errorMessage('Invalid board ID. Use alphanumeric characters, hyphens, and underscores only.'),
        error: 'Invalid board_id format',
      };
    }

    try {
      // This will be implemented with actual board validation in the backend
      // For now, return a success message indicating the intent
      const output = `
${fmt.separator('═')}
${fmt.successMessage(`Joining board: ${boardId}`)}
${fmt.separator('─')}

${fmt.ANSI.FG_CYAN}Connecting to board...${fmt.ANSI.RESET}

${fmt.infoMessage(`You are now in board: ${fmt.ANSI.BRIGHT}${boardId}${fmt.ANSI.RESET}`)}
${fmt.infoMessage(`Type ${fmt.ANSI.BRIGHT}LIST posts${fmt.ANSI.RESET} to view recent posts`)}
${fmt.infoMessage(`Type ${fmt.ANSI.BRIGHT}POST "title" "message"${fmt.ANSI.RESET} to create a new post`)}

${fmt.separator('═')}
      `.trim();

      return {
        success: true,
        output,
        data: { boardId },
      };
    } catch (error) {
      return {
        success: false,
        output: fmt.errorMessage(`Failed to join board: ${boardId}`),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};
