/**
 * Command Parser
 * Parses terminal input into structured commands with BBS-style syntax
 */

import type { ParsedCommand } from './types';

/**
 * Parse raw terminal input into a structured command
 * Supports quoted arguments and whitespace handling
 */
export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      name: '',
      args: [],
      rawInput: input,
    };
  }

  // Split on whitespace while preserving quoted strings
  const tokens: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = '';
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    tokens.push(current);
  }

  const [name, ...args] = tokens;

  return {
    name: name.toUpperCase(), // BBS commands are case-insensitive, normalize to uppercase
    args,
    rawInput: input,
  };
}

/**
 * Sanitize command input to prevent XSS and injection
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate command input length and characters
 */
export function validateInput(input: string): { valid: boolean; error?: string } {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: 'Empty command' };
  }

  if (input.length > 1000) {
    return { valid: false, error: 'Command too long (max 1000 characters)' };
  }

  // Allow alphanumeric, spaces, quotes, hyphens, underscores, slashes, and common punctuation
  const validPattern = /^[a-zA-Z0-9\s"'/_\-.,!?@#:]+$/;
  if (!validPattern.test(input)) {
    return { valid: false, error: 'Invalid characters in command' };
  }

  return { valid: true };
}
