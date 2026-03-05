const Airline = require('../models/Airline');
const { getPagination, generatePagingResult } = require('../utils/paginate');
const logger = require('../utils/logger');

const createAirline = async (data) => {
  logger.debug('Creating airline', { name: data.name });
  const airline = new Airline(data);
  return await airline.save();
};

const listAirlines = async (queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const { skip, limit: pageSize, page: pageNumber } = getPagination(page, limit);
  logger.debug('Listing airlines', { page: pageNumber, limit: pageSize });

  const total = await Airline.countDocuments({});
  const airlines = await Airline.find({})
    .skip(skip)
    .limit(pageSize);

  return { data: airlines, paging: generatePagingResult(total, pageSize, pageNumber) };
};

const getAirlineById = async (id) => {
  logger.debug('Fetching airline by id', { id });
  return await Airline.findById(id);
};

const updateAirline = async (id, updates) => {
  const airline = await Airline.findById(id);
  if (!airline) return null;
  Object.assign(airline, updates);
  return await airline.save();
};

const deleteAirline = async (id) => {
  const airline = await Airline.findById(id);
  if (!airline) return false;
  await airline.remove();
  return true;
};

module.exports = {
  createAirline,
  listAirlines,
  getAirlineById,
  updateAirline,
  deleteAirline,
};