import React, { useState } from 'react';
import styled from 'styled-components';
import RetroTerminal from './RetroTerminal';
import { terminalTheme } from '../styles/theme';

const DemoContainer = styled.div`
  padding: ${terminalTheme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${terminalTheme.spacing.lg};
`;

const Title = styled.h1`
  font-family: ${terminalTheme.fonts.retro};
  font-size: ${terminalTheme.fontSize.xxl};
  color: ${terminalTheme.foreground.primary};
  text-shadow: ${terminalTheme.effects.textGlow};
  text-align: center;
  margin-bottom: ${terminalTheme.spacing.md};
`;

const Subtitle = styled.p`
  font-family: ${terminalTheme.fonts.primary};
  font-size: ${terminalTheme.fontSize.base};
  color: ${terminalTheme.foreground.secondary};
  text-align: center;
  max-width: 600px;
`;

export const RetroTerminalDemo: React.FC = () => {
  const [terminalKey, setTerminalKey] = useState(0);

  const initialOutput = [
    '╔═══════════════════════════════════════════════════════════╗',
    '║  RETRO TERMINAL SYSTEM v1.0                               ║',
    '║  Featuring ANSI 16-Color Palette & Monospaced Fonts       ║',
    '╚═══════════════════════════════════════════════════════════╝',
    '',
    'System initialized successfully.',
    'Type "help" for available commands.',
    '',
  ];

  const handleCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();

    // This would typically be handled by the terminal component itself
    // but for demo purposes, we're showing how to interact with it
    console.log('Command received:', cmd);

    // Example: Reset terminal
    if (cmd === 'clear') {
      setTerminalKey(prev => prev + 1);
    }
  };

  return (
    <DemoContainer>
      <Title>╔═══ RETRO TERMINAL UI ═══╗</Title>
      <Subtitle>
        Featuring Cascadia Mono &amp; VT323 monospaced fonts with authentic ANSI 16-color palette
      </Subtitle>

      <RetroTerminal
        key={terminalKey}
        title="VIBE KANBAN TERMINAL"
        onCommand={handleCommand}
        initialOutput={initialOutput}
      />
    </DemoContainer>
  );
};

export default RetroTerminalDemo;
