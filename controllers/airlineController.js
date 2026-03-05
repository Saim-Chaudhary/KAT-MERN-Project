const asyncHandler = require('express-async-handler');
const airlineService = require('../services/airlineService');

const createAirline = asyncHandler(async (req, res) => {
  const created = await airlineService.createAirline(req.body);
  res.status(201).json(created);
});

const getAirlines = asyncHandler(async (req, res) => {
  const result = await airlineService.listAirlines(req.query);
  res.json({ airlines: result.data, paging: result.paging });
});

const getAirlineById = asyncHandler(async (req, res) => {
  const airline = await airlineService.getAirlineById(req.params.id);
  if (airline) {
    res.json(airline);
  } else {
    res.status(404);
    throw new Error('Airline not found');
  }
});

const updateAirline = asyncHandler(async (req, res) => {
  const updated = await airlineService.updateAirline(req.params.id, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Airline not found');
  }
});

const deleteAirline = asyncHandler(async (req, res) => {
  const success = await airlineService.deleteAirline(req.params.id);
  if (success) {
    res.json({ message: 'Airline removed' });
  } else {
    res.status(404);
    throw new Error('Airline not found');
  }
});

module.exports = { createAirline, getAirlines, getAirlineById, updateAirline, deleteAirline };