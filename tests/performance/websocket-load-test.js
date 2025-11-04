/**
 * WebSocket Performance Load Test
 *
 * Tests WebSocket performance under various load conditions:
 * - Connection stability
 * - Message throughput
 * - Latency measurements
 *
 * Usage: node tests/performance/websocket-load-test.js
 */

const { io } = require('socket.io-client');

// Configuration
const CONFIG = {
  serverUrl: process.env.SOCKET_URL || 'http://localhost:3001',
  concurrentConnections: parseInt(process.env.CONNECTIONS || '50'),
  messagesPerClient: parseInt(process.env.MESSAGES || '10'),
  messageInterval: parseInt(process.env.INTERVAL || '1000'), // ms
};

// Metrics
const metrics = {
  connectionsSucceeded: 0,
  connectionsFailed: 0,
  messagesSent: 0,
  messagesReceived: 0,
  latencies: [],
  errors: [],
  startTime: null,
  endTime: null,
};

/**
 * Create a test client connection
 */
function createTestClient(clientId) {
  return new Promise((resolve, reject) => {
    const startConnect = Date.now();

    const socket = io(CONFIG.serverUrl, {
      auth: {
        userId: `test-client-${clientId}`,
        username: `TestUser${clientId}`,
        boardId: 'test-board',
      },
      reconnection: false,
      timeout: 10000,
    });

    const clientMetrics = {
      id: clientId,
      connected: false,
      messagesSent: 0,
      messagesReceived: 0,
      latencies: [],
      connectTime: null,
    };

    socket.on('connect', () => {
      clientMetrics.connected = true;
      clientMetrics.connectTime = Date.now() - startConnect;
      metrics.connectionsSucceeded++;

      console.log(`[Client ${clientId}] Connected in ${clientMetrics.connectTime}ms`);

      // Listen for chat messages
      socket.on('chat:message', (data) => {
        clientMetrics.messagesReceived++;
        metrics.messagesReceived++;

        // Calculate latency if it's our own message
        if (data.messageId && clientMetrics.sentTimestamps?.[data.messageId]) {
          const latency = Date.now() - clientMetrics.sentTimestamps[data.messageId];
          clientMetrics.latencies.push(latency);
          metrics.latencies.push(latency);
        }
      });

      resolve({ socket, clientMetrics });
    });

    socket.on('connect_error', (error) => {
      metrics.connectionsFailed++;
      metrics.errors.push({
        clientId,
        type: 'connect_error',
        message: error.message,
      });
      console.error(`[Client ${clientId}] Connection error:`, error.message);
      reject(error);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Client ${clientId}] Disconnected:`, reason);
    });

    socket.on('error', (error) => {
      metrics.errors.push({
        clientId,
        type: 'socket_error',
        message: error.message,
      });
      console.error(`[Client ${clientId}] Socket error:`, error.message);
    });
  });
}

/**
 * Send test messages from a client
 */
async function sendTestMessages(socket, clientMetrics) {
  clientMetrics.sentTimestamps = {};

  for (let i = 0; i < CONFIG.messagesPerClient; i++) {
    await new Promise((resolve) => setTimeout(resolve, CONFIG.messageInterval));

    const messageId = `${clientMetrics.id}-${i}`;
    const timestamp = Date.now();

    clientMetrics.sentTimestamps[messageId] = timestamp;

    socket.emit('chat:send', {
      message: `Test message ${i} from client ${clientMetrics.id}`,
      messageId,
    });

    clientMetrics.messagesSent++;
    metrics.messagesSent++;

    if ((i + 1) % 5 === 0) {
      console.log(`[Client ${clientMetrics.id}] Sent ${i + 1}/${CONFIG.messagesPerClient} messages`);
    }
  }

  console.log(`[Client ${clientMetrics.id}] Completed sending all messages`);
}

/**
 * Calculate statistics
 */
function calculateStats(values) {
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / sorted.length,
    p50: sorted[Math.floor(sorted.length * 0.5)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
  };
}

/**
 * Generate performance report
 */
function generateReport() {
  const duration = (metrics.endTime - metrics.startTime) / 1000; // seconds
  const latencyStats = calculateStats(metrics.latencies);

  console.log('\n' + '='.repeat(60));
  console.log('WEBSOCKET PERFORMANCE TEST REPORT');
  console.log('='.repeat(60));

  console.log('\n📊 Test Configuration:');
  console.log(`  Server URL: ${CONFIG.serverUrl}`);
  console.log(`  Concurrent Connections: ${CONFIG.concurrentConnections}`);
  console.log(`  Messages Per Client: ${CONFIG.messagesPerClient}`);
  console.log(`  Message Interval: ${CONFIG.messageInterval}ms`);
  console.log(`  Test Duration: ${duration.toFixed(2)}s`);

  console.log('\n🔌 Connection Metrics:');
  console.log(`  Successful: ${metrics.connectionsSucceeded}`);
  console.log(`  Failed: ${metrics.connectionsFailed}`);
  console.log(`  Success Rate: ${((metrics.connectionsSucceeded / CONFIG.concurrentConnections) * 100).toFixed(2)}%`);

  console.log('\n📨 Message Metrics:');
  console.log(`  Sent: ${metrics.messagesSent}`);
  console.log(`  Received: ${metrics.messagesReceived}`);
  console.log(`  Throughput: ${(metrics.messagesSent / duration).toFixed(2)} msg/s`);

  console.log('\n⏱️  Latency Statistics (ms):');
  console.log(`  Min: ${latencyStats.min.toFixed(2)}`);
  console.log(`  Max: ${latencyStats.max.toFixed(2)}`);
  console.log(`  Average: ${latencyStats.avg.toFixed(2)}`);
  console.log(`  P50 (median): ${latencyStats.p50.toFixed(2)}`);
  console.log(`  P95: ${latencyStats.p95.toFixed(2)}`);
  console.log(`  P99: ${latencyStats.p99.toFixed(2)}`);

  if (metrics.errors.length > 0) {
    console.log('\n❌ Errors:');
    console.log(`  Total: ${metrics.errors.length}`);

    const errorsByType = {};
    metrics.errors.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
    });

    Object.entries(errorsByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }

  console.log('\n✅ Performance Assessment:');

  const assessments = [];

  if (latencyStats.avg < 50) {
    assessments.push('✓ Excellent average latency (<50ms)');
  } else if (latencyStats.avg < 100) {
    assessments.push('⚠ Good average latency (50-100ms)');
  } else {
    assessments.push('✗ High average latency (>100ms) - needs optimization');
  }

  if (latencyStats.p95 < 100) {
    assessments.push('✓ Excellent P95 latency (<100ms)');
  } else if (latencyStats.p95 < 200) {
    assessments.push('⚠ Acceptable P95 latency (100-200ms)');
  } else {
    assessments.push('✗ High P95 latency (>200ms) - needs optimization');
  }

  if (metrics.connectionsFailed === 0) {
    assessments.push('✓ All connections successful');
  } else if (metrics.connectionsFailed < CONFIG.concurrentConnections * 0.05) {
    assessments.push('⚠ Some connection failures (<5%)');
  } else {
    assessments.push('✗ High connection failure rate (>5%)');
  }

  if (metrics.messagesReceived >= metrics.messagesSent * 0.95) {
    assessments.push('✓ High message delivery rate (>95%)');
  } else {
    assessments.push('✗ Low message delivery rate (<95%)');
  }

  assessments.forEach(assessment => console.log(`  ${assessment}`));

  console.log('\n' + '='.repeat(60));

  return {
    duration,
    connections: {
      succeeded: metrics.connectionsSucceeded,
      failed: metrics.connectionsFailed,
      successRate: (metrics.connectionsSucceeded / CONFIG.concurrentConnections) * 100,
    },
    messages: {
      sent: metrics.messagesSent,
      received: metrics.messagesReceived,
      throughput: metrics.messagesSent / duration,
    },
    latency: latencyStats,
    errors: metrics.errors.length,
  };
}

/**
 * Run the load test
 */
async function runLoadTest() {
  console.log('Starting WebSocket Load Test...\n');
  console.log(`Configuration: ${CONFIG.concurrentConnections} clients, ${CONFIG.messagesPerClient} messages each\n`);

  metrics.startTime = Date.now();

  try {
    // Create all client connections
    console.log('Creating client connections...');
    const clientPromises = [];

    for (let i = 0; i < CONFIG.concurrentConnections; i++) {
      clientPromises.push(
        createTestClient(i).catch(error => {
          console.error(`Failed to create client ${i}:`, error.message);
          return null;
        })
      );
    }

    const clients = (await Promise.all(clientPromises)).filter(c => c !== null);
    console.log(`\n✓ Created ${clients.length} client connections\n`);

    // Wait a bit for all connections to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send messages from all clients
    console.log('Starting message transmission...\n');
    const messagePromises = clients.map(({ socket, clientMetrics }) =>
      sendTestMessages(socket, clientMetrics)
    );

    await Promise.all(messagePromises);

    // Wait for all messages to be received
    console.log('\nWaiting for message propagation...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Disconnect all clients
    console.log('\nDisconnecting clients...');
    clients.forEach(({ socket }) => socket.disconnect());

    metrics.endTime = Date.now();

    // Generate and display report
    const report = generateReport();

    // Exit with appropriate code
    const success =
      report.latency.avg < 100 &&
      report.connections.successRate > 95 &&
      report.errors === 0;

    process.exit(success ? 0 : 1);

  } catch (error) {
    console.error('\n❌ Load test failed:', error);
    metrics.endTime = Date.now();
    generateReport();
    process.exit(1);
  }
}

// Run the test
runLoadTest();
