const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        enum: ['Single', 'Double', 'Suite'] 
    },
    base_price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    description: { type: String },
    amenities: [{ type: String }]
});

module.exports = mongoose.model('RoomType', roomTypeSchema);