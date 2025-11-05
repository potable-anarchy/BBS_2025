/**
 * Command System Types
 * Defines the structure for BBS-style terminal commands
 */

export interface CommandContext {
  sessionId: string;
  socketId?: string;
  username: string;
  boardId?: string;
  gameMode?: boolean;
  timestamp: string;
}

export interface CommandResult {
  success: boolean;
  output: string;
  data?: any;
  error?: string;
}

export interface ParsedCommand {
  name: string;
  args: string[];
  rawInput: string;
}

export interface CommandHandler {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  requiresAuth?: boolean;
  requiresBoard?: boolean;
  execute: (args: string[], context: CommandContext) => Promise<CommandResult> | CommandResult;
}

export interface CommandRegistry {
  [key: string]: CommandHandler;
}
