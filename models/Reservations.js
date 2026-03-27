const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    check_in_date: { type: Date, required: true },

    check_out_date: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return value > this.check_in_date;
            },
            message: "check_out_date doit être après check_in_date"
        }
    },

    status: { 
        type: String, 
        enum:['Confirmée', 'Annulée'],
        default: 'Confirmée'
    },

    total_price: { type: Number },

    notes: { type: String },

    created_at: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Reservation', reservationSchema);