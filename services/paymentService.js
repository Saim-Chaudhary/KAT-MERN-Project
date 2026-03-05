const Payment = require('../models/Payment');
const { getPagination, generatePagingResult } = require('../utils/paginate');
const logger = require('../utils/logger');

const createPayment = async (data) => {
  logger.debug('Creating payment', { booking: data.booking, amount: data.amount });
  const payment = new Payment(data);
  return await payment.save();
};

const listPayments = async (queryParams) => {
  const { page = 1, limit = 10 } = queryParams;
  const { skip, limit: pageSize, page: pageNumber } = getPagination(page, limit);
  logger.debug('Listing payments', { page: pageNumber, limit: pageSize });

  const total = await Payment.countDocuments({});
  const payments = await Payment.find({})
    .skip(skip)
    .limit(pageSize)
    .populate('booking');

  return { data: payments, paging: generatePagingResult(total, pageSize, pageNumber) };
};

const getPaymentById = async (id) => {
  logger.debug('Fetching payment by id', { id });
  return await Payment.findById(id).populate('booking');
};

const updatePayment = async (id, updates) => {
  const payment = await Payment.findById(id);
  if (!payment) return null;
  Object.assign(payment, updates);
  return await payment.save();
};

const deletePayment = async (id) => {
  const payment = await Payment.findById(id);
  if (!payment) return false;
  await payment.remove();
  return true;
};

module.exports = {
  createPayment,
  listPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};