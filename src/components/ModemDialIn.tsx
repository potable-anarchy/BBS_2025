import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { terminalTheme } from '../styles/theme';

// Animations
const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

// Styled Components
const DialInContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: ${terminalTheme.background.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: ${terminalTheme.fonts.primary};
  color: ${terminalTheme.foreground.primary};
  overflow: hidden;
  position: relative;
`;

const TerminalScreen = styled.div`
  width: 90%;
  max-width: 1000px;
  background: ${terminalTheme.background.primary};
  border: ${terminalTheme.border.width} solid ${terminalTheme.border.color};
  border-radius: ${terminalTheme.border.radius};
  box-shadow: ${terminalTheme.effects.boxShadow};
  padding: 2rem;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-in;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease-in;
`;

const LogoText = styled.pre`
  font-family: ${terminalTheme.fonts.primary};
  font-size: 10px;
  line-height: 1.2;
  color: ${terminalTheme.foreground.primary};
  text-shadow: ${terminalTheme.effects.textGlow};
  margin: 0;
  white-space: pre;
`;

const ModemOutput = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

const ModemLine = styled.div<{ delay?: number; glitchEffect?: boolean }>`
  font-family: ${terminalTheme.fonts.primary};
  font-size: ${terminalTheme.fontSize.base};
  line-height: 1.6;
  color: ${terminalTheme.foreground.primary};
  margin-bottom: 0.3rem;
  animation: ${fadeIn} 0.2s ease-in;
  animation-delay: ${props => props.delay || 0}ms;
  animation-fill-mode: both;
  ${props => props.glitchEffect && `animation: ${glitch} 0.3s ease-in-out;`}
`;

const HandshakeNoise = styled.div`
  font-family: ${terminalTheme.fonts.primary};
  font-size: ${terminalTheme.fontSize.sm};
  color: ${terminalTheme.colors.yellow};
  letter-spacing: 2px;
  margin: 0.5rem 0;
  line-height: 1.4;
`;

const StatusLine = styled.div<{ status: 'connecting' | 'connected' | 'error' }>`
  font-family: ${terminalTheme.fonts.primary};
  font-size: ${terminalTheme.fontSize.lg};
  font-weight: bold;
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  border: 2px solid ${props =>
    props.status === 'connected' ? terminalTheme.colors.brightGreen :
    props.status === 'error' ? terminalTheme.colors.red :
    terminalTheme.colors.yellow
  };
  color: ${props =>
    props.status === 'connected' ? terminalTheme.colors.brightGreen :
    props.status === 'error' ? terminalTheme.colors.red :
    terminalTheme.colors.yellow
  };
  background: ${props =>
    props.status === 'connected' ? 'rgba(0, 255, 0, 0.1)' :
    props.status === 'error' ? 'rgba(255, 0, 0, 0.1)' :
    'rgba(255, 255, 0, 0.1)'
  };
  text-shadow: 0 0 10px currentColor;
  animation: ${blink} 1s infinite;
  animation-delay: ${props => props.status === 'connected' ? '0s' : '0s'};
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: ${terminalTheme.foreground.primary};
  margin-left: 4px;
  animation: ${blink} 1s step-end infinite;
  vertical-align: text-bottom;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  border: 1px solid ${terminalTheme.border.color};
  margin: 1rem 0;
  position: relative;
  background: ${terminalTheme.background.secondary};
`;

const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background: ${terminalTheme.colors.brightGreen};
  transition: width 0.3s ease;
  box-shadow: 0 0 10px ${terminalTheme.colors.brightGreen};
`;

const PressKeyPrompt = styled.div`
  text-align: center;
  font-size: ${terminalTheme.fontSize.base};
  color: ${terminalTheme.foreground.primary};
  margin-top: 2rem;
  animation: ${blink} 1.5s infinite;
`;

// Component Interface
interface ModemDialInProps {
  onComplete?: () => void;
  phoneNumber?: string;
}

// Modem handshake simulation stages
type DialInStage =
  | 'initial'
  | 'dialing'
  | 'handshake1'
  | 'handshake2'
  | 'handshake3'
  | 'negotiating'
  | 'connected'
  | 'ready';

export const ModemDialIn: React.FC<ModemDialInProps> = ({
  onComplete,
  phoneNumber = '555-DEAD'
}) => {
  const [stage, setStage] = useState<DialInStage>('initial');
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Add a new line to the output
  const addLine = (text: string) => {
    setLines(prev => [...prev, text]);
  };

  // Simulate modem sounds with Web Audio API (visual representation)
  const playModemSound = (type: 'dial' | 'handshake' | 'carrier') => {
    // This is a visual representation of the sounds
    // In a real implementation, you could use Web Audio API to generate tones
    const sounds: { [key: string]: string[] } = {
      dial: [
        '♪ BEEP... BEEP... BEEP...',
        '♫ Dialing...'
      ],
      handshake: [
        '◊◊◊ KSHHHHhhhhh ◊◊◊',
        '≋≋≋ BEEEEeeeep SCREECH ≋≋≋',
        '∿∿∿ WhIRRRrrr CRACKle ∿∿∿',
        '≈≈≈ BZZZzzzzz POP ≈≈≈',
        '~~~~ EEEEEeeee HISS ~~~~'
      ],
      carrier: [
        '♪♫ Carrier detected ♫♪'
      ]
    };

    return sounds[type];
  };

  // Simulation sequence
  useEffect(() => {
    const runDialInSequence = async () => {
      // Initial
      if (stage === 'initial') {
        addLine('');
        addLine('╔══════════════════════════════════════════════════════════════════╗');
        addLine('║              MODEM CONNECTION INITIALIZING...                    ║');
        addLine('╚══════════════════════════════════════════════════════════════════╝');
        addLine('');

        setTimeout(() => setStage('dialing'), 1500);
      }

      // Dialing
      if (stage === 'dialing') {
        addLine(`ATD ${phoneNumber}`);
        addLine('');
        setProgress(10);

        setTimeout(() => {
          playModemSound('dial').forEach((sound, i) => {
            setTimeout(() => addLine(sound), i * 500);
          });
        }, 500);

        setTimeout(() => {
          addLine('');
          addLine('◊ Connecting to The Dead Net...');
          setStage('handshake1');
        }, 2000);
      }

      // Handshake Phase 1
      if (stage === 'handshake1') {
        setProgress(25);
        addLine('');
        addLine('>>> HANDSHAKE INITIATED <<<');
        addLine('');

        setTimeout(() => {
          const noises = playModemSound('handshake');
          noises.forEach((noise, i) => {
            setTimeout(() => addLine(noise), i * 400);
          });
        }, 500);

        setTimeout(() => setStage('handshake2'), 3000);
      }

      // Handshake Phase 2
      if (stage === 'handshake2') {
        setProgress(50);
        addLine('');
        addLine('▓ Negotiating protocol...');
        addLine('▓ V.90 Protocol detected');
        addLine('▓ Error correction: ENABLED');
        addLine('▓ Data compression: ENABLED');

        setTimeout(() => setStage('handshake3'), 2000);
      }

      // Handshake Phase 3
      if (stage === 'handshake3') {
        setProgress(75);
        addLine('');
        addLine('♫ Training carrier...');
        playModemSound('carrier').forEach((sound) => addLine(sound));
        addLine('');
        addLine('■ Equalizer training: OK');
        addLine('■ Echo cancellation: OK');
        addLine('■ Signal quality: EXCELLENT');

        setTimeout(() => setStage('negotiating'), 2000);
      }

      // Negotiating
      if (stage === 'negotiating') {
        setProgress(90);
        addLine('');
        addLine('═══════════════════════════════════════════════════');
        addLine('  Negotiating connection speed...');
        addLine('  Testing line quality...');

        setTimeout(() => {
          addLine('');
          addLine('  Speed selected: 56000 bps');
          addLine('═══════════════════════════════════════════════════');
          setStage('connected');
        }, 2000);
      }

      // Connected
      if (stage === 'connected') {
        setProgress(100);
        setShowCursor(false);

        setTimeout(() => setStage('ready'), 1500);
      }
    };

    runDialInSequence();
  }, [stage, phoneNumber]);

  // Handle key press to continue
  useEffect(() => {
    if (stage === 'ready') {
      const handleKeyPress = () => {
        if (onComplete) {
          onComplete();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [stage, onComplete]);

  return (
    <DialInContainer>
      <TerminalScreen>
        {/* Logo */}
        <LogoContainer>
          <LogoText>
{`
  ████████╗██╗  ██╗███████╗    ██████╗ ███████╗ █████╗ ██████╗
  ╚══██╔══╝██║  ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔══██╗
     ██║   ███████║█████╗      ██║  ██║█████╗  ███████║██║  ██║
     ██║   ██╔══██║██╔══╝      ██║  ██║██╔══╝  ██╔══██║██║  ██║
     ██║   ██║  ██║███████╗    ██████╔╝███████╗██║  ██║██████╔╝
     ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝

                   ███╗   ██╗███████╗████████╗
                   ████╗  ██║██╔════╝╚══██╔══╝
                   ██╔██╗ ██║█████╗     ██║
                   ██║╚██╗██║██╔══╝     ██║
                   ██║ ╚████║███████╗   ██║
                   ╚═╝  ╚═══╝╚══════╝   ╚═╝

         ░▒▓█  Where the Dead Lines Come Alive  █▓▒░
`}
          </LogoText>
        </LogoContainer>

        {/* Modem Output */}
        <ModemOutput>
          {lines.map((line, index) => (
            <ModemLine key={index} delay={index * 50}>
              {line.includes('◊') || line.includes('≋') || line.includes('∿') ||
               line.includes('≈') || line.includes('~') || line.includes('♪') ||
               line.includes('♫') ? (
                <HandshakeNoise>{line}</HandshakeNoise>
              ) : (
                line
              )}
            </ModemLine>
          ))}
          {showCursor && <Cursor />}
        </ModemOutput>

        {/* Progress Bar */}
        {stage !== 'ready' && (
          <ProgressBar>
            <ProgressFill width={progress} />
          </ProgressBar>
        )}

        {/* Status Messages */}
        {stage === 'connected' && (
          <StatusLine status="connected">
            ╔════════════════════════════════════════════════════╗
            <br />
            ║           ✓✓✓ CONNECT 56000 ✓✓✓                  ║
            <br />
            ╚════════════════════════════════════════════════════╝
          </StatusLine>
        )}

        {stage === 'ready' && (
          <>
            <StatusLine status="connected">
              ╔════════════════════════════════════════════════════╗
              <br />
              ║     CONNECTION ESTABLISHED - WELCOME TO           ║
              <br />
              ║            THE DEAD NET BBS                       ║
              <br />
              ║                                                   ║
              <br />
              ║     Speed: 56000 bps • Protocol: V.90            ║
              <br />
              ╚════════════════════════════════════════════════════╝
            </StatusLine>

            <PressKeyPrompt>
              ▼ PRESS ANY KEY TO CONTINUE ▼
            </PressKeyPrompt>
          </>
        )}
      </TerminalScreen>
    </DialInContainer>
  );
};

export default ModemDialIn;
