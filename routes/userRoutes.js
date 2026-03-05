const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate, registerValidation, loginValidation } = require('../validators/userValidator');

const asyncHandler = require('express-async-handler');

// basic users list endpoint (no sensitive data)
const getUsers = asyncHandler(async (req, res) => {
  const User = require('../models/User');
  const users = await User.find({}).select('-password').limit(10);
  res.json(users);
});

router.get('/', getUsers);
router.post('/', validate(registerValidation), registerUser);
router.post('/login', validate(loginValidation), authUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;