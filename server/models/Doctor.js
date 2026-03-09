const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    feesPerConsultation: { type: Number, required: true },
    availableSlots: [{
        day: String, // e.g., "Monday"
        startTime: String, // "10:00"
        endTime: String // "14:00"
    }],
    rating: { type: Number, default: 0 },
    gender: { type: String },
    profileImage: { type: String }
});

module.exports = mongoose.model('Doctor', doctorSchema);
