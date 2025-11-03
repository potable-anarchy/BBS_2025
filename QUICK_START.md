# Quick Start Guide: Posts and Threading System

## Installation

```bash
# Install dependencies
npm install

# Environment setup (already done)
cp .env.example .env
# Edit .env if needed
```

## Running the Application

```bash
# Terminal 1: Start the backend server
npm run dev:server

# Terminal 2: Start the frontend dev server
npm run dev

# Or in production:
npm run start
```

## API Quick Reference

Base URL: `http://localhost:3001/api`

### Create a Post
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "board": "general",
    "user": "alice",
    "message": "My first post!"
  }'
```

### Reply to Post #1
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "board": "general",
    "user": "bob",
    "message": "Great post!",
    "parent_post_id": 1
  }'
```

### Get All Posts on a Board
```bash
curl http://localhost:3001/api/posts?board=general
```

### View Thread for Post #1
```bash
# As nested hierarchy
curl http://localhost:3001/api/posts/1/thread/hierarchy

# As flat list
curl http://localhost:3001/api/posts/1/thread
```

### Search Posts
```bash
curl "http://localhost:3001/api/search?q=hello&limit=10"
```

## Frontend Usage

### Display a Board's Posts

```tsx
import { PostList } from './components/PostList';

function BoardView() {
  const handleReply = (postId: number) => {
    console.log('Reply to', postId);
    // Open reply form
  };

  const handleViewThread = (postId: number) => {
    console.log('View thread', postId);
    // Navigate to thread view
  };

  return (
    <PostList
      boardName="general"
      onReply={handleReply}
      onViewThread={handleViewThread}
      autoRefresh={true}
      refreshInterval={30000}
    />
  );
}
```

### Display a Thread

```tsx
import { ThreadView } from './components/ThreadView';
import { useEffect, useState } from 'react';
import api from './services/api';

function ThreadPage({ postId }: { postId: number }) {
  const [thread, setThread] = useState(null);

  useEffect(() => {
    api.getThreadHierarchy(postId).then(setThread);
  }, [postId]);

  if (!thread) return <div>Loading...</div>;

  return (
    <ThreadView
      thread={thread}
      onReply={(id) => console.log('Reply to', id)}
      maxDepth={10}
    />
  );
}
```

### Use the API Service

```tsx
import api from './services/api';

// Create a post
const post = await api.createPost({
  board: 'general',
  user: 'alice',
  message: 'Hello!'
});

// Create a reply
const reply = await api.createPost({
  board: 'general',
  user: 'bob',
  message: 'Nice!',
  parent_post_id: post.id
});

// Get posts
const { data: posts } = await api.getPosts('general', {
  limit: 50,
  includeReplies: false
});

// Search
const { data: results } = await api.searchPosts('hello', {
  limit: 20
});

// Get user posts
const userPosts = await api.getUserPosts('alice');

// Get thread
const thread = await api.getThreadHierarchy(1);
```

## Database Structure

### Tables

**boards**
- `id` - Primary key
- `name` - Unique board name
- `description` - Board description
- `created_at`, `updated_at` - Timestamps

**posts**
- `id` - Primary key
- `board_id` - Foreign key to boards
- `user` - Username
- `message` - Post content
- `timestamp` - Creation time
- `parent_post_id` - NULL for top-level posts, post ID for replies

### Direct Database Access

```bash
# Access SQLite database directly
sqlite3 data/kanban.db

# Example queries
SELECT * FROM boards;
SELECT * FROM posts WHERE board_id = 1;
SELECT * FROM posts WHERE parent_post_id IS NULL; -- Top-level posts only
SELECT * FROM posts WHERE parent_post_id = 1; -- Direct replies to post 1
```

## Common Tasks

### Create a New Board

```tsx
const board = await api.createBoard('announcements', 'Important announcements');
```

### Get All Boards

```tsx
const boards = await api.getBoards();
```

### Delete a Post (and all replies)

```bash
curl -X DELETE http://localhost:3001/api/posts/1
```

### Format Timestamps

```tsx
import { formatTimestamp, formatFullTimestamp } from './utils/dateUtils';

const post = { timestamp: '2025-01-15T12:00:00Z' };

console.log(formatTimestamp(post.timestamp));      // "2m ago"
console.log(formatFullTimestamp(post.timestamp));  // "Jan 15, 2025 at 12:00:00"
```

## Troubleshooting

### Server won't start
- Check `.env` file exists with `KIRO_API_KEY`
- Verify port 3001 is not in use: `lsof -i :3001`
- Check for module errors in backend `.cjs` files

### Database errors
- Delete `data/kanban.db` and restart to reset
- Check migrations ran: `ls database/migrations/`
- Verify foreign keys enabled in SQLite

### Frontend can't connect
- Ensure backend is running on port 3001
- Check CORS settings in `.env` (ALLOWED_ORIGINS)
- Verify API URL in frontend matches backend

## Architecture

```
vibe-kanban/
├── database/
│   ├── db.cjs              # DatabaseManager with post/thread methods
│   └── migrations/         # SQL migrations
│       ├── 001_initial_schema.sql
│       └── 002_add_threading.sql
├── routes/
│   └── boards.cjs          # REST API endpoints
├── src/
│   ├── components/         # React components
│   │   ├── Post.tsx
│   │   ├── PostList.tsx
│   │   └── ThreadView.tsx
│   ├── types/
│   │   └── post.ts         # TypeScript types
│   ├── services/
│   │   └── api.ts          # API client
│   └── utils/
│       └── dateUtils.ts    # Timestamp formatting
├── server.cjs              # Express server
└── data/
    └── kanban.db           # SQLite database (auto-created)
```

## Next Steps

1. **Test the API**: Use curl or Postman to test endpoints
2. **Integrate Frontend**: Connect React components to your app
3. **Add Authentication**: Implement user auth for post ownership
4. **Real-time Updates**: Use WebSocket for live post updates
5. **Rich Features**: Add markdown, images, reactions, etc.

## Resources

- Full Documentation: `POSTS_AND_THREADING.md`
- Implementation Details: `IMPLEMENTATION_SUMMARY.md`
- API Reference: See "API Endpoints" section in `POSTS_AND_THREADING.md`
