const Hotel = require('../models/Hotel');
const { getPagination, generatePagingResult } = require('../utils/paginate');
const logger = require('../utils/logger');

const createHotel = async (data) => {
  logger.debug('Creating hotel', { name: data.name });
  const hotel = new Hotel(data);
  const saved = await hotel.save();
  const { clearPattern } = require('../utils/cache');
  await clearPattern('hotels:list*');
  return saved;
};

const { buildHotelFilter } = require('../utils/filter');

const listHotels = async (queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const { skip, limit: pageSize, page: pageNumber } = getPagination(page, limit);
  const filter = buildHotelFilter(queryParams);
  logger.debug('Listing hotels', { page: pageNumber, limit: pageSize, filter });

  const total = await Hotel.countDocuments(filter);
  const hotels = await Hotel.find(filter)
    .skip(skip)
    .limit(pageSize);

  return { data: hotels, paging: generatePagingResult(total, pageSize, pageNumber) };
};

const getHotelById = async (id) => {
  logger.debug('Fetching hotel by id', { id });
  return await Hotel.findById(id);
};

const updateHotel = async (id, updates) => {
  const hotel = await Hotel.findById(id);
  if (!hotel) return null;
  Object.assign(hotel, updates);
  const updated = await hotel.save();
  const { deleteKey, clearPattern } = require('../utils/cache');
  await deleteKey(`hotels:detail:${id}`);
  await clearPattern('hotels:list*');
  return updated;
};

const deleteHotel = async (id) => {
  const hotel = await Hotel.findById(id);
  if (!hotel) return false;
  await hotel.remove();
  const { deleteKey, clearPattern } = require('../utils/cache');
  await deleteKey(`hotels:detail:${id}`);
  await clearPattern('hotels:list*');
  return true;
};

module.exports = {
  createHotel,
  listHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
};