const express = require('express');
const router = express.Router();
const { sanitizeMiddleware } = require('../middleware/sanitize');
const { validateCreatePost, validateGetPosts, handleValidationErrors } = require('../middleware/validate');

// In-memory data storage (replace with database in production)
let boards = [
  { id: '1', name: 'general', description: 'General discussion board', createdAt: new Date().toISOString() },
  { id: '2', name: 'technology', description: 'Technology and programming', createdAt: new Date().toISOString() },
  { id: '3', name: 'random', description: 'Random topics', createdAt: new Date().toISOString() }
];

let posts = [];
let postIdCounter = 1;

/**
 * GET /boards
 * Get all available boards
 */
router.get('/boards', sanitizeMiddleware, (req, res) => {
  try {
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
 * GET /posts?board=:id
 * Get all posts for a specific board
 */
router.get('/posts', sanitizeMiddleware, validateGetPosts, handleValidationErrors, (req, res) => {
  try {
    const { board } = req.query;

    // Filter posts by board
    const boardPosts = posts.filter(post => post.board === board);

    // Sort by creation date (newest first)
    boardPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

    // Verify board exists
    const boardExists = boards.some(b => b.name === board);
    if (!boardExists) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    // Create new post
    const newPost = {
      id: String(postIdCounter++),
      title,
      content,
      board,
      author: author || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    posts.push(newPost);

    res.status(201).json({
      success: true,
      data: newPost,
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

// Export router and data for testing purposes
module.exports = router;

// Export data access functions for potential future use
module.exports.getData = () => ({ boards, posts });
module.exports.resetData = () => {
  boards = [
    { id: '1', name: 'general', description: 'General discussion board', createdAt: new Date().toISOString() },
    { id: '2', name: 'technology', description: 'Technology and programming', createdAt: new Date().toISOString() },
    { id: '3', name: 'random', description: 'Random topics', createdAt: new Date().toISOString() }
  ];
  posts = [];
  postIdCounter = 1;
};
