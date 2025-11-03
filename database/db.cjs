const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '..', 'data', 'kanban.db');
  }

  /**
   * Initialize database connection and run migrations
   */
  initialize() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Create or open database
      this.db = new Database(this.dbPath, {
        verbose: process.env.NODE_ENV === 'development' ? console.log : null
      });

      // Enable foreign keys
      this.db.pragma('foreign_keys = ON');

      // Set WAL mode for better concurrency
      this.db.pragma('journal_mode = WAL');

      console.log('Database connection established:', this.dbPath);

      // Run migrations
      this.runMigrations();

      // Seed default data if needed
      this.seedDefaultData();

      return this.db;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Seed default data (boards) if database is empty
   */
  seedDefaultData() {
    try {
      // Check if boards table is empty
      const boardCount = this.queryOne('SELECT COUNT(*) as count FROM boards');

      if (boardCount && boardCount.count === 0) {
        console.log('Database is empty, seeding default boards...');

        const defaultBoards = [
          { name: 'general', description: 'General discussion board' },
          { name: 'technology', description: 'Technology and programming' },
          { name: 'random', description: 'Random topics' }
        ];

        const seedTransaction = this.transaction(() => {
          defaultBoards.forEach(board => {
            this.run(
              'INSERT INTO boards (name, description) VALUES (?, ?)',
              [board.name, board.description]
            );
          });
        });

        seedTransaction();
        console.log(`✓ Seeded ${defaultBoards.length} default boards`);
      }
    } catch (error) {
      console.error('Error seeding default data:', error);
    }
  }

  /**
   * Run all pending migrations
   */
  runMigrations() {
    const migrationsDir = path.join(__dirname, 'migrations');

    if (!fs.existsSync(migrationsDir)) {
      console.warn('Migrations directory not found');
      return;
    }

    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${migrationFiles.length} migration(s)`);

    migrationFiles.forEach(file => {
      const migrationPath = path.join(migrationsDir, file);
      const migrationName = file.replace('.sql', '');

      try {
        // Read migration SQL
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        // Execute migration in a transaction
        const migrate = this.db.transaction(() => {
          this.db.exec(migrationSQL);
        });

        migrate();
        console.log(`✓ Applied migration: ${migrationName}`);
      } catch (error) {
        // If migration already applied or error, log and continue
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`- Migration already applied: ${migrationName}`);
        } else {
          console.error(`✗ Failed to apply migration ${migrationName}:`, error.message);
        }
      }
    });
  }

  /**
   * Get database instance
   */
  getDB() {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      console.log('Database connection closed');
      this.db = null;
    }
  }

  /**
   * Run a query with parameters
   */
  query(sql, params = []) {
    return this.getDB().prepare(sql).all(params);
  }

  /**
   * Run a single row query
   */
  queryOne(sql, params = []) {
    return this.getDB().prepare(sql).get(params);
  }

  /**
   * Execute a statement (INSERT, UPDATE, DELETE)
   */
  run(sql, params = []) {
    return this.getDB().prepare(sql).run(params);
  }

  /**
   * Begin a transaction
   */
  transaction(fn) {
    return this.getDB().transaction(fn);
  }

  // ============================================
  // BOARD METHODS
  // ============================================

  /**
   * Get all boards
   */
  getAllBoards() {
    return this.query('SELECT * FROM boards ORDER BY created_at DESC');
  }

  /**
   * Get board by ID
   */
  getBoardById(boardId) {
    return this.queryOne('SELECT * FROM boards WHERE id = ?', [boardId]);
  }

  /**
   * Get board by name
   */
  getBoardByName(name) {
    return this.queryOne('SELECT * FROM boards WHERE name = ?', [name]);
  }

  /**
   * Create a new board
   */
  createBoard(name, description = '') {
    const result = this.run(
      'INSERT INTO boards (name, description) VALUES (?, ?)',
      [name, description]
    );
    return { id: result.lastInsertRowid, name, description };
  }

  /**
   * Update board
   */
  updateBoard(boardId, name, description) {
    return this.run(
      'UPDATE boards SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, boardId]
    );
  }

  // ============================================
  // POST METHODS
  // ============================================

  /**
   * Create a new post
   */
  createPost(boardId, user, message, parentPostId = null) {
    // Validate parent post exists if provided
    if (parentPostId !== null) {
      const parentPost = this.getPostById(parentPostId);
      if (!parentPost) {
        throw new Error(`Parent post with ID ${parentPostId} not found`);
      }
      if (parentPost.board_id !== boardId) {
        throw new Error('Parent post must be on the same board');
      }
    }

    const result = this.run(
      'INSERT INTO posts (board_id, user, message, parent_post_id) VALUES (?, ?, ?, ?)',
      [boardId, user, message, parentPostId]
    );

    return this.getPostById(result.lastInsertRowid);
  }

  /**
   * Get post by ID
   */
  getPostById(postId) {
    return this.queryOne('SELECT * FROM posts WHERE id = ?', [postId]);
  }

  /**
   * Get all posts for a board (top-level posts only, no replies)
   */
  getPostsByBoard(boardId, limit = 100, offset = 0) {
    return this.query(
      `SELECT * FROM posts
       WHERE board_id = ? AND parent_post_id IS NULL
       ORDER BY timestamp DESC
       LIMIT ? OFFSET ?`,
      [boardId, limit, offset]
    );
  }

  /**
   * Get all posts for a board including replies
   */
  getAllPostsByBoard(boardId, limit = 1000, offset = 0) {
    return this.query(
      `SELECT * FROM posts
       WHERE board_id = ?
       ORDER BY timestamp ASC
       LIMIT ? OFFSET ?`,
      [boardId, limit, offset]
    );
  }

  /**
   * Get direct replies to a post
   */
  getReplies(postId, limit = 100) {
    return this.query(
      `SELECT * FROM posts
       WHERE parent_post_id = ?
       ORDER BY timestamp ASC
       LIMIT ?`,
      [postId, limit]
    );
  }

  /**
   * Get full thread (post + all nested replies)
   * Returns a flat array of posts in the thread
   */
  getThread(postId) {
    const posts = this.query(
      `WITH RECURSIVE thread AS (
        -- Start with the root post
        SELECT * FROM posts WHERE id = ?
        UNION ALL
        -- Recursively get all replies
        SELECT p.* FROM posts p
        INNER JOIN thread t ON p.parent_post_id = t.id
      )
      SELECT * FROM thread ORDER BY timestamp ASC`,
      [postId]
    );
    return posts;
  }

  /**
   * Get thread hierarchy (nested structure)
   * Returns posts with their replies nested
   */
  getThreadHierarchy(postId) {
    const allPosts = this.getThread(postId);

    // Build a map of post ID to post object with empty replies array
    const postMap = {};
    allPosts.forEach(post => {
      postMap[post.id] = { ...post, replies: [] };
    });

    // Build the tree structure
    let rootPost = null;
    allPosts.forEach(post => {
      if (post.id === postId) {
        rootPost = postMap[post.id];
      } else if (post.parent_post_id && postMap[post.parent_post_id]) {
        postMap[post.parent_post_id].replies.push(postMap[post.id]);
      }
    });

    return rootPost;
  }

  /**
   * Get reply count for a post
   */
  getReplyCount(postId) {
    const result = this.queryOne(
      `WITH RECURSIVE thread AS (
        SELECT id FROM posts WHERE parent_post_id = ?
        UNION ALL
        SELECT p.id FROM posts p
        INNER JOIN thread t ON p.parent_post_id = t.id
      )
      SELECT COUNT(*) as count FROM thread`,
      [postId]
    );
    return result ? result.count : 0;
  }

  /**
   * Delete a post (and all its replies due to CASCADE)
   */
  deletePost(postId) {
    return this.run('DELETE FROM posts WHERE id = ?', [postId]);
  }

  /**
   * Get posts by user
   */
  getPostsByUser(username, limit = 100) {
    return this.query(
      `SELECT p.*, b.name as board_name
       FROM posts p
       JOIN boards b ON p.board_id = b.id
       WHERE p.user = ?
       ORDER BY p.timestamp DESC
       LIMIT ?`,
      [username, limit]
    );
  }

  /**
   * Search posts by message content
   */
  searchPosts(searchTerm, boardId = null, limit = 50) {
    const params = [`%${searchTerm}%`];
    let sql = `SELECT p.*, b.name as board_name
               FROM posts p
               JOIN boards b ON p.board_id = b.id
               WHERE p.message LIKE ?`;

    if (boardId !== null) {
      sql += ' AND p.board_id = ?';
      params.push(boardId);
    }

    sql += ' ORDER BY p.timestamp DESC LIMIT ?';
    params.push(limit);

    return this.query(sql, params);
  }
}

// Export singleton instance
const dbManager = new DatabaseManager();

module.exports = dbManager;
