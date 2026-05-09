const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLogs');
const { protect } = require('../middlewares/authMiddleware');

// GET ALL LOGS
router.get('/', protect, async (req, res) => {
    try {
        const logs = await AuditLog.find().populate('user_id');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;