const io = require('socket.io-client');

console.log('Starting WebSocket chat test...\n');

// Create first client
const client1 = io('http://localhost:3001/chat', {
  auth: {
    userId: 'user-1',
    username: 'Alice',
    boardId: 'board-test'
  }
});

// Create second client
const client2 = io('http://localhost:3001/chat', {
  auth: {
    userId: 'user-2',
    username: 'Bob',
    boardId: 'board-test'
  }
});

// Client 1 event handlers
client1.on('connect', () => {
  console.log('[Alice] Connected to chat server');
});

client1.on('chat:board:joined', (data) => {
  console.log('[Alice] Joined board:', data.boardId);
  console.log('[Alice] Current users:', data.users.length);

  // Send a message after joining
  setTimeout(() => {
    console.log('[Alice] Sending message...');
    client1.emit('chat:message', { content: 'Hello from Alice!' });
  }, 500);
});

client1.on('chat:message', (message) => {
  console.log(`[Alice] Received: "${message.content}" from ${message.username}`);
});

client1.on('chat:user:joined', (data) => {
  console.log(`[Alice] ${data.username} joined the board`);
});

client1.on('chat:typing:start', (data) => {
  console.log(`[Alice] ${data.username} is typing...`);
});

client1.on('chat:error', (error) => {
  console.error('[Alice] Error:', error);
});

// Client 2 event handlers
client2.on('connect', () => {
  console.log('[Bob] Connected to chat server');
});

client2.on('chat:board:joined', (data) => {
  console.log('[Bob] Joined board:', data.boardId);
  console.log('[Bob] Current users:', data.users.length);

  // Send a message and typing indicator
  setTimeout(() => {
    console.log('[Bob] Sending typing indicator...');
    client2.emit('chat:typing:start');

    setTimeout(() => {
      console.log('[Bob] Sending message...');
      client2.emit('chat:message', { content: 'Hi Alice! This is Bob.' });
      client2.emit('chat:typing:stop');
    }, 1000);
  }, 1500);
});

client2.on('chat:message', (message) => {
  console.log(`[Bob] Received: "${message.content}" from ${message.username}`);
});

client2.on('chat:user:joined', (data) => {
  console.log(`[Bob] ${data.username} joined the board`);
});

client2.on('chat:typing:start', (data) => {
  console.log(`[Bob] ${data.username} is typing...`);
});

client2.on('chat:error', (error) => {
  console.error('[Bob] Error:', error);
});

// Handle disconnect
client1.on('disconnect', (reason) => {
  console.log('[Alice] Disconnected:', reason);
});

client2.on('disconnect', (reason) => {
  console.log('[Bob] Disconnected:', reason);
});

// Clean up after 5 seconds
setTimeout(() => {
  console.log('\nTest complete. Fetching final stats...');

  const http = require('http');
  http.get('http://localhost:3001/api/chat/stats', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\nFinal Stats:', JSON.parse(data));

      console.log('\nDisconnecting clients...');
      client1.disconnect();
      client2.disconnect();

      setTimeout(() => {
        console.log('Test finished!');
        process.exit(0);
      }, 500);
    });
  });
}, 5000);

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
