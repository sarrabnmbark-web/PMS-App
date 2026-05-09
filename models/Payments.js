const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    invoice_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true
    },
    status: {
        type: String,
        enum: ['En attente', 'Validé', 'Refusé'],
        default: 'En attente'
    },
    payment_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);