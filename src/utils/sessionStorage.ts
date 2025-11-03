/**
 * Session storage utilities for managing user authentication
 * Uses LocalStorage for persistence with ephemeral session IDs
 */

export interface UserSession {
  handle: string;
  sessionId: string;
  createdAt: number;
}

const STORAGE_KEY = 'vibe_kanban_session';

/**
 * Generate a random ephemeral session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
}

/**
 * Save user session to LocalStorage
 */
export function saveSession(handle: string): UserSession {
  const session: UserSession = {
    handle,
    sessionId: generateSessionId(),
    createdAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

/**
 * Retrieve user session from LocalStorage
 */
export function getSession(): UserSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const session: UserSession = JSON.parse(stored);

    // Validate session structure
    if (!session.handle || !session.sessionId || !session.createdAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error retrieving session:', error);
    clearSession();
    return null;
  }
}

/**
 * Clear user session from LocalStorage
 */
export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Update the handle in existing session
 */
export function updateHandle(handle: string): UserSession | null {
  const session = getSession();
  if (!session) return null;

  session.handle = handle;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

/**
 * Check if a valid session exists
 */
export function hasValidSession(): boolean {
  return getSession() !== null;
}
