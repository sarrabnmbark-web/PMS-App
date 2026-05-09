const mongoose = require('mongoose');

const seasonalPricingSchema = new mongoose.Schema({
    room_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType',
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    special_price: {
        type: Number,
        required: true
    }
});

// Vérification logique
seasonalPricingSchema.pre('save', function(next) {
    if (this.end_date <= this.start_date) {
         throw new Error('end_date doit être après start_date');
    }
});

module.exports = mongoose.model('SeasonalPricing', seasonalPricingSchema);