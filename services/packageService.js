const Package = require('../models/Package');
const { getPagination, generatePagingResult } = require('../utils/paginate');
const logger = require('../utils/logger');

const createPackage = async (data) => {
  logger.debug('Creating package', { title: data.title });
  const pkg = new Package(data);
  const saved = await pkg.save();
  // clear list caches after new item
  const { clearPattern } = require('../utils/cache');
  await clearPattern('packages:list*');
  return saved;
};

const { buildPackageFilter } = require('../utils/filter');

const listPackages = async (queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const { skip, limit: pageSize, page: pageNumber } = getPagination(page, limit);
  const filter = buildPackageFilter(queryParams);
  logger.debug('Listing packages', { page: pageNumber, limit: pageSize, filter });

  const total = await Package.countDocuments(filter);
  const packages = await Package.find(filter)
    .skip(skip)
    .limit(pageSize)
    .populate('airline hotels includedServices');

  return {
    data: packages,
    paging: generatePagingResult(total, pageSize, pageNumber),
  };
};

const getPackageById = async (id) => {
  logger.debug('Fetching package by id', { id });
  return await Package.findById(id).populate('airline hotels includedServices');
};

const updatePackage = async (id, updates) => {
  const pkg = await Package.findById(id);
  if (!pkg) return null;
  Object.assign(pkg, updates);
  const updated = await pkg.save();
  const { deleteKey, clearPattern } = require('../utils/cache');
  await deleteKey(`packages:detail:${id}`);
  await clearPattern('packages:list*');
  return updated;
};

const deletePackage = async (id) => {
  const pkg = await Package.findById(id);
  if (!pkg) return false;
  await pkg.remove();
  const { deleteKey, clearPattern } = require('../utils/cache');
  await deleteKey(`packages:detail:${id}`);
  await clearPattern('packages:list*');
  return true;
};

module.exports = {
  createPackage,
  listPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};