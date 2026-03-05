const asyncHandler = require('express-async-handler');
const paymentService = require('../services/paymentService');

const createPayment = asyncHandler(async (req, res) => {
  const created = await paymentService.createPayment(req.body);
  res.status(201).json(created);
});

const getPayments = asyncHandler(async (req, res) => {
  const result = await paymentService.listPayments(req.query);
  res.json({ payments: result.data, paging: result.paging });
});

const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  if (payment) {
    res.json(payment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

const updatePayment = asyncHandler(async (req, res) => {
  const updated = await paymentService.updatePayment(req.params.id, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

const deletePayment = asyncHandler(async (req, res) => {
  const success = await paymentService.deletePayment(req.params.id);
  if (success) {
    res.json({ message: 'Payment removed' });
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

module.exports = { createPayment, getPayments, getPaymentById, updatePayment, deletePayment };