const express = require('express');
const router = express.Router();
const {
  createAirline,
  getAirlines,
  getAirlineById,
  updateAirline,
  deleteAirline,
} = require('../controllers/airlineController');
const { protect, admin } = require('../middleware/authMiddleware');

// public endpoints
router.get('/', getAirlines);
router.get('/:id', getAirlineById);

// protected endpoints (admin only)
router.post('/', protect, admin, createAirline);
router.put('/:id', protect, admin, updateAirline);
router.delete('/:id', protect, admin, deleteAirline);

module.exports = router;