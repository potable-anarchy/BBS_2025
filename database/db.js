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

      return this.db;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
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
}

// Export singleton instance
const dbManager = new DatabaseManager();

module.exports = dbManager;
