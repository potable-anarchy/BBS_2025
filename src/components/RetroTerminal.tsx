import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { terminalTheme } from '../styles/theme';

// Terminal Container
const TerminalContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  background: ${terminalTheme.background.primary};
  border: ${terminalTheme.border.width} solid ${terminalTheme.border.color};
  border-radius: ${terminalTheme.border.radius};
  box-shadow: ${terminalTheme.effects.boxShadow};
  overflow: hidden;
  font-family: ${terminalTheme.fonts.primary};
`;

// Terminal Header
const TerminalHeader = styled.div`
  background: ${terminalTheme.background.secondary};
  padding: ${terminalTheme.spacing.sm} ${terminalTheme.spacing.md};
  border-bottom: ${terminalTheme.border.width} solid ${terminalTheme.border.color};
  display: flex;
  align-items: center;
  gap: ${terminalTheme.spacing.sm};
`;

// Window Control Buttons
const WindowControls = styled.div`
  display: flex;
  gap: ${terminalTheme.spacing.xs};
`;

const ControlButton = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 5px ${props => props.color};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 10px ${props => props.color};
  }
`;

// Terminal Title
const TerminalTitle = styled.div`
  color: ${terminalTheme.foreground.primary};
  font-size: ${terminalTheme.fontSize.sm};
  text-shadow: ${terminalTheme.effects.textGlow};
  flex: 1;
  text-align: center;
`;

// Terminal Body
const TerminalBody = styled.div`
  padding: ${terminalTheme.spacing.md};
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  background: ${terminalTheme.background.primary};
`;

// Output Line
const OutputLine = styled.div<{ color?: string }>`
  color: ${props => props.color || terminalTheme.foreground.primary};
  font-size: ${terminalTheme.fontSize.base};
  line-height: 1.5;
  margin-bottom: ${terminalTheme.spacing.xs};
  white-space: pre-wrap;
  word-wrap: break-word;
`;

// Input Container
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${terminalTheme.spacing.sm};
  margin-top: ${terminalTheme.spacing.sm};
`;

// Prompt Symbol
const Prompt = styled.span`
  color: ${terminalTheme.foreground.primary};
  font-size: ${terminalTheme.fontSize.base};
  text-shadow: ${terminalTheme.effects.textGlow};
  user-select: none;
`;

// Input Field
const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${terminalTheme.foreground.primary};
  font-family: ${terminalTheme.fonts.primary};
  font-size: ${terminalTheme.fontSize.base};
  caret-color: ${terminalTheme.foreground.primary};

  &::placeholder {
    color: ${terminalTheme.foreground.muted};
  }
`;

// Cursor Blink Animation
const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: ${terminalTheme.foreground.primary};
  margin-left: 2px;
  animation: blink 1s step-end infinite;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

// Component Props
interface RetroTerminalProps {
  title?: string;
  onCommand?: (command: string) => void;
  initialOutput?: string[];
}

interface OutputEntry {
  text: string;
  color?: string;
}

export const RetroTerminal: React.FC<RetroTerminalProps> = ({
  title = 'RETRO TERMINAL v1.0',
  onCommand,
  initialOutput = [],
}) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<OutputEntry[]>(
    initialOutput.map(text => ({ text }))
  );
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addOutput = (text: string, color?: string) => {
    setOutput(prev => [...prev, { text, color }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add command to output
    addOutput(`>_ ${input}`, terminalTheme.colors.brightGreen);

    // Add to history
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    // Execute command callback
    if (onCommand) {
      onCommand(input);
    }

    // Clear input
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
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
    <TerminalContainer>
      <TerminalHeader>
        <WindowControls>
          <ControlButton color={terminalTheme.colors.red} />
          <ControlButton color={terminalTheme.colors.yellow} />
          <ControlButton color={terminalTheme.colors.green} />
        </WindowControls>
        <TerminalTitle>{title}</TerminalTitle>
      </TerminalHeader>

      <TerminalBody ref={bodyRef}>
        {/* Output Lines */}
        {output.map((entry, index) => (
          <OutputLine key={index} color={entry.color}>
            {entry.text}
          </OutputLine>
        ))}

        {/* Input Prompt */}
        <form onSubmit={handleSubmit}>
          <InputContainer>
            <Prompt>&gt;_</Prompt>
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              autoFocus
            />
            <Cursor />
          </InputContainer>
        </form>
      </TerminalBody>
    </TerminalContainer>
  );
};

export default RetroTerminal;
