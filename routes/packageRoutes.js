const express = require('express');
const router = express.Router();
const {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');
const { protect, admin } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../utils/cache');

const listCacheKey = (req) => `packages:list:${req.query.page || 1}:${req.query.limit || 10}`;
const detailCacheKey = (req) => `packages:detail:${req.params.id}`;

router.route('/').get(cacheMiddleware(listCacheKey, 30), getPackages).post(protect, admin, createPackage);
router
  .route('/:id')
  .get(cacheMiddleware(detailCacheKey, 60), getPackageById)
  .put(protect, admin, updatePackage)
  .delete(protect, admin, deletePackage);

module.exports = router;