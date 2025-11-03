import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import type { ChatMessage } from '../types/chat';

interface ChatFeedProps {
  socket: any;
  currentUsername?: string;
  maxMessages?: number;
}

const ChatFeed: React.FC<ChatFeedProps> = ({
  socket,
  currentUsername,
  maxMessages = 100
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Smooth scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current && autoScroll) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  }, [autoScroll]);

  // Check if user is near bottom of chat
  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom

    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Handle scroll events to detect manual scrolling
  const handleScroll = useCallback(() => {
    const nearBottom = isNearBottom();
    setAutoScroll(nearBottom);
  }, [isNearBottom]);

  // Request chat history on mount
  useEffect(() => {
    if (!socket) return;

    socket.emit('chat:history', { limit: 50 });

    // Listen for chat history
    const handleHistory = (history: ChatMessage[]) => {
      setMessages(history);
      // Scroll to bottom without animation on initial load
      setTimeout(() => scrollToBottom(false), 100);
    };

    // Listen for new messages
    const handleMessage = (message: ChatMessage) => {
      setMessages(prev => {
        const updated = [...prev, message];
        // Keep only the last maxMessages
        if (updated.length > maxMessages) {
          return updated.slice(updated.length - maxMessages);
        }
        return updated;
      });
    };

    // Listen for errors
    const handleError = (error: { error: string }) => {
      console.error('Chat error:', error.error);
    };

    socket.on('chat:history', handleHistory);
    socket.on('chat:message', handleMessage);
    socket.on('chat:error', handleError);

    return () => {
      socket.off('chat:history', handleHistory);
      socket.off('chat:message', handleMessage);
      socket.off('chat:error', handleError);
    };
  }, [socket, maxMessages, scrollToBottom]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !socket) return;

    socket.emit('chat:send', { message: inputValue.trim() });
    setInputValue('');
  }, [inputValue, socket]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  }, [handleSendMessage]);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <HeaderTitle>GLOBAL CHAT</HeaderTitle>
        <OnlineIndicator>● LIVE</OnlineIndicator>
      </ChatHeader>

      <MessagesContainer
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((msg, index) => (
          <MessageRow key={`${msg.id}-${index}`}>
            <Timestamp>{formatTimestamp(msg.timestamp)}</Timestamp>
            <Username color={msg.userColor}>
              {msg.user === currentUsername ? 'YOU' : msg.user}
            </Username>
            <MessageText>{msg.message}</MessageText>
          </MessageRow>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {!autoScroll && (
        <ScrollPrompt onClick={() => {
          setAutoScroll(true);
          scrollToBottom(true);
        }}>
          ↓ New messages ↓
        </ScrollPrompt>
      )}

      <InputContainer onSubmit={handleSendMessage}>
        <ChatPrompt>&gt;</ChatPrompt>
        <ChatInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          maxLength={500}
          autoComplete="off"
        />
      </InputContainer>
    </ChatContainer>
  );
};

// Styled Components
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  position: relative;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 255, 0, 0.1);
  border-bottom: 1px solid ${props => props.theme.colors.primary};
`;

const HeaderTitle = styled.div`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  text-shadow: 0 0 8px ${props => props.theme.colors.primary};
  letter-spacing: 2px;
`;

const OnlineIndicator = styled.div`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 12px;
  color: #00ff00;
  text-shadow: 0 0 8px #00ff00;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  font-family: ${props => props.theme.fonts.mono};
  line-height: 1.6;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.secondary};
    }
  }

  /* Smooth scrolling */
  scroll-behavior: smooth;
`;

const MessageRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Timestamp = styled.span`
  color: ${props => props.theme.colors.secondary};
  font-size: 12px;
  flex-shrink: 0;
  min-width: 45px;
`;

const Username = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: bold;
  text-shadow: 0 0 4px ${props => props.color};
  flex-shrink: 0;
  min-width: 120px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::after {
    content: ':';
    margin-left: 2px;
  }
`;

const MessageText = styled.span`
  color: ${props => props.theme.colors.foreground};
  word-wrap: break-word;
  flex: 1;
`;

const ScrollPrompt = styled.button`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 10px ${props => props.theme.colors.primary};
  animation: bounce 1s infinite;

  &:hover {
    background: ${props => props.theme.colors.secondary};
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-5px); }
  }
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid ${props => props.theme.colors.primary};
  gap: 8px;
`;

const ChatPrompt = styled.span`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.mono};
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 8px ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

const ChatInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${props => props.theme.colors.foreground};
  font-family: ${props => props.theme.fonts.mono};
  font-size: 14px;
  padding: 4px;

  &::placeholder {
    color: ${props => props.theme.colors.secondary};
    opacity: 0.5;
  }

  &:focus {
    background: rgba(0, 255, 0, 0.05);
  }
`;

export default ChatFeed;
