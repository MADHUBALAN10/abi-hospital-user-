const express = require('express');
const router = express.Router();
const Nurse = require('../models/Nurse');
const User = require('../models/User');

// GET all nurses
router.get('/', async (req, res) => {
    try {
        const nurses = await Nurse.find().populate('userId', 'name email phone');
        res.json(nurses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add a nurse (creates user + nurse profile in one step)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, department, shift, experience, gender, profileImage } = req.body;

        // Check if email already used
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'A user with this email already exists' });
        }

        // Create user (bypass auth/register to avoid enum issues)
        const newUser = new User({
            name,
            email,
            password: 'nurse123',
            phone: phone || '',
            role: 'nurse',
        });
        await newUser.save();

        // Create nurse profile
        const nurse = new Nurse({
            userId: newUser._id,
            department,
            shift: shift || 'Morning',
            experience: parseInt(experience) || 0,
            gender,
            profileImage,
            phone,
        });
        await nurse.save();

        const populated = await Nurse.findById(nurse._id).populate('userId', 'name email phone');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update a nurse
router.put('/:id', async (req, res) => {
    try {
        const { name, department, shift, experience, gender, profileImage, phone } = req.body;

        const nurse = await Nurse.findById(req.params.id);
        if (!nurse) return res.status(404).json({ error: 'Nurse not found' });

        if (name) {
            await User.findByIdAndUpdate(nurse.userId, { name });
        }

        const updated = await Nurse.findByIdAndUpdate(
            req.params.id,
            { department, shift, experience: parseInt(experience) || 0, gender, profileImage, phone },
            { new: true }
        ).populate('userId', 'name email phone');

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a nurse
router.delete('/:id', async (req, res) => {
    try {
        const nurse = await Nurse.findByIdAndDelete(req.params.id);
        if (!nurse) return res.status(404).json({ error: 'Nurse not found' });
        res.json({ message: 'Nurse deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
