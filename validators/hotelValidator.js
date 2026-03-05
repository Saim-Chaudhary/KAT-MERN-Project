const { check } = require('express-validator');
const { validate } = require('./userValidator');

const hotelValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('city', 'City must be either Makkah or Madina')
    .optional()
    .isIn(['Makkah', 'Madina']),
  check('distanceFromHaram', 'Distance must be a number').optional().isNumeric(),
  check('category', 'Category must be one of 3 Star, 4 Star, 5 Star')
    .optional()
    .isIn(['3 Star', '4 Star', '5 Star']),
];

module.exports = { validate, hotelValidation };