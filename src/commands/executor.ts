/**
 * Command Executor
 * Executes commands with validation and error handling
 */

import { parseCommand, validateInput, sanitizeInput } from './parser';
import { commandRegistry } from './registry';
import type { CommandContext, CommandResult } from './types';
import * as fmt from './formatter';

export class CommandExecutor {
  /**
   * Execute a command from raw input
   */
  async execute(rawInput: string, context: CommandContext): Promise<CommandResult> {
    // Check if we're in game mode - if so, route ALL input to the game handler
    if (context.gameMode) {
      const gameHandler = commandRegistry.get('LORD');
      if (gameHandler) {
        // Pass the entire raw input as args to the game
        const args = rawInput.trim().split(/\s+/);
        return await gameHandler.execute(args, context);
      }
    }

    // Sanitize input
    const sanitized = sanitizeInput(rawInput);

    // Validate input
    const validation = validateInput(sanitized);
    if (!validation.valid) {
      return {
        success: false,
        output: fmt.errorMessage(validation.error || 'Invalid input'),
        error: validation.error,
      };
    }

    // Parse command
    const parsed = parseCommand(sanitized);

    if (!parsed.name) {
      return {
        success: false,
        output: fmt.errorMessage('Empty command'),
        error: 'Empty command',
      };
    }

    // Get command handler
    const handler = commandRegistry.get(parsed.name);

    if (!handler) {
      return {
        success: false,
        output: fmt.errorMessage(`Unknown command: ${parsed.name}. Type HELP for available commands.`),
        error: 'Unknown command',
      };
    }

    // Check authentication requirement
    if (handler.requiresAuth && !context.username) {
      return {
        success: false,
        output: fmt.errorMessage('Authentication required for this command'),
        error: 'Authentication required',
      };
    }

    // Check board requirement
    if (handler.requiresBoard && !context.boardId) {
      return {
        success: false,
        output: fmt.errorMessage('You must join a board first. Use: JOIN <board_id>'),
        error: 'Board required',
      };
    }

    // Execute command
    try {
      const result = await handler.execute(parsed.args, context);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        output: fmt.errorMessage(`Command execution failed: ${errorMessage}`),
        error: errorMessage,
      };
    }
  }

  /**
   * Get available commands for the current context
   */
  getAvailableCommands(context: CommandContext): string[] {
    return commandRegistry.getAll()
      .filter(handler => {
        if (handler.requiresAuth && !context.username) return false;
        if (handler.requiresBoard && !context.boardId) return false;
        return true;
      })
      .map(handler => handler.name);
  }
}

// Export singleton instance
export const commandExecutor = new CommandExecutor();
