const express = require('express');
const router = express.Router();
const { createTask, updateTaskStatus } = require('../controllers/housekeepingController');
const { protect } = require('../middlewares/authMiddleware');

// CREATE TASK
router.post('/', protect, createTask);

// UPDATE STATUS
router.put('/:id', protect, updateTaskStatus);

module.exports = router;