const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    shift: { type: String, enum: ['Morning', 'Afternoon', 'Night'], default: 'Morning' },
    experience: { type: Number, default: 0 },
    gender: { type: String },
    profileImage: { type: String },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Nurse', nurseSchema);
