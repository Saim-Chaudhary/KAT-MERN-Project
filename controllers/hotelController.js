const asyncHandler = require('express-async-handler');
const hotelService = require('../services/hotelService');

const createHotel = asyncHandler(async (req, res) => {
  const created = await hotelService.createHotel(req.body);
  res.status(201).json(created);
});

const getHotels = asyncHandler(async (req, res) => {
  const result = await hotelService.listHotels(req.query);
  res.json({ hotels: result.data, paging: result.paging });
});

const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await hotelService.getHotelById(req.params.id);
  if (hotel) {
    res.json(hotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

const updateHotel = asyncHandler(async (req, res) => {
  const updated = await hotelService.updateHotel(req.params.id, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

const deleteHotel = asyncHandler(async (req, res) => {
  const success = await hotelService.deleteHotel(req.params.id);
  if (success) {
    res.json({ message: 'Hotel removed' });
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

module.exports = { createHotel, getHotels, getHotelById, updateHotel, deleteHotel };