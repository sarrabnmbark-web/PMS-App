const express = require('express');
const router = express.Router();
const { checkIn, checkOut } = require('../controllers/stayController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/checkin', protect, checkIn);
router.put('/checkout/:stay_id', protect, checkOut); // PUT car on met à jour le séjour

module.exports = router;