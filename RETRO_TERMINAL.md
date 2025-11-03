# Retro Terminal UI

A retro-style terminal UI component featuring monospaced fonts and an authentic ANSI 16-color palette.

## Features

### 🎨 ANSI 16-Color Palette
- **Normal Colors (0-7)**: Black, Red, Green, Yellow, Blue, Magenta, Cyan, White
- **Bright Colors (8-15)**: Bright variants of all base colors
- Authentic terminal color scheme for true retro aesthetics

### 🔤 Monospaced Fonts
- **Primary**: Cascadia Mono - Modern, clean monospaced font
- **Retro**: VT323 - Classic terminal font with vintage character
- **Fallback**: Courier New for maximum compatibility

### ⚡ Terminal Features
- Command input with `>_` prompt
- Command history navigation (↑/↓ arrow keys)
- Auto-scrolling output
- Blinking cursor animation
- MacOS-style window controls
- Glow effects and shadows for authentic CRT look

## Components

### RetroTerminal
The main terminal component with full command support.

```tsx
import { RetroTerminal } from './components/RetroTerminal';

<RetroTerminal
  title="MY TERMINAL"
  onCommand={(cmd) => console.log('Command:', cmd)}
  initialOutput={['Welcome to the terminal!', 'Type a command...']}
/>
```

**Props:**
- `title?: string` - Terminal window title (default: "RETRO TERMINAL v1.0")
- `onCommand?: (command: string) => void` - Callback for command execution
- `initialOutput?: string[]` - Initial lines to display in terminal

### RetroTerminalDemo
A demonstration component showcasing the terminal with color palette.

```tsx
import { RetroTerminalDemo } from './components/RetroTerminalDemo';

<RetroTerminalDemo />
```

## Theme System

### Using the ANSI Colors

```tsx
import { ansiColors, terminalTheme } from './styles/theme';

// Access individual colors
const greenText = ansiColors.brightGreen;
const redText = ansiColors.red;

// Use in styled-components
const ColoredText = styled.span`
  color: ${ansiColors.brightCyan};
  background: ${terminalTheme.background.primary};
`;
```

### Available Theme Values

```tsx
terminalTheme.colors.*          // All ANSI colors
terminalTheme.background.*      // Background colors and gradients
terminalTheme.foreground.*      // Text colors
terminalTheme.fonts.*           // Font families
terminalTheme.fontSize.*        // Font size scale
terminalTheme.spacing.*         // Spacing scale
terminalTheme.border.*          // Border properties
terminalTheme.effects.*         // Glow and shadow effects
```

## ANSI Color Reference

| Color | Normal | Bright |
|-------|--------|--------|
| Black | `#000000` | `#7f7f7f` |
| Red | `#cd0000` | `#ff0000` |
| Green | `#00cd00` | `#00ff00` |
| Yellow | `#cdcd00` | `#ffff00` |
| Blue | `#0000ee` | `#5c5cff` |
| Magenta | `#cd00cd` | `#ff00ff` |
| Cyan | `#00cdcd` | `#00ffff` |
| White | `#e5e5e5` | `#ffffff` |

## Font Loading

The fonts are loaded via Google Fonts in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Cascadia+Mono:wght@400;700&display=swap" rel="stylesheet">
```

## Usage Examples

### Basic Terminal

```tsx
import { RetroTerminal } from './components';

function MyApp() {
  return (
    <RetroTerminal
      title="SYSTEM TERMINAL"
      initialOutput={[
        '╔════════════════════════╗',
        '║  SYSTEM INITIALIZED    ║',
        '╚════════════════════════╝',
        '',
        'Ready for input...',
      ]}
      onCommand={(cmd) => {
        console.log('Executing:', cmd);
        // Handle command logic here
      }}
    />
  );
}
```

### Custom Styled Component

```tsx
import styled from 'styled-components';
import { terminalTheme } from './styles/theme';

const CustomOutput = styled.div`
  font-family: ${terminalTheme.fonts.retro};
  color: ${terminalTheme.colors.brightCyan};
  font-size: ${terminalTheme.fontSize.retro};
  text-shadow: ${terminalTheme.effects.textGlow};
`;
```

## Keyboard Shortcuts

- **Enter** - Execute command
- **↑** - Previous command in history
- **↓** - Next command in history

## Styling Customization

The terminal uses CSS-in-JS with styled-components. All styles can be customized by modifying the theme object in `src/styles/theme.ts`.

### Example: Change Primary Color

```tsx
// In theme.ts
export const terminalTheme = {
  ...
  foreground: {
    primary: ansiColors.brightCyan,  // Changed from brightGreen
    ...
  },
  ...
};
```

## File Structure

```
src/
├── components/
│   ├── RetroTerminal.tsx      # Main terminal component
│   ├── RetroTerminalDemo.tsx  # Demo/showcase component
│   └── index.ts               # Component exports
├── styles/
│   ├── theme.ts               # ANSI colors & theme system
│   ├── GlobalStyles.ts        # Global styles
│   └── index.ts               # Style exports
└── index.html                 # Font imports
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires support for:
- CSS Grid
- CSS Flexbox
- CSS Custom Properties
- ES6+

## Performance

- Lightweight (~5KB gzipped)
- No heavy dependencies
- Optimized re-renders with React hooks
- Auto-scrolling debounced for large outputs

## Future Enhancements

- [ ] ANSI escape sequence parsing
- [ ] Multi-line input support
- [ ] Tab completion
- [ ] Syntax highlighting
- [ ] Command suggestions
- [ ] Terminal themes switcher
- [ ] Export/save session history
