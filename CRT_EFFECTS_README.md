# CRT Shader Effects & Visual Filters

Authentic retro CRT monitor effects for the Vibe Kanban terminal interface.

## Features

### 1. Scanlines
Horizontal lines that simulate the display technology of CRT monitors.
- **Implementation**: CSS repeating linear gradients
- **Configurable intensity**: Low, Medium, High
- **Animated drift**: Subtle vertical movement for realism
- **File**: `src/styles/crtEffects.ts`

### 2. Screen Flicker
Simulates unstable power supply of vintage CRT displays.
- **Implementation**: CSS keyframe animations
- **Opacity variations**: 0.97 - 1.0
- **Configurable speed**: Based on intensity setting
- **GPU-accelerated**: Uses `opacity` property for performance

### 3. Phosphor Glow
Green phosphor afterglow effect on text.
- **Implementation**: CSS text-shadow with animations
- **Pulsing effect**: Simulates phosphor persistence
- **Customizable colors**: Configured in theme.ts
- **Intensity levels**: Adjustable glow radius

### 4. Vignette Effect
Darkened corners simulating CRT screen edges.
- **Implementation**: Radial gradient overlay
- **Configurable strength**: 0.3 - 0.7 opacity
- **Elliptical shape**: Matches typical CRT screen shape

### 5. Screen Noise
Static/noise overlay for authenticity.
- **Implementation**: SVG fractal noise filter
- **Animated**: Constant shifting noise pattern
- **Low opacity**: Subtle effect (2% opacity)
- **Performance**: Uses data URI for efficiency

### 6. Chromatic Aberration (Optional)
Color fringing at text edges.
- **Implementation**: Multi-colored text shadows
- **RGB separation**: Red/cyan shift
- **Toggleable**: Can be enabled/disabled
- **Subtle effect**: Minimal performance impact

### 7. Screen Curvature (Optional)
3D perspective transform simulating curved screen.
- **Implementation**: CSS perspective transform
- **Toggleable**: Can be enabled/disabled
- **Subtle effect**: 400px perspective

## File Structure

```
src/
├── styles/
│   ├── crtEffects.ts          # CRT animations and effect builders
│   └── theme.ts                # Theme config with CRT settings
├── components/
│   └── CRTScreen.tsx           # Wrapper component for CRT effects
└── App.tsx                     # Main app with CRT toggle controls
```

## Usage

### Basic Usage

Wrap any component with `CRTScreen`:

```tsx
import CRTScreen from './components/CRTScreen';

<CRTScreen enabled={true}>
  <YourTerminalComponent />
</CRTScreen>
```

### Advanced Configuration

```tsx
import CRTScreen from './components/CRTScreen';
import { CRTConfig } from './styles/crtEffects';

const config: Partial<CRTConfig> = {
  scanlines: true,
  flicker: true,
  phosphorGlow: true,
  vignette: true,
  chromaticAberration: false,  // Optional
  curvature: false,             // Optional
  intensity: 'medium',          // 'low' | 'medium' | 'high'
};

<CRTScreen enabled={true} config={config}>
  <YourTerminalComponent />
</CRTScreen>
```

## Intensity Levels

### Low
- Scanline opacity: 3%
- Flicker duration: 4s (slower)
- Glow intensity: 5px
- Vignette strength: 30%

### Medium (Default)
- Scanline opacity: 6%
- Flicker duration: 2s
- Glow intensity: 8px
- Vignette strength: 50%

### High
- Scanline opacity: 12%
- Flicker duration: 1s (faster)
- Glow intensity: 12px
- Vignette strength: 70%

## Performance Considerations

All effects are GPU-accelerated using CSS properties:
- `transform`: For animations and curvature
- `opacity`: For flicker effects
- `background`: For scanlines and vignette
- `text-shadow`: For phosphor glow

### Optimization Tips

1. **Pseudo-elements**: Scanlines and vignette use `::before` and `::after` to avoid extra DOM nodes
2. **CSS-only**: No JavaScript animations for better performance
3. **Minimal repaints**: Effects use properties that don't trigger layout recalculation
4. **`will-change`**: Can be added for elements with complex animations

## Customization

### Modify Theme Colors

Edit `src/styles/theme.ts`:

```typescript
crt: {
  phosphor: {
    primary: '#00ff00',           // Bright green
    glow: 'rgba(0, 255, 0, 0.8)', // Glow color
    trail: 'rgba(0, 255, 0, 0.4)', // Trail color
  },
}
```

### Adjust Animation Speed

Edit `src/styles/crtEffects.ts`:

```typescript
export const crtFlicker = keyframes`
  // Modify keyframe percentages for different flicker patterns
`;
```

### Change Scanline Pattern

Edit intensity values in `src/styles/crtEffects.ts`:

```typescript
export const intensityValues = {
  medium: {
    scanlineOpacity: 0.06, // Increase for more visible scanlines
    // ...
  },
};
```

## Toggle Controls

The main App component includes interactive controls:

### CRT Effects ON/OFF
Toggle all CRT effects with a single button.

### Intensity Selector
Cycle through Low → Medium → High intensity levels.

### Location
`src/App.tsx` - Lines 183-204

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may need vendor prefixes for older versions)
- **Mobile**: Supported but may impact performance on low-end devices

## Accessibility

### Considerations
- High-contrast effects may cause eye strain
- Flicker effects may trigger photosensitivity
- Provide option to disable effects (implemented via toggle)

### Recommendations
- Default to medium or low intensity
- Provide clear toggle controls
- Consider adding a "reduced motion" media query check

## Future Enhancements

Potential additions:
- Color fringing intensity control
- Horizontal sync glitches (rolling effect)
- Adjustable scanline density
- Pixel grid overlay
- RGB shadow ghosting
- Screen burn-in simulation
- Bezier-curved edges
- Custom phosphor colors (amber, white, etc.)

## Credits

Inspired by classic CRT monitors:
- IBM 3270 terminals
- Commodore 64
- Apple II
- VT100/VT220 terminals

## License

Part of the Vibe Kanban project.
