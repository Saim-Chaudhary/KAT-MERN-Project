const asyncHandler = require('express-async-handler');
const { connectRedis } = require('../utils/cache');

// returns hit counts stored in Redis (admin only)
const getMetrics = asyncHandler(async (req, res) => {
  const client = await connectRedis();
  if (!client) {
    res.status(503);
    throw new Error('Metrics unavailable (Redis not connected)');
  }

  const keys = await client.keys('analytics:*');
  const data = {};
  for (const key of keys) {
    data[key.replace('analytics:', '')] = await client.get(key);
  }
  res.json(data);
});

module.exports = { getMetrics };