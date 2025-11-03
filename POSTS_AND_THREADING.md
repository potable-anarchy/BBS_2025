# Posts and Threading System

A complete implementation of post creation, viewing, and threaded reply functionality for the vibe-kanban application.

## Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Usage Examples](#usage-examples)
- [Architecture](#architecture)

## Overview

The posts and threading system provides:

- **Post Creation**: Create posts on boards with user attribution and timestamps
- **Threaded Replies**: Reply to posts with unlimited nesting depth
- **Thread Viewing**: View entire conversation threads with nested hierarchy
- **Board Organization**: Posts are organized within boards
- **User Attribution**: All posts include username and timestamp
- **Reply Counting**: Automatic counting of replies for each post
- **Search**: Full-text search across posts
- **User History**: View all posts by a specific user

## Database Schema

### Migrations

The system uses two database migrations:

1. **001_initial_schema.sql** - Creates boards and posts tables
2. **002_add_threading.sql** - Adds threading support via parent_post_id

### Tables

#### boards
```sql
CREATE TABLE boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### posts
```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    user TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    parent_post_id INTEGER DEFAULT NULL,  -- NULL for top-level posts
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);
```

### Indexes

For optimal query performance:

- `idx_posts_board_id` - Fast board post lookups
- `idx_posts_timestamp` - Sorted post queries
- `idx_posts_user` - User post filtering
- `idx_posts_parent_id` - Reply lookups
- `idx_posts_thread_lookup` - Thread hierarchy queries

## API Endpoints

Base URL: `http://localhost:3001/api`

### Boards

#### GET /boards
Get all available boards.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "general",
      "description": "General discussion board",
      "created_at": "2025-01-15T12:00:00Z",
      "updated_at": "2025-01-15T12:00:00Z"
    }
  ],
  "count": 1
}
```

#### GET /boards/:id
Get a specific board by ID.

#### POST /boards
Create a new board.

**Request:**
```json
{
  "name": "new-board",
  "description": "A new discussion board"
}
```

### Posts

#### GET /posts?board=:name&limit=100&offset=0&includeReplies=false
Get posts for a board. Returns top-level posts only by default.

**Query Parameters:**
- `board` (required): Board name or ID
- `limit` (optional): Max posts to return (default: 100)
- `offset` (optional): Pagination offset (default: 0)
- `includeReplies` (optional): Include all posts including replies (default: false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "board_id": 1,
      "user": "alice",
      "message": "Hello world!",
      "timestamp": "2025-01-15T12:00:00Z",
      "parent_post_id": null,
      "reply_count": 5
    }
  ],
  "count": 1,
  "board": "general",
  "board_id": 1
}
```

#### GET /posts/:id
Get a specific post by ID with reply count.

#### POST /posts
Create a new post or reply.

**Request (New Post):**
```json
{
  "board": "general",
  "user": "alice",
  "message": "This is my post!"
}
```

**Request (Reply):**
```json
{
  "board": "general",
  "user": "bob",
  "message": "Great post!",
  "parent_post_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "board_id": 1,
    "user": "bob",
    "message": "Great post!",
    "timestamp": "2025-01-15T12:05:00Z",
    "parent_post_id": 1
  },
  "message": "Reply created successfully"
}
```

#### DELETE /posts/:id
Delete a post and all its replies (cascading delete).

### Threads

#### GET /posts/:id/replies?limit=100
Get direct replies to a post (not nested).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "board_id": 1,
      "user": "bob",
      "message": "Great post!",
      "timestamp": "2025-01-15T12:05:00Z",
      "parent_post_id": 1,
      "reply_count": 2
    }
  ],
  "count": 1,
  "parent_post_id": 1
}
```

#### GET /posts/:id/thread
Get full thread as a flat array (all posts in chronological order).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "board_id": 1,
      "user": "alice",
      "message": "Hello world!",
      "timestamp": "2025-01-15T12:00:00Z",
      "parent_post_id": null
    },
    {
      "id": 2,
      "board_id": 1,
      "user": "bob",
      "message": "Great post!",
      "timestamp": "2025-01-15T12:05:00Z",
      "parent_post_id": 1
    }
  ],
  "count": 2,
  "root_post_id": 1
}
```

#### GET /posts/:id/thread/hierarchy
Get full thread as a nested hierarchy.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "board_id": 1,
    "user": "alice",
    "message": "Hello world!",
    "timestamp": "2025-01-15T12:00:00Z",
    "parent_post_id": null,
    "replies": [
      {
        "id": 2,
        "board_id": 1,
        "user": "bob",
        "message": "Great post!",
        "timestamp": "2025-01-15T12:05:00Z",
        "parent_post_id": 1,
        "replies": []
      }
    ]
  },
  "root_post_id": 1
}
```

### User Posts

#### GET /users/:username/posts?limit=100
Get all posts by a specific user across all boards.

### Search

#### GET /search?q=:query&board=:boardId&limit=50
Search posts by message content.

**Query Parameters:**
- `q` (required): Search term
- `board` (optional): Limit search to specific board ID
- `limit` (optional): Max results (default: 50)

## Frontend Components

### Post Component

Display an individual post with user attribution and timestamp.

```tsx
import { Post } from './components/Post';

<Post
  post={postData}
  depth={0}
  onReply={(postId) => handleReply(postId)}
  onViewThread={(postId) => handleViewThread(postId)}
  showReplyCount={true}
/>
```

**Props:**
- `post`: Post object
- `depth`: Nesting depth (for visual indentation)
- `onReply`: Callback when reply button clicked
- `onViewThread`: Callback when "view thread" clicked
- `showReplyCount`: Show reply count badge

### ThreadView Component

Display a full thread with nested replies.

```tsx
import { ThreadView } from './components/ThreadView';

<ThreadView
  thread={threadData}
  onReply={(postId) => handleReply(postId)}
  maxDepth={10}
/>
```

**Props:**
- `thread`: ThreadPost object with nested replies
- `onReply`: Callback when reply button clicked
- `maxDepth`: Maximum nesting depth before collapsing

### PostList Component

Display a list of posts for a board with auto-refresh.

```tsx
import { PostList } from './components/PostList';

<PostList
  boardName="general"
  apiUrl="http://localhost:3001/api"
  onReply={(postId) => handleReply(postId)}
  onViewThread={(postId) => handleViewThread(postId)}
  limit={100}
  autoRefresh={true}
  refreshInterval={30000}
/>
```

**Props:**
- `boardName`: Name of the board to display
- `apiUrl`: API base URL
- `onReply`: Reply callback
- `onViewThread`: View thread callback
- `limit`: Max posts to fetch
- `autoRefresh`: Auto-refresh posts
- `refreshInterval`: Refresh interval in ms

## Usage Examples

### Create a New Post

```typescript
import api from './services/api';

const newPost = await api.createPost({
  board: 'general',
  user: 'alice',
  message: 'Hello, world!'
});
```

### Reply to a Post

```typescript
const reply = await api.createPost({
  board: 'general',
  user: 'bob',
  message: 'Nice post!',
  parent_post_id: 1
});
```

### Get Posts for a Board

```typescript
const response = await api.getPosts('general', {
  limit: 50,
  offset: 0,
  includeReplies: false
});

const posts = response.data;
```

### View a Thread

```typescript
// Get thread as nested hierarchy
const thread = await api.getThreadHierarchy(1);

// Or get as flat array
const flatThread = await api.getThread(1);
```

### Search Posts

```typescript
const results = await api.searchPosts('hello', {
  board: 1,
  limit: 20
});
```

## Architecture

### Backend (Node.js + Express + SQLite)

**Key Files:**
- `database/db.js` - DatabaseManager with post/thread methods
- `database/migrations/` - SQL schema migrations
- `routes/boards.js` - REST API endpoints
- `middleware/sanitize.js` - XSS protection
- `middleware/validate.js` - Input validation

**Features:**
- SQLite database with better-sqlite3 (synchronous)
- Recursive SQL queries for thread traversal
- Automatic reply counting
- Input sanitization and validation
- Foreign key constraints with CASCADE delete

### Frontend (React + TypeScript)

**Key Files:**
- `src/types/post.ts` - TypeScript interfaces
- `src/components/Post.tsx` - Individual post component
- `src/components/ThreadView.tsx` - Thread hierarchy component
- `src/components/PostList.tsx` - Board post listing
- `src/services/api.ts` - API service layer
- `src/utils/dateUtils.ts` - Timestamp formatting

**Features:**
- Styled components for terminal aesthetics
- Real-time timestamp formatting
- Nested thread rendering
- Auto-refresh capability
- TypeScript type safety

### Thread Hierarchy

The threading system supports unlimited nesting depth using a recursive approach:

1. Each post can have a `parent_post_id`
2. Top-level posts have `parent_post_id = NULL`
3. Replies reference their parent via `parent_post_id`
4. SQL recursive CTEs fetch entire thread trees
5. Frontend components render threads with visual indentation

**Example Thread Structure:**
```
Post #1 (parent_post_id: null)
├── Post #2 (parent_post_id: 1)
│   ├── Post #4 (parent_post_id: 2)
│   └── Post #5 (parent_post_id: 2)
└── Post #3 (parent_post_id: 1)
    └── Post #6 (parent_post_id: 3)
```

### Security Features

- **XSS Prevention**: HTML sanitization on all inputs
- **Input Validation**: Express-validator for structured validation
- **SQL Injection Protection**: Parameterized queries
- **Foreign Key Constraints**: Data integrity enforcement
- **CORS Configuration**: Controlled cross-origin access

## Testing

### Manual Testing Checklist

- [ ] Create a new board
- [ ] Create a post on a board
- [ ] Reply to a post
- [ ] Reply to a reply (nested threading)
- [ ] View thread hierarchy
- [ ] View thread as flat list
- [ ] Get posts for a board
- [ ] Search posts
- [ ] Get user's posts
- [ ] Delete a post (verify cascade delete)
- [ ] Test reply counting
- [ ] Test timestamp formatting

### API Testing with curl

```bash
# Create a post
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{"board": "general", "user": "alice", "message": "Test post"}'

# Get posts
curl http://localhost:3001/api/posts?board=general

# Create a reply
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{"board": "general", "user": "bob", "message": "Test reply", "parent_post_id": 1}'

# View thread
curl http://localhost:3001/api/posts/1/thread/hierarchy
```

## Future Enhancements

- [ ] Post editing
- [ ] Post reactions (upvote/downvote)
- [ ] Markdown support in messages
- [ ] Image attachments
- [ ] User mentions (@username)
- [ ] Thread subscription/notifications
- [ ] Post pinning
- [ ] Thread locking
- [ ] Pagination for large threads
- [ ] Real-time updates via WebSocket
