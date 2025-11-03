/**
 * Command Registry
 * Manages registration and lookup of command handlers
 */

import type { CommandHandler, CommandRegistry } from './types';
import { helpCommand, joinCommand, listCommand, postCommand, newsCommand, chatHandler } from './handlers';

class CommandRegistryManager {
  private commands: CommandRegistry = {};

  constructor() {
    // Register built-in commands
    this.register(helpCommand);
    this.register(joinCommand);
    this.register(listCommand);
    this.register(postCommand);
    this.register(newsCommand);
    this.register(chatHandler);
  }

  /**
   * Register a command handler
   */
  register(handler: CommandHandler): void {
    this.commands[handler.name] = handler;

    // Register aliases
    if (handler.aliases) {
      handler.aliases.forEach(alias => {
        this.commands[alias.toUpperCase()] = handler;
      });
    }
  }

  /**
   * Get a command handler by name
   */
  get(name: string): CommandHandler | undefined {
    return this.commands[name.toUpperCase()];
  }

  /**
   * Check if a command exists
   */
  has(name: string): boolean {
    return name.toUpperCase() in this.commands;
  }

  /**
   * Get all registered commands (excluding aliases)
   */
  getAll(): CommandHandler[] {
    const seen = new Set<string>();
    const handlers: CommandHandler[] = [];

    Object.values(this.commands).forEach(handler => {
      if (!seen.has(handler.name)) {
        seen.add(handler.name);
        handlers.push(handler);
      }
    });

    return handlers;
  }

  /**
   * Unregister a command
   */
  unregister(name: string): void {
    const handler = this.commands[name.toUpperCase()];
    if (handler) {
      delete this.commands[handler.name];
      handler.aliases?.forEach(alias => {
        delete this.commands[alias.toUpperCase()];
      });
    }
  }
}

// Export singleton instance
export const commandRegistry = new CommandRegistryManager();
