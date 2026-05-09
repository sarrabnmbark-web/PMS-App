const SeasonalPricing = require('../models/SeasonalPricing');

// CREATE
exports.createSeason = async (req, res) => {
    try {
        const season = await SeasonalPricing.create(req.body);
        res.status(201).json(season);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET ALL
exports.getSeasons = async (req, res) => {
    try {
        const seasons = await SeasonalPricing.find().populate('room_type_id');
        res.json(seasons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};