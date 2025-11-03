# Database Documentation

This directory contains the SQLite database configuration, schema, and migrations for the Vibe Kanban application.

## Structure

```
database/
├── db.js                    # Database connection manager
├── migrations/              # SQL migration files
│   └── 001_initial_schema.sql
└── README.md               # This file
```

## Database Schema

### Tables

#### `boards`
Stores information about kanban boards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique board identifier |
| name | TEXT | NOT NULL, UNIQUE | Board name |
| description | TEXT | | Board description (optional) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### `posts`
Stores messages/posts associated with boards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique post identifier |
| board_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to boards table |
| user | TEXT | NOT NULL | Username/identifier of poster |
| message | TEXT | NOT NULL | Post content |
| timestamp | DATETIME | DEFAULT CURRENT_TIMESTAMP | Post creation time |

**Foreign Keys:**
- `board_id` references `boards(id)` with `ON DELETE CASCADE`

**Indexes:**
- `idx_posts_board_id` - Fast lookup by board
- `idx_posts_timestamp` - Chronological ordering
- `idx_posts_user` - Fast lookup by user

#### `migrations`
Tracks applied database migrations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Migration record ID |
| name | TEXT | NOT NULL, UNIQUE | Migration filename |
| applied_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | When migration was applied |

## Database Manager API

The `DatabaseManager` class in `db.js` provides the following methods:

### `initialize()`
Initializes the database connection and runs all pending migrations.

```javascript
const dbManager = require('./database/db');
dbManager.initialize();
```

### `getDB()`
Returns the database instance for direct queries.

```javascript
const db = dbManager.getDB();
```

### `query(sql, params)`
Execute a query and return all matching rows.

```javascript
const boards = dbManager.query('SELECT * FROM boards WHERE id = ?', [1]);
```

### `queryOne(sql, params)`
Execute a query and return a single row.

```javascript
const board = dbManager.queryOne('SELECT * FROM boards WHERE id = ?', [1]);
```

### `run(sql, params)`
Execute a statement (INSERT, UPDATE, DELETE).

```javascript
const result = dbManager.run(
  'INSERT INTO boards (name, description) VALUES (?, ?)',
  ['General', 'Main discussion board']
);
console.log('Inserted board with ID:', result.lastInsertRowid);
```

### `transaction(fn)`
Execute multiple operations in a transaction.

```javascript
const insertBoardWithPost = dbManager.transaction((boardName, postMessage) => {
  const boardResult = dbManager.run(
    'INSERT INTO boards (name) VALUES (?)',
    [boardName]
  );

  dbManager.run(
    'INSERT INTO posts (board_id, user, message) VALUES (?, ?, ?)',
    [boardResult.lastInsertRowid, 'system', postMessage]
  );

  return boardResult.lastInsertRowid;
});

const boardId = insertBoardWithPost('Announcements', 'Welcome!');
```

### `close()`
Close the database connection.

```javascript
dbManager.close();
```

## Usage Examples

### Creating a Board

```javascript
const dbManager = require('./database/db');

const result = dbManager.run(
  'INSERT INTO boards (name, description) VALUES (?, ?)',
  ['General Discussion', 'A place for general topics']
);

console.log('Created board with ID:', result.lastInsertRowid);
```

### Creating a Post

```javascript
const result = dbManager.run(
  'INSERT INTO posts (board_id, user, message) VALUES (?, ?, ?)',
  [1, 'john_doe', 'Hello, world!']
);

console.log('Created post with ID:', result.lastInsertRowid);
```

### Fetching Board Posts

```javascript
const posts = dbManager.query(
  `SELECT p.*, b.name as board_name
   FROM posts p
   JOIN boards b ON p.board_id = b.id
   WHERE p.board_id = ?
   ORDER BY p.timestamp DESC`,
  [1]
);

console.log('Posts:', posts);
```

### Listing All Boards

```javascript
const boards = dbManager.query(
  'SELECT * FROM boards ORDER BY created_at DESC'
);

console.log('Boards:', boards);
```

## Migrations

Migrations are SQL files stored in the `migrations/` directory. They are automatically applied in alphabetical order when the database is initialized.

### Creating a New Migration

1. Create a new file in `database/migrations/` with a numbered prefix:
   ```
   002_add_tags_table.sql
   ```

2. Write your SQL schema changes:
   ```sql
   -- Migration: Add tags for categorizing posts

   CREATE TABLE IF NOT EXISTS tags (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL UNIQUE
   );

   -- Record this migration
   INSERT OR IGNORE INTO migrations (name) VALUES ('002_add_tags_table');
   ```

3. Restart the server - the migration will be applied automatically.

## Configuration

Database configuration is managed through environment variables:

- `DATABASE_PATH` - Path to the SQLite database file (default: `./data/kanban.db`)
- `NODE_ENV` - Set to `development` for verbose SQL logging

See `.env.example` for reference.

## Database File Location

The SQLite database file is stored in the `data/` directory at the project root. This directory is gitignored to prevent committing database files to version control.

Default path: `./data/kanban.db`

## SQLite Configuration

The database uses the following SQLite pragmas:

- `foreign_keys = ON` - Enforces foreign key constraints
- `journal_mode = WAL` - Write-Ahead Logging for better concurrency

## Backup

To backup the database:

```bash
sqlite3 data/kanban.db ".backup data/kanban_backup.db"
```

To restore from backup:

```bash
cp data/kanban_backup.db data/kanban.db
```
