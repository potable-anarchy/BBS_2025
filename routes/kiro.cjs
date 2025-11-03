/**
 * Kiro API Routes
 * Express routes for Kiro agent integration
 */

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const kiroService = require('../services/kiroService.cjs');
const kiroHooks = require('../services/kiroHooks.cjs');
const logger = require('../utils/logger.cjs');

const router = express.Router();

/**
 * Validation error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: errors.array(),
      },
    });
  }
  next();
};

/**
 * GET /api/kiro/ping
 * Test Kiro API connectivity
 */
router.get('/kiro/ping', async (req, res) => {
  try {
    const result = await kiroService.ping();
    res.json(result);
  } catch (error) {
    logger.error('Ping endpoint error', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to ping Kiro API',
      },
    });
  }
});

/**
 * GET /api/kiro/health
 * Get Kiro service health status
 */
router.get('/kiro/health', async (req, res) => {
  try {
    const health = await kiroService.healthCheck();
    res.status(health.healthy ? 200 : 503).json(health);
  } catch (error) {
    logger.error('Health check error', { error: error.message });
    res.status(503).json({
      healthy: false,
      timestamp: new Date().toISOString(),
      details: { error: error.message },
    });
  }
});

/**
 * GET /api/kiro/agents
 * Get list of available agents
 */
router.get('/kiro/agents', async (req, res) => {
  try {
    const result = await kiroService.getAgents();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    logger.error('Get agents error', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch agents',
      },
    });
  }
});

/**
 * GET /api/kiro/agents/:agentId
 * Get specific agent details
 */
router.get(
  '/kiro/agents/:agentId',
  [param('agentId').notEmpty().trim().escape()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { agentId } = req.params;
      const result = await kiroService.getAgent(agentId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Get agent error', {
        agentId: req.params.agentId,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch agent',
        },
      });
    }
  }
);

/**
 * GET /api/kiro/agents/:agentId/health
 * Check agent health status
 */
router.get(
  '/kiro/agents/:agentId/health',
  [param('agentId').notEmpty().trim().escape()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { agentId } = req.params;
      const result = await kiroService.checkAgentHealth(agentId);
      res.status(result.success ? 200 : 503).json(result);
    } catch (error) {
      logger.error('Agent health check error', {
        agentId: req.params.agentId,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to check agent health',
        },
      });
    }
  }
);

/**
 * POST /api/kiro/agents/:agentId/tasks
 * Submit a task to an agent
 */
router.post(
  '/kiro/agents/:agentId/tasks',
  [
    param('agentId').notEmpty().trim().escape(),
    body('prompt').notEmpty().trim().isLength({ min: 1, max: 10000 }),
    body('context').optional().isObject(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('timeout').optional().isInt({ min: 1000, max: 300000 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { agentId } = req.params;
      const task = {
        prompt: req.body.prompt,
        context: req.body.context,
        priority: req.body.priority || 'medium',
        timeout: req.body.timeout,
      };

      const result = await kiroService.submitTask(agentId, task);
      res.status(result.success ? 201 : 500).json(result);
    } catch (error) {
      logger.error('Submit task error', {
        agentId: req.params.agentId,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to submit task',
        },
      });
    }
  }
);

/**
 * GET /api/kiro/agents/:agentId/tasks/:taskId
 * Get task status
 */
router.get(
  '/kiro/agents/:agentId/tasks/:taskId',
  [
    param('agentId').notEmpty().trim().escape(),
    param('taskId').notEmpty().trim().escape(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { agentId, taskId } = req.params;
      const result = await kiroService.getTaskStatus(agentId, taskId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Get task status error', {
        agentId: req.params.agentId,
        taskId: req.params.taskId,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get task status',
        },
      });
    }
  }
);

/**
 * DELETE /api/kiro/agents/:agentId/tasks/:taskId
 * Cancel a task
 */
router.delete(
  '/kiro/agents/:agentId/tasks/:taskId',
  [
    param('agentId').notEmpty().trim().escape(),
    param('taskId').notEmpty().trim().escape(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { agentId, taskId } = req.params;
      const result = await kiroService.cancelTask(agentId, taskId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Cancel task error', {
        agentId: req.params.agentId,
        taskId: req.params.taskId,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to cancel task',
        },
      });
    }
  }
);

/**
 * GET /api/kiro/agents/:agentId/tasks
 * Get task history for an agent
 */
router.get(
  '/kiro/agents/:agentId/tasks',
  [
    param('agentId').notEmpty().trim().escape(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { agentId } = req.params;
      const limit = parseInt(req.query.limit || '50', 10);
      const result = await kiroService.getTaskHistory(agentId, limit);
      res.status(result.success ? 200 : 500).json(result);
    } catch (error) {
      logger.error('Get task history error', {
        agentId: req.params.agentId,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get task history',
        },
      });
    }
  }
);

/**
 * GET /api/kiro/hooks/status
 * Get status of Kiro hooks
 */
router.get('/kiro/hooks/status', async (req, res) => {
  try {
    const status = kiroHooks.getStatus();
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Get hooks status error', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get hooks status',
      },
    });
  }
});

/**
 * POST /api/kiro/hooks/enable
 * Enable Kiro hooks
 */
router.post('/kiro/hooks/enable', async (req, res) => {
  try {
    kiroHooks.enable();
    res.json({
      success: true,
      message: 'Kiro hooks enabled',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Enable hooks error', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to enable hooks',
      },
    });
  }
});

/**
 * POST /api/kiro/hooks/disable
 * Disable Kiro hooks
 */
router.post('/kiro/hooks/disable', async (req, res) => {
  try {
    kiroHooks.disable();
    res.json({
      success: true,
      message: 'Kiro hooks disabled',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Disable hooks error', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to disable hooks',
      },
    });
  }
});

/**
 * POST /api/kiro/hooks/idle/trigger
 * Manually trigger idle event hook
 */
router.post('/kiro/hooks/idle/trigger', async (req, res) => {
  try {
    const result = await kiroHooks.handleIdleEvent();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Trigger idle event error', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to trigger idle event',
      },
    });
  }
});

module.exports = router;
