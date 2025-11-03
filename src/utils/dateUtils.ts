/**
 * Date and timestamp utility functions for the vibe-kanban application
 */

/**
 * Format a timestamp for terminal display (compact format)
 * Examples: "2m ago", "1h ago", "3d ago", "2025-01-15"
 */
export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else if (diffDay < 7) {
    return `${diffDay}d ago`;
  } else {
    // Format as YYYY-MM-DD for older posts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

/**
 * Format a timestamp with full details (for tooltips or detailed views)
 * Example: "Jan 15, 2025 at 14:30:45"
 */
export function formatFullTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
}

/**
 * Format timestamp in terminal/Unix style (HH:MM:SS)
 * Example: "14:30:45"
 */
export function formatTimeOnly(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format timestamp in ISO format for terminal display
 * Example: "2025-01-15T14:30:45"
 */
export function formatISOTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toISOString().replace('T', ' ').split('.')[0];
}

/**
 * Parse and validate timestamp
 */
export function parseTimestamp(timestamp: string | Date): Date | null {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}

/**
 * Check if a timestamp is within the last N hours
 */
export function isRecent(timestamp: string | Date, hours: number = 24): boolean {
  const date = parseTimestamp(timestamp);
  if (!date) return false;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours <= hours;
}

/**
 * Get relative time string (more detailed version)
 * Example: "2 minutes ago", "3 hours ago", "1 day ago"
 */
export function getRelativeTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 10) {
    return 'just now';
  } else if (diffSec < 60) {
    return `${diffSec} seconds ago`;
  } else if (diffMin === 1) {
    return '1 minute ago';
  } else if (diffMin < 60) {
    return `${diffMin} minutes ago`;
  } else if (diffHour === 1) {
    return '1 hour ago';
  } else if (diffHour < 24) {
    return `${diffHour} hours ago`;
  } else if (diffDay === 1) {
    return '1 day ago';
  } else if (diffDay < 7) {
    return `${diffDay} days ago`;
  } else if (diffWeek === 1) {
    return '1 week ago';
  } else if (diffWeek < 4) {
    return `${diffWeek} weeks ago`;
  } else if (diffMonth === 1) {
    return '1 month ago';
  } else if (diffMonth < 12) {
    return `${diffMonth} months ago`;
  } else if (diffYear === 1) {
    return '1 year ago';
  } else {
    return `${diffYear} years ago`;
  }
}

/**
 * Format duration between two timestamps
 */
export function formatDuration(start: string | Date, end: string | Date): string {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60) {
    return `${diffSec}s`;
  } else if (diffMin < 60) {
    return `${diffMin}m ${diffSec % 60}s`;
  } else {
    return `${diffHour}h ${diffMin % 60}m`;
  }
}
