/**
 * POST Command Handler
 * Creates a new post on the current board
 */

import { CommandHandler, CommandContext, CommandResult } from '../types';
import * as fmt from '../formatter';

export const postCommand: CommandHandler = {
  name: 'POST',
  description: 'Create a new post on the current board',
  usage: 'POST <title> [message]',
  requiresAuth: true,
  requiresBoard: true,

  execute: async (args, context): Promise<CommandResult> => {
    if (!context.boardId) {
      return {
        success: false,
        output: fmt.errorMessage('You must join a board first. Use: JOIN <board_id>'),
        error: 'No active board',
      };
    }

    if (args.length === 0) {
      return {
        success: false,
        output: fmt.errorMessage('Post title required. Usage: POST <title> [message]'),
        error: 'Missing title parameter',
      };
    }

    const title = args[0];
    const content = args.slice(1).join(' ') || '';

    // Validate title
    if (title.length > 200) {
      return {
        success: false,
        output: fmt.errorMessage('Title too long (max 200 characters)'),
        error: 'Title exceeds maximum length',
      };
    }

    // Validate content
    if (content.length > 10000) {
      return {
        success: false,
        output: fmt.errorMessage('Message too long (max 10000 characters)'),
        error: 'Content exceeds maximum length',
      };
    }

    try {
      // This will be implemented with actual database insertion
      // For now, return a success message
      const postId = Math.floor(Math.random() * 10000); // Mock post ID
      const timestamp = new Date();

      const output = `
${fmt.separator('═')}
${fmt.successMessage('POST CREATED SUCCESSFULLY')}
${fmt.separator('─')}

${fmt.ANSI.FG_BRIGHT_YELLOW}Post Details:${fmt.ANSI.RESET}

  ${fmt.ANSI.FG_BRIGHT_GREEN}ID:${fmt.ANSI.RESET}        #${postId}
  ${fmt.ANSI.FG_BRIGHT_GREEN}Board:${fmt.ANSI.RESET}     ${context.boardId}
  ${fmt.ANSI.FG_BRIGHT_GREEN}Author:${fmt.ANSI.RESET}    ${context.username}
  ${fmt.ANSI.FG_BRIGHT_GREEN}Title:${fmt.ANSI.RESET}     ${title}
  ${fmt.ANSI.FG_BRIGHT_GREEN}Date:${fmt.ANSI.RESET}      ${fmt.formatTimestamp(timestamp)}

${content ? `${fmt.ANSI.FG_BRIGHT_YELLOW}Message:${fmt.ANSI.RESET}\n${content}\n` : ''}
${fmt.separator('═')}
${fmt.infoMessage(`Your post has been published to ${fmt.ANSI.BRIGHT}${context.boardId}${fmt.ANSI.RESET}`)}
      `.trim();

      return {
        success: true,
        output,
        data: {
          postId,
          boardId: context.boardId,
          title,
          content,
          author: context.username,
          timestamp: timestamp.toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        output: fmt.errorMessage('Failed to create post'),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};
