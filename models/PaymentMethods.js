const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Cash', 'Carte', 'Virement']
    }
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);