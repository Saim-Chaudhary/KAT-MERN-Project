const Guide = require('../models/Guide');
const { getPagination, generatePagingResult } = require('../utils/paginate');
const logger = require('../utils/logger');

const createGuide = async (data) => {
  logger.debug('Creating guide', { name: data.fullName });
  const guide = new Guide(data);
  return await guide.save();
};

const listGuides = async (queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const { skip, limit: pageSize, page: pageNumber } = getPagination(page, limit);
  logger.debug('Listing guides', { page: pageNumber, limit: pageSize });

  const total = await Guide.countDocuments({});
  const guides = await Guide.find({})
    .skip(skip)
    .limit(pageSize);

  return { data: guides, paging: generatePagingResult(total, pageSize, pageNumber) };
};

const getGuideById = async (id) => {
  logger.debug('Fetching guide by id', { id });
  return await Guide.findById(id);
};

const updateGuide = async (id, updates) => {
  const guide = await Guide.findById(id);
  if (!guide) return null;
  Object.assign(guide, updates);
  return await guide.save();
};

const deleteGuide = async (id) => {
  const guide = await Guide.findById(id);
  if (!guide) return false;
  await guide.remove();
  return true;
};

module.exports = {
  createGuide,
  listGuides,
  getGuideById,
  updateGuide,
  deleteGuide,
};