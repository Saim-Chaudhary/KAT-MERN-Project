const express = require('express');
const { getMetrics } = require('../controllers/analyticsController');
const { protect, roleCheck } = require('../middleware/authMiddleware');

const router = express.Router();

// only admin can view metrics
router.get('/', protect, roleCheck(['admin']), getMetrics);

module.exports = router;