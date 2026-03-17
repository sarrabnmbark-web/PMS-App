const mongoose = require('mongoose');

const staySchema = new mongoose.Schema({
    reservation_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reservation', 
        required: true 
    },
    checked_in_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    actual_check_in: { 
        type: Date, 
        default: Date.now 
    },
    actual_check_out: { 
        type: Date
    },
    stay_status: {
        type: String,
        enum:['En cours', 'Terminé', 'Annulé'], 
        default: 'En cours'
    },
    nb_guests: { 
        type: Number, 
        default: 1 
    }
});

module.exports = mongoose.model('Stay', staySchema);