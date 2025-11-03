import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import styled from 'styled-components';

interface XTermTerminalProps {
  onCommand?: (command: string) => void;
  welcomeMessage?: string;
}

const TerminalWrapper = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  border: 2px solid #00ff00;

  .xterm {
    height: 500px;
  }

  .xterm-viewport {
    background-color: transparent !important;
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
  color: #00ff00;
  opacity: 0.8;
`;

const XTermTerminal: React.FC<XTermTerminalProps> = ({
  onCommand,
  welcomeMessage = 'XTerm Terminal ready. Type "help" for available commands.\r\n'
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const currentLineRef = useRef<string>('');

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#00ff00',
        cursor: '#00ff00',
        cursorAccent: '#1e1e1e',
        selectionBackground: '#00ff00',
        selectionForeground: '#1e1e1e',
        black: '#000000',
        red: '#ff5555',
        green: '#00ff00',
        yellow: '#ffff55',
        blue: '#5555ff',
        magenta: '#ff55ff',
        cyan: '#55ffff',
        white: '#ffffff',
        brightBlack: '#555555',
        brightRed: '#ff5555',
        brightGreen: '#55ff55',
        brightYellow: '#ffff55',
        brightBlue: '#5555ff',
        brightMagenta: '#ff55ff',
        brightCyan: '#55ffff',
        brightWhite: '#ffffff'
      },
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: 14,
      lineHeight: 1.2,
      rows: 25,
      cols: 80
    });

    term.open(terminalRef.current);
    xtermRef.current = term;

    // Write welcome message
    term.write(welcomeMessage);
    term.write('> ');

    // Handle input
    term.onData((data) => {
      const code = data.charCodeAt(0);

      // Handle Enter key
      if (code === 13) {
        term.write('\r\n');
        const command = currentLineRef.current.trim();

        if (command) {
          handleCommand(term, command, onCommand);
        }

        currentLineRef.current = '';
        term.write('> ');
      }
      // Handle backspace
      else if (code === 127) {
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          term.write('\b \b');
        }
      }
      // Handle regular characters
      else if (code >= 32 && code < 127) {
        currentLineRef.current += data;
        term.write(data);
      }
    });

    return () => {
      term.dispose();
    };
  }, [welcomeMessage, onCommand]);

  const handleCommand = (term: XTerm, command: string, callback?: (command: string) => void) => {
    if (command.toLowerCase() === 'clear') {
      term.clear();
    } else if (command.toLowerCase() === 'help') {
      term.write('Available commands:\r\n');
      term.write('  help     - Show this help message\r\n');
      term.write('  clear    - Clear the terminal\r\n');
      term.write('  echo     - Echo text back\r\n');
      term.write('  date     - Show current date and time\r\n');
      term.write('\r\n');
    } else if (command.toLowerCase().startsWith('echo ')) {
      term.write(command.substring(5) + '\r\n');
    } else if (command.toLowerCase() === 'date') {
      term.write(new Date().toString() + '\r\n');
    } else if (callback) {
      callback(command);
    } else {
      term.write(`Command not recognized: ${command}\r\n`);
      term.write('Type "help" for available commands.\r\n');
    }
  };

  return (
    <TerminalWrapper>
      <TerminalHeader>
        <TerminalButton color="#ff5f56" />
        <TerminalButton color="#ffbd2e" />
        <TerminalButton color="#27c93f" />
        <TerminalTitle>xterm@vibe-kanban</TerminalTitle>
      </TerminalHeader>
      <div ref={terminalRef} />
    </TerminalWrapper>
  );
};

export default XTermTerminal;
