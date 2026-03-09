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
        const { userId, specialization, experience, feesPerConsultation, gender, profileImage, availableSlots } = req.body;
        const newDoctor = new Doctor({ userId, specialization, experience, feesPerConsultation, gender, profileImage, availableSlots });
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
        const { name, specialization, experience, feesPerConsultation, gender, profileImage, availableSlots } = req.body;
        
        let doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

        if (name) {
            await User.findByIdAndUpdate(doctor.userId, { name });
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id, 
            { specialization, experience, feesPerConsultation, gender, profileImage, availableSlots }, 
            { new: true }
        ).populate('userId', 'name email phone');
        
        res.json(updatedDoctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
