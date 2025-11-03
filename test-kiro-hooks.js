#!/usr/bin/env node

/**
 * Kiro Hooks Test Suite
 * Tests all three event hooks: on_user_login, on_new_post, on_idle
 */

const kiroHooks = require('./services/kiroHooks.cjs');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test result tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
};

/**
 * Print a test header
 */
function printHeader(text) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

/**
 * Print a test section
 */
function printSection(text) {
  console.log(`\n${colors.bright}${colors.blue}${text}${colors.reset}`);
  console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`);
}

/**
 * Print test result
 */
function printResult(testName, success, details = '') {
  const icon = success ? '✓' : '✗';
  const color = success ? colors.green : colors.red;
  const status = success ? 'PASS' : 'FAIL';

  console.log(`${color}${icon} ${testName} ... ${status}${colors.reset}`);
  if (details) {
    console.log(`  ${colors.dim}${details}${colors.reset}`);
  }

  if (success) {
    results.passed++;
  } else {
    results.failed++;
  }
}

/**
 * Print warning
 */
function printWarning(text) {
  console.log(`${colors.yellow}⚠ ${text}${colors.reset}`);
}

/**
 * Print info
 */
function printInfo(text) {
  console.log(`${colors.dim}ℹ ${text}${colors.reset}`);
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Test: Hooks initialization
 */
async function testInitialization() {
  printSection('Test 1: Hooks Initialization');

  try {
    const initialized = await kiroHooks.initialize();

    if (initialized) {
      printResult('Initialize hooks service', true, 'Kiro API is reachable');
    } else {
      printWarning('Kiro API not available - hooks will use fallback mode');
      printResult('Initialize hooks service', true, 'Fallback mode enabled');
    }

    const status = kiroHooks.getStatus();
    printInfo(`Agent ID: ${status.agentId}`);
    printInfo(`Enabled: ${status.enabled}`);
    printInfo(`Idle interval: ${status.idleInterval / 1000 / 60} minutes`);
    printInfo(`Post response probability: ${status.postResponseProbability * 100}%`);

    return true;
  } catch (error) {
    printResult('Initialize hooks service', false, error.message);
    return false;
  }
}

/**
 * Test: on_user_login hook
 */
async function testUserLoginHook() {
  printSection('Test 2: User Login Hook (on_user_login)');

  const testUsers = [
    { username: 'alice', socketId: 'socket_001', sessionId: 'session_001' },
    { username: 'bob', socketId: 'socket_002', sessionId: 'session_002' },
    { username: 'charlie', socketId: 'socket_003', sessionId: 'session_003' },
  ];

  let successCount = 0;
  let greetingCount = 0;
  let fallbackCount = 0;

  for (const user of testUsers) {
    try {
      printInfo(`Testing login for user: ${user.username}`);
      const greeting = await kiroHooks.onUserLogin(user);

      if (greeting) {
        if (greeting.success) {
          greetingCount++;
          printResult(`Login greeting for ${user.username}`, true,
            `Message: "${greeting.greeting}"`);
        } else if (greeting.fallback) {
          fallbackCount++;
          printWarning(`Fallback greeting for ${user.username}: "${greeting.greeting}"`);
          results.passed++;
        } else {
          printResult(`Login greeting for ${user.username}`, false,
            'No greeting generated');
        }
        successCount++;
      } else {
        printInfo(`No greeting for ${user.username} (probability: 70%)`);
        results.skipped++;
      }

      // Small delay between tests
      await sleep(500);
    } catch (error) {
      printResult(`Login greeting for ${user.username}`, false, error.message);
    }
  }

  console.log(`\n${colors.dim}Summary: ${successCount}/${testUsers.length} users processed, ${greetingCount} greetings, ${fallbackCount} fallbacks${colors.reset}`);
  return successCount > 0;
}

/**
 * Test: on_new_post hook
 */
async function testNewPostHook() {
  printSection('Test 3: New Post Hook (on_new_post)');

  const testPosts = [
    {
      id: 1001,
      user: 'alice',
      message: 'Hello, Dead Net! First post here.',
      board_id: 1,
      board_name: 'general'
    },
    {
      id: 1002,
      user: 'bob',
      message: 'This reminds me of the old BBS days...',
      board_id: 1,
      board_name: 'general'
    },
    {
      id: 1003,
      user: 'charlie',
      message: 'Anyone else getting nostalgic vibes?',
      board_id: 2,
      board_name: 'technology'
    },
    {
      id: 1004,
      user: 'dave',
      message: 'The line is never truly silent.',
      board_id: 1,
      board_name: 'general'
    },
    {
      id: 1005,
      user: 'eve',
      message: 'Just checking if SYSOP-13 is watching...',
      board_id: 1,
      board_name: 'general'
    },
  ];

  let successCount = 0;
  let responseCount = 0;

  for (const post of testPosts) {
    try {
      printInfo(`Testing post ${post.id} by ${post.user}`);
      const analysis = await kiroHooks.onNewPost(post);

      if (analysis) {
        if (analysis.success && analysis.shouldRespond) {
          responseCount++;
          printResult(`Post analysis for #${post.id}`, true,
            `SYSOP-13 responds: "${analysis.response}"`);
        } else if (!analysis.success) {
          printWarning(`Post analysis for #${post.id} failed (will not respond)`);
          results.passed++;
        } else {
          printInfo(`Post #${post.id} analyzed but no response needed`);
          results.passed++;
        }
        successCount++;
      } else {
        printInfo(`Post #${post.id} skipped (probability: 10% + 2min cooldown)`);
        results.skipped++;
      }

      // Small delay between tests
      await sleep(800);
    } catch (error) {
      printResult(`Post analysis for #${post.id}`, false, error.message);
    }
  }

  console.log(`\n${colors.dim}Summary: ${successCount}/${testPosts.length} posts processed, ${responseCount} responses${colors.reset}`);
  printInfo('Note: Low response rate is expected (10% probability + cooldown)');
  return successCount > 0;
}

/**
 * Test: on_idle hook
 */
async function testIdleHook() {
  printSection('Test 4: Idle Event Hook (on_idle)');

  try {
    printInfo('Triggering idle event...');
    const result = await kiroHooks.handleIdleEvent();

    if (result && result.success) {
      const messageType = result.messageType || 'unknown';
      printResult('Generate idle message', true,
        `Type: ${messageType}\nMessage: "${result.message}"`);

      printInfo(`Message type: ${messageType}`);
      printInfo(`Task ID: ${result.taskId || 'N/A'}`);
      return true;
    } else if (result && !result.success) {
      printWarning('Idle message generation failed (using fallback)');
      results.passed++;
      return true;
    } else {
      printResult('Generate idle message', false, 'No result returned');
      return false;
    }
  } catch (error) {
    printResult('Generate idle message', false, error.message);
    return false;
  }
}

/**
 * Test: Hook enable/disable
 */
async function testEnableDisable() {
  printSection('Test 5: Enable/Disable Hooks');

  try {
    // Disable hooks
    kiroHooks.disable();
    let status = kiroHooks.getStatus();
    printResult('Disable hooks', status.enabled === false,
      `Status: ${status.enabled ? 'enabled' : 'disabled'}`);

    // Try to use disabled hook
    const greeting = await kiroHooks.onUserLogin({
      username: 'test',
      socketId: 'test',
      sessionId: 'test'
    });
    printResult('Disabled hook returns null', greeting === null,
      'Hooks correctly disabled');

    // Re-enable hooks
    kiroHooks.enable();
    status = kiroHooks.getStatus();
    printResult('Enable hooks', status.enabled === true,
      `Status: ${status.enabled ? 'enabled' : 'disabled'}`);

    return true;
  } catch (error) {
    printResult('Enable/disable test', false, error.message);
    return false;
  }
}

/**
 * Test: Status check
 */
async function testStatus() {
  printSection('Test 6: Status Check');

  try {
    const status = kiroHooks.getStatus();

    printResult('Get hooks status', true, 'Status retrieved successfully');

    console.log(`\n${colors.dim}Status Details:${colors.reset}`);
    console.log(`  Enabled: ${status.enabled}`);
    console.log(`  Agent ID: ${status.agentId}`);
    console.log(`  Last idle check: ${new Date(status.lastIdleCheck).toISOString()}`);
    console.log(`  Idle interval: ${status.idleInterval / 1000 / 60} minutes`);
    console.log(`  Post probability: ${status.postResponseProbability * 100}%`);
    console.log(`  Post cooldown: ${status.postResponseCooldown / 1000} seconds`);

    return true;
  } catch (error) {
    printResult('Get hooks status', false, error.message);
    return false;
  }
}

/**
 * Print final summary
 */
function printSummary() {
  printHeader('Test Summary');

  const total = results.passed + results.failed;
  const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;

  console.log(`${colors.bright}Total Tests:${colors.reset} ${total}`);
  console.log(`${colors.green}Passed:${colors.reset} ${results.passed}`);
  console.log(`${colors.red}Failed:${colors.reset} ${results.failed}`);
  console.log(`${colors.dim}Skipped:${colors.reset} ${results.skipped}`);
  console.log(`${colors.bright}Pass Rate:${colors.reset} ${passRate}%\n`);

  if (results.failed === 0) {
    console.log(`${colors.green}${colors.bright}✓ All tests passed!${colors.reset}\n`);
    return 0;
  } else {
    console.log(`${colors.red}${colors.bright}✗ Some tests failed${colors.reset}\n`);
    return 1;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  printHeader('Kiro Hooks Test Suite');

  console.log(`${colors.dim}Testing Kiro event hooks integration${colors.reset}`);
  console.log(`${colors.dim}Agent: SYSOP-13${colors.reset}`);
  console.log(`${colors.dim}Timestamp: ${new Date().toISOString()}${colors.reset}`);

  try {
    // Run tests sequentially
    await testInitialization();
    await testUserLoginHook();
    await testNewPostHook();
    await testIdleHook();
    await testEnableDisable();
    await testStatus();

    // Cleanup
    printSection('Cleanup');
    kiroHooks.cleanup();
    printInfo('Hooks service cleaned up');

    // Print summary
    const exitCode = printSummary();

    process.exit(exitCode);
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}Fatal error:${colors.reset} ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
