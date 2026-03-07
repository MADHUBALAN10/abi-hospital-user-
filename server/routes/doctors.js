const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Get all doctors with user info
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('userId', 'name email phone');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a doctor profile (Admin only ideally)
router.post('/', async (req, res) => {
    try {
        const { userId, specialization, experience, feesPerConsultation, availableSlots } = req.body;
        const newDoctor = new Doctor({ userId, specialization, experience, feesPerConsultation, availableSlots });
        await newDoctor.save();

        // Update user role to doctor
        await User.findByIdAndUpdate(userId, { role: 'doctor' });

        res.status(201).json(newDoctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a doctor profile
router.put('/:id', async (req, res) => {
    try {
        const { specialization, experience, feesPerConsultation, availableSlots } = req.body;
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id, 
            { specialization, experience, feesPerConsultation, availableSlots }, 
            { new: true }
        );
        res.json(updatedDoctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
