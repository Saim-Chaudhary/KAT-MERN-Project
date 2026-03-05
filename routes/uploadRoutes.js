const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

// only authenticated users can upload, allow multiple fields
router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;