import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface TerminalProps {
  prompt?: string;
  welcomeMessage?: string;
  onCommand?: (command: string) => string | void;
}

const TerminalContainer = styled.div`
  background-color: #1e1e1e;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  height: 500px;
  overflow-y: auto;
  border: 2px solid #00ff00;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #2e2e2e;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 5px;
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #00ff00;
`;

const TerminalButton = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 8px;
  cursor: pointer;
`;

const TerminalTitle = styled.span`
  margin-left: 10px;
  font-size: 14px;
  opacity: 0.8;
`;

const TerminalOutput = styled.div`
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const TerminalInputLine = styled.div`
  display: flex;
  align-items: center;
`;

const TerminalPrompt = styled.span`
  color: #00ff00;
  margin-right: 8px;
  font-weight: bold;
`;

const TerminalInput = styled.input`
  background: transparent;
  border: none;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  outline: none;
  flex: 1;
  caret-color: #00ff00;

  &::selection {
    background-color: #00ff00;
    color: #1e1e1e;
  }
`;

const HistoryLine = styled.div`
  margin-bottom: 5px;
`;

const Terminal: React.FC<TerminalProps> = ({
  prompt = '>',
  welcomeMessage = 'Terminal ready. Type "help" for available commands.',
  onCommand
}) => {
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output', content: string }>>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (welcomeMessage) {
      setHistory([{ type: 'output', content: welcomeMessage }]);
    }
  }, [welcomeMessage]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: 'input', content: `${prompt} ${trimmedCmd}` }]);
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // Built-in commands
    let output = '';
    if (trimmedCmd.toLowerCase() === 'clear') {
      setHistory([]);
      return;
    } else if (trimmedCmd.toLowerCase() === 'help') {
      output = `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  echo     - Echo text back
  date     - Show current date and time

Type any command to get started!`;
    } else if (trimmedCmd.toLowerCase().startsWith('echo ')) {
      output = trimmedCmd.substring(5);
    } else if (trimmedCmd.toLowerCase() === 'date') {
      output = new Date().toString();
    } else if (onCommand) {
      const result = onCommand(trimmedCmd);
      output = result || `Command not recognized: ${trimmedCmd}`;
    } else {
      output = `Command not recognized: ${trimmedCmd}. Type "help" for available commands.`;
    }

    if (output) {
      setHistory(prev => [...prev, { type: 'output', content: output }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <TerminalContainer
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
    >
      <TerminalHeader>
        <TerminalButton color="#ff5f56" />
        <TerminalButton color="#ffbd2e" />
        <TerminalButton color="#27c93f" />
        <TerminalTitle>terminal@vibe-kanban</TerminalTitle>
      </TerminalHeader>

      {history.map((item, index) => (
        <HistoryLine key={index}>
          {item.type === 'input' ? (
            <span style={{ color: '#00ff00' }}>{item.content}</span>
          ) : (
            <TerminalOutput style={{ color: '#ffffff', opacity: 0.9 }}>
              {item.content}
            </TerminalOutput>
          )}
        </HistoryLine>
      ))}

      <TerminalInputLine>
        <TerminalPrompt>{prompt}</TerminalPrompt>
        <TerminalInput
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </TerminalInputLine>
    </TerminalContainer>
  );
};

export default Terminal;
