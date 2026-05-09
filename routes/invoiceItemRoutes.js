const express = require('express');
const router = express.Router();
const { addItem, getItemsByInvoice } = require('../controllers/invoiceItemController');
const { protect } = require('../middlewares/authMiddleware');

// ADD ITEM TO INVOICE
router.post('/', protect, addItem);

// GET ITEMS BY INVOICE
router.get('/:invoice_id', protect, getItemsByInvoice);

module.exports = router;