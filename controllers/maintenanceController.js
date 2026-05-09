const Maintenance = require('../models/MaintenanceRequests');

// CREATE
exports.createRequest = async (req, res) => {
    try {
        const request = await Maintenance.create(req.body);
        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
    try {
        const request = await Maintenance.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};