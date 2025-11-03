import React, { useState } from 'react';
import styled from 'styled-components';
import RetroTerminal from './RetroTerminal';
import { terminalTheme, ansiColors } from '../styles/theme';

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

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${terminalTheme.spacing.md};
  width: 100%;
  max-width: 1200px;
  margin-top: ${terminalTheme.spacing.lg};
`;

const ColorSwatch = styled.div<{ color: string }>`
  background: ${props => props.color};
  padding: ${terminalTheme.spacing.md};
  border: ${terminalTheme.border.width} solid ${terminalTheme.border.color};
  border-radius: ${terminalTheme.border.radius};
  text-align: center;
  font-size: ${terminalTheme.fontSize.sm};
  color: ${terminalTheme.foreground.primary};
  text-shadow: 0 0 5px ${terminalTheme.background.primary};
`;

const ColorName = styled.div`
  font-weight: bold;
  margin-bottom: ${terminalTheme.spacing.xs};
`;

const ColorCode = styled.div`
  font-size: ${terminalTheme.fontSize.xs};
  opacity: 0.8;
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

      <Title style={{ fontSize: terminalTheme.fontSize.xl }}>
        ═══ ANSI Color Palette ═══
      </Title>

      <ColorPalette>
        {Object.entries(ansiColors).map(([name, color]) => (
          <ColorSwatch key={name} color={color}>
            <ColorName>{name}</ColorName>
            <ColorCode>{color}</ColorCode>
          </ColorSwatch>
        ))}
      </ColorPalette>
    </DemoContainer>
  );
};

export default RetroTerminalDemo;
