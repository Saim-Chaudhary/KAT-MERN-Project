const Booking = require('../models/Booking');
const logger = require('../utils/logger');

const createBooking = async (data) => {
  logger.debug('Creating booking', { user: data.user, package: data.package });
  const booking = new Booking(data);
  return await booking.save();
};

const listBookings = async (filters = {}) => {
  logger.debug('Listing bookings', { filters });
  return await Booking.find(filters)
    .populate('user package assignedGuide');
};

const getBookingById = async (id) => {
  logger.debug('Fetching booking by id', { id });
  return await Booking.findById(id).populate('user package assignedGuide');
};

const updateBooking = async (id, updates) => {
  const booking = await Booking.findById(id);
  if (!booking) return null;
  Object.assign(booking, updates);
  return await booking.save();
};

const deleteBooking = async (id) => {
  const booking = await Booking.findById(id);
  if (!booking) return false;
  await booking.remove();
  return true;
};

module.exports = {
  createBooking,
  listBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};