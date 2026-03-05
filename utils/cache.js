const redis = require('redis');
const logger = require('./logger');

let client;

const connectRedis = async () => {
  if (client) return client;
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL,
      socket: { reconnectStrategy: false }
    });
    client.on('error', (err) => logger.debug('Redis error', { message: err.message }));
    await client.connect();
    return client;
  } catch (err) {
    logger.debug('Redis connection failed', { error: err.message });
    return null;
  }
};

// helper to delete a key from cache
const deleteKey = async (key) => {
  try {
    const c = await connectRedis();
    if (c) await c.del(key);
  } catch (err) {
    logger.debug('Cache delete failed', { key, error: err.message });
  }
};

// delete all keys matching a pattern (e.g. 'packages:list*')
const clearPattern = async (pattern) => {
  try {
    const c = await connectRedis();
    if (!c) return;
    const iter = c.scanIterator({ MATCH: pattern });
    for await (const key of iter) {
      await c.del(key);
    }
  } catch (err) {
    logger.debug('Cache pattern clear failed', { pattern, error: err.message });
  }
};

// middleware to cache GET responses by key

const cacheMiddleware = (keyGenerator, ttl = 60) => {
  return async (req, res, next) => {
    try {
      const client = await connectRedis();
      if (!client) {
        // Redis not available, skip caching
        return next();
      }
      const key = keyGenerator(req);
      const data = await client.get(key);
      if (data) {
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.parse(data));
      }
      // override res.send to cache the output
      const originalSend = res.send.bind(res);
      res.send = async (body) => {
        if (res.statusCode === 200) {
          await client.setEx(key, ttl, typeof body === 'string' ? body : JSON.stringify(body));
        }
        return originalSend(body);
      };
      next();
    } catch (err) {
      logger.debug('Cache middleware skipped', { error: err.message });
      next();
    }
  };
};

module.exports = { connectRedis, cacheMiddleware, deleteKey, clearPattern };