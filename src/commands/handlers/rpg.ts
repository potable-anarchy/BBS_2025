import type { CommandHandler, CommandContext, CommandResult } from '../types';
import * as fmt from '../formatter';

/**
 * Legend of the Red Dragon (LORD) - Classic BBS Door Game
 * Originally created by Seth Able Robinson in 1989
 * This is a faithful recreation that runs as a full-screen TUI game
 */

type GameScreen =
  | 'MAIN_MENU'
  | 'FOREST'
  | 'INN'
  | 'BROTHEL'
  | 'WEAPONS'
  | 'HEALER'
  | 'STATS';

interface LORDPlayer {
  name: string;
  level: number;
  experience: number;
  hp: number;
  maxHp: number;
  strength: number;
  defense: number;
  charm: number;
  gold: number;
  gems: number;
  forestFights: number;
  maxForestFights: number;
  pvpFights: number;
  maxPvpFights: number;
  alive: boolean;
  married: boolean;
  spouse?: string;
  romanceLevel: number;
  hasHadKids: boolean;
  inn_visits: number;
  brothelVisits: number;
  lastPlayed: string;
  killCount: number;
  deathCount: number;
  weapon: string;
  armor: string;
  inGameMode: boolean;
  currentScreen: GameScreen;
}

interface Monster {
  name: string;
  level: number;
  hp: number;
  strength: number;
  defense: number;
  gold: number;
  exp: number;
}

const playerStates = new Map<string, LORDPlayer>();

const MONSTERS: Monster[] = [
  { name: 'Rat', level: 1, hp: 10, strength: 3, defense: 1, gold: 5, exp: 10 },
  { name: 'Goblin', level: 2, hp: 20, strength: 5, defense: 2, gold: 10, exp: 20 },
  { name: 'Hobgoblin', level: 3, hp: 35, strength: 8, defense: 3, gold: 20, exp: 35 },
  { name: 'Orc', level: 4, hp: 50, strength: 12, defense: 5, gold: 35, exp: 55 },
  { name: 'Cyclops', level: 5, hp: 75, strength: 18, defense: 8, gold: 60, exp: 85 },
  { name: 'Troll', level: 6, hp: 100, strength: 25, defense: 12, gold: 90, exp: 120 },
  { name: 'Minotaur', level: 7, hp: 150, strength: 35, defense: 18, gold: 140, exp: 175 },
  { name: 'Gargoyle', level: 8, hp: 200, strength: 45, defense: 25, gold: 200, exp: 250 },
  { name: 'Chimera', level: 9, hp: 275, strength: 60, defense: 35, gold: 300, exp: 350 },
  { name: 'Demon', level: 10, hp: 400, strength: 80, defense: 50, gold: 500, exp: 500 },
  { name: 'Balrog', level: 11, hp: 600, strength: 110, defense: 70, gold: 800, exp: 750 },
  { name: 'Red Dragon', level: 12, hp: 1000, strength: 150, defense: 100, gold: 2000, exp: 1500 },
];

const WEAPONS = [
  { name: 'Stick', cost: 0, strength: 0 },
  { name: 'Dagger', cost: 50, strength: 2 },
  { name: 'Short Sword', cost: 200, strength: 5 },
  { name: 'Long Sword', cost: 1000, strength: 10 },
  { name: 'Huge Axe', cost: 4000, strength: 20 },
  { name: 'Bone Cruncher', cost: 10000, strength: 35 },
  { name: 'Twin Swords', cost: 40000, strength: 60 },
  { name: 'Blood Sword', cost: 150000, strength: 100 },
  { name: 'Death Sword', cost: 1000000, strength: 175 },
];

const ARMORS = [
  { name: 'Cloth', cost: 0, defense: 0 },
  { name: 'Leather Vest', cost: 50, defense: 2 },
  { name: 'Bronze Armor', cost: 200, defense: 5 },
  { name: 'Iron Armor', cost: 1000, defense: 10 },
  { name: 'Graphite Armor', cost: 4000, defense: 20 },
  { name: 'Erdrick\'s Armor', cost: 10000, defense: 35 },
  { name: 'Able\'s Armor', cost: 40000, defense: 60 },
  { name: 'Full Body Armor', cost: 150000, defense: 100 },
  { name: 'Blood Armor', cost: 1000000, defense: 175 },
];

const EXP_PER_LEVEL = [0, 100, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800, 153600, 307200];

const INN_GREETINGS = [
  'Violet smiles at you warmly.',
  'Violet winks at you from across the bar.',
  'Violet asks how your day has been.',
  'Violet offers you a drink on the house.',
  'Violet compliments your bravery.',
  'Violet giggles at your jokes.',
  'Violet says you look strong today.',
  'Violet blushes as you walk in.',
  'Violet leans in close as she pours your drink.',
  'Violet whispers something naughty in your ear.',
  'Violet sits on your lap while you talk.',
  'Violet suggests you come upstairs later...',
];

const INN_RESULTS = [
  'Violet gives you a peck on the cheek! (+2 charm)',
  'Violet holds your hand for a moment. (+1 charm)',
  'You have a wonderful conversation! (+3 charm)',
  'Violet laughs at your stories! (+2 charm)',
  'Violet seems distracted today. (no change)',
  'You accidentally spill your drink. Awkward! (no change)',
  'Violet kisses you passionately! (+4 charm)',
  'You and Violet share an intimate moment... (+5 charm)',
  'Violet takes you upstairs for "dessert"! (+6 charm)',
  'Violet invites you to her room. Things get steamy! (+7 charm)',
  'You spend the night with Violet. *wink wink* (+8 charm)',
];

const BEDROOM_SCENES = [
  'Violet leads you upstairs. The night is young...',
  'You hear the door lock behind you. Violet grins mischievously.',
  'The candles flicker. Violet slowly removes her apron...',
  'Hours later, you stumble downstairs with a satisfied grin.',
  'Violet whispers "Same time tomorrow?" as you leave.',
  '"That was... educational," Violet purrs.',
  'You wake up in Violet\'s bed. She\'s already gone to work.',
];

const BROTHEL_GIRLS = [
  { name: 'Ruby', specialty: 'passionate', cost: 50 },
  { name: 'Sapphire', specialty: 'exotic', cost: 75 },
  { name: 'Jade', specialty: 'experienced', cost: 100 },
  { name: 'Diamond', specialty: 'adventurous', cost: 150 },
  { name: 'Emerald', specialty: 'kinky', cost: 200 },
];

const BROTHEL_ENCOUNTERS = [
  'Ruby takes you to a private room. She knows exactly what you need...',
  'Sapphire performs an exotic dance that leaves you breathless.',
  'Jade shows you techniques you never imagined existed.',
  'Diamond suggests some "adventurous" positions. You happily agree.',
  'Emerald brings out toys and restraints. "Trust me," she purrs.',
  'The girl whispers naughty things in your ear as she undresses.',
  'Hours later, you stumble out completely satisfied.',
  '"Come back soon, handsome!" she calls as you leave.',
  'You discover muscles you didn\'t know you had. Worth it!',
  'She teaches you moves that will surely impress Violet...',
];

const BROTHEL_DISEASES = [
  { name: 'The Drips', effect: 'Strength -5', strPenalty: 5 },
  { name: 'Cupid\'s Itch', effect: 'Charm -10', charmPenalty: 10 },
  { name: 'Lover\'s Curse', effect: 'Defense -5', defPenalty: 5 },
];

function createNewPlayer(name: string): LORDPlayer {
  return {
    name,
    level: 1,
    experience: 0,
    hp: 40,
    maxHp: 40,
    strength: 10,
    defense: 10,
    charm: 10,
    gold: 100,
    gems: 0,
    forestFights: 0,
    maxForestFights: 20,
    pvpFights: 0,
    maxPvpFights: 3,
    alive: true,
    married: false,
    romanceLevel: 0,
    hasHadKids: false,
    inn_visits: 0,
    brothelVisits: 0,
    lastPlayed: new Date().toISOString().split('T')[0],
    killCount: 0,
    deathCount: 0,
    weapon: 'Stick',
    armor: 'Cloth',
    inGameMode: false,
    currentScreen: 'MAIN_MENU',
  };
}

function getPlayer(sessionId: string, username: string): LORDPlayer {
  const key = `${sessionId}:${username}`;
  if (!playerStates.has(key)) {
    playerStates.set(key, createNewPlayer(username));
  }

  const player = playerStates.get(key)!;

  const today = new Date().toISOString().split('T')[0];
  if (player.lastPlayed !== today) {
    player.forestFights = 0;
    player.pvpFights = 0;
    player.inn_visits = 0;
    player.brothelVisits = 0;
    player.lastPlayed = today;
  }

  return player;
}

function savePlayer(sessionId: string, username: string, player: LORDPlayer): void {
  const key = `${sessionId}:${username}`;
  playerStates.set(key, player);
}

function showMainMenu(player: LORDPlayer): string {
  const border = '═'.repeat(77);
  return `
${fmt.ANSI.FG_BRIGHT_RED}${border}${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_YELLOW}        ⚔  LEGEND OF THE RED DRAGON  ⚔${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_CYAN}              By Seth Able Robinson${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_RED}${border}${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_WHITE}${player.name}${fmt.ANSI.RESET} the ${player.alive ? fmt.ANSI.FG_BRIGHT_GREEN + 'Valiant' : fmt.ANSI.FG_RED + 'Dead'}${fmt.ANSI.RESET}${player.married ? fmt.ANSI.FG_BRIGHT_RED + ' ❤ Married to Violet ❤' + fmt.ANSI.RESET : ''}

${fmt.ANSI.FG_YELLOW}Level:${fmt.ANSI.RESET} ${player.level}  ${fmt.ANSI.FG_RED}HP:${fmt.ANSI.RESET} ${player.hp}/${player.maxHp}  ${fmt.ANSI.FG_CYAN}Exp:${fmt.ANSI.RESET} ${player.experience}
${fmt.ANSI.FG_GREEN}Str:${fmt.ANSI.RESET} ${player.strength}  ${fmt.ANSI.FG_BLUE}Def:${fmt.ANSI.RESET} ${player.defense}  ${fmt.ANSI.FG_MAGENTA}Charm:${fmt.ANSI.RESET} ${player.charm}
${fmt.ANSI.FG_BRIGHT_YELLOW}Gold:${fmt.ANSI.RESET} ${player.gold}  ${fmt.ANSI.FG_BRIGHT_CYAN}Gems:${fmt.ANSI.RESET} ${player.gems}

${fmt.ANSI.FG_GREEN}Weapon:${fmt.ANSI.RESET} ${player.weapon}  ${fmt.ANSI.FG_BLUE}Armor:${fmt.ANSI.RESET} ${player.armor}${player.hasHadKids ? '\n' + fmt.ANSI.FG_BRIGHT_CYAN + '👶 You have children with Violet!' + fmt.ANSI.RESET : ''}

${fmt.ANSI.FG_CYAN}─────────────────────────────────────────────────────────────────────────────${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_WHITE}(F)${fmt.ANSI.RESET} orest          ${fmt.ANSI.FG_CYAN}[${player.forestFights}/${player.maxForestFights} fights left]${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_WHITE}(I)${fmt.ANSI.RESET} nn             ${fmt.ANSI.FG_MAGENTA}[Visit Violet the Barmaid]${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_WHITE}(B)${fmt.ANSI.RESET} rothel         ${fmt.ANSI.FG_BRIGHT_RED}[Ladies of the Night]${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_WHITE}(W)${fmt.ANSI.RESET} eapons         ${fmt.ANSI.FG_GREEN}[Buy better equipment]${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_WHITE}(S)${fmt.ANSI.RESET} tats           ${fmt.ANSI.FG_YELLOW}[View detailed stats]${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_WHITE}(H)${fmt.ANSI.RESET} ealer          ${fmt.ANSI.FG_RED}[Restore your health]${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_WHITE}(Q)${fmt.ANSI.RESET} uit            ${fmt.ANSI.FG_BRIGHT_BLACK}[Return to BBS]${fmt.ANSI.RESET}

${fmt.ANSI.FG_CYAN}─────────────────────────────────────────────────────────────────────────────${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}Your command?${fmt.ANSI.RESET}
`.trim();
}

function showStats(player: LORDPlayer): string {
  return `
${fmt.ANSI.FG_BRIGHT_CYAN}═══════════════════════════════════════════════════════════════════════════${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_YELLOW}             PLAYER STATISTICS${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_CYAN}═══════════════════════════════════════════════════════════════════════════${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_WHITE}Name:${fmt.ANSI.RESET}         ${player.name}
${fmt.ANSI.FG_YELLOW}Level:${fmt.ANSI.RESET}        ${player.level}
${fmt.ANSI.FG_CYAN}Experience:${fmt.ANSI.RESET}   ${player.experience} / ${EXP_PER_LEVEL[player.level] || 'MAX'}

${fmt.ANSI.FG_RED}Hit Points:${fmt.ANSI.RESET}   ${player.hp} / ${player.maxHp}
${fmt.ANSI.FG_GREEN}Strength:${fmt.ANSI.RESET}     ${player.strength}
${fmt.ANSI.FG_BLUE}Defense:${fmt.ANSI.RESET}      ${player.defense}
${fmt.ANSI.FG_MAGENTA}Charm:${fmt.ANSI.RESET}        ${player.charm}

${fmt.ANSI.FG_BRIGHT_YELLOW}Gold:${fmt.ANSI.RESET}         ${player.gold}
${fmt.ANSI.FG_BRIGHT_CYAN}Gems:${fmt.ANSI.RESET}         ${player.gems}

${fmt.ANSI.FG_GREEN}Weapon:${fmt.ANSI.RESET}       ${player.weapon}
${fmt.ANSI.FG_BLUE}Armor:${fmt.ANSI.RESET}        ${player.armor}

${fmt.ANSI.FG_WHITE}Status:${fmt.ANSI.RESET}       ${player.alive ? fmt.ANSI.FG_BRIGHT_GREEN + 'ALIVE' : fmt.ANSI.FG_RED + 'DEAD'}${fmt.ANSI.RESET}
${fmt.ANSI.FG_MAGENTA}Married:${fmt.ANSI.RESET}      ${player.married ? 'Yes, to ' + player.spouse : 'No'}

${fmt.ANSI.FG_CYAN}═══════════════════════════════════════════════════════════════════════════${fmt.ANSI.RESET}
${fmt.ANSI.FG_YELLOW}Monsters Slain:${fmt.ANSI.RESET}    ${player.killCount}
${fmt.ANSI.FG_RED}Times Died:${fmt.ANSI.RESET}        ${player.deathCount}
${fmt.ANSI.FG_GREEN}Forest Fights:${fmt.ANSI.RESET}     ${player.forestFights} / ${player.maxForestFights} today
${fmt.ANSI.FG_CYAN}═══════════════════════════════════════════════════════════════════════════${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to return...${fmt.ANSI.RESET}
`.trim();
}

function forestFight(player: LORDPlayer): string {
  if (!player.alive) {
    return fmt.errorMessage('You are DEAD! Visit the healer first!\n\n' + fmt.ANSI.FG_BRIGHT_GREEN + 'Press any key to continue...' + fmt.ANSI.RESET);
  }

  if (player.forestFights >= player.maxForestFights) {
    return fmt.errorMessage('You have no forest fights remaining today!\n\n' + fmt.ANSI.FG_BRIGHT_GREEN + 'Press any key to continue...' + fmt.ANSI.RESET);
  }

  player.forestFights++;

  const monsterPool = MONSTERS.filter(m => m.level <= player.level + 2);
  const monster = { ...monsterPool[Math.floor(Math.random() * monsterPool.length)] };

  let log = `
${fmt.ANSI.FG_BRIGHT_GREEN}You venture into the dark forest...${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_RED}A ${monster.name} attacks!${fmt.ANSI.RESET} (Level ${monster.level})
`;

  let round = 1;
  while (player.hp > 0 && monster.hp > 0) {
    log += `\n${fmt.ANSI.FG_CYAN}-- Round ${round} --${fmt.ANSI.RESET}\n`;

    const playerDmg = Math.max(1, player.strength - Math.floor(monster.defense / 2) + Math.floor(Math.random() * 10));
    monster.hp -= playerDmg;
    log += `${fmt.ANSI.FG_GREEN}You hit for ${playerDmg} damage!${fmt.ANSI.RESET}`;

    if (monster.hp > 0) {
      log += ` ${fmt.ANSI.FG_RED}(${monster.name}: ${monster.hp} HP)${fmt.ANSI.RESET}\n`;
    } else {
      log += `\n`;
    }

    if (monster.hp <= 0) {
      player.experience += monster.exp;
      player.gold += monster.gold;
      player.killCount++;

      log += `\n${fmt.ANSI.FG_BRIGHT_YELLOW}*** VICTORY! ***${fmt.ANSI.RESET}\n`;
      log += `${fmt.ANSI.FG_CYAN}You gain ${monster.exp} experience!${fmt.ANSI.RESET}\n`;
      log += `${fmt.ANSI.FG_YELLOW}You receive ${monster.gold} gold!${fmt.ANSI.RESET}\n`;

      if (player.level < 12 && player.experience >= EXP_PER_LEVEL[player.level]) {
        player.level++;
        player.maxHp += 10;
        player.hp = player.maxHp;
        player.strength += 5;
        player.defense += 5;

        log += `\n${fmt.ANSI.FG_BRIGHT_CYAN}*** LEVEL UP! ***${fmt.ANSI.RESET}\n`;
        log += `${fmt.ANSI.FG_BRIGHT_GREEN}You are now level ${player.level}!${fmt.ANSI.RESET}\n`;
        log += `${fmt.ANSI.FG_GREEN}+10 HP, +5 Strength, +5 Defense${fmt.ANSI.RESET}\n`;
      }

      break;
    }

    const monsterDmg = Math.max(1, monster.strength - Math.floor(player.defense / 2) + Math.floor(Math.random() * 10));
    player.hp -= monsterDmg;
    log += `${fmt.ANSI.FG_RED}${monster.name} hits you for ${monsterDmg} damage!${fmt.ANSI.RESET}`;

    if (player.hp > 0) {
      log += ` ${fmt.ANSI.FG_GREEN}(You: ${player.hp}/${player.maxHp} HP)${fmt.ANSI.RESET}\n`;
    } else {
      log += `\n`;
    }

    if (player.hp <= 0) {
      player.alive = false;
      player.deathCount++;

      log += `\n${fmt.ANSI.FG_BRIGHT_RED}*** YOU HAVE DIED! ***${fmt.ANSI.RESET}\n`;
      log += `${fmt.ANSI.FG_RED}The ${monster.name} has slain you!${fmt.ANSI.RESET}\n`;
      log += `${fmt.ANSI.FG_YELLOW}You must visit the healer to be resurrected!${fmt.ANSI.RESET}\n`;
      break;
    }

    round++;
  }

  log += `\n\n${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}`;
  return log;
}

function visitInn(player: LORDPlayer): string {
  if (!player.married && player.inn_visits >= 3) {
    return `
${fmt.ANSI.FG_BRIGHT_MAGENTA}The Inn${fmt.ANSI.RESET}

${fmt.ANSI.FG_CYAN}Violet says, "I'm exhausted, darling. Come back tomorrow!"${fmt.ANSI.RESET}
${fmt.ANSI.FG_BRIGHT_BLACK}She winks at you suggestively.${fmt.ANSI.RESET}

${fmt.ANSI.FG_YELLOW}(You can only visit the inn 3 times per day... unless you marry her!)${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}
`.trim();
  }

  player.inn_visits++;

  const greeting = INN_GREETINGS[Math.floor(Math.random() * INN_GREETINGS.length)];
  const result = INN_RESULTS[Math.floor(Math.random() * INN_RESULTS.length)];

  const charmMatch = result.match(/\+(\d+) charm/);
  let charmGain = 0;
  if (charmMatch) {
    charmGain = parseInt(charmMatch[1]);
    player.charm += charmGain;

    if (charmGain >= 4) {
      player.romanceLevel = Math.min(10, player.romanceLevel + 1);
    }
  }

  let output = `
${fmt.ANSI.FG_BRIGHT_MAGENTA}╔═══════════════════════════════════════════════════════════════════════════╗
║                              THE INN                                      ║
╚═══════════════════════════════════════════════════════════════════════════╝${fmt.ANSI.RESET}

${fmt.ANSI.FG_MAGENTA}Violet the barmaid looks up as you enter...${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_MAGENTA}${greeting}${fmt.ANSI.RESET}

${fmt.ANSI.FG_CYAN}You spend some time talking with Violet...${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_YELLOW}${result}${fmt.ANSI.RESET}
`;

  if (charmGain >= 6) {
    const scene = BEDROOM_SCENES[Math.floor(Math.random() * BEDROOM_SCENES.length)];
    output += `\n${fmt.ANSI.FG_BRIGHT_RED}${scene}${fmt.ANSI.RESET}\n`;

    if (charmGain >= 7 && Math.random() < 0.15 && !player.hasHadKids) {
      player.hasHadKids = true;
      output += `\n${fmt.ANSI.FG_BRIGHT_YELLOW}*** Nine months later... ***${fmt.ANSI.RESET}\n`;
      output += `${fmt.ANSI.FG_CYAN}Violet tells you she's pregnant! You're going to be a father!${fmt.ANSI.RESET}\n`;
      output += `${fmt.ANSI.FG_GREEN}(+10 Charm for being such a stud!)${fmt.ANSI.RESET}\n`;
      player.charm += 10;
    }
  }

  if (player.romanceLevel >= 8 && !player.married && player.charm >= 40) {
    output += `\n${fmt.ANSI.FG_BRIGHT_MAGENTA}═══════════════════════════════════════════════════════════════════════════${fmt.ANSI.RESET}\n`;
    output += `${fmt.ANSI.FG_BRIGHT_RED}❤${fmt.ANSI.RESET} ${fmt.ANSI.FG_BRIGHT_MAGENTA}Violet looks deeply into your eyes...${fmt.ANSI.RESET} ${fmt.ANSI.FG_BRIGHT_RED}❤${fmt.ANSI.RESET}\n\n`;
    output += `${fmt.ANSI.FG_MAGENTA}"I've fallen for you completely. Will you marry me?"${fmt.ANSI.RESET}\n\n`;
    output += `${fmt.ANSI.FG_CYAN}Type ${fmt.ANSI.FG_BRIGHT_GREEN}Y${fmt.ANSI.RESET}${fmt.ANSI.FG_CYAN} to accept, or any other key to decline...${fmt.ANSI.RESET}\n`;
    output += `${fmt.ANSI.FG_BRIGHT_MAGENTA}═══════════════════════════════════════════════════════════════════════════${fmt.ANSI.RESET}\n`;
    player.currentScreen = 'INN'; // Stay on inn screen for marriage prompt
    return output;
  }

  output += `
${fmt.ANSI.FG_MAGENTA}Current Charm: ${player.charm}${fmt.ANSI.RESET}
${fmt.ANSI.FG_CYAN}Inn visits today: ${player.inn_visits}/3${fmt.ANSI.RESET}
`;

  if (player.romanceLevel > 0) {
    const hearts = '❤'.repeat(Math.min(10, player.romanceLevel));
    output += `${fmt.ANSI.FG_BRIGHT_RED}Romance with Violet: ${hearts}${fmt.ANSI.RESET} (${player.romanceLevel}/10)\n`;
  }

  output += `\n${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}`;

  return output.trim();
}

function showBrothelMenu(player: LORDPlayer): string {
  let output = `
${fmt.ANSI.FG_BRIGHT_RED}╔═══════════════════════════════════════════════════════════════════════════╗
║                        🌹 THE BROTHEL 🌹                                   ║
╚═══════════════════════════════════════════════════════════════════════════╝${fmt.ANSI.RESET}

${fmt.ANSI.FG_RED}Madame Scarlett greets you with a knowing smile...${fmt.ANSI.RESET}
${fmt.ANSI.FG_MAGENTA}"Welcome, darling. My girls are the finest in the realm."${fmt.ANSI.RESET}

${fmt.ANSI.FG_YELLOW}Your gold: ${player.gold}${fmt.ANSI.RESET}
${fmt.ANSI.FG_CYAN}Brothel visits today: ${player.brothelVisits}/3${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_MAGENTA}AVAILABLE GIRLS:${fmt.ANSI.RESET}
`;

  BROTHEL_GIRLS.forEach((girl, i) => {
    const canAfford = player.gold >= girl.cost;
    const color = canAfford ? fmt.ANSI.FG_BRIGHT_WHITE : fmt.ANSI.FG_BRIGHT_BLACK;
    output += `${color}  (${i + 1}) ${girl.name.padEnd(12)} - ${girl.specialty.padEnd(15)} ${girl.cost} gold${fmt.ANSI.RESET}\n`;
  });

  output += `\n${fmt.ANSI.FG_CYAN}Press 1-5 to choose a girl, or any other key to leave...${fmt.ANSI.RESET}`;

  if (player.married) {
    output += `\n\n${fmt.ANSI.FG_YELLOW}⚠ Warning: Violet might not approve of this...${fmt.ANSI.RESET}`;
  }

  return output;
}

function visitBrothel(player: LORDPlayer, girlIndex: number): string {
  if (player.brothelVisits >= 3) {
    return `
${fmt.ANSI.FG_BRIGHT_RED}The Brothel${fmt.ANSI.RESET}

${fmt.ANSI.FG_RED}Madame Scarlett shakes her head.${fmt.ANSI.RESET}
${fmt.ANSI.FG_MAGENTA}"You've had enough fun for one day, tiger. Come back tomorrow!"${fmt.ANSI.RESET}

${fmt.ANSI.FG_YELLOW}(You can only visit the brothel 3 times per day)${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}
`.trim();
  }

  const girl = BROTHEL_GIRLS[girlIndex];
  if (!girl) {
    return fmt.errorMessage('Invalid selection!\n\n' + fmt.ANSI.FG_BRIGHT_GREEN + 'Press any key to continue...' + fmt.ANSI.RESET);
  }

  if (player.gold < girl.cost) {
    return fmt.errorMessage(`Not enough gold! ${girl.name} costs ${girl.cost} gold.\n\n` + fmt.ANSI.FG_BRIGHT_GREEN + 'Press any key to continue...' + fmt.ANSI.RESET);
  }

  player.gold -= girl.cost;
  player.brothelVisits++;

  const encounter1 = BROTHEL_ENCOUNTERS[Math.floor(Math.random() * BROTHEL_ENCOUNTERS.length)];
  const encounter2 = BROTHEL_ENCOUNTERS[Math.floor(Math.random() * BROTHEL_ENCOUNTERS.length)];

  let output = `
${fmt.ANSI.FG_BRIGHT_RED}╔═══════════════════════════════════════════════════════════════════════════╗
║                        🌹 THE BROTHEL 🌹                                   ║
╚═══════════════════════════════════════════════════════════════════════════╝${fmt.ANSI.RESET}

${fmt.ANSI.FG_MAGENTA}You choose ${girl.name}, the ${girl.specialty} one...${fmt.ANSI.RESET}

${fmt.ANSI.FG_RED}${encounter1}${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_RED}${encounter2}${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_YELLOW}*** SATISFIED! ***${fmt.ANSI.RESET}
`;

  const charmGain = Math.floor(girl.cost / 50) + Math.floor(Math.random() * 3);
  player.charm += charmGain;
  output += `${fmt.ANSI.FG_GREEN}+${charmGain} Charm (You learned some new tricks!)${fmt.ANSI.RESET}\n`;

  if (Math.random() < 0.1) {
    const disease = BROTHEL_DISEASES[Math.floor(Math.random() * BROTHEL_DISEASES.length)];
    output += `\n${fmt.ANSI.FG_BRIGHT_RED}⚠ OH NO! ⚠${fmt.ANSI.RESET}\n`;
    output += `${fmt.ANSI.FG_RED}You've contracted: ${disease.name}!${fmt.ANSI.RESET}\n`;
    output += `${fmt.ANSI.FG_YELLOW}Effect: ${disease.effect}${fmt.ANSI.RESET}\n`;

    if (disease.strPenalty) player.strength = Math.max(1, player.strength - disease.strPenalty);
    if (disease.charmPenalty) player.charm = Math.max(1, player.charm - disease.charmPenalty);
    if (disease.defPenalty) player.defense = Math.max(1, player.defense - disease.defPenalty);

    output += `${fmt.ANSI.FG_CYAN}(Visit the healer to cure it!)${fmt.ANSI.RESET}\n`;
  }

  if (player.married && Math.random() < 0.3) {
    output += `\n${fmt.ANSI.FG_BRIGHT_MAGENTA}═══════════════════════════════════════════════════════════════════════════${fmt.ANSI.RESET}\n`;
    output += `${fmt.ANSI.FG_BRIGHT_RED}💔 UH OH! 💔${fmt.ANSI.RESET}\n\n`;
    output += `${fmt.ANSI.FG_RED}Violet found out you visited the brothel!${fmt.ANSI.RESET}\n`;
    output += `${fmt.ANSI.FG_MAGENTA}"How could you?!" she cries.${fmt.ANSI.RESET}\n`;

    player.romanceLevel = Math.max(0, player.romanceLevel - 3);
    output += `${fmt.ANSI.FG_YELLOW}Romance level decreased!${fmt.ANSI.RESET}\n`;
    output += `${fmt.ANSI.FG_BRIGHT_MAGENTA}═══════════════════════════════════════════════════════════════════════════${fmt.ANSI.RESET}\n`;
  }

  output += `\n${fmt.ANSI.FG_YELLOW}Gold remaining: ${player.gold}${fmt.ANSI.RESET}`;
  output += `\n\n${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}`;

  return output.trim();
}

function showWeaponsShop(player: LORDPlayer): string {
  let output = `
${fmt.ANSI.FG_BRIGHT_GREEN}╔═══════════════════════════════════════════════════════════════════════════╗
║                         WEAPONS & ARMOR SHOP                              ║
╚═══════════════════════════════════════════════════════════════════════════╝${fmt.ANSI.RESET}

${fmt.ANSI.FG_YELLOW}Your gold: ${player.gold}${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_CYAN}WEAPONS:${fmt.ANSI.RESET}
`;

  WEAPONS.forEach((weapon, i) => {
    const owned = player.weapon === weapon.name ? ' (EQUIPPED)' : '';
    const canBuy = player.gold >= weapon.cost && player.weapon !== weapon.name;
    const color = canBuy ? fmt.ANSI.FG_BRIGHT_WHITE : fmt.ANSI.FG_BRIGHT_BLACK;
    output += `${color}  (${i + 1}) ${weapon.name.padEnd(20)} +${weapon.strength} Str  ${weapon.cost} gold${owned}${fmt.ANSI.RESET}\n`;
  });

  output += `\n${fmt.ANSI.FG_BRIGHT_CYAN}ARMOR:${fmt.ANSI.RESET}\n`;

  ARMORS.forEach((armor, i) => {
    const owned = player.armor === armor.name ? ' (EQUIPPED)' : '';
    const canBuy = player.gold >= armor.cost && player.armor !== armor.name;
    const color = canBuy ? fmt.ANSI.FG_BRIGHT_WHITE : fmt.ANSI.FG_BRIGHT_BLACK;
    const num = i + 10; // Start at 10 for armor (after weapons)
    output += `${color}  (${num}) ${armor.name.padEnd(20)} +${armor.defense} Def  ${armor.cost} gold${owned}${fmt.ANSI.RESET}\n`;
  });

  output += `\n${fmt.ANSI.FG_CYAN}Press 1-9 for weapons, 10-18 for armor, or any other key to leave...${fmt.ANSI.RESET}`;

  return output;
}

function visitHealer(player: LORDPlayer): string {
  if (player.alive && player.hp === player.maxHp) {
    return `
${fmt.ANSI.FG_BRIGHT_CYAN}The Healer's Sanctuary${fmt.ANSI.RESET}

${fmt.ANSI.FG_GREEN}You are already at full health!${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}
`.trim();
  }

  if (!player.alive) {
    player.alive = true;
    player.hp = player.maxHp;

    return `
${fmt.ANSI.FG_BRIGHT_CYAN}╔═══════════════════════════════════════════════════════════════════════════╗
║                        THE HEALER'S SANCTUARY                             ║
╚═══════════════════════════════════════════════════════════════════════════╝${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_WHITE}The healer waves her hands over your body...${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}*** YOU HAVE BEEN RESURRECTED! ***${fmt.ANSI.RESET}

${fmt.ANSI.FG_GREEN}You are alive again with full health!${fmt.ANSI.RESET}
${fmt.ANSI.FG_CYAN}HP restored: ${player.maxHp}/${player.maxHp}${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}
`.trim();
  }

  const cost = Math.floor((player.maxHp - player.hp) * 0.5);

  if (player.gold < cost) {
    return fmt.errorMessage(`Not enough gold! Healing costs ${cost} gold.\n\n` + fmt.ANSI.FG_BRIGHT_GREEN + 'Press any key to continue...' + fmt.ANSI.RESET);
  }

  player.gold -= cost;
  player.hp = player.maxHp;

  return `
${fmt.ANSI.FG_BRIGHT_CYAN}The Healer's Sanctuary${fmt.ANSI.RESET}

${fmt.ANSI.FG_GREEN}The healer restores your health!${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}HP: ${player.maxHp}/${player.maxHp}${fmt.ANSI.RESET}
${fmt.ANSI.FG_YELLOW}Cost: ${cost} gold${fmt.ANSI.RESET}
${fmt.ANSI.FG_CYAN}Gold remaining: ${player.gold}${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}
`.trim();
}

function marryViolet(player: LORDPlayer): string {
  player.married = true;
  player.spouse = 'Violet';
  player.maxHp += 20;
  player.hp = player.maxHp;
  player.strength += 10;
  player.defense += 10;

  return `
${fmt.ANSI.FG_BRIGHT_RED}╔═══════════════════════════════════════════════════════════════════════════╗
║                            ❤ WEDDING DAY ❤                                ║
╚═══════════════════════════════════════════════════════════════════════════╝${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_MAGENTA}The village gathers as you and Violet exchange vows...${fmt.ANSI.RESET}

${fmt.ANSI.FG_MAGENTA}"I do!" says Violet, tears of joy in her eyes.${fmt.ANSI.RESET}

${fmt.ANSI.FG_CYAN}The crowd erupts in cheers!${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_YELLOW}*** YOU ARE NOW MARRIED TO VIOLET! ***${fmt.ANSI.RESET}

${fmt.ANSI.FG_GREEN}Marriage benefits:${fmt.ANSI.RESET}
${fmt.ANSI.FG_CYAN}• +20 Max HP${fmt.ANSI.RESET}
${fmt.ANSI.FG_CYAN}• +10 Strength${fmt.ANSI.RESET}
${fmt.ANSI.FG_CYAN}• +10 Defense${fmt.ANSI.RESET}
${fmt.ANSI.FG_CYAN}• Unlimited inn visits!${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_RED}❤ Love conquers all! ❤${fmt.ANSI.RESET}

${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}
`.trim();
}

export const rpgCommand: CommandHandler = {
  name: 'LORD',
  description: 'Play Legend of the Red Dragon - Classic BBS RPG',
  usage: 'LORD',
  aliases: ['RPG', 'GAME'],
  requiresAuth: true,

  execute: async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const player = getPlayer(context.sessionId, context.username);

    // First time entering - show welcome and main menu
    if (!player.inGameMode) {
      player.inGameMode = true;
      player.currentScreen = 'MAIN_MENU';
      savePlayer(context.sessionId, context.username, player);

      const welcome = `
${fmt.ANSI.FG_BRIGHT_YELLOW}╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   Welcome to LEGEND OF THE RED DRAGON!                                   ║
║                                                                           ║
║   You are entering game mode. All commands will be processed             ║
║   within the game until you quit.                                        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝${fmt.ANSI.RESET}

${showMainMenu(player)}
`;

      return {
        success: true,
        output: welcome,
        data: { inGameMode: true },
      };
    }

    // Process game commands
    const input = args.join(' ').toUpperCase();
    let output = '';

    try {
      // Handle screens that need specific input
      if (player.currentScreen === 'INN' && player.romanceLevel >= 8 && !player.married && player.charm >= 40) {
        if (input === 'Y' || input === 'YES') {
          output = marryViolet(player);
          player.currentScreen = 'MAIN_MENU';
        } else {
          output = `${fmt.ANSI.FG_YELLOW}You decline Violet's proposal. Maybe another time...${fmt.ANSI.RESET}\n\n${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}`;
          player.currentScreen = 'MAIN_MENU';
        }
        savePlayer(context.sessionId, context.username, player);
        return { success: true, output, data: { inGameMode: true } };
      }

      // Handle brothel girl selection
      if (player.currentScreen === 'BROTHEL') {
        const girlNum = parseInt(input);
        if (!isNaN(girlNum) && girlNum >= 1 && girlNum <= 5) {
          output = visitBrothel(player, girlNum - 1);
        }
        player.currentScreen = 'MAIN_MENU';
        savePlayer(context.sessionId, context.username, player);
        if (output) {
          return { success: true, output, data: { inGameMode: true } };
        }
      }

      // Handle weapon/armor shop
      if (player.currentScreen === 'WEAPONS') {
        const itemNum = parseInt(input);
        if (!isNaN(itemNum)) {
          if (itemNum >= 1 && itemNum <= 9) {
            // Weapon
            const weapon = WEAPONS[itemNum - 1];
            if (weapon && player.gold >= weapon.cost && player.weapon !== weapon.name) {
              player.gold -= weapon.cost;
              const oldWeapon = WEAPONS.find(w => w.name === player.weapon);
              if (oldWeapon) player.strength -= oldWeapon.strength;
              player.weapon = weapon.name;
              player.strength += weapon.strength;
              output = `${fmt.ANSI.FG_BRIGHT_GREEN}Purchased ${weapon.name}!${fmt.ANSI.RESET}\n\n${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}`;
            }
          } else if (itemNum >= 10 && itemNum <= 18) {
            // Armor
            const armor = ARMORS[itemNum - 10];
            if (armor && player.gold >= armor.cost && player.armor !== armor.name) {
              player.gold -= armor.cost;
              const oldArmor = ARMORS.find(a => a.name === player.armor);
              if (oldArmor) player.defense -= oldArmor.defense;
              player.armor = armor.name;
              player.defense += armor.defense;
              output = `${fmt.ANSI.FG_BRIGHT_GREEN}Purchased ${armor.name}!${fmt.ANSI.RESET}\n\n${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}`;
            }
          }
        }
        player.currentScreen = 'MAIN_MENU';
        savePlayer(context.sessionId, context.username, player);
        if (output) {
          return { success: true, output, data: { inGameMode: true } };
        }
      }

      // Main menu navigation
      if (!input || input === 'M') {
        output = showMainMenu(player);
      } else if (input === 'F') {
        output = forestFight(player);
        savePlayer(context.sessionId, context.username, player);
      } else if (input === 'I') {
        output = visitInn(player);
        savePlayer(context.sessionId, context.username, player);
      } else if (input === 'B') {
        if (player.brothelVisits >= 3) {
          output = `${fmt.ANSI.FG_RED}You've visited the brothel enough for today!${fmt.ANSI.RESET}\n\n${fmt.ANSI.FG_BRIGHT_GREEN}Press any key to continue...${fmt.ANSI.RESET}`;
        } else {
          player.currentScreen = 'BROTHEL';
          output = showBrothelMenu(player);
          return { success: true, output, data: { inGameMode: true } };
        }
      } else if (input === 'W') {
        player.currentScreen = 'WEAPONS';
        output = showWeaponsShop(player);
        return { success: true, output, data: { inGameMode: true } };
      } else if (input === 'S') {
        output = showStats(player);
      } else if (input === 'H') {
        output = visitHealer(player);
        savePlayer(context.sessionId, context.username, player);
      } else if (input === 'Q' || input === 'QUIT' || input === 'EXIT') {
        player.inGameMode = false;
        savePlayer(context.sessionId, context.username, player);
        return {
          success: true,
          output: `${fmt.ANSI.FG_BRIGHT_YELLOW}Thanks for playing LORD!${fmt.ANSI.RESET}\n${fmt.ANSI.FG_CYAN}Your progress has been saved.${fmt.ANSI.RESET}`,
          data: { inGameMode: false },
        };
      } else {
        // Any other key returns to main menu
        output = showMainMenu(player);
      }

      return {
        success: true,
        output,
        data: { inGameMode: true },
      };
    } catch (error) {
      return {
        success: false,
        output: fmt.errorMessage(`LORD error: ${error instanceof Error ? error.message : 'Unknown error'}`),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};
