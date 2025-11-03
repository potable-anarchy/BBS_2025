/**
 * CommandTerminal Component
 * Terminal component with integrated command system
 */

import React, { useState, useCallback } from 'react';
import { Terminal } from './Terminal';
import { useCommandSystem } from '../hooks/useCommandSystem';

interface CommandTerminalProps {
  username?: string;
  boardId?: string;
  serverUrl?: string;
  welcomeMessage?: string;
}

export const CommandTerminal: React.FC<CommandTerminalProps> = ({
  username = 'Anonymous',
  boardId,
  serverUrl,
  welcomeMessage,
}) => {
  const { executeCommand, currentBoard, isConnected } = useCommandSystem({
    username,
    boardId,
    serverUrl,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Handle command execution
  const handleCommand = useCallback(
    async (input: string): Promise<string> => {
      if (isProcessing) {
        return 'Command in progress, please wait...';
      }

      setIsProcessing(true);

      try {
        const result = await executeCommand(input);
        return result.output;
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      } finally {
        setIsProcessing(false);
      }
    },
    [executeCommand, isProcessing]
  );

  // Create welcome message with BBS styling
  const getWelcomeMessage = useCallback(() => {
    if (welcomeMessage) {
      return welcomeMessage;
    }

    return `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   ██╗   ██╗██╗██████╗ ███████╗    ██╗  ██╗ █████╗ ███╗   ██╗██████╗ █████╗ ███╗   ██╗
║   ██║   ██║██║██╔══██╗██╔════╝    ██║ ██╔╝██╔══██╗████╗  ██║██╔══██╗██╔══██╗████╗  ██║
║   ██║   ██║██║██████╔╝█████╗      █████╔╝ ███████║██╔██╗ ██║██████╔╝███████║██╔██╗ ██║
║   ╚██╗ ██╔╝██║██╔══██╗██╔══╝      ██╔═██╗ ██╔══██║██║╚██╗██║██╔══██╗██╔══██║██║╚██╗██║
║    ╚████╔╝ ██║██████╔╝███████╗    ██║  ██╗██║  ██║██║ ╚████║██████╔╝██║  ██║██║ ╚████║
║     ╚═══╝  ╚═╝╚═════╝ ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
║                                                                           ║
║                         Terminal BBS - v1.0                               ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

Welcome, ${username}!

Connected: ${isConnected ? '✓ YES' : '✗ NO'}
Current Board: ${currentBoard || 'None'}

Type HELP for available commands.
Type JOIN <board_id> to join a discussion board.

───────────────────────────────────────────────────────────────────────────
`;
  }, [username, currentBoard, isConnected, welcomeMessage]);

  // Create prompt based on current board
  const getPrompt = useCallback(() => {
    if (currentBoard) {
      return `[${currentBoard}] > `;
    }
    return '> ';
  }, [currentBoard]);

  return (
    <Terminal
      prompt={getPrompt()}
      welcomeMessage={getWelcomeMessage()}
      onCommand={handleCommand}
    />
  );
};
