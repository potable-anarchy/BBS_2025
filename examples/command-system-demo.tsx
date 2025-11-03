/**
 * Command System Demo
 * Example of using the command system with Terminal component
 */

import React from 'react';
import { CommandTerminal } from '../src/components/CommandTerminal';

export default function CommandSystemDemo() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <CommandTerminal
        username="demo_user"
        serverUrl="http://localhost:3001"
      />
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 *
 * Basic Commands:
 * ---------------
 * > HELP                    - Show all available commands
 * > HELP JOIN               - Get help for JOIN command
 * > LIST boards             - List all available boards
 * > JOIN general            - Join the general discussion board
 * > LIST posts              - List posts in current board
 * > POST "Hello" "World"    - Create a new post
 * > CLEAR                   - Clear terminal screen
 * > WHOAMI                  - Show user information
 * > EXIT                    - Exit current board
 *
 * Advanced Usage:
 * ---------------
 * > LIST                    - Defaults to LIST boards
 * > ?                       - Alias for HELP
 * > COMMANDS                - Alias for HELP
 * > QUIT                    - Alias for EXIT
 *
 * Multi-word Arguments:
 * --------------------
 * > POST "Bug Report" "Found a critical issue in the login system"
 * > POST "Feature Request" "Add dark mode support"
 *
 * Command Chaining (Future):
 * -------------------------
 * > JOIN general && LIST posts
 * > POST "Quick Note" && EXIT
 */
