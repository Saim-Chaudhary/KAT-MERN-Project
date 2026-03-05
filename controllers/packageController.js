const asyncHandler = require('express-async-handler');
const packageService = require('../services/packageService');

// @desc    Create new package
// @route   POST /api/v1/packages
// @access  Private (admin)
const createPackage = asyncHandler(async (req, res) => {
  const created = await packageService.createPackage(req.body);
  res.status(201).json(created);
});

// @desc    Get all packages (paginated)
// @route   GET /api/v1/packages
// @access  Public
const getPackages = asyncHandler(async (req, res) => {
  const result = await packageService.listPackages(req.query);
  res.json({ packages: result.data, paging: result.paging });
});

// @desc    Get single package by id
// @route   GET /api/v1/packages/:id
// @access  Public
const getPackageById = asyncHandler(async (req, res) => {
  const pkg = await packageService.getPackageById(req.params.id);
  if (pkg) {
    res.json(pkg);
  } else {
    res.status(404);
    throw new Error('Package not found');
  }
});

// @desc    Update a package
// @route   PUT /api/v1/packages/:id
// @access  Private (admin)
const updatePackage = asyncHandler(async (req, res) => {
  const updated = await packageService.updatePackage(req.params.id, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Package not found');
  }
});

// @desc    Delete a package
// @route   DELETE /api/v1/packages/:id
// @access  Private (admin)
const deletePackage = asyncHandler(async (req, res) => {
  const success = await packageService.deletePackage(req.params.id);
  if (success) {
    res.json({ message: 'Package removed' });
  } else {
    res.status(404);
    throw new Error('Package not found');
  }
});

module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};