const mongoose = require('mongoose');

const housekeepingTaskSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    task_status: {
        type: String,
        enum: ['En attente', 'En cours', 'Terminé'],
        default: 'En attente'
    },
    scheduled_date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('HousekeepingTask', housekeepingTaskSchema);