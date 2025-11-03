/**
 * SYSOP-13 Post Daily Bulletin Behavior
 * Generates and posts daily bulletins to boards
 */

import type {
  BehaviorContext,
  BehaviorResult,
  DailyBulletin,
  BulletinSection,
  SysopConfig,
} from '../../types/sysop';
import type { Post } from '../../types/post';
import { generateResponse, bulletinHeaderTemplates } from '../responseTemplates';
import { getRandomLore } from '../loreDatabase';
import { formatBbsDate } from '../../utils/dateUtils';

/**
 * Generate bulletin statistics section
 */
export function generateStatsSection(posts: Post[]): BulletinSection {
  const last24Hours = posts.filter(post => {
    const postTime = new Date(post.timestamp).getTime();
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return postTime > dayAgo;
  });

  const uniqueUsers = new Set(posts.map(p => p.user)).size;
  const mostActiveUser = getMostActiveUser(last24Hours);
  const totalBytes = posts.reduce((sum, p) => sum + p.message.length, 0);

  // Convert bytes to a retro measurement
  const kilobytes = (totalBytes / 1024).toFixed(2);
  const at2400Baud = (totalBytes / 240).toFixed(1); // 240 bytes/sec at 2400 baud

  const content = `
System Activity (Last 24 Hours):
─────────────────────────────────
Messages Posted: ${last24Hours.length}
Active Users: ${uniqueUsers}
Most Active: ${mostActiveUser}
Data Transferred: ${kilobytes} KB
${totalBytes > 0 ? `(~${at2400Baud} seconds at 2400 baud)` : ''}

Total Messages in System: ${posts.length}
`;

  return {
    heading: 'SYSTEM STATISTICS',
    content: content.trim(),
    type: 'stats',
  };
}

/**
 * Get most active user from posts
 */
function getMostActiveUser(posts: Post[]): string {
  if (posts.length === 0) return 'None';

  const userCounts = posts.reduce((acc, post) => {
    acc[post.user] = (acc[post.user] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const [topUser, count] = Object.entries(userCounts).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  return `${topUser} (${count} posts)`;
}

/**
 * Generate lore section
 */
export function generateLoreSection(): BulletinSection {
  const lore = getRandomLore(1)[0];

  const content = `
"${lore.content}"

- From the Archives, ${lore.era}
  Category: ${lore.category.toUpperCase()}
`;

  return {
    heading: 'FROM THE ARCHIVES',
    content: content.trim(),
    type: 'lore',
  };
}

/**
 * Generate news/announcements section
 */
export function generateNewsSection(): BulletinSection {
  const announcements = [
    'System maintenance scheduled for 0300 hours. Expect brief carrier loss.',
    'New file uploads in the UTILS section. Check /list files for details.',
    'Remember: Upload/Download ratio is 1:10. Share to keep the files flowing.',
    'Late night rates apply after 2300 hours. Prime time for that download queue.',
    'FidoNet mail run completed. Check your messages.',
  ];

  // Randomly select 1-2 announcements
  const count = Math.random() > 0.5 ? 2 : 1;
  const selected = [...announcements]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  const content = selected.map((item, i) => `${i + 1}. ${item}`).join('\n');

  return {
    heading: 'SYSTEM ANNOUNCEMENTS',
    content,
    type: 'announcement',
  };
}

/**
 * Generate technical status section
 */
export function generateTechnicalSection(): BulletinSection {
  const uptime = Math.floor(Math.random() * 100) + 1;
  const carrierQuality = (95 + Math.random() * 5).toFixed(1);
  const bufferUsage = (Math.random() * 30 + 10).toFixed(1);

  const content = `
Line Status: ONLINE
Carrier Quality: ${carrierQuality}%
System Uptime: ${uptime} days
Buffer Usage: ${bufferUsage}%
Protocol: 8-N-1 (8 data, No parity, 1 stop)

All systems nominal. The bits keep flowing.
`;

  return {
    heading: 'TECHNICAL STATUS',
    content: content.trim(),
    type: 'news',
  };
}

/**
 * Format bulletin as text
 */
export function formatBulletin(bulletin: DailyBulletin): string {
  let output = bulletin.title + '\n\n';

  for (const section of bulletin.sections) {
    output += `${section.heading}\n`;
    output += '─'.repeat(section.heading.length) + '\n';
    output += section.content + '\n\n';
  }

  if (bulletin.footer) {
    output += bulletin.footer + '\n';
  }

  output += `\n--- SYSOP-13 @ ${bulletin.timestamp} ---`;

  return output;
}

/**
 * Generate complete daily bulletin
 */
export function generateDailyBulletin(
  context: BehaviorContext,
  _config: SysopConfig
): DailyBulletin {
  const date = formatBbsDate(new Date());
  const posts = context.posts || [];

  // Generate header
  const title = generateResponse(bulletinHeaderTemplates, { date });

  // Build sections
  const sections: BulletinSection[] = [
    generateNewsSection(),
    generateStatsSection(posts),
    generateTechnicalSection(),
    generateLoreSection(),
  ];

  const footer = `
╔════════════════════════════════════════╗
║  "Keeping the carrier strong since    ║
║   the days of 300 baud."               ║
║                                        ║
║  - SYSOP-13                            ║
╚════════════════════════════════════════╝
`;

  return {
    title,
    sections,
    footer: footer.trim(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if bulletin should be posted based on schedule
 */
export function shouldPostBulletin(
  lastBulletinTime: Date | null,
  _schedule: string
): boolean {
  if (!lastBulletinTime) return true;

  // Simple daily check - can be enhanced with cron parsing
  const now = new Date();
  const timeSinceLastBulletin = now.getTime() - lastBulletinTime.getTime();
  const hoursElapsed = timeSinceLastBulletin / (1000 * 60 * 60);

  // Post once per day (24 hours)
  return hoursElapsed >= 24;
}

/**
 * Main daily bulletin behavior
 */
export async function postDailyBulletin(
  context: BehaviorContext,
  config: SysopConfig
): Promise<BehaviorResult> {
  try {
    const bulletinConfig = config.behaviors.post_daily_bulletin;

    if (!bulletinConfig.enabled) {
      return {
        success: true,
        action: 'no_action',
        metadata: { reason: 'Bulletin posting disabled' },
      };
    }

    // Generate bulletin
    const bulletin = generateDailyBulletin(context, config);

    // Format as text
    const bulletinText = formatBulletin(bulletin);

    return {
      success: true,
      action: 'send_bulletin',
      response: bulletinText,
      metadata: {
        bulletin,
        boards: bulletinConfig.boards,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate weekly digest
 */
export function generateWeeklyDigest(posts: Post[]): string {
  const lastWeek = posts.filter(post => {
    const postTime = new Date(post.timestamp).getTime();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return postTime > weekAgo;
  });

  const uniqueUsers = new Set(lastWeek.map(p => p.user)).size;
  const totalBytes = lastWeek.reduce((sum, p) => sum + p.message.length, 0);

  return `
╔═══════════════════════════════════════╗
║     WEEKLY DIGEST - SYSOP-13          ║
╚═══════════════════════════════════════╝

Messages This Week: ${lastWeek.length}
Active Users: ${uniqueUsers}
Data Volume: ${(totalBytes / 1024).toFixed(2)} KB

Most Active Day: ${getMostActiveDay(lastWeek)}
Top Contributor: ${getMostActiveUser(lastWeek)}

The datastream flows strong this week.
Keep those carriers clean, folks.

--- SYSOP-13 ---
`;
}

/**
 * Get most active day from posts
 */
function getMostActiveDay(posts: Post[]): string {
  if (posts.length === 0) return 'None';

  const dayCounts = posts.reduce((acc, post) => {
    const day = new Date(post.timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
    });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const [topDay, count] = Object.entries(dayCounts).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  return `${topDay} (${count} posts)`;
}
