// ANSI 16-Color Palette Theme
export const ansiColors = {
  // Normal colors (0-7)
  black: '#000000',
  red: '#cd0000',
  green: '#00cd00',
  yellow: '#cdcd00',
  blue: '#0000ee',
  magenta: '#cd00cd',
  cyan: '#00cdcd',
  white: '#e5e5e5',

  // Bright colors (8-15)
  brightBlack: '#7f7f7f',
  brightRed: '#ff0000',
  brightGreen: '#00ff00',
  brightYellow: '#ffff00',
  brightBlue: '#5c5cff',
  brightMagenta: '#ff00ff',
  brightCyan: '#00ffff',
  brightWhite: '#ffffff',
} as const;

// Terminal Theme
export const terminalTheme = {
  colors: ansiColors,

  // Background colors
  background: {
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  },

  // Foreground colors
  foreground: {
    primary: ansiColors.brightGreen,
    secondary: ansiColors.green,
    muted: ansiColors.brightBlack,
  },

  // Typography
  fonts: {
    primary: "'Cascadia Mono', 'Courier New', monospace",
    retro: "'VT323', 'Courier New', monospace",
    fallback: "'Courier New', Courier, monospace",
  },

  // Font sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    retro: '20px', // VT323 needs larger size for readability
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  // Border
  border: {
    width: '2px',
    radius: '4px',
    color: ansiColors.brightGreen,
  },

  // Effects
  effects: {
    glow: `0 0 10px ${ansiColors.brightGreen}`,
    glowStrong: `0 0 20px ${ansiColors.brightGreen}`,
    textGlow: `0 0 5px ${ansiColors.brightGreen}`,
    boxShadow: `0 0 20px rgba(0, 255, 0, 0.3)`,
  },

  // CRT Effects Configuration
  crt: {
    // Scanline patterns
    scanlines: {
      low: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0.03) 2px)',
      medium: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0.06) 1px, rgba(0, 0, 0, 0.06) 2px)',
      high: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0.12) 1px, rgba(0, 0, 0, 0.12) 2px)',
    },
    // Vignette intensity
    vignette: {
      low: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 100%)',
      medium: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.15) 60%, rgba(0, 0, 0, 0.5) 100%)',
      high: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.7) 100%)',
    },
    // Phosphor glow colors (green phosphor CRT)
    phosphor: {
      primary: `${ansiColors.brightGreen}`,
      glow: 'rgba(0, 255, 0, 0.8)',
      trail: 'rgba(0, 255, 0, 0.4)',
    },
    // Screen curvature
    curvature: 'perspective(400px)',
    // Bezel shadow (CRT monitor frame)
    bezel: 'inset 0 0 40px rgba(0, 0, 0, 0.8)',
  },
} as const;

export type TerminalTheme = typeof terminalTheme;

// Simple theme for components (compatible with styled-components)
export const theme = {
  colors: {
    background: '#0a0a0a',
    foreground: '#e5e5e5',
    primary: '#00ff00',
    secondary: '#7f7f7f',
    accent: '#00ffff',
    error: '#ff0000',
    warning: '#ffff00',
    success: '#00ff00',
    // ANSI colors for terminal styling
    dim: '#7f7f7f',
    cyan: '#00cdcd',
    magenta: '#cd00cd',
    blue: '#0000ee',
    yellow: '#cdcd00',
    red: '#cd0000',
  },
  fonts: {
    mono: "'Cascadia Mono', 'Courier New', monospace",
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    small: '8px',  // Alias for sm
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
} as const;
