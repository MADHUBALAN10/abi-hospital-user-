import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserMd, FaClock, FaCheckCircle, FaArrowRight, FaSignOutAlt, FaHeartbeat, FaFileMedical, FaHistory, FaStar, FaSearch, FaFilter, FaBell, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [activeStep, setActiveStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookedAppointment, setBookedAppointment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('all');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Auto-fix user data on load - RUNS ONLY ONCE
    useEffect(() => {
        const generateValidObjectId = () => {
            const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
            const randomHex = () => Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            return timestamp + randomHex() + randomHex() + randomHex().substring(0, 2);
        };

        const validateAndFixUser = () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) throw new Error('No user data');

                const userData = JSON.parse(userStr);

                // Check if user ID is valid (24 characters)
                if (!userData._id || userData._id.length !== 24) {
                    console.warn('⚠️ Invalid user ID detected. Auto-fixing...');

                    // Generate valid user with proper ObjectId
                    const validUser = {
                        _id: generateValidObjectId(),
                        name: userData.name || 'Test Patient',
                        email: userData.email || 'patient@hospital.com',
                        role: 'patient'
                    };

                    localStorage.setItem('user', JSON.stringify(validUser));
                    console.log('✅ User ID fixed:', validUser._id, '(24 characters)');
                    return validUser;
                }

                return userData;
            } catch (error) {
                console.error('User validation error:', error);

                // Create new valid user
                const validUser = {
                    _id: generateValidObjectId(),
                    name: 'Test Patient',
                    email: 'patient@hospital.com',
                    role: 'patient'
                };

                localStorage.setItem('user', JSON.stringify(validUser));
                console.log('✅ New user created:', validUser._id);
                return validUser;
            }
        };

        const validatedUser = validateAndFixUser();
        setUser(validatedUser);

    }, []); // Empty dependency array - runs ONCE on mount

    useEffect(() => {
        if (user) {
            fetchDoctors();
            fetchMyAppointments();
        }
    }, [user]);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API_URL}/doctors`);
            setDoctors(res.data.map((doc, i) => ({
                id: doc._id,
                name: doc.userId?.name || 'Doctor',
                specialty: doc.specialization,
                rating: 4.5 + (i * 0.1),
                fee: doc.feesPerConsultation,
                avatar: doc.userId?.name?.[0] + (doc.userId?.name?.split(' ')[1]?.[0] || ''),
                color: ['#667eea', '#48bb78', '#f6ad55', '#4299e1', '#ed8936'][i % 5],
                experience: doc.experience,
                patients: 100 + (i * 20)
            })));
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([
                { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9, fee: 200, avatar: 'SJ', color: '#667eea', experience: 10, patients: 234 },
                { id: '2', name: 'Dr. Michael Chen', specialty: 'Dermatologist', rating: 4.8, fee: 150, avatar: 'MC', color: '#48bb78', experience: 8, patients: 189 },
                { id: '3', name: 'Dr. Emily Davis', specialty: 'Pediatrician', rating: 5.0, fee: 180, avatar: 'ED', color: '#f6ad55', experience: 12, patients: 312 },
                { id: '4', name: 'Dr. James Wilson', specialty: 'Neurologist', rating: 4.7, fee: 220, avatar: 'JW', color: '#4299e1', experience: 15, patients: 267 },
            ]);
        }
    };

    const fetchMyAppointments = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await axios.get(`${API_URL}/appointments?role=patient&userId=${user._id}`);
            setMyAppointments(res.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setMyAppointments([]);
        }
    };

    const timeSlots = [
        { time: '09:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: true },
        { time: '04:00 PM', available: false },
        { time: '05:00 PM', available: true },
    ];

    const handleBooking = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const bookingData = {
                patientId: user._id,
                doctorId: selectedDoctor.id,
                date: selectedDate || new Date().toISOString(),
                timeSlot: selectedSlot
            };

            await axios.post(`${API_URL}/appointments`, bookingData);

            setBookedAppointment({
                doctor: selectedDoctor,
                date: selectedDate,
                slot: selectedSlot
            });

            toast.success('✅ Successfully booked your order!', {
                duration: 4000,
                position: 'top-center',
                icon: '🎉',
                style: {
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontWeight: '700',
                    padding: '16px 24px',
                    borderRadius: '16px',
                    fontSize: '1.0625rem',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
                }
            });

            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
                setActiveStep(1);
                setSelectedDoctor(null);
                setSelectedSlot(null);
                setSelectedDate('');
                setActiveTab('appointments');
                fetchMyAppointments();
            }, 4000);

        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Failed to book appointment. Please try again.');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterSpecialty === 'all' || doc.specialty === filterSpecialty;
        return matchesSearch && matchesFilter;
    });

    const specialties = ['all', ...new Set(doctors.map(d => d.specialty))];

    const upcomingAppointments = myAppointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
    const completedAppointments = myAppointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

    // Show loading while user is being validated
    if (!user) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '4px solid #e2e8f0',
                        borderTop: '4px solid #667eea',
                        borderRadius: '50%',
                        margin: '0 auto 1.5rem',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <h2 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '0.5rem' }}>Loading Dashboard...</h2>
                    <p style={{ color: '#64748b' }}>Please wait</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Toaster position="top-center" />

            {/* Modern Header */}
            <header style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            🏥
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                                MediCare+
                            </h1>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Patient Portal</p>
                        </div>
                    </div>

                    <nav style={{ display: 'flex', gap: '0.5rem' }}>
                        {['home', 'book', 'appointments', 'history'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    background: activeTab === tab ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                                    color: activeTab === tab ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {tab === 'book' ? 'Book Appointment' : tab}
                            </button>
                        ))}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button style={{
                            width: '40px',
                            height: '40px',
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FaBell color="#64748b" />
                        </button>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1rem'
                        }}>
                            {user.name?.[0] || 'P'}
                        </div>
                        <button onClick={handleLogout} style={{
                            padding: '0.625rem 1.25rem',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                {/* Home Tab - Dashboard Overview */}
                {activeTab === 'home' && (
                    <div>
                        {/* Hero Section */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            padding: '3rem',
                            marginBottom: '2rem',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                                Welcome back, {user.name || 'Patient'}! 👋
                            </h2>
                            <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '2rem' }}>
                                Your health journey starts here. Book appointments, track your medical history, and stay connected with your healthcare providers.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setActiveTab('book')} style={{
                                    padding: '1rem 2rem',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '1.0625rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                                }}>
                                    <FaCalendarAlt /> Book Appointment
                                </button>
                                <button onClick={() => setActiveTab('history')} style={{
                                    padding: '1rem 2rem',
                                    background: 'white',
                                    color: '#667eea',
                                    border: '2px solid #667eea',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '1.0625rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FaHistory /> View History
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            {[
                                { icon: '📅', label: 'Next Appointment', value: upcomingAppointments[0] ? new Date(upcomingAppointments[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None', color: '#667eea' },
                                { icon: '✅', label: 'Total Visits', value: completedAppointments.length, color: '#48bb78' },
                                { icon: '👨‍⚕️', label: 'Doctors Consulted', value: new Set(myAppointments.map(a => a.doctorId?._id)).size, color: '#f6ad55' },
                                { icon: '⏰', label: 'Pending', value: upcomingAppointments.length, color: '#4299e1' },
                            ].map((stat, i) => (
                                <div key={i} style={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                                    borderLeft: `4px solid ${stat.color}`
                                }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</p>
                                    <p style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Appointments */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            padding: '2rem',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
                                📅 Upcoming Appointments
                            </h3>
                            {upcomingAppointments.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {upcomingAppointments.slice(0, 3).map(appt => (
                                        <div key={appt._id} style={{
                                            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            border: '2px solid #e2e8f0'
                                        }}>
                                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                    borderRadius: '14px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '1.25rem',
                                                    fontWeight: '800'
                                                }}>
                                                    👨‍⚕️
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '800', fontSize: '1.125rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                                                        {appt.doctorId?.userId?.name || 'Doctor'}
                                                    </p>
                                                    <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                                                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {appt.timeSlot}
                                                    </p>
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '0.5rem 1rem',
                                                background: appt.status === 'Pending' ? '#fef3c7' : '#d1fae5',
                                                color: appt.status === 'Pending' ? '#92400e' : '#065f46',
                                                borderRadius: '8px',
                                                fontWeight: '700',
                                                fontSize: '0.875rem'
                                            }}>
                                                {appt.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</p>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>No upcoming appointments</p>
                                    <button onClick={() => setActiveTab('book')} style={{
                                        marginTop: '1rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}>
                                        Book Your First Appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Book Appointment Tab */}
                {activeTab === 'book' && (
                    <div>
                        {activeStep === 1 && (
                            <div>
                                {/* Search and Filter */}
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
                                }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
                                        🔍 Find Your Doctor
                                    </h2>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <FaSearch style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input
                                                type="text"
                                                placeholder="Search doctors by name or specialty..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem 1rem 1rem 3rem',
                                                    border: '2px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    transition: 'border 0.3s'
                                                }}
                                            />
                                        </div>
                                        <select
                                            value={filterSpecialty}
                                            onChange={(e) => setFilterSpecialty(e.target.value)}
                                            style={{
                                                padding: '1rem 1.5rem',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '12px',
                                                fontSize: '1rem',
                                                outline: 'none',
                                                background: 'white',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {specialties.map(spec => (
                                                <option key={spec} value={spec}>
                                                    {spec === 'all' ? '🏥 All Specialties' : spec}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                                        Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                {/* Doctors Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                    {filteredDoctors.map(doctor => (
                                        <div
                                            key={doctor.id}
                                            onClick={() => {
                                                setSelectedDoctor(doctor);
                                                setActiveStep(2);
                                            }}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(20px)',
                                                borderRadius: '20px',
                                                padding: '2rem',
                                                cursor: 'pointer',
                                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                                                transition: 'all 0.3s',
                                                border: '2px solid transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-8px)';
                                                e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.2)';
                                                e.currentTarget.style.borderColor = doctor.color;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
                                                e.currentTarget.style.borderColor = 'transparent';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                                <div style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    background: `linear-gradient(135deg, ${doctor.color}, ${doctor.color}dd)`,
                                                    borderRadius: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '1.5rem',
                                                    fontWeight: '800',
                                                    boxShadow: `0 10px 30px ${doctor.color}40`
                                                }}>
                                                    {doctor.avatar}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem' }}>
                                                        {doctor.name}
                                                    </h3>
                                                    <p style={{ color: '#64748b', fontSize: '0.9375rem', fontWeight: '600' }}>
                                                        {doctor.specialty}
                                                    </p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    background: '#fef3c7',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '8px'
                                                }}>
                                                    <FaStar color="#f59e0b" size={14} />
                                                    <span style={{ fontWeight: '700', color: '#92400e', fontSize: '0.875rem' }}>
                                                        {doctor.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <div style={{
                                                    background: '#dbeafe',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '700',
                                                    color: '#1e40af'
                                                }}>
                                                    {doctor.experience} years exp.
                                                </div>
                                                <div style={{
                                                    background: '#dcfce7',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '700',
                                                    color: '#166534'
                                                }}>
                                                    {doctor.patients}+ patients
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingTop: '1rem',
                                                borderTop: '2px solid #f1f5f9'
                                            }}>
                                                <div>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '700' }}>
                                                        Consultation Fee
                                                    </p>
                                                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: doctor.color }}>
                                                        ₹{doctor.fee}
                                                    </p>
                                                </div>
                                                <button style={{
                                                    padding: '0.75rem 1.5rem',
                                                    background: `linear-gradient(135deg, ${doctor.color}, ${doctor.color}dd)`,
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    fontSize: '0.9375rem'
                                                }}>
                                                    Book Now <FaArrowRight size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeStep === 2 && selectedDoctor && (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '3rem',
                                maxWidth: '800px',
                                margin: '0 auto',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                            }}>
                                <button
                                    onClick={() => setActiveStep(1)}
                                    style={{
                                        background: '#f1f5f9',
                                        border: 'none',
                                        padding: '0.75rem 1.25rem',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        color: '#475569',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    ← Back to Doctors
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{
                                        width: '90px',
                                        height: '90px',
                                        background: `linear-gradient(135deg, ${selectedDoctor.color}, ${selectedDoctor.color}dd)`,
                                        borderRadius: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '2rem',
                                        fontWeight: '800',
                                        boxShadow: `0 15px 40px ${selectedDoctor.color}40`
                                    }}>
                                        {selectedDoctor.avatar}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                                            {selectedDoctor.name}
                                        </h2>
                                        <p style={{ fontSize: '1.125rem', color: '#64748b', fontWeight: '600' }}>
                                            {selectedDoctor.specialty}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                        📅 Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            fontWeight: '600'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                        🕐 Select Time Slot
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                                        {timeSlots.map(slot => (
                                            <button
                                                key={slot.time}
                                                disabled={!slot.available}
                                                onClick={() => setSelectedSlot(slot.time)}
                                                style={{
                                                    padding: '1rem',
                                                    background: selectedSlot === slot.time ? `linear-gradient(135deg, ${selectedDoctor.color}, ${selectedDoctor.color}dd)` :
                                                        slot.available ? 'white' : '#f8fafc',
                                                    color: selectedSlot === slot.time ? 'white' :
                                                        slot.available ? '#475569' : '#cbd5e1',
                                                    border: selectedSlot === slot.time ? 'none' : '2px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    fontWeight: '700',
                                                    cursor: slot.available ? 'pointer' : 'not-allowed',
                                                    transition: 'all 0.3s',
                                                    fontSize: '0.9375rem'
                                                }}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedDate && selectedSlot && (
                                    <div style={{
                                        marginTop: '2rem',
                                        padding: '1.5rem',
                                        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                                        borderRadius: '16px',
                                        border: '2px solid #bae6fd'
                                    }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0369a1', marginBottom: '1rem' }}>
                                            📋 Appointment Summary
                                        </h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ color: '#475569', fontWeight: '600' }}>Doctor:</span>
                                            <span style={{ fontWeight: '800', color: '#1e293b' }}>{selectedDoctor.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ color: '#475569', fontWeight: '600' }}>Date:</span>
                                            <span style={{ fontWeight: '800', color: '#1e293b' }}>
                                                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ color: '#475569', fontWeight: '600' }}>Time:</span>
                                            <span style={{ fontWeight: '800', color: '#1e293b' }}>{selectedSlot}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '2px solid #bae6fd' }}>
                                            <span style={{ color: '#475569', fontWeight: '700', fontSize: '1.125rem' }}>Consultation Fee:</span>
                                            <span style={{ fontWeight: '800', color: selectedDoctor.color, fontSize: '1.5rem' }}>₹{selectedDoctor.fee}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={!selectedDate || !selectedSlot || loading}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        background: selectedDate && selectedSlot ? `linear-gradient(135deg, ${selectedDoctor.color}, ${selectedDoctor.color}dd)` : '#e2e8f0',
                                        color: selectedDate && selectedSlot ? 'white' : '#94a3b8',
                                        border: 'none',
                                        borderRadius: '14px',
                                        fontSize: '1.125rem',
                                        fontWeight: '800',
                                        cursor: selectedDate && selectedSlot ? 'pointer' : 'not-allowed',
                                        marginTop: '2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        boxShadow: selectedDate && selectedSlot ? `0 10px 30px ${selectedDoctor.color}40` : 'none'
                                    }}
                                >
                                    {loading ? 'Booking...' : (
                                        <>
                                            <FaCheckCircle /> Confirm Booking
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
                    }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
                            📅 My Appointments
                        </h2>

                        {upcomingAppointments.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {upcomingAppointments.map(appt => (
                                    <div key={appt._id} style={{
                                        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                                        borderRadius: '16px',
                                        padding: '2rem',
                                        border: '2px solid #e2e8f0'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                    borderRadius: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '1.5rem',
                                                    fontWeight: '800'
                                                }}>
                                                    👨‍⚕️
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '800', fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                                                        {appt.doctorId?.userId?.name || 'Doctor'}
                                                    </p>
                                                    <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                                        {appt.doctorId?.specialization || 'Specialist'}
                                                    </p>
                                                    <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                                                        📅 {new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • 🕐 {appt.timeSlot}
                                                    </p>
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '0.75rem 1.25rem',
                                                background: appt.status === 'Pending' ? '#fef3c7' : '#d1fae5',
                                                color: appt.status === 'Pending' ? '#92400e' : '#065f46',
                                                borderRadius: '10px',
                                                fontWeight: '800',
                                                fontSize: '0.9375rem'
                                            }}>
                                                {appt.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No appointments yet</p>
                                <p style={{ marginBottom: '2rem' }}>Book your first appointment to get started</p>
                                <button onClick={() => setActiveTab('book')} style={{
                                    padding: '1rem 2rem',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '1.0625rem',
                                    cursor: 'pointer'
                                }}>
                                    Book Appointment Now
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
                    }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
                            📊 Appointment History
                        </h2>

                        {completedAppointments.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {completedAppointments.map(appt => (
                                    <div key={appt._id} style={{
                                        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                                        borderRadius: '16px',
                                        padding: '2rem',
                                        border: '2px solid #e2e8f0',
                                        opacity: 0.8
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    background: '#cbd5e1',
                                                    borderRadius: '14px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.25rem'
                                                }}>
                                                    👨‍⚕️
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '800', fontSize: '1.125rem', color: '#475569', marginBottom: '0.5rem' }}>
                                                        {appt.doctorId?.userId?.name || 'Doctor'}
                                                    </p>
                                                    <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                                                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {appt.timeSlot}
                                                    </p>
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '0.75rem 1.25rem',
                                                background: appt.status === 'Completed' ? '#d1fae5' : '#fee2e2',
                                                color: appt.status === 'Completed' ? '#065f46' : '#991b1b',
                                                borderRadius: '10px',
                                                fontWeight: '800',
                                                fontSize: '0.9375rem'
                                            }}>
                                                {appt.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>No appointment history</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Success Modal */}
            {showSuccessModal && bookedAppointment && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    {/* Confetti particles */}
                    {[...Array(20)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            width: '10px',
                            height: '10px',
                            background: ['#10b981', '#0891b2', '#f59e0b', '#8b5cf6', '#ec4899'][i % 5],
                            borderRadius: '50%',
                            top: '50%',
                            left: '50%',
                            animation: `confetti${i % 4} ${1 + Math.random()}s ease-out forwards`,
                            opacity: 0
                        }} />
                    ))}

                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        maxWidth: '500px',
                        width: '90%',
                        padding: '3rem 2.5rem',
                        textAlign: 'center',
                        animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        position: 'relative',
                        overflow: 'visible',
                        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.3)'
                    }}>
                        {/* Animated Checkmark Circle */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem',
                            boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4), 0 0 0 20px rgba(16, 185, 129, 0.1)',
                            animation: 'checkmarkPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
                            position: 'relative'
                        }}>
                            {/* Pulse rings */}
                            <div style={{
                                position: 'absolute',
                                inset: '-10px',
                                border: '3px solid #10b981',
                                borderRadius: '50%',
                                animation: 'pulse 1.5s ease-out infinite'
                            }} />
                            <div style={{
                                position: 'absolute',
                                inset: '-20px',
                                border: '2px solid #10b981',
                                borderRadius: '50%',
                                animation: 'pulse 1.5s ease-out 0.3s infinite',
                                opacity: 0.5
                            }} />

                            <FaCheckCircle style={{
                                fontSize: '4rem',
                                color: 'white',
                                animation: 'checkmarkDraw 0.5s ease-out 0.4s both'
                            }} />
                        </div>

                        {/* Success Message */}
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '1rem',
                            animation: 'slideUpFade 0.5s ease-out 0.5s both'
                        }}>
                            🎉 Booking Confirmed!
                        </h2>

                        <p style={{
                            color: '#64748b',
                            fontSize: '1.0625rem',
                            marginBottom: '2rem',
                            animation: 'slideUpFade 0.5s ease-out 0.6s both'
                        }}>
                            Your appointment has been scheduled successfully
                        </p>

                        {/* Booking Details Card */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                            border: '2px solid #86efac',
                            textAlign: 'left',
                            borderRadius: '16px',
                            animation: 'slideUpFade 0.5s ease-out 0.7s both'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    background: `linear-gradient(135deg, ${bookedAppointment.doctor.color}, ${bookedAppointment.doctor.color}dd)`,
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    fontWeight: '800'
                                }}>
                                    {bookedAppointment.doctor.avatar}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                                        {bookedAppointment.doctor.name}
                                    </p>
                                    <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                                        {bookedAppointment.doctor.specialty}
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                paddingTop: '1rem',
                                borderTop: '2px solid #bbf7d0'
                            }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                                        📅 Date
                                    </p>
                                    <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9375rem' }}>
                                        {bookedAppointment.date ? new Date(bookedAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                                        🕐 Time
                                    </p>
                                    <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9375rem' }}>
                                        {bookedAppointment.slot}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Auto-close indicator */}
                        <p style={{
                            marginTop: '1.5rem',
                            fontSize: '0.875rem',
                            color: '#94a3b8',
                            animation: 'slideUpFade 0.5s ease-out 0.8s both'
                        }}>
                            Redirecting to appointments...
                        </p>
                    </div>

                    {/* Keyframes for animations */}
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        
                        @keyframes scaleIn {
                            from {
                                opacity: 0;
                                transform: scale(0.7) translateY(30px);
                            }
                            to {
                                opacity: 1;
                                transform: scale(1) translateY(0);
                            }
                        }
                        
                        @keyframes checkmarkPop {
                            0% {
                                transform: scale(0);
                                opacity: 0;
                            }
                            50% {
                                transform: scale(1.2);
                            }
                            100% {
                                transform: scale(1);
                                opacity: 1;
                            }
                        }
                        
                        @keyframes checkmarkDraw {
                            from {
                                transform: scale(0) rotate(-45deg);
                                opacity: 0;
                            }
                            to {
                                transform: scale(1) rotate(0deg);
                                opacity: 1;
                            }
                        }
                        
                        @keyframes pulse {
                            0% {
                                transform: scale(1);
                                opacity: 1;
                            }
                            100% {
                                transform: scale(1.5);
                                opacity: 0;
                            }
                        }
                        
                        @keyframes slideUpFade {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        
                        @keyframes confetti0 {
                            to {
                                transform: translate(-100px, 200px) rotate(360deg);
                                opacity: 0;
                            }
                        }
                        
                        @keyframes confetti1 {
                            to {
                                transform: translate(100px, 220px) rotate(-360deg);
                                opacity: 0;
                            }
                        }
                        
                        @keyframes confetti2 {
                            to {
                                transform: translate(-80px, -180px) rotate(270deg);
                                opacity: 0;
                            }
                        }
                        
                        @keyframes confetti3 {
                            to {
                                transform: translate(120px, -200px) rotate(-270deg);
                                opacity: 0;
                            }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
