/**
 * SYSOP-13 Lore Database
 * Historical and cultural knowledge for context injection
 */

import type { LoreEntry } from '../types/sysop';

/**
 * BBS and modem era lore entries
 */
export const loreDatabase: LoreEntry[] = [
  // Technology History
  {
    id: 'lore_001',
    category: 'technology',
    title: '2400 Baud Modems',
    content: 'At 2400 baud, you could download a 1MB file in about an hour. We learned patience.',
    era: '1980s',
    keywords: ['modem', 'baud', 'speed', 'download', 'patience'],
    relevance: 0.9,
  },
  {
    id: 'lore_002',
    category: 'technology',
    title: 'Hayes AT Commands',
    content: 'ATDT for tone dialing, ATDP for pulse. Every sysop knew these by heart.',
    era: '1980s-1990s',
    keywords: ['hayes', 'modem', 'commands', 'dial', 'at'],
    relevance: 0.8,
  },
  {
    id: 'lore_003',
    category: 'technology',
    title: 'Acoustic Couplers',
    content: 'Before RJ-11 jacks, we literally placed the phone handset into rubber cups. 300 baud of pure chaos.',
    era: '1970s-1980s',
    keywords: ['acoustic', 'coupler', 'modem', 'phone', 'legacy'],
    relevance: 0.7,
  },
  {
    id: 'lore_004',
    category: 'technology',
    title: 'Terminal Emulation',
    content: 'ANSI, VT100, VT52... each terminal had its own personality. We spoke their languages.',
    era: '1980s-1990s',
    keywords: ['terminal', 'ansi', 'vt100', 'emulation', 'display'],
    relevance: 0.85,
  },

  // BBS Culture
  {
    id: 'lore_005',
    category: 'culture',
    title: 'The Busy Signal',
    content: 'Single line BBSes meant one user at a time. Autodialers would retry hundreds of times.',
    era: '1980s-1990s',
    keywords: ['busy', 'dial', 'single-line', 'wait', 'patience'],
    relevance: 0.9,
  },
  {
    id: 'lore_006',
    category: 'culture',
    title: 'Message Bases',
    content: 'FidoNet connected BBSes worldwide. Messages would propagate overnight via long distance calls.',
    era: '1984-2000s',
    keywords: ['fidonet', 'messages', 'network', 'overnight', 'echo'],
    relevance: 0.85,
  },
  {
    id: 'lore_007',
    category: 'culture',
    title: 'SysOp Duties',
    content: 'Running a BBS meant late nights, phone bills, and moderating your digital domain.',
    era: '1980s-1990s',
    keywords: ['sysop', 'operator', 'moderate', 'admin', 'duty'],
    relevance: 0.95,
  },
  {
    id: 'lore_008',
    category: 'culture',
    title: 'Handle Culture',
    content: 'Your handle was your identity. Real names were for the phone book.',
    era: '1980s-2000s',
    keywords: ['handle', 'username', 'identity', 'alias', 'name'],
    relevance: 0.8,
  },

  // Historical Events
  {
    id: 'lore_009',
    category: 'event',
    title: 'Eternal September',
    content: 'September 1993. AOL gave Usenet access to the masses. The old net never recovered.',
    era: '1993',
    keywords: ['september', 'aol', 'usenet', 'internet', 'change'],
    relevance: 0.75,
  },
  {
    id: 'lore_010',
    category: 'event',
    title: 'The Great Modem Tax Scare',
    content: 'In 1987, rumors spread of taxing modem usage. BBSers organized. The tax never came.',
    era: '1987',
    keywords: ['tax', 'modem', 'rumor', 'organize', 'fear'],
    relevance: 0.6,
  },
  {
    id: 'lore_011',
    category: 'event',
    title: 'The Web Arrives',
    content: 'Mid-90s, Netscape brought the web. BBSes started dying. The text era was ending.',
    era: '1994-1995',
    keywords: ['web', 'netscape', 'decline', 'change', 'graphics'],
    relevance: 0.7,
  },

  // Technical Culture
  {
    id: 'lore_012',
    category: 'technology',
    title: 'XMODEM Protocol',
    content: 'Ward Christensen\'s gift to file transfers. Checksums and retries. It just worked.',
    era: '1977',
    keywords: ['xmodem', 'protocol', 'transfer', 'file', 'reliable'],
    relevance: 0.8,
  },
  {
    id: 'lore_013',
    category: 'technology',
    title: 'Door Games',
    content: 'Trade Wars, Legend of the Red Dragon, BRE. Multiplayer gaming before the internet.',
    era: '1980s-1990s',
    keywords: ['door', 'games', 'multiplayer', 'trade wars', 'lord'],
    relevance: 0.85,
  },
  {
    id: 'lore_014',
    category: 'technology',
    title: 'ANSI Art',
    content: 'ASCII extended with color codes. Digital graffiti at 80x25 characters.',
    era: '1980s-1990s',
    keywords: ['ansi', 'art', 'ascii', 'color', 'graphics'],
    relevance: 0.9,
  },
  {
    id: 'lore_015',
    category: 'history',
    title: 'Compuserve and the Walled Gardens',
    content: 'Before the internet, commercial services were islands. $6/hour for text chat.',
    era: '1980s-1990s',
    keywords: ['compuserve', 'commercial', 'cost', 'walled garden', 'expensive'],
    relevance: 0.7,
  },

  // More Culture
  {
    id: 'lore_016',
    category: 'culture',
    title: 'Late Night Sessions',
    content: '2am to 6am had the cheapest long distance rates. The real community came alive after midnight.',
    era: '1980s-1990s',
    keywords: ['night', 'late', 'community', 'rates', 'time'],
    relevance: 0.8,
  },
  {
    id: 'lore_017',
    category: 'culture',
    title: 'The Download Ratio',
    content: 'Upload 1 file, download 10. Ratios kept the file bases fresh. Everyone contributed.',
    era: '1980s-1990s',
    keywords: ['ratio', 'upload', 'download', 'files', 'share'],
    relevance: 0.75,
  },
  {
    id: 'lore_018',
    category: 'culture',
    title: 'Offline Mail Readers',
    content: 'Download message packets, read offline to save connection time. Blue Wave, QWK packets.',
    era: '1980s-1990s',
    keywords: ['offline', 'mail', 'qwk', 'blue wave', 'packets'],
    relevance: 0.7,
  },
];

/**
 * Search lore by keywords
 */
export function searchLore(
  keywords: string[],
  minRelevance: number = 0.5,
  maxResults: number = 3
): LoreEntry[] {
  const scoredLore = loreDatabase.map(entry => {
    const keywordMatches = keywords.filter(keyword =>
      entry.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    );
    const score = (keywordMatches.length / keywords.length) * entry.relevance;

    return { entry, score };
  });

  return scoredLore
    .filter(({ score }) => score >= minRelevance)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ entry }) => entry);
}

/**
 * Get random lore entries
 */
export function getRandomLore(count: number = 1, category?: string): LoreEntry[] {
  const filtered = category
    ? loreDatabase.filter(entry => entry.category === category)
    : loreDatabase;

  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get lore by category
 */
export function getLoreByCategory(category: string): LoreEntry[] {
  return loreDatabase.filter(entry => entry.category === category);
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'with', 'to', 'for', 'of', 'as', 'by', 'from', 'this', 'that',
  ]);

  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .slice(0, 5); // Top 5 keywords
}
