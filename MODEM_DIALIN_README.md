# Modem Dial-In Simulation Component

A fully-featured retro modem connection simulation with authentic BBS-style handshake animation, ASCII art branding, and boot-up sequence for "The Dead Net" terminal interface.

## Features

### Authentic Modem Experience
- **Multi-stage handshake animation**: Simulates the complete dial-in process
- **Visual sound representation**: ASCII art representations of modem sounds
  - Dial tones
  - Carrier signals
  - Connection noise (screech, crackle, hiss)
- **Progressive status updates**: Real-time connection progress
- **CONNECT 56000** message with authentic V.90 protocol details

### Boot Sequence Stages

1. **Initial**: Modem connection initialization screen
2. **Dialing**: ATD command with dial tone simulation
3. **Handshake Phase 1**: Initial protocol negotiation with noise
4. **Handshake Phase 2**: V.90 protocol detection, error correction, and compression setup
5. **Handshake Phase 3**: Carrier training and signal quality checks
6. **Negotiating**: Final speed selection (56000 bps)
7. **Connected**: Success screen with CONNECT 56000 message
8. **Ready**: Welcome screen with "Press Any Key" prompt

### Visual Elements

- **The Dead Net ASCII Logo**: Full ASCII art branding
- **Progress bar**: Visual connection progress indicator
- **Animated text**: Fade-in effects and timed animations
- **Blinking cursor**: Authentic terminal cursor animation
- **Status indicators**: Color-coded connection states
  - Yellow: Connecting
  - Green: Connected
  - Red: Error (not currently used, but available)

### CRT Effects Integration

The component is designed to work seamlessly with the CRT screen effects:
- Scanlines
- Phosphor glow
- Flicker effects
- Chromatic aberration (optional)
- Screen curvature (optional)

## Usage

### Basic Implementation

```tsx
import { ModemDialIn } from './components/ModemDialIn';

function App() {
  const [showModem, setShowModem] = useState(true);

  if (showModem) {
    return (
      <ModemDialIn onComplete={() => setShowModem(false)} />
    );
  }

  return <YourMainApp />;
}
```

### With CRT Effects

```tsx
import { ModemDialIn } from './components/ModemDialIn';
import CRTScreen from './components/CRTScreen';

function App() {
  const [showModem, setShowModem] = useState(true);

  if (showModem) {
    return (
      <CRTScreen enabled={true} config={{
        scanlines: true,
        flicker: true,
        intensity: 'medium'
      }}>
        <ModemDialIn onComplete={() => setShowModem(false)} />
      </CRTScreen>
    );
  }

  return <YourMainApp />;
}
```

### Custom Phone Number

```tsx
<ModemDialIn
  phoneNumber="555-1337"
  onComplete={() => console.log('Connected!')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onComplete` | `() => void` | `undefined` | Callback function triggered when user presses any key after connection is established |
| `phoneNumber` | `string` | `'555-DEAD'` | Phone number displayed during the dialing phase |

## Animation Timing

The entire dial-in sequence runs approximately 15-18 seconds:

- Initial screen: 1.5s
- Dialing: 2s
- Handshake Phase 1: 3s
- Handshake Phase 2: 2s
- Handshake Phase 3: 2s
- Negotiating: 2s
- Connected: 1.5s
- Ready: Waits for user input

## Customization

### Modifying Modem Sounds

Edit the `playModemSound` function to add or modify visual sound representations:

```tsx
const sounds: { [key: string]: string[] } = {
  dial: ['♪ BEEP... BEEP... BEEP...', '♫ Dialing...'],
  handshake: [
    '◊◊◊ KSHHHHhhhhh ◊◊◊',
    '≋≋≋ BEEEEeeeep SCREECH ≋≋≋',
    // Add more sound variations...
  ],
  carrier: ['♪♫ Carrier detected ♫♪']
};
```

### Adjusting Animation Speed

Modify the `setTimeout` delays in the `useEffect` hook to speed up or slow down the sequence:

```tsx
// Example: Speed up dialing phase
setTimeout(() => setStage('dialing'), 750); // Reduced from 1500
```

### Changing Colors

Update the styled components to customize the color scheme:

```tsx
const StatusLine = styled.div<{ status: 'connecting' | 'connected' | 'error' }>`
  color: ${props =>
    props.status === 'connected' ? terminalTheme.colors.brightCyan : // Changed from green
    props.status === 'error' ? terminalTheme.colors.red :
    terminalTheme.colors.yellow
  };
  // ...
`;
```

## Technical Details

### Technologies Used
- React 19.1.1
- TypeScript
- Styled Components 6.1.19
- CSS Keyframe Animations

### Performance
- Minimal re-renders using staged state updates
- Efficient animation using CSS keyframes
- No external libraries for animations

### Browser Compatibility
- Modern browsers with ES6+ support
- Requires CSS animation support
- Best experienced with CRT effects enabled

## Integration with The Dead Net

This component is designed specifically for "The Dead Net" BBS-style interface and includes:
- Branded ASCII art logo
- Thematic color scheme (green phosphor terminal)
- Retro terminology and messages
- Period-accurate modem speeds and protocols

## Future Enhancements

Potential additions:
- Actual audio synthesis using Web Audio API
- Configurable connection speeds (28.8K, 33.6K, 56K)
- Error/retry simulation
- User-configurable animation speed
- Multiple logo variations
- Connection failure scenarios

## License

Part of the Vibe Kanban project - MIT License

## Credits

Created for "The Dead Net" - Where the Dead Lines Come Alive
