const express = require('express');
const router = express.Router();
const { sanitizeMiddleware } = require('../middleware/sanitize.cjs');
const { validateCreatePost, validateGetPosts, handleValidationErrors } = require('../middleware/validate.cjs');
const db = require('../database/db.cjs');
const kiroHooks = require('../services/kiroHooks.cjs');

/**
 * GET /boards
 * Get all available boards
 */
router.get('/boards', sanitizeMiddleware, (req, res) => {
  try {
    const boards = db.getAllBoards();
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
 * GET /boards/:id
 * Get a specific board by ID
 */
router.get('/boards/:id', sanitizeMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const board = db.getBoardById(parseInt(id));

    if (!board) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /boards
 * Create a new board
 */
router.post('/boards', sanitizeMiddleware, (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Board name is required'
      });
    }

    const board = db.createBoard(name.trim(), description || '');

    res.status(201).json({
      success: true,
      data: board,
      message: 'Board created successfully'
    });
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        error: 'Board with this name already exists'
      });
    }

    console.error('Error creating board:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /posts?board=:name&limit=:limit&offset=:offset&includeReplies=:boolean
 * Get posts for a specific board (by name or ID)
 */
router.get('/posts', sanitizeMiddleware, validateGetPosts, handleValidationErrors, (req, res) => {
  try {
    const { board, limit = 100, offset = 0, includeReplies = 'false' } = req.query;

    // Find board by name or ID
    let boardData = null;
    const boardIdNum = parseInt(board);

    if (!isNaN(boardIdNum)) {
      boardData = db.getBoardById(boardIdNum);
    } else {
      boardData = db.getBoardByName(board);
    }

    if (!boardData) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    // Get posts based on includeReplies flag
    const posts = includeReplies === 'true'
      ? db.getAllPostsByBoard(boardData.id, parseInt(limit), parseInt(offset))
      : db.getPostsByBoard(boardData.id, parseInt(limit), parseInt(offset));

    // Add reply counts for each top-level post
    const postsWithCounts = posts.map(post => ({
      ...post,
      reply_count: post.parent_post_id === null ? db.getReplyCount(post.id) : 0
    }));

    res.json({
      success: true,
      data: postsWithCounts,
      count: postsWithCounts.length,
      board: boardData.name,
      board_id: boardData.id
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
 * GET /posts/:id
 * Get a specific post by ID
 */
router.get('/posts/:id', sanitizeMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const post = db.getPostById(parseInt(id));

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Add reply count
    const postWithCount = {
      ...post,
      reply_count: db.getReplyCount(post.id)
    };

    res.json({
      success: true,
      data: postWithCount
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /posts/:id/replies
 * Get direct replies to a post
 */
router.get('/posts/:id/replies', sanitizeMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 100 } = req.query;

    const post = db.getPostById(parseInt(id));
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const replies = db.getReplies(parseInt(id), parseInt(limit));

    // Add reply counts for each reply
    const repliesWithCounts = replies.map(reply => ({
      ...reply,
      reply_count: db.getReplyCount(reply.id)
    }));

    res.json({
      success: true,
      data: repliesWithCounts,
      count: repliesWithCounts.length,
      parent_post_id: parseInt(id)
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /posts/:id/thread
 * Get full thread (post + all nested replies) as a flat array
 */
router.get('/posts/:id/thread', sanitizeMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const post = db.getPostById(parseInt(id));
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const thread = db.getThread(parseInt(id));

    res.json({
      success: true,
      data: thread,
      count: thread.length,
      root_post_id: parseInt(id)
    });
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /posts/:id/thread/hierarchy
 * Get full thread as a nested hierarchy
 */
router.get('/posts/:id/thread/hierarchy', sanitizeMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const post = db.getPostById(parseInt(id));
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const hierarchy = db.getThreadHierarchy(parseInt(id));

    res.json({
      success: true,
      data: hierarchy,
      root_post_id: parseInt(id)
    });
  } catch (error) {
    console.error('Error fetching thread hierarchy:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /posts
 * Create a new post or reply
 * Body: { board, user, message, parent_post_id }
 */
router.post('/posts', sanitizeMiddleware, validateCreatePost, handleValidationErrors, (req, res) => {
  try {
    const { board, user, message, parent_post_id } = req.body;

    // Find board by name or ID
    let boardData = null;
    const boardIdNum = parseInt(board);

    if (!isNaN(boardIdNum)) {
      boardData = db.getBoardById(boardIdNum);
    } else {
      boardData = db.getBoardByName(board);
    }

    if (!boardData) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    if (!user || user.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'User is required'
      });
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Parse parent_post_id if provided
    const parentPostId = parent_post_id ? parseInt(parent_post_id) : null;

    // Create post
    const newPost = db.createPost(
      boardData.id,
      user.trim(),
      message.trim(),
      parentPostId
    );

    // Trigger Kiro on_new_post hook (only for top-level posts, not replies)
    if (!parentPostId) {
      kiroHooks.onNewPost({
        id: newPost.id,
        user: newPost.user,
        message: newPost.message,
        board_id: newPost.board_id,
        board_name: boardData.name
      }).then(analysis => {
        // If Kiro decides to respond, create a post from SYSOP-13
        if (analysis && analysis.success && analysis.shouldRespond && analysis.response) {
          try {
            db.createPost(
              boardData.id,
              'SYSOP-13',
              analysis.response,
              newPost.id // Reply to the original post
            );
            console.log(`SYSOP-13 responded to post ${newPost.id}`);
          } catch (error) {
            console.error('Error creating SYSOP-13 response post:', error);
          }
        }
      }).catch(error => {
        console.error('Error in Kiro new post hook:', error);
      });
    }

    res.status(201).json({
      success: true,
      data: newPost,
      message: parentPostId ? 'Reply created successfully' : 'Post created successfully'
    });
  } catch (error) {
    if (error.message && error.message.includes('Parent post')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * DELETE /posts/:id
 * Delete a post and all its replies
 */
router.delete('/posts/:id', sanitizeMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const post = db.getPostById(parseInt(id));
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    db.deletePost(parseInt(id));

    res.json({
      success: true,
      message: 'Post and all replies deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /users/:username/posts
 * Get all posts by a specific user
 */
router.get('/users/:username/posts', sanitizeMiddleware, (req, res) => {
  try {
    const { username } = req.params;
    const { limit = 100 } = req.query;

    const posts = db.getPostsByUser(username, parseInt(limit));

    res.json({
      success: true,
      data: posts,
      count: posts.length,
      username: username
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /search?q=:query&board=:boardId&limit=:limit
 * Search posts by message content
 */
router.get('/search', sanitizeMiddleware, (req, res) => {
  try {
    const { q, board, limit = 50 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const boardId = board ? parseInt(board) : null;
    const posts = db.searchPosts(q.trim(), boardId, parseInt(limit));

    res.json({
      success: true,
      data: posts,
      count: posts.length,
      query: q.trim()
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
