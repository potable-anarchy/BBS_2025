/**
 * Browser Detection and Feature Support
 * Utilities for detecting browser capabilities and adjusting features accordingly
 */

export interface BrowserInfo {
  name: 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';
  isMobile: boolean;
  supportsBackdropFilter: boolean;
  supportsWebGL: boolean;
  prefersReducedMotion: boolean;
  devicePixelRatio: number;
}

/**
 * Detect the current browser
 */
export function detectBrowser(): BrowserInfo['name'] {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('edg/')) {
    return 'edge';
  }
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return 'chrome';
  }
  if (userAgent.includes('firefox')) {
    return 'firefox';
  }
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  }

  return 'unknown';
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if backdrop-filter is supported
 */
export function supportsBackdropFilter(): boolean {
  return CSS.supports('backdrop-filter', 'blur(10px)') ||
         CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
}

/**
 * Check if WebGL is supported
 */
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get device pixel ratio
 */
export function getDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * Get comprehensive browser information
 */
export function getBrowserInfo(): BrowserInfo {
  return {
    name: detectBrowser(),
    isMobile: isMobileDevice(),
    supportsBackdropFilter: supportsBackdropFilter(),
    supportsWebGL: supportsWebGL(),
    prefersReducedMotion: prefersReducedMotion(),
    devicePixelRatio: getDevicePixelRatio(),
  };
}

/**
 * Determine optimal CRT effect intensity based on browser and device
 */
export function getOptimalCRTIntensity(
  browserInfo: BrowserInfo
): 'low' | 'medium' | 'high' {
  // Reduced motion preference overrides everything
  if (browserInfo.prefersReducedMotion) {
    return 'low';
  }

  // Mobile devices get low intensity
  if (browserInfo.isMobile) {
    return 'low';
  }

  // Safari generally has worse CSS filter performance
  if (browserInfo.name === 'safari') {
    return 'medium';
  }

  // High DPI displays can handle more
  if (browserInfo.devicePixelRatio > 2) {
    return 'medium';
  }

  // Default to medium for most desktop browsers
  return 'medium';
}

/**
 * Log browser capabilities for debugging
 */
export function logBrowserCapabilities(): void {
  const info = getBrowserInfo();

  console.group('Browser Capabilities');
  console.log('Browser:', info.name);
  console.log('Mobile:', info.isMobile);
  console.log('Backdrop Filter Support:', info.supportsBackdropFilter);
  console.log('WebGL Support:', info.supportsWebGL);
  console.log('Prefers Reduced Motion:', info.prefersReducedMotion);
  console.log('Device Pixel Ratio:', info.devicePixelRatio);
  console.log('Optimal CRT Intensity:', getOptimalCRTIntensity(info));
  console.groupEnd();
}
