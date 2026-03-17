const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_number: { type: String, required: true, unique: true },
    floor: { type: Number },
    room_type_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomType', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Disponible', 'Occupée', 'Maintenance'],
        default: 'Disponible'
    }
});

module.exports = mongoose.model('Room', roomSchema);