const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, createBookingValidation } = require('../validators/bookingValidator');

// all routes require authentication
router.use(protect);

router.route('/').get(getBookings).post(validate(createBookingValidation), createBooking);
router
  .route('/:id')
  .get(getBookingById)
  .put(admin, updateBooking)
  .delete(admin, deleteBooking);

module.exports = router;