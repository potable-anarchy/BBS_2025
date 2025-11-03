/**
 * Kiro API Integration Test
 * Tests connectivity and basic functionality of Kiro API
 */

const fetch = require('node-fetch');
require('dotenv').config();

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001/api';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * Log test result
 */
function logTest(name, passed, message = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`${colors.green}✓${colors.reset} ${name}`);
  } else {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    if (message) {
      console.log(`  ${colors.red}${message}${colors.reset}`);
    }
  }
}

/**
 * Log section header
 */
function logSection(title) {
  console.log(`\n${colors.cyan}${title}${colors.reset}`);
  console.log('='.repeat(title.length));
}

/**
 * Make API request
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const data = await response.json();
    return { response, data };
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

/**
 * Test 1: Health Check
 */
async function testHealthCheck() {
  logSection('Health Check Tests');

  try {
    const { response, data } = await apiRequest('/kiro/health');

    logTest(
      'Health endpoint returns response',
      response.status === 200 || response.status === 503
    );

    logTest(
      'Health response has required fields',
      data.hasOwnProperty('healthy') && data.hasOwnProperty('timestamp')
    );

    if (data.healthy) {
      console.log(`  ${colors.green}Kiro API is healthy${colors.reset}`);
    } else {
      console.log(`  ${colors.yellow}Kiro API health check failed:${colors.reset}`, data.details);
    }
  } catch (error) {
    logTest('Health endpoint accessible', false, error.message);
  }
}

/**
 * Test 2: Ping Endpoint
 */
async function testPing() {
  logSection('Ping Tests');

  try {
    const { response, data } = await apiRequest('/kiro/ping');

    logTest('Ping endpoint returns response', !!data);
    logTest('Ping response has success field', data.hasOwnProperty('success'));
    logTest('Ping response has timestamp', data.hasOwnProperty('timestamp'));

    if (data.success) {
      console.log(`  ${colors.green}Ping successful${colors.reset}`);
      if (data.data) {
        console.log(`  Version: ${data.data.version || 'N/A'}`);
        console.log(`  Status: ${data.data.status || 'N/A'}`);
      }
    } else {
      console.log(`  ${colors.yellow}Ping failed:${colors.reset}`, data.error?.message);
    }
  } catch (error) {
    logTest('Ping endpoint accessible', false, error.message);
  }
}

/**
 * Test 3: Get Agents
 */
async function testGetAgents() {
  logSection('Agent Discovery Tests');

  try {
    const { response, data } = await apiRequest('/kiro/agents');

    logTest('Agents endpoint returns response', !!data);
    logTest('Agents response has success field', data.hasOwnProperty('success'));

    if (data.success && data.data) {
      const agents = Array.isArray(data.data) ? data.data : [];
      logTest('Agents returned as array', Array.isArray(agents));
      console.log(`  ${colors.green}Found ${agents.length} agent(s)${colors.reset}`);

      agents.forEach((agent, index) => {
        console.log(`  Agent ${index + 1}:`);
        console.log(`    ID: ${agent.id}`);
        console.log(`    Name: ${agent.name}`);
        console.log(`    Status: ${agent.status}`);
        if (agent.capabilities) {
          console.log(`    Capabilities: ${agent.capabilities.join(', ')}`);
        }
      });

      return agents;
    } else {
      console.log(`  ${colors.yellow}No agents found or error:${colors.reset}`, data.error?.message);
      return [];
    }
  } catch (error) {
    logTest('Agents endpoint accessible', false, error.message);
    return [];
  }
}

/**
 * Test 4: Get Specific Agent
 */
async function testGetAgent(agentId) {
  if (!agentId) {
    console.log(`  ${colors.yellow}Skipping - no agent ID available${colors.reset}`);
    return;
  }

  logSection('Single Agent Tests');

  try {
    const { response, data } = await apiRequest(`/kiro/agents/${agentId}`);

    logTest('Single agent endpoint returns response', !!data);

    if (data.success && data.data) {
      logTest('Agent data has required fields',
        data.data.id && data.data.name && data.data.status
      );
      console.log(`  ${colors.green}Agent details retrieved${colors.reset}`);
    } else {
      console.log(`  ${colors.yellow}Agent not found:${colors.reset}`, data.error?.message);
    }
  } catch (error) {
    logTest('Single agent endpoint accessible', false, error.message);
  }
}

/**
 * Test 5: Check Agent Health
 */
async function testAgentHealth(agentId) {
  if (!agentId) {
    console.log(`  ${colors.yellow}Skipping - no agent ID available${colors.reset}`);
    return;
  }

  logSection('Agent Health Tests');

  try {
    const { response, data } = await apiRequest(`/kiro/agents/${agentId}/health`);

    logTest('Agent health endpoint returns response', !!data);

    if (data.success && data.data) {
      logTest('Agent health has status', data.data.hasOwnProperty('healthy'));
      console.log(`  ${colors.green}Agent health status: ${data.data.healthy ? 'Healthy' : 'Unhealthy'}${colors.reset}`);
    } else {
      console.log(`  ${colors.yellow}Health check failed:${colors.reset}`, data.error?.message);
    }
  } catch (error) {
    logTest('Agent health endpoint accessible', false, error.message);
  }
}

/**
 * Test 6: Submit Task (Optional - requires valid agent)
 */
async function testSubmitTask(agentId) {
  if (!agentId) {
    console.log(`  ${colors.yellow}Skipping task submission - no agent ID available${colors.reset}`);
    return null;
  }

  logSection('Task Submission Tests');

  try {
    const task = {
      prompt: 'Test task: Respond with "OK"',
      context: { test: true },
      priority: 'low',
    };

    const { response, data } = await apiRequest(
      `/kiro/agents/${agentId}/tasks`,
      {
        method: 'POST',
        body: JSON.stringify(task),
      }
    );

    logTest('Task submission endpoint returns response', !!data);

    if (data.success && data.data) {
      logTest('Task response has taskId', !!data.data.taskId);
      console.log(`  ${colors.green}Task submitted: ${data.data.taskId}${colors.reset}`);
      console.log(`  Status: ${data.data.status}`);
      return data.data.taskId;
    } else {
      console.log(`  ${colors.yellow}Task submission failed:${colors.reset}`, data.error?.message);
      return null;
    }
  } catch (error) {
    logTest('Task submission endpoint accessible', false, error.message);
    return null;
  }
}

/**
 * Test 7: Get Task Status
 */
async function testGetTaskStatus(agentId, taskId) {
  if (!agentId || !taskId) {
    console.log(`  ${colors.yellow}Skipping - no agent ID or task ID available${colors.reset}`);
    return;
  }

  logSection('Task Status Tests');

  try {
    const { response, data } = await apiRequest(
      `/kiro/agents/${agentId}/tasks/${taskId}`
    );

    logTest('Task status endpoint returns response', !!data);

    if (data.success && data.data) {
      console.log(`  ${colors.green}Task status: ${data.data.status}${colors.reset}`);
      if (data.data.result) {
        console.log(`  Result: ${JSON.stringify(data.data.result)}`);
      }
    } else {
      console.log(`  ${colors.yellow}Task status check failed:${colors.reset}`, data.error?.message);
    }
  } catch (error) {
    logTest('Task status endpoint accessible', false, error.message);
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`${colors.blue}
╔═══════════════════════════════════════════╗
║   Kiro API Integration Test Suite        ║
╚═══════════════════════════════════════════╝${colors.reset}
`);

  console.log(`Testing against: ${colors.yellow}${API_BASE_URL}${colors.reset}\n`);

  // Check if server is running
  try {
    await apiRequest('/');
  } catch (error) {
    console.log(`${colors.red}ERROR: Cannot connect to server at ${API_BASE_URL}${colors.reset}`);
    console.log(`${colors.yellow}Please ensure the server is running with: npm run dev:server${colors.reset}\n`);
    process.exit(1);
  }

  // Run all tests
  await testHealthCheck();
  await testPing();
  const agents = await testGetAgents();

  // Test specific agent if available
  const agentId = agents.length > 0 ? agents[0].id : null;
  await testGetAgent(agentId);
  await testAgentHealth(agentId);

  // Optional task tests (may fail if API is in mock mode)
  const taskId = await testSubmitTask(agentId);
  if (taskId) {
    // Wait a bit for task to process
    await new Promise(resolve => setTimeout(resolve, 2000));
    await testGetTaskStatus(agentId, taskId);
  }

  // Print summary
  console.log(`\n${colors.cyan}Test Summary${colors.reset}`);
  console.log('='.repeat(50));
  console.log(`Total Tests:  ${totalTests}`);
  console.log(`${colors.green}Passed:       ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed:       ${failedTests}${colors.reset}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

  if (failedTests === 0) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.yellow}⚠ Some tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
