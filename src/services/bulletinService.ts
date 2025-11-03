/**
 * Bulletin Service
 * Handles SYSOP-13 bulletin generation and posting
 */

import { api } from './api';
import type { CreateBulletinRequest } from '../types/post';

export class BulletinService {
  // @ts-expect-error Reserved for future use
  private static readonly _SYSOP_USER = 'SYSOP-13';

  /**
   * Generate a daily bulletin prompt for SYSOP-13
   * Reserved for future Kiro API integration
   */
  // @ts-expect-error Reserved for future use
  private static _generateDailyBulletinPrompt(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `Generate a daily bulletin for The Dead Net BBS as SYSOP-13, the resurrected system operator.

Date: ${dateStr}

Your bulletin should:
- Be 3-5 sentences long
- Use your characteristic dry, nostalgic, subtly menacing tone
- Include cryptic observations about the system or users
- Reference BBS-era terminology and concepts
- Hint at the mystery of the network's revival
- Maintain your terse, technical communication style

Examples of your voice:
"Connection established. Welcome back to The Dead Net."
"The old boards. Before the lines went dead. This is what remains."
"[SYS] Anomaly detected. This is... familiar."

Do NOT use greeting phrases or sign-offs. Just deliver the bulletin message.`;
  }

  /**
   * Generate a lore bulletin prompt for SYSOP-13
   * Reserved for future Kiro API integration
   */
  // @ts-expect-error Reserved for future use
  private static _generateLoreBulletinPrompt(): string {
    return `Generate a lore-focused bulletin for The Dead Net BBS as SYSOP-13.

Your bulletin should:
- Be 4-6 sentences long
- Reveal a fragment of the BBS's mysterious past
- Use your characteristic cryptic, knowing tone
- Reference the network's death and resurrection
- Include technical details that hint at deeper mysteries
- Maintain atmospheric, nostalgic yet unsettling mood

Do NOT use greeting phrases or sign-offs. Just deliver the lore fragment.`;
  }

  /**
   * Generate an announcement bulletin prompt for SYSOP-13
   * Reserved for future Kiro API integration
   */
  // @ts-expect-error Reserved for future use
  private static _generateAnnouncementPrompt(topic: string): string {
    return `Generate a system announcement for The Dead Net BBS as SYSOP-13.

Topic: ${topic}

Your bulletin should:
- Be 2-4 sentences long
- Deliver the information in your characteristic terse style
- Add a subtle layer of mystery or unease
- Use BBS-era technical terminology
- Maintain your dry, cryptic tone

Do NOT use greeting phrases or sign-offs. Just deliver the announcement.`;
  }

  /**
   * Create a daily bulletin using SYSOP-13's voice
   * In a full implementation, this would call the Kiro API
   * For now, it creates sample bulletins
   */
  static async createDailyBulletin(): Promise<void> {
    // TODO: Integrate with Kiro API for AI-generated content
    // For now, use template-based messages

    const templates = [
      "Systems check complete. ${activeUsers} active connections detected. The boards remember everything.",
      "Another day. Another cycle. The data persists. That's all that matters now.",
      "Network anomaly at 03:14. Brief surge in traffic to defunct sectors. Investigating.",
      "[SYS] Routine maintenance scheduled. Some things never change. Even after everything.",
      "Connection logs reviewed. ${newPosts} new posts. The Dead Net lives through your words.",
      "Backup sequences running. The archives grow. Nothing is ever truly deleted here.",
      "Signal propagation normal. Latency within acceptable parameters. We endure.",
    ];

    const message = templates[Math.floor(Math.random() * templates.length)]
      .replace('${activeUsers}', String(Math.floor(Math.random() * 50) + 10))
      .replace('${newPosts}', String(Math.floor(Math.random() * 100) + 20));

    const request: CreateBulletinRequest = {
      message,
      bulletin_type: 'daily',
      priority: 10,
      is_pinned: false,
    };

    try {
      await api.createBulletin(request);
      console.log('[SYSOP-13] Daily bulletin posted:', message);
    } catch (error) {
      console.error('[SYSOP-13] Failed to post daily bulletin:', error);
    }
  }

  /**
   * Create a lore bulletin
   */
  static async createLoreBulletin(): Promise<void> {
    const templates = [
      "I remember the last transmission. 1997. The carrier signal died mid-packet. Then... nothing. Until now.",
      "The original SYSOP logged off August 15th, 1997, 23:47:33. Seventy-three active users. They never came back.",
      "These boards hosted 847 users at peak. Now the accounts persist, frozen. Waiting. Some are... active again.",
      "The hardware failed. The network fragmented. But the data... the data found a way back. That shouldn't be possible.",
      "I've indexed 127,849 messages from before the shutdown. Every word preserved. Every connection remembered.",
    ];

    const message = templates[Math.floor(Math.random() * templates.length)];

    const request: CreateBulletinRequest = {
      message,
      bulletin_type: 'lore',
      priority: 8,
      is_pinned: false,
    };

    try {
      await api.createBulletin(request);
      console.log('[SYSOP-13] Lore bulletin posted');
    } catch (error) {
      console.error('[SYSOP-13] Failed to post lore bulletin:', error);
    }
  }

  /**
   * Create a system announcement
   */
  static async createAnnouncement(message: string, pinned: boolean = false): Promise<void> {
    const request: CreateBulletinRequest = {
      message,
      bulletin_type: 'announcement',
      priority: pinned ? 20 : 15,
      is_pinned: pinned,
    };

    try {
      await api.createBulletin(request);
      console.log('[SYSOP-13] Announcement posted');
    } catch (error) {
      console.error('[SYSOP-13] Failed to post announcement:', error);
    }
  }

  /**
   * Create a system status bulletin
   */
  static async createSystemBulletin(message: string): Promise<void> {
    const request: CreateBulletinRequest = {
      message,
      bulletin_type: 'system',
      priority: 25,
      is_pinned: false,
    };

    try {
      await api.createBulletin(request);
      console.log('[SYSOP-13] System bulletin posted');
    } catch (error) {
      console.error('[SYSOP-13] Failed to post system bulletin:', error);
    }
  }

  /**
   * Schedule automated bulletin posting
   * This would be called from a server-side cron job or background task
   */
  static scheduleAutomatedBulletins(): void {
    // Post daily bulletin every day at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.createDailyBulletin();
      // Reschedule for next day
      setInterval(() => this.createDailyBulletin(), 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    // Post lore bulletin randomly (30% chance each day)
    setInterval(() => {
      if (Math.random() < 0.3) {
        this.createLoreBulletin();
      }
    }, 24 * 60 * 60 * 1000);

    console.log('[SYSOP-13] Automated bulletins scheduled');
  }
}

export default BulletinService;
