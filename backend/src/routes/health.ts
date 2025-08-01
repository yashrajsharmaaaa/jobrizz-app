import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Basic health check
router.get('/', async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Health check failed',
      },
    });
  }
});

// Database health check
router.get('/db', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(503).json({
      success: false,
      error: {
        code: 'DATABASE_UNHEALTHY',
        message: 'Database connection failed',
      },
    });
  }
});

// Redis health check
router.get('/cache', async (req: Request, res: Response) => {
  try {
    await redis.ping();
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        cache: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Redis health check failed:', error);
    res.status(503).json({
      success: false,
      error: {
        code: 'CACHE_UNHEALTHY',
        message: 'Cache connection failed',
      },
    });
  }
});

// Comprehensive health check
router.get('/full', async (req: Request, res: Response) => {
  const checks = {
    database: false,
    cache: false,
  };

  try {
    // Check database
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (error) {
      logger.error('Database check failed:', error);
    }

    // Check Redis
    try {
      await redis.ping();
      checks.cache = true;
    } catch (error) {
      logger.error('Redis check failed:', error);
    }

    const allHealthy = Object.values(checks).every(check => check);
    const status = allHealthy ? 'healthy' : 'degraded';

    res.status(allHealthy ? 200 : 503).json({
      success: allHealthy,
      data: {
        status,
        checks,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    logger.error('Full health check failed:', error);
    res.status(503).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Health check failed',
      },
    });
  }
});

export default router;