const { check } = require('express-validator');
const { validate } = require('./userValidator'); // reuse validate helper

const createBookingValidation = [
  check('user', 'User ID is required').not().isEmpty().isMongoId(),
  check('package', 'Package ID is required').not().isEmpty().isMongoId(),
  check('numberOfAdults', 'Number of adults must be a number').optional().isNumeric(),
  check('numberOfChildren', 'Number of children must be a number').optional().isNumeric(),
];

module.exports = { validate, createBookingValidation };