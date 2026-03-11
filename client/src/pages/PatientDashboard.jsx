import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserMd, FaClock, FaCheckCircle, FaArrowRight, FaSignOutAlt, FaHeartbeat, FaFileMedical, FaHistory, FaStar, FaSearch, FaFilter, FaBell, FaUser, FaCreditCard, FaLock, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'https://abi-hospital-backend.onrender.com/api';

/* ── Green-style Appointment Booking Form ── */
const GreenBookingForm = ({ selectedDoctor, doctors, selectedDate, setSelectedDate, selectedSlot, setSelectedSlot, loading, handleBooking, onBack }) => {
    const [center, setCenter] = useState('');
    const [department, setDepartment] = useState(selectedDoctor?.specialty || '');
    const [patientName, setPatientName] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const centers = ['Main Campus', 'North Branch', 'South Clinic', 'East Wing', 'West Center'];
    const departments = [...new Set(doctors.map(d => d.specialty)), 'General Medicine', 'Emergency'];
    const slots = [
        { time: '09:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: true },
        { time: '04:00 PM', available: false },
        { time: '05:00 PM', available: true },
    ];

    const inputStyle = {
        width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
        borderRadius: '8px', fontSize: '0.9rem', outline: 'none',
        background: '#f8fbff', color: '#1e293b', boxSizing: 'border-box',
        fontFamily: 'inherit',
    };
    const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'auto' };

    const canSubmit = selectedDate && selectedSlot && !loading;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedSlot) { alert('Please select a time slot.'); return; }
        handleBooking();
    };

    return (
        <div style={{
            borderRadius: '20px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            minHeight: '540px', maxWidth: '960px', margin: '0 auto',
        }}>
            {/* Left — Medical image with green overlay */}
            <div style={{
                position: 'relative', overflow: 'hidden',
                backgroundImage: `url('https://img.freepik.com/free-photo/doctor-checking-patient-health_1279-2018.jpg')`,
                backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(160deg, rgba(22,163,74,0.82) 0%, rgba(5,90,40,0.88) 100%)',
                }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '48px 36px', color: 'white', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <button onClick={onBack} style={{
                        background: 'rgba(255,255,255,0.18)', color: 'white', border: 'none',
                        padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                        fontWeight: '600', fontSize: '0.85rem', marginBottom: '32px',
                        display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content',
                    }}>← Back to Doctors</button>

                    <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🏥</div>
                    <h2 style={{ fontSize: '1.7rem', fontWeight: '800', marginBottom: '12px', lineHeight: 1.3 }}>
                        Book an Appointment
                    </h2>
                    <p style={{ fontSize: '0.92rem', opacity: 0.88, lineHeight: 1.7, marginBottom: '28px' }}>
                        Please feel welcome to contact our staff with any general or medical enquiry.
                        Our doctors will receive or return any urgent calls.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { icon: '📅', text: 'Easy appointment scheduling' },
                            { icon: '👨‍⚕️', text: `Booking with ${selectedDoctor?.name}` },
                            { icon: '🎯', text: selectedDoctor?.specialty || 'Expert Specialist' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', opacity: 0.92 }}>
                                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — White form card */}
            <div style={{ background: '#ffffff', padding: '32px 30px', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                    Book An Appointment
                </h3>
                <p style={{ fontSize: '0.83rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.6 }}>
                    Please feel welcome to contact our staff with any general or medical enquiry.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Row 1: Center + Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <select style={selectStyle} value={center} onChange={e => setCenter(e.target.value)} required>
                            <option value="">Select Center</option>
                            {centers.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input
                            type="date" style={inputStyle}
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    {/* Row 2: Doctor/Dept + Patient Name */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <select style={selectStyle} value={department} onChange={e => setDepartment(e.target.value)} required>
                            <option value="">Doctor / Department</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input
                            type="text" placeholder="Enter Your Name" style={inputStyle}
                            value={patientName} onChange={e => setPatientName(e.target.value)} required
                        />
                    </div>

                    {/* Row 3: Phone + Age */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                            type="tel" placeholder="Enter Your Phone No." style={inputStyle}
                            value={phone} onChange={e => setPhone(e.target.value)} required
                        />
                        <input
                            type="number" placeholder="Enter Your Age" style={inputStyle}
                            value={age} onChange={e => setAge(e.target.value)} min="1" max="120" required
                        />
                    </div>

                    {/* Email */}
                    <input
                        type="email" placeholder="Enter Your Email Id" style={inputStyle}
                        value={email} onChange={e => setEmail(e.target.value)} required
                    />

                    {/* Time Slot — required by backend */}
                    <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '7px' }}>
                            🕐 Select Time Slot <span style={{ color: '#dc2626' }}>*</span>
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {slots.map(slot => (
                                <button
                                    key={slot.time}
                                    type="button"
                                    disabled={!slot.available}
                                    onClick={() => setSelectedSlot(slot.time)}
                                    style={{
                                        padding: '7px 12px',
                                        background: selectedSlot === slot.time ? '#16a34a' : slot.available ? '#f8fbff' : '#f1f5f9',
                                        color: selectedSlot === slot.time ? 'white' : slot.available ? '#374151' : '#cbd5e1',
                                        border: `1.5px solid ${selectedSlot === slot.time ? '#16a34a' : '#e2e8f0'}`,
                                        borderRadius: '7px', fontWeight: '700', fontSize: '0.78rem',
                                        cursor: slot.available ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                        {!selectedSlot && (
                            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>Please select a time slot</p>
                        )}
                    </div>

                    {/* Message */}
                    <textarea
                        placeholder="Enter Your Message (optional)"
                        rows={2}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        style={{
                            width: '100%', padding: '13px',
                            background: canSubmit ? '#14532d' : '#e2e8f0',
                            color: canSubmit ? 'white' : '#94a3b8',
                            border: 'none', borderRadius: '8px',
                            fontSize: '1rem', fontWeight: '800',
                            cursor: canSubmit ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'background 0.2s', marginTop: '4px',
                        }}
                        onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = '#166534'; }}
                        onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = '#14532d'; }}
                    >
                        → {loading ? 'Booking...' : 'Proceed to Payment'}
                    </button>

                    {/* Consultation fee display */}
                    {selectedDoctor?.fee && (
                        <div style={{
                            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                            borderRadius: '10px', padding: '12px 16px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            border: '1.5px solid #bae6fd',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaShieldAlt size={14} color="#0284c7" />
                                <span style={{ fontSize: '0.82rem', color: '#0c4a6e', fontWeight: '600' }}>Consultation Fee + GST</span>
                            </div>
                            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0369a1' }}>
                                ₹{(selectedDoctor.fee + Math.round(selectedDoctor.fee * 0.18)).toLocaleString('en-IN')}
                            </span>
                        </div>
                    )}

                    {/* Video consultation link */}
                    <p style={{ textAlign: 'center', marginTop: '2px' }}>
                        <a href="#video-consult" style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}
                            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.target.style.textDecoration = 'none'}>
                            🎥 Video Consultation
                        </a>
                    </p>
                </form>


            </div>

        </div>
    );
};

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
    const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [rescheduleAppt, setRescheduleAppt] = useState(null);
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleSlot, setRescheduleSlot] = useState('');
    const navigate = useNavigate();

    // Auto-fix user data on load - RUNS ONLY ONCE
    useEffect(() => {
        const generateValidObjectId = () => {
            // Generate a valid 24-character MongoDB ObjectId
            const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
            const randomHex = () => Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            const id = timestamp + randomHex() + randomHex() + randomHex();
            return id.substring(0, 24);
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
        const urlParams = new URLSearchParams(window.location.search);
        const appointmentId = urlParams.get('appointmentId');

        if (urlParams.get('success')) {
            toast.success('✅ Payment successful! Appointment confirmed.', {
                duration: 4000,
                position: 'top-center',
                icon: '🎉',
                style: {
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white', fontWeight: '700', padding: '16px 24px',
                    borderRadius: '16px', fontSize: '1.0625rem',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
                }
            });
            if (appointmentId) {
                axios.put(`${API_URL}/payment/update-appointment-payment/${appointmentId}`, { paymentStatus: 'Paid' })
                    .catch(e => console.error("Error updating status:", e));
            }

            setBookedAppointment({
                doctor: { name: "Your Doctor", specialty: "Consultation", color: "#10b981", avatar: "👩‍⚕️" },
                date: new Date().toISOString(),
                slot: "Confirmed"
            });
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
                setActiveTab('home');
            }, 4000);

            window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (urlParams.get('canceled')) {
            toast.error('❌ Payment canceled. Appointment not finalized.', {
                duration: 4000,
                position: 'top-center',
            });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

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
                patients: 100 + (i * 20),
                profileImage: doc.profileImage || null,
                gender: doc.gender || '',
            })));
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([
                { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9, fee: 800, avatar: 'SJ', color: '#667eea', experience: 10, patients: 234, profileImage: null },
                { id: '2', name: 'Dr. Michael Chen', specialty: 'Dermatologist', rating: 4.8, fee: 600, avatar: 'MC', color: '#48bb78', experience: 8, patients: 189, profileImage: null },
                { id: '3', name: 'Dr. Emily Davis', specialty: 'Pediatrician', rating: 5.0, fee: 700, avatar: 'ED', color: '#f6ad55', experience: 12, patients: 312, profileImage: null },
                { id: '4', name: 'Dr. James Wilson', specialty: 'Neurologist', rating: 4.7, fee: 900, avatar: 'JW', color: '#4299e1', experience: 15, patients: 267, profileImage: null },
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
            const fee = selectedDoctor.fee || 500;
            const gst = Math.round(fee * 0.18);
            const total = fee + gst;

            const bookingData = {
                patientId: user._id,
                doctorId: selectedDoctor.id,
                date: selectedDate || new Date().toISOString(),
                timeSlot: selectedSlot,
                paymentId: '',
                paymentAmount: total,
                paymentStatus: 'Pending',
            };

            const apptRes = await axios.post(`${API_URL}/appointments`, bookingData);
            const newAppointmentId = apptRes.data._id;

            // Initiate Checkout
            const checkoutRes = await axios.post(`${API_URL}/payment/create-checkout-session`, {
                amount: total,
                doctorName: selectedDoctor.name,
                appointmentId: newAppointmentId,
                successUrl: `${window.location.origin}/patient-dashboard?success=true&appointmentId=${newAppointmentId}`,
                cancelUrl: `${window.location.origin}/patient-dashboard?canceled=true`
            });

            if (checkoutRes.data.url) {
                window.location.href = checkoutRes.data.url;
            } else {
                toast.error("Failed to generate payment link.");
                setLoading(false);
            }

        } catch (error) {
            console.error('Booking error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to book appointment. Please try again.';
            toast.error(`❌ ${errorMessage}`);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleReschedule = async () => {
        if (!rescheduleDate || !rescheduleSlot) {
            toast.error('Please select a new date and time slot.');
            return;
        }
        try {
            await axios.put(`${API_URL}/appointments/${rescheduleAppt._id}`, {
                date: rescheduleDate,
                timeSlot: rescheduleSlot,
            });
            toast.success('✅ Appointment rescheduled successfully!', {
                duration: 3000,
                position: 'top-center',
                style: { background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', fontWeight: '700', borderRadius: '14px', padding: '14px 22px' }
            });
            setShowRescheduleModal(false);
            setRescheduleAppt(null);
            setRescheduleDate('');
            setRescheduleSlot('');
            fetchMyAppointments();
        } catch (err) {
            toast.error(`❌ ${err.response?.data?.error || 'Failed to reschedule'}`);
        }
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
                            width: '56px',
                            height: '56px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Triangles */}
                                <polygon points="50,5 50,52 24,52" fill="#4b5563" />
                                <polygon points="50,5 76,52 50,52" fill="#f59e0b" />
                                <polygon points="5,82 43,82 24,50" fill="#f59e0b" />
                                <polygon points="95,82 57,82 76,50" fill="#4b5563" />
                                
                                {/* Center Circle & Caduceus */}
                                <circle cx="50" cy="58" r="20" fill="white" />
                                <line x1="50" y1="36" x2="50" y2="78" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
                                <path d="M 50 42 Q 32 30 18 45 Q 32 50 48 42" fill="#4b5563" />
                                <path d="M 50 42 Q 68 30 82 45 Q 68 50 52 42" fill="#4b5563" />
                                <path d="M 43 50 Q 50 43 57 50 T 43 60 T 57 70" fill="none" stroke="#4b5563" strokeWidth="3" />
                                
                                {/* Tiny Symbols */}
                                <circle cx="40" cy="30" r="3" stroke="white" strokeWidth="1.5" />
                                <line x1="40" y1="33" x2="40" y2="39" stroke="white" strokeWidth="1.5" />
                                <line x1="37" y1="36" x2="43" y2="36" stroke="white" strokeWidth="1.5" />
                                
                                <path d="M 60 25 L 60 20 L 56 20 L 56 16 L 60 16 L 60 11 L 64 11 L 64 16 L 68 16 L 68 20 L 64 20 L 64 25 Z" fill="white" transform="scale(0.6) translate(40, 16)" />
                                
                                <circle cx="21" cy="68" r="4.5" stroke="white" strokeWidth="2.5" />
                                <path d="M 21 68 L 21 60 L 28 60" fill="none" stroke="white" strokeWidth="2.5" />
                                
                                <circle cx="72" cy="62" r="2.5" fill="white" />
                                <circle cx="80" cy="62" r="2.5" fill="white" />
                                <path d="M 69 66 L 75 66 L 75 75 L 69 75 Z" fill="white" stroke="#4b5563" strokeWidth="1" />
                                <path d="M 77 66 L 83 66 L 83 75 L 77 75 Z" fill="white" stroke="#4b5563" strokeWidth="1" />
                            </svg>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0, display: 'flex', gap: '8px', letterSpacing: '0.5px' }}>
                                <span style={{ color: '#f59e0b' }}>ABHI</span> 
                                <span style={{ color: '#4b5563' }}>SK HOSPITAL</span>
                            </h1>
                            <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '-2px 0 0 0', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>promising care at best</p>
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
                                                {/* Show actual profile image if available */}
                                                <div style={{
                                                    width: '70px', height: '70px',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: `0 10px 30px ${doctor.color}40`,
                                                    flexShrink: 0,
                                                }}>
                                                    {doctor.profileImage ? (
                                                        <img src={doctor.profileImage} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{
                                                            width: '100%', height: '100%',
                                                            background: `linear-gradient(135deg, ${doctor.color}, ${doctor.color}dd)`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'white', fontSize: '1.5rem', fontWeight: '800'
                                                        }}>{doctor.avatar}</div>
                                                    )}
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
                                                        ₹{doctor.fee?.toLocaleString('en-IN')}
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

                        {activeStep === 2 && selectedDoctor && (() => {
                            // Local form state managed via refs to avoid re-render storms
                            return (
                                <GreenBookingForm
                                    selectedDoctor={selectedDoctor}
                                    doctors={doctors}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    selectedSlot={selectedSlot}
                                    setSelectedSlot={setSelectedSlot}
                                    loading={loading}
                                    handleBooking={handleBooking}
                                    onBack={() => setActiveStep(1)}
                                />
                            );
                        })()}
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

                {/* History Tab — shows ALL appointments */}
                {activeTab === 'history' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
                    }}>
                        {/* Header row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                                    📋 Appointment History
                                </h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                                    All your appointments — {myAppointments.length} total
                                </p>
                            </div>
                            <button
                                onClick={fetchMyAppointments}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    background: 'linear-gradient(135deg,#16a34a,#15803d)',
                                    color: 'white', border: 'none', borderRadius: '10px',
                                    fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
                                }}
                            >
                                🔄 Refresh
                            </button>
                        </div>

                        {/* Status legend */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            {[
                                { label: 'Pending', bg: '#fef3c7', color: '#92400e' },
                                { label: 'Confirmed', bg: '#dbeafe', color: '#1e40af' },
                                { label: 'Completed', bg: '#d1fae5', color: '#065f46' },
                                { label: 'Cancelled', bg: '#fee2e2', color: '#991b1b' },
                            ].map(s => (
                                <span key={s.label} style={{
                                    padding: '4px 12px', borderRadius: '20px',
                                    background: s.bg, color: s.color,
                                    fontSize: '0.78rem', fontWeight: '700',
                                }}>{s.label}</span>
                            ))}
                        </div>

                        {myAppointments.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[...myAppointments]
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map(appt => {
                                        const statusColors = {
                                            Pending: { bg: '#fef3c7', color: '#92400e' },
                                            Confirmed: { bg: '#dbeafe', color: '#1e40af' },
                                            Completed: { bg: '#d1fae5', color: '#065f46' },
                                            Cancelled: { bg: '#fee2e2', color: '#991b1b' },
                                        };
                                        const sc = statusColors[appt.status] || { bg: '#f1f5f9', color: '#475569' };
                                        const isActive = appt.status !== 'Completed' && appt.status !== 'Cancelled';

                                        return (
                                            <div key={appt._id} style={{
                                                background: isActive
                                                    ? 'linear-gradient(135deg,#f8fafc,#f0fdf4)'
                                                    : 'linear-gradient(135deg,#f8fafc,#f1f5f9)',
                                                borderRadius: '16px',
                                                padding: '1.5rem 2rem',
                                                border: `2px solid ${isActive ? '#bbf7d0' : '#e2e8f0'}`,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                flexWrap: 'wrap',
                                            }}>
                                                {/* Left — doctor info */}
                                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1, minWidth: '220px' }}>
                                                    <div style={{
                                                        width: '56px', height: '56px',
                                                        background: isActive
                                                            ? 'linear-gradient(135deg,#16a34a,#15803d)'
                                                            : 'linear-gradient(135deg,#94a3b8,#64748b)',
                                                        borderRadius: '14px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '1.4rem', flexShrink: 0,
                                                    }}>
                                                        👨‍⚕️
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: '800', fontSize: '1.05rem', color: '#1e293b', marginBottom: '3px' }}>
                                                            {appt.doctorId?.userId?.name || 'Doctor'}
                                                        </p>
                                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginBottom: '3px' }}>
                                                            {appt.doctorId?.specialization || 'Specialist'}
                                                        </p>
                                                        <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                                                            📅 {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            {appt.timeSlot && <> &bull; 🕐 {appt.timeSlot}</>}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right — status + view */}
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <span style={{
                                                        padding: '6px 14px',
                                                        background: sc.bg, color: sc.color,
                                                        borderRadius: '8px', fontWeight: '800', fontSize: '0.875rem',
                                                    }}>
                                                        {appt.status}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAppointmentDetails(appt);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        style={{
                                                            padding: '8px 16px',
                                                            background: 'linear-gradient(135deg,#667eea,#764ba2)',
                                                            color: 'white', border: 'none', borderRadius: '10px',
                                                            fontWeight: '700', fontSize: '0.875rem',
                                                            cursor: 'pointer', whiteSpace: 'nowrap',
                                                            boxShadow: '0 4px 14px rgba(102,126,234,0.3)',
                                                            transition: 'transform 0.2s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                                    >
                                                        👁️ View Details
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No appointments yet</p>
                                <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>Book your first appointment to see it here</p>
                                <button onClick={() => setActiveTab('book')} style={{
                                    padding: '0.875rem 2rem',
                                    background: 'linear-gradient(135deg,#16a34a,#15803d)',
                                    color: 'white', border: 'none', borderRadius: '12px',
                                    fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                                }}>
                                    📅 Book Appointment
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* ── Reschedule Modal ── */}
            {showRescheduleModal && rescheduleAppt && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9998,
                }}>
                    <div style={{
                        background: 'white', borderRadius: '24px',
                        padding: '2.5rem', width: '90%', maxWidth: '480px',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>📅 Reschedule Appointment</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>
                                    {rescheduleAppt.doctorId?.userId?.name || 'Doctor'} &bull; {rescheduleAppt.doctorId?.specialization || 'Specialist'}
                                </p>
                            </div>
                            <button onClick={() => setShowRescheduleModal(false)}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', width: '36px', height: '36px', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>
                                ✕
                            </button>
                        </div>

                        {/* Current appointment info */}
                        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', marginBottom: '1.5rem', border: '1.5px solid #e2e8f0' }}>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Current Schedule</p>
                            <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
                                {new Date(rescheduleAppt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &bull; {rescheduleAppt.timeSlot}
                            </p>
                        </div>

                        {/* New Date */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontWeight: '700', color: '#374151', fontSize: '0.875rem', marginBottom: '8px' }}>New Date</label>
                            <input
                                type="date"
                                value={rescheduleDate}
                                onChange={e => setRescheduleDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                style={{
                                    width: '100%', padding: '12px 14px',
                                    border: '2px solid #e2e8f0', borderRadius: '12px',
                                    fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                                    fontFamily: 'inherit', fontWeight: '600',
                                }}
                            />
                        </div>

                        {/* Time Slot */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{ display: 'block', fontWeight: '700', color: '#374151', fontSize: '0.875rem', marginBottom: '8px' }}>New Time Slot</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {timeSlots.map(slot => (
                                    <button
                                        key={slot.time}
                                        disabled={!slot.available}
                                        onClick={() => setRescheduleSlot(slot.time)}
                                        style={{
                                            padding: '10px 6px',
                                            background: rescheduleSlot === slot.time ? '#16a34a' : slot.available ? 'white' : '#f8fafc',
                                            color: rescheduleSlot === slot.time ? 'white' : slot.available ? '#374151' : '#cbd5e1',
                                            border: `2px solid ${rescheduleSlot === slot.time ? '#16a34a' : '#e2e8f0'}`,
                                            borderRadius: '10px', fontWeight: '700', fontSize: '0.8rem',
                                            cursor: slot.available ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowRescheduleModal(false)}
                                style={{
                                    flex: 1, padding: '13px', background: '#f1f5f9',
                                    color: '#475569', border: 'none', borderRadius: '12px',
                                    fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                                }}
                            >Cancel</button>
                            <button
                                onClick={handleReschedule}
                                disabled={!rescheduleDate || !rescheduleSlot}
                                style={{
                                    flex: 2, padding: '13px',
                                    background: rescheduleDate && rescheduleSlot ? 'linear-gradient(135deg,#16a34a,#15803d)' : '#e2e8f0',
                                    color: rescheduleDate && rescheduleSlot ? 'white' : '#94a3b8',
                                    border: 'none', borderRadius: '12px',
                                    fontWeight: '800', fontSize: '1rem',
                                    cursor: rescheduleDate && rescheduleSlot ? 'pointer' : 'not-allowed',
                                    transition: 'background 0.2s',
                                }}
                            >📅 Confirm Reschedule</button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Appointment Details Modal */}
            {showDetailsModal && selectedAppointmentDetails && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9998,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                        animation: 'slideUp 0.4s ease-out'
                    }}>
                        {/* Close Button */}
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: '#f1f5f9',
                                border: 'none',
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#e2e8f0';
                                e.target.style.transform = 'rotate(90deg)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#f1f5f9';
                                e.target.style.transform = 'rotate(0deg)';
                            }}
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: '#1e293b',
                            marginBottom: '2rem',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            📋 Appointment Details
                        </h2>

                        {/* Doctor Card */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                            borderRadius: '16px',
                            border: '2px solid #bae6fd',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '2rem'
                                }}>
                                    👨‍⚕️
                                </div>
                                <div>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0369a1', marginBottom: '0.5rem' }}>
                                        {selectedAppointmentDetails.doctorId?.userId?.name || 'Doctor'}
                                    </p>
                                    <p style={{ color: '#0284c7', fontSize: '1rem', fontWeight: '600' }}>
                                        {selectedAppointmentDetails.doctorId?.specialization || 'Specialist'}
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                paddingTop: '1.5rem',
                                borderTop: '2px solid #bae6fd'
                            }}>
                                <div>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        📅 Date
                                    </p>
                                    <p style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '800' }}>
                                        {new Date(selectedAppointmentDetails.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        🕐 Time
                                    </p>
                                    <p style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '800' }}>
                                        {selectedAppointmentDetails.timeSlot}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                                📊 Status
                            </p>
                            <span style={{
                                display: 'inline-block',
                                padding: '0.75rem 1.5rem',
                                background: '#d1fae5',
                                color: '#065f46',
                                borderRadius: '12px',
                                fontWeight: '800',
                                fontSize: '1rem'
                            }}>
                                ✓ {selectedAppointmentDetails.status}
                            </span>
                        </div>

                        {/* Doctor's Diagnosis */}
                        {selectedAppointmentDetails.diagnosis && (
                            <div style={{
                                padding: '1.5rem',
                                background: '#fef3c7',
                                borderRadius: '16px',
                                border: '2px solid #fcd34d',
                                marginBottom: '1.5rem'
                            }}>
                                <p style={{ color: '#b45309', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    🔍 Diagnosis
                                </p>
                                <p style={{
                                    color: '#78350f',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    fontWeight: '500'
                                }}>
                                    {selectedAppointmentDetails.diagnosis}
                                </p>
                            </div>
                        )}

                        {/* Doctor's Prescription */}
                        {selectedAppointmentDetails.prescription && (
                            <div style={{
                                padding: '1.5rem',
                                background: '#dbeafe',
                                borderRadius: '16px',
                                border: '2px solid #93c5fd',
                                marginBottom: '1.5rem'
                            }}>
                                <p style={{ color: '#1e40af', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    💊 Prescription
                                </p>
                                <div style={{
                                    color: '#1e3a8a',
                                    fontSize: '1rem',
                                    lineHeight: '1.8',
                                    fontWeight: '500',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {selectedAppointmentDetails.prescription}
                                </div>
                            </div>
                        )}

                        {/* Doctor's Notes/Suggestions */}
                        {selectedAppointmentDetails.notes && (
                            <div style={{
                                padding: '1.5rem',
                                background: '#f3e8ff',
                                borderRadius: '16px',
                                border: '2px solid #d8b4fe',
                                marginBottom: '1.5rem'
                            }}>
                                <p style={{ color: '#6b21a8', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    💡 Doctor's Suggestions
                                </p>
                                <div style={{
                                    color: '#4c1d95',
                                    fontSize: '1rem',
                                    lineHeight: '1.8',
                                    fontWeight: '500',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {selectedAppointmentDetails.notes}
                                </div>
                            </div>
                        )}

                        {/* No Details Available */}
                        {!selectedAppointmentDetails.diagnosis && !selectedAppointmentDetails.prescription && !selectedAppointmentDetails.notes && (
                            <div style={{
                                padding: '2rem',
                                textAlign: 'center',
                                background: '#f1f5f9',
                                borderRadius: '16px',
                                marginBottom: '1.5rem'
                            }}>
                                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</p>
                                <p style={{ color: '#64748b', fontWeight: '600', fontSize: '1rem' }}>
                                    No detailed notes available for this appointment yet.
                                </p>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '14px',
                                fontWeight: '800',
                                fontSize: '1.0625rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
