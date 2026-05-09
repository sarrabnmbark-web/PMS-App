const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Basse', 'Moyenne', 'Haute'],
        default: 'Moyenne'
    },
    status: {
        type: String,
        enum: ['Ouverte', 'En cours', 'Résolue'],
        default: 'Ouverte'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);