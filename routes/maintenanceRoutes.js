const express = require('express');
const router = express.Router();
const { createRequest, updateStatus } = require('../controllers/maintenanceController');
const { protect } = require('../middlewares/authMiddleware');

// CREATE REQUEST
router.post('/', protect, createRequest);

// UPDATE STATUS
router.put('/:id', protect, updateStatus);

module.exports = router;