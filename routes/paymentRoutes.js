const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// list payments (protected)
router.get('/', protect, getPayments);

// detail and mutations
router.get('/:id', protect, getPaymentById);
router.post('/', protect, createPayment);
router.put('/:id', protect, admin, updatePayment);
router.delete('/:id', protect, admin, deletePayment);

module.exports = router;