/**
 * The Dead Net - ASCII Art Demo
 *
 * Run this file to see a demonstration of all available ASCII art assets.
 * Usage: node ascii-demo.js
 */

const ascii = require('./ascii-art');

// Helper to add spacing between demos
function separator(title = '') {
  console.log('\n\n');
  if (title) {
    console.log(ascii.createDivider(title, '═', 75));
  } else {
    console.log(ascii.UI_ELEMENTS.dividers.heavy);
  }
  console.log('\n');
}

// Clear console and start demo
console.clear();

// ============================================================================
// LOGOS DEMO
// ============================================================================

separator('LOGOS DEMONSTRATION');

console.log('1. Main Logo (for splash screens):');
console.log(ascii.LOGOS.main);

separator();

console.log('2. Compact Logo (for headers):');
console.log(ascii.LOGOS.compact);

separator();

console.log('3. Mini Logo (for small spaces):');
console.log(ascii.LOGOS.mini);

separator();

console.log('4. Simple Logo:');
console.log(ascii.LOGOS.simple);

// ============================================================================
// BOARD HEADERS DEMO
// ============================================================================

separator('BOARD HEADERS DEMONSTRATION');

console.log('1. General Discussion Board:');
console.log(ascii.BOARD_HEADERS.general);

separator();

console.log('2. Technology Board:');
console.log(ascii.BOARD_HEADERS.tech);

separator();

console.log('3. News Board:');
console.log(ascii.BOARD_HEADERS.news);

separator();

console.log('4. Private Messages:');
console.log(ascii.BOARD_HEADERS.messages);

separator();

console.log('5. File Archives:');
console.log(ascii.BOARD_HEADERS.files);

separator();

console.log('6. User Directory:');
console.log(ascii.BOARD_HEADERS.users);

separator();

console.log('7. Administration (Restricted):');
console.log(ascii.BOARD_HEADERS.admin);

// ============================================================================
// SYSTEM MESSAGES DEMO
// ============================================================================

separator('SYSTEM MESSAGES DEMONSTRATION');

console.log('1. Welcome Screen:');
console.log(ascii.SYSTEM_MESSAGES.welcome);

separator();

console.log('2. Loading:');
console.log(ascii.SYSTEM_MESSAGES.loading);

separator();

console.log('3. Connected:');
console.log(ascii.SYSTEM_MESSAGES.connected);

separator();

console.log('4. Error:');
console.log(ascii.SYSTEM_MESSAGES.error);

separator();

console.log('5. Disconnected:');
console.log(ascii.SYSTEM_MESSAGES.disconnected);

separator();

console.log('6. Access Denied:');
console.log(ascii.SYSTEM_MESSAGES.accessDenied);

separator();

console.log('7. Login:');
console.log(ascii.SYSTEM_MESSAGES.login);

separator();

console.log('8. Login Success:');
console.log(ascii.SYSTEM_MESSAGES.loginSuccess);

separator();

console.log('9. Goodbye:');
console.log(ascii.SYSTEM_MESSAGES.goodbye);

// ============================================================================
// UI ELEMENTS DEMO
// ============================================================================

separator('UI ELEMENTS DEMONSTRATION');

console.log('1. Dividers:');
console.log('   Heavy:  ' + ascii.UI_ELEMENTS.dividers.heavy.substring(0, 50));
console.log('   Light:  ' + ascii.UI_ELEMENTS.dividers.light.substring(0, 50));
console.log('   Double: ' + ascii.UI_ELEMENTS.dividers.double.substring(0, 50));
console.log('   Dashed: ' + ascii.UI_ELEMENTS.dividers.dashed.substring(0, 50));
console.log('   Dotted: ' + ascii.UI_ELEMENTS.dividers.dotted.substring(0, 50));
console.log('   Wave:   ' + ascii.UI_ELEMENTS.dividers.wave.substring(0, 50));

separator();

console.log('2. Box Styles:');
const boxes = ascii.UI_ELEMENTS.boxes;

console.log('\n   Single Line:');
console.log('   ' + boxes.single.topLeft + boxes.single.horizontal.repeat(20) + boxes.single.topRight);
console.log('   ' + boxes.single.vertical + ' Single Line Box    ' + boxes.single.vertical);
console.log('   ' + boxes.single.bottomLeft + boxes.single.horizontal.repeat(20) + boxes.single.bottomRight);

console.log('\n   Double Line:');
console.log('   ' + boxes.double.topLeft + boxes.double.horizontal.repeat(20) + boxes.double.topRight);
console.log('   ' + boxes.double.vertical + ' Double Line Box    ' + boxes.double.vertical);
console.log('   ' + boxes.double.bottomLeft + boxes.double.horizontal.repeat(20) + boxes.double.bottomRight);

console.log('\n   Heavy Line:');
console.log('   ' + boxes.heavy.topLeft + boxes.heavy.horizontal.repeat(20) + boxes.heavy.topRight);
console.log('   ' + boxes.heavy.vertical + ' Heavy Line Box     ' + boxes.heavy.vertical);
console.log('   ' + boxes.heavy.bottomLeft + boxes.heavy.horizontal.repeat(20) + boxes.heavy.bottomRight);

console.log('\n   Rounded:');
console.log('   ' + boxes.rounded.topLeft + boxes.rounded.horizontal.repeat(20) + boxes.rounded.topRight);
console.log('   ' + boxes.rounded.vertical + ' Rounded Box        ' + boxes.rounded.vertical);
console.log('   ' + boxes.rounded.bottomLeft + boxes.rounded.horizontal.repeat(20) + boxes.rounded.bottomRight);

separator();

console.log('3. Indicators:');
console.log('   ' + ascii.UI_ELEMENTS.indicators.bullet + ' Bullet point');
console.log('   ' + ascii.UI_ELEMENTS.indicators.arrow + ' Arrow');
console.log('   ' + ascii.UI_ELEMENTS.indicators.pointer + ' Pointer');
console.log('   ' + ascii.UI_ELEMENTS.indicators.check + ' Check mark');
console.log('   ' + ascii.UI_ELEMENTS.indicators.cross + ' Cross mark');
console.log('   ' + ascii.UI_ELEMENTS.indicators.star + ' Star');
console.log('   ' + ascii.UI_ELEMENTS.indicators.diamond + ' Diamond');
console.log('   ' + ascii.UI_ELEMENTS.indicators.circle + ' Circle filled');
console.log('   ' + ascii.UI_ELEMENTS.indicators.circleEmpty + ' Circle empty');
console.log('   ' + ascii.UI_ELEMENTS.indicators.arrowRight + ' Arrow right');
console.log('   ' + ascii.UI_ELEMENTS.indicators.arrowLeft + ' Arrow left');

separator();

console.log('4. Status Indicators:');
console.log('   ' + ascii.UI_ELEMENTS.status.online);
console.log('   ' + ascii.UI_ELEMENTS.status.offline);
console.log('   ' + ascii.UI_ELEMENTS.status.away);
console.log('   ' + ascii.UI_ELEMENTS.status.busy);
console.log('   ' + ascii.UI_ELEMENTS.status.connecting);
console.log('   ' + ascii.UI_ELEMENTS.status.error);
console.log('   ' + ascii.UI_ELEMENTS.status.success);
console.log('   ' + ascii.UI_ELEMENTS.status.warning);
console.log('   ' + ascii.UI_ELEMENTS.status.info);

separator();

console.log('5. Progress Bars:');
console.log('   ' + ascii.createProgressBar(0, 50, 'blocks'));
console.log('   ' + ascii.createProgressBar(25, 50, 'blocks'));
console.log('   ' + ascii.createProgressBar(50, 50, 'blocks'));
console.log('   ' + ascii.createProgressBar(75, 50, 'blocks'));
console.log('   ' + ascii.createProgressBar(100, 50, 'blocks'));

console.log('\n   Shade style:');
console.log('   ' + ascii.createProgressBar(60, 50, 'bars'));

separator();

console.log('6. Spinner Characters (animation frames):');
console.log('   Dots:   ' + ascii.UI_ELEMENTS.spinners.dots.join(' '));
console.log('   Line:   ' + ascii.UI_ELEMENTS.spinners.line.join(' '));
console.log('   Arrow:  ' + ascii.UI_ELEMENTS.spinners.arrow.join(' '));
console.log('   Bounce: ' + ascii.UI_ELEMENTS.spinners.bounce.join(' '));

separator();

console.log('7. Decorative Patterns:');
console.log('   Shade:  ' + ascii.UI_ELEMENTS.patterns.shade.join(' '));
console.log('   Wave:   ' + ascii.UI_ELEMENTS.patterns.wave);
console.log('   Stars:  ' + ascii.UI_ELEMENTS.patterns.stars);
console.log('   Blocks: ' + ascii.UI_ELEMENTS.patterns.blocks);

// ============================================================================
// MENUS DEMO
// ============================================================================

separator('MENUS DEMONSTRATION');

console.log('1. Main Menu:');
console.log(ascii.MENUS.main);

separator();

console.log('2. Board List:');
console.log(ascii.MENUS.boardList);

// ============================================================================
// HELPER FUNCTIONS DEMO
// ============================================================================

separator('HELPER FUNCTIONS DEMONSTRATION');

console.log('1. createBox() function:');
console.log(ascii.createBox('This is a custom message box\nwith multiple lines\nand centered content', 60, 'double'));

separator();

console.log('2. createDivider() function:');
console.log(ascii.createDivider('', '═', 75));
console.log(ascii.createDivider('SECTION TITLE', '═', 75));
console.log(ascii.createDivider('NEWS', '─', 75));
console.log(ascii.createDivider('', '~', 75));

separator();

console.log('3. createStatusLine() function:');
console.log(ascii.createStatusLine('User: ghost_rider', 'Online: 42 users', 75));
console.log(ascii.createStatusLine('Messages: 3 new', 'Last login: 2 hours ago', 75));
console.log(ascii.createStatusLine('Board: Technology', 'Posts: 1,234', 75));

separator();

console.log('4. createMenuItem() function:');
console.log(ascii.createMenuItem('1', 'General Discussion', 'Last: 2 min ago', false));
console.log(ascii.createMenuItem('2', 'Technology Board', 'Last: 5 min ago', true));
console.log(ascii.createMenuItem('3', 'News Feed', 'Last: 10 min ago', false));
console.log(ascii.createMenuItem('B', 'Back to Main Menu', '', false));

separator();

console.log('5. createProgressBar() function with different styles:');
console.log('   Blocks: ' + ascii.createProgressBar(65, 40, 'blocks'));
console.log('   Bars:   ' + ascii.createProgressBar(65, 40, 'bars'));
console.log('   Dots:   ' + ascii.createProgressBar(65, 40, 'dots'));

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

separator('PRACTICAL USAGE EXAMPLES');

console.log('Example 1: Message Board Post');
console.log(ascii.BOARD_HEADERS.tech);
console.log('\n');
console.log(ascii.createBox(
  'Subject: New JavaScript Framework Released\n' +
  'Author: coder42\n' +
  'Date: 2025-01-15 14:30\n' +
  '\n' +
  'Check out this new framework that promises\n' +
  'to revolutionize web development...',
  75,
  'single'
));
console.log('\n');
console.log(ascii.createStatusLine('[R]eply  [N]ext  [P]revious', '[B]ack to Board List'));

separator();

console.log('Example 2: User Profile Card');
const profileBox =
  '╔═══════════════════════════════════════════════════════════════════════════╗\n' +
  '║  ' + ascii.UI_ELEMENTS.indicators.star + ' USER PROFILE                                                         ║\n' +
  '║                                                                           ║\n' +
  '║  Username:    ghost_rider                 ' + ascii.UI_ELEMENTS.status.online + '                  ║\n' +
  '║  Join Date:   2025-01-01                                                  ║\n' +
  '║  Posts:       1,234                                                       ║\n' +
  '║  Reputation:  ' + ascii.UI_ELEMENTS.indicators.star.repeat(5) + '                                                    ║\n' +
  '║                                                                           ║\n' +
  '║  Bio: Retro computing enthusiast and BBS veteran                         ║\n' +
  '║                                                                           ║\n' +
  '╚═══════════════════════════════════════════════════════════════════════════╝';
console.log(profileBox);

separator();

console.log('Example 3: File Download Progress');
console.log(ascii.BOARD_HEADERS.files);
console.log('\n');
console.log('  Downloading: retro-game-pack.zip');
console.log('  ' + ascii.createProgressBar(78, 60, 'blocks'));
console.log('  Speed: 128 KB/s  |  Time remaining: 00:03:45');

separator();

console.log('Example 4: Live Chat Interface');
console.log(ascii.LOGOS.compact);
console.log('\n' + ascii.createDivider('LIVE CHAT', '─', 75));
console.log('\n');
console.log('[14:32] <ghost_rider> Anyone remember dial-up modems?');
console.log('[14:33] <retro_fan> ' + ascii.UI_ELEMENTS.indicators.star + ' Those were the days!');
console.log('[14:34] <newbie_88> What\'s a modem?');
console.log('[14:35] <sysop> Type /help for commands');
console.log('\n' + ascii.UI_ELEMENTS.dividers.dashed);
console.log(ascii.createStatusLine('Users in room: 15', 'Type your message:'));

separator('END OF DEMO');

console.log('\n');
console.log('For more information, see ASCII-ART-GUIDE.md');
console.log('\n');
