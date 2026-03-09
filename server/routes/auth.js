const express = require('express');
const router = express.Router();
const User = require('../models/User');
const https = require('https');

// Helper: fetch Google userinfo
const fetchGoogleUser = (access_token) => new Promise((resolve, reject) => {
    const options = {
        hostname: 'www.googleapis.com',
        path: '/oauth2/v3/userinfo',
        method: 'GET',
        headers: { Authorization: `Bearer ${access_token}` }
    };
    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try { resolve(JSON.parse(data)); }
            catch (e) { reject(new Error('Invalid response from Google')); }
        });
    });
    req.on('error', reject);
    req.end();
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        // In production, HASH PASSWORD HERE
        const newUser = new User({ name, email, password, role, phone });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        // In production, RETURN JWT HERE
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Google OAuth - verify access_token and create/find user
router.post('/google', async (req, res) => {
    try {
        const { access_token } = req.body;
        if (!access_token) {
            return res.status(400).json({ error: 'No access token provided' });
        }

        // Fetch user profile from Google
        const googleData = await fetchGoogleUser(access_token);
        const { email, name, sub: googleId } = googleData;

        if (!email) {
            return res.status(400).json({ error: 'Could not retrieve email from Google' });
        }

        // Find existing user or create new one
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name: name || email.split('@')[0],
                email,
                password: `google_${googleId}`,
                role: 'patient',
                phone: '',
            });
            await user.save();
        }

        res.json(user);
    } catch (err) {
        console.error('Google auth error:', err.message);
        res.status(500).json({ error: 'Google authentication failed. Please try again.' });
    }
});

module.exports = router;


