import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger.js';

let redis: RedisClientType;

export async function connectRedis(): Promise<void> {
  try {
    redis = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis reconnection failed after 10 attempts');
            return new Error('Redis reconnection failed');
          }
          return Math.min(retries * 50, 1000);
        },
      },
    });

    redis.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    redis.on('connect', () => {
      logger.info('Redis connecting...');
    });

    redis.on('ready', () => {
      logger.info('Redis connected and ready');
    });

    redis.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    redis.on('end', () => {
      logger.info('Redis connection ended');
    });

    await redis.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    if (redis) {
      await redis.quit();
      logger.info('Redis disconnected successfully');
    }
  } catch (error) {
    logger.error('Failed to disconnect from Redis:', error);
    throw error;
  }
}

export { redis };

// Graceful shutdown
process.on('beforeExit', async () => {
  await disconnectRedis();
});