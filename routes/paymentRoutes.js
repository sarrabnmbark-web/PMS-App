const express = require('express');
const router = express.Router();
const { createPayment, getPaymentsByInvoice } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// CREATE PAYMENT
router.post('/', protect, createPayment);

// GET PAYMENTS BY INVOICE
router.get('/:invoice_id', protect, getPaymentsByInvoice);

module.exports = router;