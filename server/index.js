require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Welcome Route
app.get('/', (req, res) => {
    res.json({
        message: '🏥 MediCare+ Hospital Management System API',
        status: 'running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            doctors: '/api/doctors',
            appointments: '/api/appointments',
            inventory: '/api/inventory'
        }
    });
});

// Check for MONGO_URI
console.log('🔧 Checking environment variables...');
if (!process.env.MONGO_URI) {
    console.error('❌ ERROR: MONGO_URI is not defined in .env file');
    console.error('Please add MONGO_URI to your .env file');
} else {
    console.log('✅ MONGO_URI found in environment');
}

// Database Connection
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_management')
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        console.log('📊 Database:', mongoose.connection.name);
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('Please check your MONGO_URI in .env file');
    });

// Routes (Imports)
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const inventoryRoutes = require('./routes/inventory');
const nurseRoutes = require('./routes/nurses');

// Routes (Mounting)
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/nurses', nurseRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.path}`,
        availableRoutes: ['/api/auth', '/api/doctors', '/api/appointments', '/api/inventory']
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('\n=================================');
    console.log('🚀 Server Status: RUNNING');
    console.log('📡 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('📝 API Docs: http://localhost:' + PORT);
    console.log('=================================\n');
});
