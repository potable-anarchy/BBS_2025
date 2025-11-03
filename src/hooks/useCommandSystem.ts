/**
 * useCommandSystem Hook
 * React hook for integrating command system with Terminal component
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import type { CommandContext, CommandResult } from '../commands';
import { commandExecutor } from '../commands';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

interface CommandSystemConfig {
  username?: string;
  boardId?: string;
  serverUrl?: string;
}

export function useCommandSystem(config: CommandSystemConfig = {}) {
  const [currentBoard, setCurrentBoard] = useState<string | undefined>(config.boardId);
  const [username, setUsername] = useState<string>(config.username || 'Anonymous');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const serverUrl = config.serverUrl || 'http://localhost:3001';
    const socket = io(`${serverUrl}/commands`, {
      auth: {
        username,
      },
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Command system connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Command system disconnected');
    });

    socket.on('command:board_joined', (data) => {
      setCurrentBoard(data.boardId);
    });

    socket.on('command:error', (data) => {
      console.error('Command error:', data.error);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [username, config.serverUrl]);

  // Execute command
  const executeCommand = useCallback(
    async (input: string): Promise<CommandResult> => {
      const context: CommandContext = {
        sessionId: socketRef.current?.id || 'local',
        socketId: socketRef.current?.id,
        username,
        boardId: currentBoard,
        timestamp: new Date().toISOString(),
      };

      // Execute command locally
      const result = await commandExecutor.execute(input, context);

      // If command was successful and has data, emit to server
      if (result.success && socketRef.current?.connected) {
        // Handle JOIN command separately
        if (input.toUpperCase().startsWith('JOIN ')) {
          const boardId = result.data?.boardId;
          if (boardId) {
            socketRef.current.emit('command:join_board', { boardId });
          }
        } else {
          // Emit command execution to server for logging
          socketRef.current.emit('command:execute', {
            command: input.split(' ')[0],
            args: input.split(' ').slice(1),
            boardId: currentBoard,
          });
        }
      }

      return result;
    },
    [username, currentBoard]
  );

  // Get available commands for current context
  const getAvailableCommands = useCallback((): string[] => {
    const context: CommandContext = {
      sessionId: socketRef.current?.id || 'local',
      username,
      boardId: currentBoard,
      timestamp: new Date().toISOString(),
    };
    return commandExecutor.getAvailableCommands(context);
  }, [username, currentBoard]);

  return {
    executeCommand,
    getAvailableCommands,
    currentBoard,
    username,
    isConnected,
    setUsername,
  };
}
