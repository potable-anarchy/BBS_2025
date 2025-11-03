import { useState } from 'react';
import styled from 'styled-components';
import Terminal from './components/Terminal';
import XTermTerminal from './components/XTermTerminal';
import RetroTerminalDemo from './components/RetroTerminalDemo';
import { GlobalStyles } from './styles/GlobalStyles';
import CRTScreen from './components/CRTScreen';
import type { CRTConfig } from './styles/crtEffects';

const AppContainer = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 48px;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  margin-bottom: 10px;
  font-family: 'Courier New', Courier, monospace;

  &::before {
    content: '> ';
    color: #00ff00;
  }
`;

const Subtitle = styled.p`
  color: #00ff00;
  opacity: 0.8;
  font-size: 16px;
`;

const TerminalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const TerminalSection = styled.section`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #00ff00;
  font-size: 20px;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #00ff00;
`;

const ToggleButton = styled.button`
  background-color: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 10px 20px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background-color: #00ff00;
    color: #1e1e1e;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const CRTControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const CRTLabel = styled.span`
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
`;

const SmallToggleButton = styled(ToggleButton)`
  margin: 0;
  padding: 8px 15px;
  font-size: 12px;
`;

type TerminalMode = 'retro' | 'custom' | 'xterm';

function App() {
  const [terminalMode, setTerminalMode] = useState<TerminalMode>('retro');
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [crtIntensity, setCrtIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [crtConfig, setCrtConfig] = useState<Partial<CRTConfig>>({
    scanlines: true,
    flicker: true,
    phosphorGlow: true,
    vignette: true,
    chromaticAberration: false,
    curvature: false,
    intensity: 'medium',
  });

  const handleCustomCommand = (command: string): string => {
    const cmd = command.toLowerCase().trim();

    if (cmd === 'whoami') {
      return 'vibe-kanban-user';
    } else if (cmd === 'pwd') {
      return '/home/vibe-kanban';
    } else if (cmd.startsWith('calc ')) {
      // Simple calculator without eval for security
      const expression = command.substring(5).trim();
      const match = expression.match(/^(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)$/);

      if (match) {
        const [, num1, operator, num2] = match;
        const a = parseFloat(num1);
        const b = parseFloat(num2);

        let result: number;
        switch (operator) {
          case '+': result = a + b; break;
          case '-': result = a - b; break;
          case '*': result = a * b; break;
          case '/': result = a / b; break;
          default: return 'Error: Invalid operator';
        }

        return `Result: ${result}`;
      }
      return 'Error: Invalid expression. Use format: calc 2 + 2';
    }

    return `Command not recognized: ${command}. Try "help" for available commands.`;
  };

  const toggleCrtIntensity = () => {
    const intensities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const currentIndex = intensities.indexOf(crtIntensity);
    const nextIndex = (currentIndex + 1) % intensities.length;
    const nextIntensity = intensities[nextIndex];
    setCrtIntensity(nextIntensity);
    setCrtConfig({ ...crtConfig, intensity: nextIntensity });
  };

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Header>
          <Title>Vibe Kanban Terminal</Title>
          <Subtitle>A terminal-style UI framework built with React + TypeScript</Subtitle>
        </Header>

        <ControlsContainer>
          <ToggleButton onClick={() => {
            const modes: TerminalMode[] = ['retro', 'custom', 'xterm'];
            const currentIndex = modes.indexOf(terminalMode);
            const nextIndex = (currentIndex + 1) % modes.length;
            setTerminalMode(modes[nextIndex]);
          }}>
            Terminal Mode: {terminalMode.toUpperCase()}
          </ToggleButton>

          <CRTControls>
            <CRTLabel>CRT Effects:</CRTLabel>
            <SmallToggleButton onClick={() => setCrtEnabled(!crtEnabled)}>
              {crtEnabled ? 'ON' : 'OFF'}
            </SmallToggleButton>
            {crtEnabled && (
              <SmallToggleButton onClick={toggleCrtIntensity}>
                Intensity: {crtIntensity.toUpperCase()}
              </SmallToggleButton>
            )}
          </CRTControls>
        </ControlsContainer>

        <CRTScreen enabled={crtEnabled} config={crtConfig}>
          {terminalMode === 'retro' ? (
            <RetroTerminalDemo />
          ) : terminalMode === 'custom' ? (
            <TerminalGrid>
              <TerminalSection>
                <SectionTitle>Custom Terminal Component</SectionTitle>
                <Terminal
                  prompt="$"
                  welcomeMessage={`Welcome to Vibe Kanban Terminal!
Version 1.0.0
Type "help" for available commands.

Try these custom commands:
  whoami  - Show current user
  pwd     - Print working directory
  calc    - Calculate expressions (e.g., calc 2 + 2)
`}
                  onCommand={handleCustomCommand}
                />
              </TerminalSection>

              <TerminalSection>
                <SectionTitle>Simple Terminal</SectionTitle>
                <Terminal
                  prompt=">"
                  welcomeMessage="Simple terminal ready. Type commands below:"
                />
              </TerminalSection>
            </TerminalGrid>
          ) : (
            <TerminalSection>
              <SectionTitle>XTerm-based Terminal</SectionTitle>
              <XTermTerminal
                welcomeMessage={`Welcome to XTerm Terminal!
Powered by @xterm/xterm
Type "help" for available commands.

`}
                onCommand={(cmd) => {
                  console.log('Command received:', cmd);
                }}
              />
            </TerminalSection>
          )}
        </CRTScreen>
      </AppContainer>
    </>
  );
}

export default App;
