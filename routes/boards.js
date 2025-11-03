const express = require('express');
const router = express.Router();
const { sanitizeMiddleware } = require('../middleware/sanitize');
const { validateCreatePost, validateGetPosts, handleValidationErrors } = require('../middleware/validate');
const dbManager = require('../database/db');

/**
 * GET /boards
 * Get all available boards
 */
router.get('/boards', sanitizeMiddleware, (req, res) => {
  try {
    const boards = dbManager.query('SELECT * FROM boards ORDER BY created_at ASC');

    res.json({
      success: true,
      data: boards,
      count: boards.length
    });
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /posts?board=:boardId
 * Get all posts for a specific board
 */
router.get('/posts', sanitizeMiddleware, validateGetPosts, handleValidationErrors, (req, res) => {
  try {
    const { board } = req.query;

    // Get posts for the specified board (by ID or name)
    let boardPosts;
    if (!isNaN(board)) {
      // If board is a number, query by ID
      boardPosts = dbManager.query(
        'SELECT p.*, b.name as board_name FROM posts p JOIN boards b ON p.board_id = b.id WHERE p.board_id = ? ORDER BY p.timestamp DESC',
        [parseInt(board)]
      );
    } else {
      // If board is a string, query by name
      boardPosts = dbManager.query(
        'SELECT p.*, b.name as board_name FROM posts p JOIN boards b ON p.board_id = b.id WHERE b.name = ? ORDER BY p.timestamp DESC',
        [board]
      );
    }

    res.json({
      success: true,
      data: boardPosts,
      count: boardPosts.length,
      board: board
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /post
 * Create a new post
 */
router.post('/post', sanitizeMiddleware, validateCreatePost, handleValidationErrors, (req, res) => {
  try {
    const { title, content, board, author } = req.body;

    // Verify board exists and get board ID
    let boardData;
    if (!isNaN(board)) {
      // If board is a number, query by ID
      boardData = dbManager.queryOne('SELECT * FROM boards WHERE id = ?', [parseInt(board)]);
    } else {
      // If board is a string, query by name
      boardData = dbManager.queryOne('SELECT * FROM boards WHERE name = ?', [board]);
    }

    if (!boardData) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    // Create new post (note: title and content are combined into message in DB schema)
    const message = title ? `${title}\n\n${content}` : content;
    const result = dbManager.run(
      'INSERT INTO posts (board_id, user, message) VALUES (?, ?, ?)',
      [boardData.id, author || 'Anonymous', message]
    );

    // Retrieve the created post
    const newPost = dbManager.queryOne('SELECT * FROM posts WHERE id = ?', [result.lastInsertRowid]);

    res.status(201).json({
      success: true,
      data: {
        ...newPost,
        board_name: boardData.name
      },
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
