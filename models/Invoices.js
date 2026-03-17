const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    stay_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Stay', 
        required: true 
    },
    generated_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    invoice_number: { 
        type: String, 
        required: true, 
        unique: true 
    },
    total_amount: { 
        type: Number, 
        required: true 
    },
    generated_at: { 
        type: Date, 
        default: Date.now 
    },
    payment_status: {
        type: String,
        enum:['Non payée', 'Payée', 'Payée partiellement'],
        default: 'Non payée'
    }
});

module.exports = mongoose.model('Invoice', invoiceSchema);