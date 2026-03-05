const asyncHandler = require('express-async-handler');
const guideService = require('../services/guideService');

const createGuide = asyncHandler(async (req, res) => {
  const created = await guideService.createGuide(req.body);
  res.status(201).json(created);
});

const getGuides = asyncHandler(async (req, res) => {
  const result = await guideService.listGuides(req.query);
  res.json({ guides: result.data, paging: result.paging });
});

const getGuideById = asyncHandler(async (req, res) => {
  const guide = await guideService.getGuideById(req.params.id);
  if (guide) {
    res.json(guide);
  } else {
    res.status(404);
    throw new Error('Guide not found');
  }
});

const updateGuide = asyncHandler(async (req, res) => {
  const updated = await guideService.updateGuide(req.params.id, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Guide not found');
  }
});

const deleteGuide = asyncHandler(async (req, res) => {
  const success = await guideService.deleteGuide(req.params.id);
  if (success) {
    res.json({ message: 'Guide removed' });
  } else {
    res.status(404);
    throw new Error('Guide not found');
  }
});

module.exports = { createGuide, getGuides, getGuideById, updateGuide, deleteGuide };