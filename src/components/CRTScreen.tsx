import React from 'react';
import styled, { keyframes } from 'styled-components';
import { terminalTheme } from '../styles/theme';
import {
  buildCRTEffects,
  defaultCRTConfig,
  phosphorGlowEffect,
  chromaticAberrationEffect,
  intensityValues,
} from '../styles/crtEffects';
import type { CRTConfig } from '../styles/crtEffects';

interface CRTScreenProps {
  children: React.ReactNode;
  enabled?: boolean;
  config?: Partial<CRTConfig>;
  className?: string;
}

const CRTContainer = styled.div<{ $config: CRTConfig; $enabled: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${terminalTheme.background.primary};

  ${({ $config, $enabled }) => $enabled && buildCRTEffects($config)}

  /* Screen bezel effect - simulates CRT monitor frame */
  ${({ $enabled }) =>
    $enabled &&
    `
    box-shadow: ${terminalTheme.crt.bezel};
    border-radius: ${terminalTheme.border.radius};
  `}

  /* Apply phosphor glow to text content */
  ${({ $config, $enabled }) =>
    $enabled &&
    $config.phosphorGlow &&
    `
    & * {
      ${phosphorGlowEffect(intensityValues[$config.intensity].glowIntensity)}
    }
  `}

  /* Apply chromatic aberration to text */
  ${({ $config, $enabled }) =>
    $enabled &&
    $config.chromaticAberration &&
    `
    & * {
      ${chromaticAberrationEffect}
    }
  `}

  /* Screen curvature effect */
  ${({ $config, $enabled }) =>
    $enabled &&
    $config.curvature &&
    `
    transform: ${terminalTheme.crt.curvature};
    transform-style: preserve-3d;
  `}

  /* Content wrapper */
  & > * {
    position: relative;
    z-index: 0;
  }
`;

const noise = keyframes`
  0% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-5%, -5%);
  }
  20% {
    transform: translate(-10%, 5%);
  }
  30% {
    transform: translate(5%, -10%);
  }
  40% {
    transform: translate(-5%, 15%);
  }
  50% {
    transform: translate(-10%, 5%);
  }
  60% {
    transform: translate(15%, 0%);
  }
  70% {
    transform: translate(0%, 10%);
  }
  80% {
    transform: translate(-15%, 0%);
  }
  90% {
    transform: translate(10%, 5%);
  }
  100% {
    transform: translate(5%, 0%);
  }
`;

const CRTNoise = styled.div<{ $enabled: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
  opacity: ${({ $enabled }) => ($enabled ? 0.02 : 0)};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E");
  animation: ${noise} 0.2s steps(10) infinite;
`;

/**
 * CRTScreen - Wrapper component that applies CRT monitor effects
 *
 * Features:
 * - Scanlines with vertical drift animation
 * - Screen flicker simulating unstable power
 * - Phosphor glow on text
 * - Vignette effect (dark corners)
 * - Optional chromatic aberration
 * - Optional screen curvature
 * - Screen noise overlay
 *
 * Usage:
 * ```tsx
 * <CRTScreen enabled={true} config={{ intensity: 'medium' }}>
 *   <YourTerminalComponent />
 * </CRTScreen>
 * ```
 */
export const CRTScreen: React.FC<CRTScreenProps> = ({
  children,
  enabled = true,
  config = {},
  className,
}) => {
  const mergedConfig: CRTConfig = {
    ...defaultCRTConfig,
    ...config,
  };

  return (
    <CRTContainer $config={mergedConfig} $enabled={enabled} className={className}>
      {children}
      <CRTNoise $enabled={enabled} />
    </CRTContainer>
  );
};

export default CRTScreen;
