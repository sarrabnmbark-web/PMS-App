const Task = require('../models/HousekeepingTasks');

// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPDATE STATUS
exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { task_status: req.body.task_status },
            { new: true }
        );

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};