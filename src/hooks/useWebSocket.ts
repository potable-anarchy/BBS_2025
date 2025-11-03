/**
 * WebSocket hook for managing Socket.IO connection
 */

import { useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { ConnectionStatus } from '../context/AuthContext';
import type { UserSession } from '../utils/sessionStorage';

interface UseWebSocketOptions {
  session: UserSession | null;
  onConnectionChange: (status: ConnectionStatus) => void;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function useWebSocket({ session, onConnectionChange }: UseWebSocketOptions) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Don't connect if no session
    if (!session) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Create socket connection with authentication
    onConnectionChange(ConnectionStatus.CONNECTING);

    const socket = io(SOCKET_URL, {
      auth: {
        userId: session.sessionId,
        username: session.handle,
        boardId: 'default', // Can be changed based on board navigation
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
      onConnectionChange(ConnectionStatus.CONNECTED);
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      onConnectionChange(ConnectionStatus.DISCONNECTED);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      onConnectionChange(ConnectionStatus.ERROR);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
      onConnectionChange(ConnectionStatus.CONNECTED);
    });

    socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
      onConnectionChange(ConnectionStatus.CONNECTING);
    });

    socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
      onConnectionChange(ConnectionStatus.ERROR);
    });

    // Cleanup on unmount or session change
    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [session, onConnectionChange]);

  return socketRef.current;
}
