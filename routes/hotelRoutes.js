const express = require('express');
const router = express.Router();
const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');
const { protect, admin, roleCheck } = require('../middleware/authMiddleware');
const { validate, hotelValidation } = require('../validators/hotelValidator');
const { cacheMiddleware } = require('../utils/cache');

const listCacheKey = (req) => `hotels:list:${req.query.page || 1}:${req.query.limit || 10}`;
const detailCacheKey = (req) => `hotels:detail:${req.params.id}`;

// list and detail public
router.route('/').get(cacheMiddleware(listCacheKey, 30), getHotels);
router.route('/:id').get(cacheMiddleware(detailCacheKey, 60), getHotelById);

// modifications admin-only
router.post('/', protect, admin, validate(hotelValidation), createHotel);
router.put('/:id', protect, admin, validate(hotelValidation), updateHotel);
router.delete('/:id', protect, admin, deleteHotel);

module.exports = router;