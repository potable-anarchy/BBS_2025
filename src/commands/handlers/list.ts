/**
 * LIST Command Handler
 * Lists boards or posts
 */

import type { CommandHandler, CommandContext, CommandResult } from '../types';
import * as fmt from '../formatter';

export const listCommand: CommandHandler = {
  name: 'LIST',
  description: 'List boards or posts',
  usage: 'LIST [boards|posts]',

  execute: async (args, context): Promise<CommandResult> => {
    const target = args[0]?.toLowerCase() || 'boards';

    if (target === 'boards') {
      return listBoards(context);
    } else if (target === 'posts') {
      return listPosts(context);
    } else {
      return {
        success: false,
        output: fmt.errorMessage(`Invalid target: ${target}. Use 'boards' or 'posts'.`),
        error: 'Invalid target',
      };
    }
  },
};

async function listBoards(_context: CommandContext): Promise<CommandResult> {
  // This will fetch actual boards from the database
  // For now, return mock data with BBS-style formatting
  const boards = [
    { id: 'general', name: 'General Discussion', posts: 42, users: 12 },
    { id: 'announcements', name: 'Announcements', posts: 8, users: 156 },
    { id: 'dev-chat', name: 'Development Chat', posts: 234, users: 18 },
    { id: 'support', name: 'Support & Help', posts: 67, users: 34 },
  ];

  const output = `
${fmt.header('AVAILABLE BOARDS')}

${fmt.table(
    ['Board ID', 'Name', 'Posts', 'Users'],
    boards.map(b => [
      b.id,
      b.name,
      b.posts.toString(),
      b.users.toString(),
    ])
  )}

${fmt.separator('─')}
${fmt.infoMessage(`Total boards: ${boards.length}`)}
${fmt.infoMessage(`Type ${fmt.ANSI.BRIGHT}JOIN <board_id>${fmt.ANSI.RESET} to join a board`)}
  `.trim();

  return {
    success: true,
    output,
    data: { boards },
  };
}

async function listPosts(context: CommandContext): Promise<CommandResult> {
  if (!context.boardId) {
    return {
      success: false,
      output: fmt.errorMessage('You must join a board first. Use: JOIN <board_id>'),
      error: 'No active board',
    };
  }

  // This will fetch actual posts from the database
  // For now, return mock data with BBS-style formatting
  const posts = [
    {
      id: 1,
      title: 'Welcome to Vibe Kanban!',
      author: 'admin',
      timestamp: new Date('2025-01-01T12:00:00Z'),
      replies: 5,
    },
    {
      id: 2,
      title: 'Feature request: Dark mode',
      author: 'user123',
      timestamp: new Date('2025-01-02T14:30:00Z'),
      replies: 12,
    },
    {
      id: 3,
      title: 'Bug: Terminal scrolling issue',
      author: 'debugger',
      timestamp: new Date('2025-01-03T09:15:00Z'),
      replies: 3,
    },
  ];

  const output = `
${fmt.header(`POSTS IN BOARD: ${context.boardId.toUpperCase()}`)}

${fmt.table(
    ['ID', 'Title', 'Author', 'Date', 'Replies'],
    posts.map(p => [
      p.id.toString(),
      p.title,
      p.author,
      fmt.formatTimestamp(p.timestamp),
      p.replies.toString(),
    ])
  )}

${fmt.separator('─')}
${fmt.infoMessage(`Total posts: ${posts.length}`)}
${fmt.infoMessage(`Type ${fmt.ANSI.BRIGHT}POST "title" "message"${fmt.ANSI.RESET} to create a new post`)}
  `.trim();

  return {
    success: true,
    output,
    data: { posts },
  };
}
