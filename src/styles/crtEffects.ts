import { keyframes, css } from 'styled-components';

// CRT Flicker Animation - Simulates unstable power supply
export const crtFlicker = keyframes`
  0% {
    opacity: 0.98;
  }
  5% {
    opacity: 1;
  }
  10% {
    opacity: 0.97;
  }
  15% {
    opacity: 1;
  }
  20% {
    opacity: 0.99;
  }
  25% {
    opacity: 0.97;
  }
  30% {
    opacity: 1;
  }
  35% {
    opacity: 0.98;
  }
  40% {
    opacity: 1;
  }
  45% {
    opacity: 0.99;
  }
  50% {
    opacity: 0.98;
  }
  55% {
    opacity: 1;
  }
  60% {
    opacity: 0.97;
  }
  65% {
    opacity: 0.99;
  }
  70% {
    opacity: 1;
  }
  75% {
    opacity: 0.98;
  }
  80% {
    opacity: 0.97;
  }
  85% {
    opacity: 1;
  }
  90% {
    opacity: 0.99;
  }
  95% {
    opacity: 0.98;
  }
  100% {
    opacity: 1;
  }
`;

// Scanline Drift - Subtle vertical movement
export const scanlineDrift = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
`;

// Text Flicker - Simulates phosphor glow variations
export const textFlicker = keyframes`
  0% {
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
  }
  50% {
    text-shadow: 0 0 8px rgba(0, 255, 0, 1);
  }
  100% {
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
  }
`;

// Screen Roll - Occasional vertical sync issues
export const screenRoll = keyframes`
  0% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-2px);
  }
  20% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
`;

// Chromatic Aberration Shift
export const chromaticShift = keyframes`
  0% {
    text-shadow:
      -1px 0 0 rgba(255, 0, 0, 0.3),
      1px 0 0 rgba(0, 255, 255, 0.3);
  }
  50% {
    text-shadow:
      -0.5px 0 0 rgba(255, 0, 0, 0.3),
      0.5px 0 0 rgba(0, 255, 255, 0.3);
  }
  100% {
    text-shadow:
      -1px 0 0 rgba(255, 0, 0, 0.3),
      1px 0 0 rgba(0, 255, 255, 0.3);
  }
`;

// CRT Effect Configuration
export interface CRTConfig {
  scanlines: boolean;
  flicker: boolean;
  phosphorGlow: boolean;
  vignette: boolean;
  chromaticAberration: boolean;
  curvature: boolean;
  intensity: 'low' | 'medium' | 'high';
}

export const defaultCRTConfig: CRTConfig = {
  scanlines: true,
  flicker: true,
  phosphorGlow: true,
  vignette: true,
  chromaticAberration: false,
  curvature: false,
  intensity: 'medium',
};

// Intensity-based values
export const intensityValues = {
  low: {
    scanlineOpacity: 0.03,
    flickerDuration: '4s',
    glowIntensity: '5px',
    vignetteStrength: 0.3,
  },
  medium: {
    scanlineOpacity: 0.06,
    flickerDuration: '2s',
    glowIntensity: '8px',
    vignetteStrength: 0.5,
  },
  high: {
    scanlineOpacity: 0.12,
    flickerDuration: '1s',
    glowIntensity: '12px',
    vignetteStrength: 0.7,
  },
};

// Scanline Effect
export const scanlineEffect = (opacity: number) => css`
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0) 1px,
    rgba(0, 0, 0, ${opacity}) 1px,
    rgba(0, 0, 0, ${opacity}) 2px
  );
  animation: ${scanlineDrift} 8s linear infinite;
`;

// Vignette Effect
export const vignetteEffect = (strength: number) => css`
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, ${strength * 0.3}) 60%,
    rgba(0, 0, 0, ${strength * 0.7}) 100%
  );
`;

// Screen Curvature Effect
export const curvatureEffect = css`
  transform: perspective(400px) rotateX(0deg);
  transform-style: preserve-3d;
`;

// Phosphor Glow Effect
export const phosphorGlowEffect = (intensity: string) => css`
  text-shadow:
    0 0 ${intensity} rgba(0, 255, 0, 0.8),
    0 0 calc(${intensity} * 2) rgba(0, 255, 0, 0.4);
  animation: ${textFlicker} 3s ease-in-out infinite;
`;

// Chromatic Aberration Effect
export const chromaticAberrationEffect = css`
  animation: ${chromaticShift} 2s ease-in-out infinite;
`;

// CRT Flicker Effect (for entire screen)
export const crtFlickerEffect = (duration: string) => css`
  animation: ${crtFlicker} ${duration} linear infinite;
`;

// Combined CRT Effect Builder
export const buildCRTEffects = (config: CRTConfig) => {
  const intensity = intensityValues[config.intensity];

  return css`
    position: relative;

    ${config.curvature && curvatureEffect}
    ${config.flicker && crtFlickerEffect(intensity.flickerDuration)}

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 1;

      ${config.scanlines && scanlineEffect(intensity.scanlineOpacity)}
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 2;

      ${config.vignette && vignetteEffect(intensity.vignetteStrength)}
    }
  `;
};
