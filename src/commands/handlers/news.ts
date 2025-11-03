/**
 * NEWS Command Handler
 * Displays system bulletins from SYSOP-13
 */

import type { CommandHandler, CommandResult } from '../types';
import * as fmt from '../formatter';
import { api } from '../../services/api';
import type { Post } from '../../types/post';

export const newsCommand: CommandHandler = {
  name: 'NEWS',
  description: 'Display system bulletins from SYSOP-13',
  usage: 'NEWS [latest|all|daily|lore|announcement|system] [count]',
  aliases: ['BULLETIN', 'BULLETINS'],

  execute: async (args): Promise<CommandResult> => {
    const subcommand = args[0]?.toLowerCase() || 'latest';
    const count = parseInt(args[1]) || 10;

    try {
      let bulletins: Post[];

      switch (subcommand) {
        case 'latest':
          const latest = await api.getLatestBulletin();
          bulletins = latest ? [latest] : [];
          break;

        case 'all':
          bulletins = await api.getBulletins({ limit: count, includeUnpinned: true });
          break;

        case 'daily':
        case 'lore':
        case 'announcement':
        case 'system':
          bulletins = await api.getBulletinsByType(subcommand, count);
          break;

        default:
          return {
            success: false,
            output: fmt.errorMessage(`Unknown news subcommand: ${subcommand}`) + '\n' +
                    fmt.infoMessage('Valid options: latest, all, daily, lore, announcement, system'),
            error: 'Invalid subcommand'
          };
      }

      if (bulletins.length === 0) {
        return {
          success: true,
          output: fmt.warningMessage('No bulletins available.')
        };
      }

      return formatBulletins(bulletins, subcommand);

    } catch (error) {
      return {
        success: false,
        output: fmt.errorMessage(`Failed to retrieve bulletins: ${error instanceof Error ? error.message : 'Unknown error'}`),
        error: String(error)
      };
    }
  },
};

function formatBulletins(bulletins: Post[], filter: string): CommandResult {
  const title = filter === 'latest'
    ? 'LATEST SYSTEM BULLETIN'
    : `SYSTEM BULLETINS - ${filter.toUpperCase()}`;

  let output = fmt.header(title) + '\n\n';

  bulletins.forEach((bulletin, index) => {
    const isPinned = bulletin.is_pinned;
    const type = bulletin.bulletin_type || 'bulletin';
    const timestamp = new Date(bulletin.timestamp).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // Type color coding
    let typeColor = fmt.ANSI.FG_BRIGHT_GREEN;
    switch (type) {
      case 'daily': typeColor = fmt.ANSI.FG_BRIGHT_CYAN; break;
      case 'announcement': typeColor = fmt.ANSI.FG_BRIGHT_YELLOW; break;
      case 'lore': typeColor = fmt.ANSI.FG_BRIGHT_MAGENTA; break;
      case 'system': typeColor = fmt.ANSI.FG_BRIGHT_RED; break;
    }

    // Header line
    if (isPinned) {
      output += `${fmt.ANSI.FG_BRIGHT_YELLOW}[PINNED]${fmt.ANSI.RESET} `;
    }
    output += `${typeColor}[${type.toUpperCase()}]${fmt.ANSI.RESET} `;
    output += `${fmt.ANSI.FG_BRIGHT_WHITE}${bulletin.user}${fmt.ANSI.RESET} `;
    output += `${fmt.ANSI.FG_CYAN}${timestamp}${fmt.ANSI.RESET}\n`;

    // Message content (with proper line wrapping)
    const messageLines = bulletin.message.split('\n');
    messageLines.forEach(line => {
      output += `  ${line}\n`;
    });

    // Separator between bulletins
    if (index < bulletins.length - 1) {
      output += '\n' + fmt.separator('─') + '\n\n';
    }
  });

  output += '\n' + fmt.separator('─');
  output += `\n${fmt.ANSI.FG_CYAN}Total bulletins: ${bulletins.length}${fmt.ANSI.RESET}`;

  if (filter === 'latest') {
    output += `\n${fmt.ANSI.FG_CYAN}Use ${fmt.ANSI.BRIGHT}NEWS all${fmt.ANSI.RESET}${fmt.ANSI.FG_CYAN} to view all bulletins${fmt.ANSI.RESET}`;
  }

  return {
    success: true,
    output
  };
}
