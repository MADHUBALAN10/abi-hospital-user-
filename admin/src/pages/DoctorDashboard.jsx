import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaSignOutAlt, FaHeartbeat, FaCheckCircle, FaTimesCircle, FaPlus, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState('appointments');
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctorData();
    }, []);

    const fetchDoctorData = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            // Fetch doctor's appointments
            const apptRes = await axios.get(`${API_URL}/appointments?role=doctor&userId=${user._id}`);
            setAppointments(apptRes.data);

            // Fetch doctor info
            const docRes = await axios.get(`${API_URL}/doctors`);
            const doctor = docRes.data.find(d => d.userId._id === user._id);
            setDoctorInfo(doctor || {
                userId: { name: 'Dr. John Smith', email: 'doctor@hospital.com' },
                specialization: 'Cardiologist',
                experience: 10,
                feesPerConsultation: 50,
                availableSlots: []
            });
            if (doctor && doctor.availableSlots) {
                setAvailableTimes(doctor.availableSlots.map(s => s.startTime));
            } else {
                setAvailableTimes(['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM']);
            }


        } catch (error) {
            console.error('Error fetching doctor data:', error);
            toast.error('Failed to load data. Using demo mode.');

            // Fallback to demo data
            setAppointments([
                {
                    _id: '1',
                    patientId: { _id: '1', name: 'Patricia Kenodi' },
                    date: new Date().toISOString(),
                    timeSlot: '09:00 AM',
                    type: 'Consultation',
                    status: 'pending'
                },
                {
                    _id: '2',
                    patientId: { _id: '2', name: 'Michael Chen' },
                    date: new Date().toISOString(),
                    timeSlot: '10:30 AM',
                    type: 'Follow-up',
                    status: 'confirmed'
                },
                {
                    _id: '3',
                    patientId: { _id: '3', name: 'Sarah Johnson' },
                    date: new Date().toISOString(),
                    timeSlot: '02:00 PM',
                    type: 'Check-up',
                    status: 'pending'
                }
            ]);

            setDoctorInfo({
                userId: { name: 'Dr. John Smith', email: 'doctor@hospital.com' },
                specialization: 'Cardiologist',
                experience: 10,
                feesPerConsultation: 50,
                rating: 4.9,
                reviews: 120
            });
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${API_URL}/appointments/${id}`, { status });
            setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
            toast.success(`Appointment ${status}!`, {
                icon: status === 'confirmed' ? '✅' : '❌',
                style: {
                    background: status === 'confirmed' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '16px 24px',
                    borderRadius: '12px'
                }
            });
        } catch (error) {
            toast.error('Failed to update appointment');
        }
    };

    const handleToggleTime = async (time) => {
        const newTimes = availableTimes.includes(time) 
            ? availableTimes.filter(t => t !== time)
            : [...availableTimes, time].sort();
            
        setAvailableTimes(newTimes);
        
        if (doctorInfo && doctorInfo._id) {
            try {
                const slotsData = newTimes.map(t => ({ day: 'All', startTime: t, endTime: '' }));
                await axios.put(`${API_URL}/doctors/${doctorInfo._id}`, { availableSlots: slotsData });
                toast.success('Schedule updated!');
            } catch (err) {
                console.error(err);
                toast.error('Failed to save schedule');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const stats = {
        total: appointments.length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        pending: appointments.filter(a => a.status === 'pending').length
    };

    const avatarColors = ['#0891b2', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '300px',
                background: 'white',
                borderRight: '1px solid rgba(226, 232, 240, 0.8)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0, 0, 0, 0.04)'
            }}>
                {/* Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '2rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '2px solid #f1f5f9'
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.25rem'
                    }}>
                        <FaHeartbeat />
                    </div>
                    <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', display: 'block', lineHeight: 1 }}>
                            Doctor<span style={{ color: '#0891b2' }}>Portal</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>MediCare+</span>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="glass-card" style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #dbeafe, #e0f2fe)',
                    border: '2px solid rgba(14, 165, 178, 0.1)'
                }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        marginBottom: '1.25rem',
                        boxShadow: '0 8px 24px rgba(8, 145, 178, 0.3)'
                    }}>
                        {doctorInfo?.userId?.name?.[0] || 'D'}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.375rem' }}>
                        {doctorInfo?.userId?.name || 'Doctor'}
                    </h3>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b', marginBottom: '1rem' }}>
                        {doctorInfo?.specialization || 'Specialist'}
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontSize: '0.9375rem',
                        marginBottom: '0.75rem'
                    }}>
                        <span style={{ color: '#f59e0b', fontSize: '1.125rem' }}>★</span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{doctorInfo?.rating || 4.9}</span>
                        <span style={{ color: '#94a3b8' }}>({doctorInfo?.reviews || 120} reviews)</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(8, 145, 178, 0.2)'
                    }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{doctorInfo?.experience || 10}</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Years Exp.</p>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(8, 145, 178, 0.2)' }}></div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0891b2', lineHeight: 1 }}>₹{doctorInfo?.feesPerConsultation || 50}</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Per Visit</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavButton
                        icon={<FaCalendarAlt />}
                        label="Appointments"
                        count={stats.pending}
                        active={activeTab === 'appointments'}
                        onClick={() => setActiveTab('appointments')}
                    />
                    <NavButton
                        icon={<FaClock />}
                        label="My Schedule"
                        active={activeTab === 'schedule'}
                        onClick={() => setActiveTab('schedule')}
                    />
                    <NavButton
                        icon={<FaUsers />}
                        label="Patient Records"
                        active={activeTab === 'patients'}
                        onClick={() => setActiveTab('patients')}
                    />
                </nav>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="card-hover"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: '#fef2f2',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#dc2626',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginTop: '1rem'
                    }}
                >
                    <FaSignOutAlt /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {/* Header */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2.5rem'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2.25rem',
                            fontWeight: '800',
                            color: '#0f172a',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em'
                        }}>
                            {activeTab === 'appointments' && "Today's Appointments"}
                            {activeTab === 'schedule' && 'Manage Schedule'}
                            {activeTab === 'patients' && 'Patient Records'}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {activeTab === 'schedule' && (
                        <button className="btn btn-primary">
                            <FaPlus /> Add Time Slot
                        </button>
                    )}
                </header>

                {/* Content */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid #e5e7eb',
                            borderTopColor: '#0891b2',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem'
                        }}></div>
                        Loading...
                    </div>
                ) : (
                    <>
                        {activeTab === 'appointments' && (
                            <div>
                                {/* Quick Stats */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                    gap: '1.5rem',
                                    marginBottom: '2rem'
                                }}>
                                    <StatCard
                                        label="Total Today"
                                        value={stats.total}
                                        icon={<FaCalendarAlt />}
                                        gradient="linear-gradient(135deg, #0891b2, #06b6d4)"
                                    />
                                    <StatCard
                                        label="Confirmed"
                                        value={stats.confirmed}
                                        icon={<FaCheckCircle />}
                                        gradient="linear-gradient(135deg, #10b981, #34d399)"
                                    />
                                    <StatCard
                                        label="Pending"
                                        value={stats.pending}
                                        icon={<FaClock />}
                                        gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
                                    />
                                </div>

                                {/* Appointments Queue */}
                                <div className="glass-card">
                                    <h3 style={{ fontSize: '1.375rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.75rem' }}>
                                        Appointment Queue
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {appointments.map((appt, index) => (
                                            <div key={appt._id} className="card" style={{
                                                padding: '1.5rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: '1.5rem',
                                                transition: 'all 0.2s'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                                                    <div style={{
                                                        width: '64px',
                                                        height: '64px',
                                                        background: `linear-gradient(135deg, ${avatarColors[index % avatarColors.length]}, ${avatarColors[index % avatarColors.length]}dd)`,
                                                        borderRadius: '16px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: '800',
                                                        fontSize: '1.25rem',
                                                        boxShadow: `0 4px 14px ${avatarColors[index % avatarColors.length]}40`,
                                                        flexShrink: 0
                                                    }}>
                                                        {appt.patientId?.name?.[0] || 'P'}
                                                    </div>

                                                    <div style={{ flex: 1 }}>
                                                        <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.375rem' }}>
                                                            {appt.patientId?.name || 'Patient Name'}
                                                        </h4>
                                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9375rem', color: '#64748b', flexWrap: 'wrap' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <FaClock style={{ color: '#0891b2' }} /> {appt.timeSlot}
                                                            </span>
                                                            <span>{appt.type || 'Consultation'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.875rem', flexShrink: 0 }}>
                                                    {appt.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                                                                style={{
                                                                    padding: '0.75rem 1.5rem',
                                                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '12px',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.9375rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.5rem',
                                                                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                                            >
                                                                <FaCheckCircle /> Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                                                                style={{
                                                                    padding: '0.75rem 1.5rem',
                                                                    background: 'white',
                                                                    color: '#ef4444',
                                                                    border: '2px solid #ef4444',
                                                                    borderRadius: '12px',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.9375rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.5rem',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = '#ef4444';
                                                                    e.target.style.color = 'white';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = 'white';
                                                                    e.target.style.color = '#ef4444';
                                                                }}
                                                            >
                                                                <FaTimesCircle /> Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="badge" style={{
                                                            background: appt.status === 'confirmed' ? '#d1fae5' : '#fef2f2',
                                                            color: appt.status === 'confirmed' ? '#065f46' : '#991b1b',
                                                            border: `1px solid ${appt.status === 'confirmed' ? '#a7f3d0' : '#fecaca'}`,
                                                            padding: '0.625rem 1.25rem',
                                                            fontWeight: '600',
                                                            textTransform: 'capitalize',
                                                            fontSize: '0.9375rem'
                                                        }}>
                                                            {appt.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'schedule' && (
                            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
                                <div style={{
                                    width: '96px',
                                    height: '96px',
                                    background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '3rem',
                                    margin: '0 auto 2rem',
                                    boxShadow: '0 8px 24px rgba(8, 145, 178, 0.3)'
                                }}>
                                    <FaClock />
                                </div>
                                <h3 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                                    Manage Your Schedule
                                </h3>
                                <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1.0625rem' }}>
                                    Click on a time slot to toggle your availability. These slots will be available to patients booking appointments with you.
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                    {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'].map((time, i) => {
                                        const isAvailable = availableTimes.includes(time);
                                        return (
                                            <div key={i} onClick={() => handleToggleTime(time)} className="card card-hover" style={{
                                                padding: '1.25rem',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                background: isAvailable ? 'linear-gradient(135deg, #0891b2, #06b6d4)' : 'white',
                                                color: isAvailable ? 'white' : '#0f172a',
                                                cursor: 'pointer',
                                                border: isAvailable ? 'none' : '2px solid #e2e8f0',
                                                borderRadius: '12px',
                                                fontWeight: '600',
                                                transition: 'all 0.2s',
                                                boxShadow: isAvailable ? '0 4px 14px rgba(8, 145, 178, 0.3)' : 'none'
                                            }}>
                                                <span style={{ fontSize: '1.0625rem' }}>{time}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'patients' && (
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #e0f2fe, #dbeafe)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#0891b2',
                                        fontSize: '1.5rem',
                                    }}>
                                        <FaUsers />
                                    </div>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>
                                        Patient Records
                                    </h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {Array.from(new Set(appointments.map(a => a.patientId?._id))).map((patientId) => {
                                        const patientAppts = appointments.filter(a => a.patientId?._id === patientId);
                                        const patientInfo = patientAppts[0]?.patientId || { name: 'Unknown' };
                                        if (!patientId) return null;
                                        return (
                                            <div key={patientId} className="card card-hover" style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: '700',
                                                        fontSize: '1.25rem'
                                                    }}>
                                                        {patientInfo.name?.[0] || 'P'}
                                                    </div>
                                                    <div>
                                                        <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a' }}>{patientInfo.name}</h4>
                                                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{patientAppts.length} previous visits</p>
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: '0.9375rem', color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span>Last Visit:</span>
                                                    <span style={{ fontWeight: '600' }}>
                                                        {new Date(patientAppts[patientAppts.length - 1]?.date).toLocaleDateString()}
                                                    </span>
                                                </p>
                                                <button style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    background: '#f1f5f9',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#0891b2',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    marginTop: '1rem'
                                                }}>
                                                    View Full Record
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {appointments.length === 0 && (
                                        <p style={{ color: '#64748b', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>No patient records available yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

// Nav Button Component
const NavButton = ({ icon, label, active, onClick, count }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            padding: '1rem 1.125rem',
            background: active ? 'linear-gradient(135deg, #0891b2, #06b6d4)' : 'transparent',
            color: active ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '14px',
            fontWeight: active ? '600' : '500',
            fontSize: '0.9375rem',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            textAlign: 'left',
            boxShadow: active ? '0 4px 14px rgba(8, 145, 178, 0.35)' : 'none',
            position: 'relative'
        }}
        onMouseEnter={(e) => !active && (e.target.style.background = '#f8fafc')}
        onMouseLeave={(e) => !active && (e.target.style.background = 'transparent')}
    >
        <span style={{ fontSize: '1.25rem' }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {count > 0 && (
            <span style={{
                background: active ? 'rgba(255,255,255,0.25)' : '#fef2f2',
                color: active ? 'white' : '#dc2626',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700'
            }}>
                {count}
            </span>
        )}
    </button>
);

// Stat Card Component
const StatCard = ({ label, value, icon, gradient }) => (
    <div className="glass-card card-hover" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            background: gradient,
            borderRadius: '50%',
            opacity: 0.1,
            filter: 'blur(30px)'
        }}></div>

        <div style={{ position: 'relative' }}>
            <div style={{
                width: '56px',
                height: '56px',
                background: gradient,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.375rem' }}>
                {value}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#64748b', fontWeight: '500' }}>
                {label}
            </p>
        </div>
    </div>
);

export default DoctorDashboard;
