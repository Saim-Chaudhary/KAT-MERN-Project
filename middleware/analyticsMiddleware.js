const logger = require('../utils/logger');
const { connectRedis } = require('../utils/cache');

// simple analytics: log each request and increment a Redis counter if available
const analytics = async (req, res, next) => {
  logger.info('API request', { method: req.method, path: req.originalUrl });
  try {
    const client = await connectRedis();
    if (client) {
      const key = `analytics:${req.method}:${req.path}`;
      await client.incr(key);
    }
  } catch (err) {
    logger.debug('Analytics increment failed', { error: err.message });
  }
  next();
};

module.exports = analytics;