import type { CommandHandler, CommandContext, CommandResult } from '../types';

/**
 * CHAT Command Handler
 * Sends a message to the global chat
 */
export const chatHandler: CommandHandler = {
  name: 'CHAT',
  description: 'Send a message to the global chat',
  usage: 'CHAT <message>',
  aliases: ['SAY', 'MSG'],
  requiresAuth: true,
  requiresBoard: false,

  async execute(args: string[], _context: CommandContext): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        success: false,
        output: 'Usage: CHAT <message>',
        error: 'Message is required'
      };
    }

    const message = args.join(' ');

    if (message.length > 500) {
      return {
        success: false,
        output: 'Message too long (max 500 characters)',
        error: 'Message exceeds maximum length'
      };
    }

    try {
      // The message will be handled by the WebSocket event listener
      // This command just provides feedback to the user
      return {
        success: true,
        output: `Message sent to global chat: ${message}`,
        data: { message }
      };
    } catch (error) {
      return {
        success: false,
        output: 'Failed to send chat message',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

export default chatHandler;
