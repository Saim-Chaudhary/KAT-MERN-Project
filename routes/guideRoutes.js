const express = require('express');
const router = express.Router();
const {
  createGuide,
  getGuides,
  getGuideById,
  updateGuide,
  deleteGuide,
} = require('../controllers/guideController');
const { protect, admin } = require('../middleware/authMiddleware');

// public endpoints
router.get('/', getGuides);
router.get('/:id', getGuideById);

// protected endpoints (admin only)
router.post('/', protect, admin, createGuide);
router.put('/:id', protect, admin, updateGuide);
router.delete('/:id', protect, admin, deleteGuide);

module.exports = router;