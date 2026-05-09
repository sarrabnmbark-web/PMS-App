const express = require('express');
const router = express.Router();
const { createSeason, getSeasons } = require('../controllers/seasonalPricingController');
const { protect } = require('../middlewares/authMiddleware');

// CREATE
router.post('/', protect, createSeason);

// GET ALL
router.get('/', protect, getSeasons);

module.exports = router;