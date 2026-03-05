const asyncHandler = require('express-async-handler');
const bookingService = require('../services/bookingService');

// @desc    Create a booking
// @route   POST /api/v1/bookings
// @access  Private (user)
const createBooking = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user.role !== 'admin') {
    data.user = req.user._id;
  }
  const created = await bookingService.createBooking(data);
  // notify via socket
  if (req.io) {
    req.io.emit('bookingCreated', created);
  }
  res.status(201).json(created);
});

// @desc    Get user's bookings or all for admin
// @route   GET /api/v1/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== 'admin') {
    filter.user = req.user._id;
  }
  const bookings = await bookingService.listBookings(filter);
  res.json(bookings);
});

// @desc    Get booking by id
// @route   GET /api/v1/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  // enforce user ownership unless admin
  if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }
  res.json(booking);
});

// @desc    Update booking (admin only)
// @route   PUT /api/v1/bookings/:id
// @access  Private (admin)
const updateBooking = asyncHandler(async (req, res) => {
  const updated = await bookingService.updateBooking(req.params.id, req.body);
  if (updated) {
    if (req.io) req.io.emit('bookingUpdated', updated);
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Delete booking (admin only)
// @route   DELETE /api/v1/bookings/:id
// @access  Private (admin)
const deleteBooking = asyncHandler(async (req, res) => {
  const success = await bookingService.deleteBooking(req.params.id);
  if (success) {
    if (req.io) req.io.emit('bookingDeleted', { id: req.params.id });
    res.json({ message: 'Booking removed' });
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};