const express = require('express');
const router = express.Router();
const { exportInvoicePDF } = require('../controllers/invoiceController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:id/pdf', exportInvoicePDF); //ecrire l'id de invoice d'apres postman ou compass pas l'id de stay

module.exports = router;