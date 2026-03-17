const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    cin_passport: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    email: { type: String },
    nationality: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', clientSchema);