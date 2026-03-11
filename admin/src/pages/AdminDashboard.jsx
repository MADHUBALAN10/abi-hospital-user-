import React, { useState, useEffect } from 'react';
import { FaUserMd, FaPills, FaMoneyBillWave, FaWhatsapp, FaChartPie, FaSignOutAlt, FaBell, FaUsers, FaCalendarAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'https://abi-hospital-backend.onrender.com/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        revenue: 0
    });
    const [appointments, setAppointments] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch appointments for overview
            const apptRes = await axios.get(`${API_URL}/appointments`);
            setAppointments(apptRes.data);

            // Fetch doctors
            const docRes = await axios.get(`${API_URL}/doctors`);
            setDoctors(docRes.data);

            // Fetch inventory if on stock tab
            if (activeTab === 'stock') {
                const invRes = await axios.get(`${API_URL}/inventory`);
                setInventory(invRes.data);
            }

            // Calculate stats
            setStats({
                doctors: docRes.data.length,
                patients: new Set(apptRes.data.map(a => a.patientId?._id)).size,
                appointments: apptRes.data.filter(a => a.status === 'pending').length,
                revenue: apptRes.data.filter(a => a.paymentStatus === 'completed').reduce((sum, a) => sum + (a.paymentAmount || 0), 0)
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Using demo mode.');

            // Fallback to demo data
            setAppointments([
                {
                    _id: '1',
                    patientId: { _id: '1', name: 'Patricia Kenodi' },
                    doctorId: { userId: { name: 'Dr. Sarah Johnson' } },
                    date: new Date().toISOString(),
                    timeSlot: '10:00 AM',
                    status: 'confirmed'
                }
            ]);
            setDoctors([
                { _id: '1', userId: { name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com' }, specialization: 'Cardiologist', experience: 10 }
            ]);
            setInventory([
                { _id: '1', itemName: 'Paracetamol 500mg', category: 'Medicine', stockQuantity: 120, unitPrice: 5 }
            ]);
            setStats({ doctors: 12, patients: 845, appointments: 4, revenue: 12400 });
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const handleAddInventory = async () => {
        const newItem = {
            itemName: 'New Medicine',
            category: 'Medicine',
            stockQuantity: 100,
            unitPrice: 10
        };

        try {
            const res = await axios.post(`${API_URL}/inventory`, newItem);
            setInventory([...inventory, res.data]);
            toast.success('Item added successfully');
        } catch (error) {
            toast.error('Failed to add item');
        }
    };

    const handleDeleteInventory = async (id) => {
        try {
            await axios.delete(`${API_URL}/inventory/${id}`);
            setInventory(inventory.filter(item => item._id !== id));
            toast.success('Item deleted');
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
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
                    marginBottom: '3rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '2px solid #f1f5f9'
                }}>
                    <div style={{
                        width: '46px',
                        height: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="46" height="46" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="50,5 50,52 24,52" fill="#4b5563" />
                            <polygon points="50,5 76,52 50,52" fill="#f59e0b" />
                            <polygon points="5,82 43,82 24,50" fill="#f59e0b" />
                            <polygon points="95,82 57,82 76,50" fill="#4b5563" />
                            <circle cx="50" cy="58" r="20" fill="white" />
                            <line x1="50" y1="36" x2="50" y2="78" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
                            <path d="M 50 42 Q 32 30 18 45 Q 32 50 48 42" fill="#4b5563" />
                            <path d="M 50 42 Q 68 30 82 45 Q 68 50 52 42" fill="#4b5563" />
                            <path d="M 43 50 Q 50 43 57 50 T 43 60 T 57 70" fill="none" stroke="#4b5563" strokeWidth="3" />
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
                        <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', display: 'flex', gap: '3px', lineHeight: 1 }}>
                            <span style={{ color: '#f59e0b' }}>ABHI</span> 
                            <span style={{ color: '#4b5563' }}>SK HOSPITAL</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500', display: 'block', marginTop: '3px' }}>Admin Panel</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavItem
                        icon={<FaChartPie />}
                        label="Dashboard"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                        badge={stats.appointments > 0 ? stats.appointments : null}
                    />
                    <NavItem
                        icon={<FaUserMd />}
                        label="Doctors"
                        active={activeTab === 'doctors'}
                        onClick={() => { setActiveTab('doctors'); setSelectedDoctor(null); }}
                        count={stats.doctors}
                    />
                    <NavItem
                        icon={<FaPills />}
                        label="Inventory"
                        active={activeTab === 'stock'}
                        onClick={() => setActiveTab('stock')}
                    />
                    <NavItem
                        icon={<FaMoneyBillWave />}
                        label="Payments"
                        active={activeTab === 'payments'}
                        onClick={() => setActiveTab('payments')}
                    />

                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginTop: '2rem',
                        marginBottom: '0.5rem',
                        paddingLeft: '1rem'
                    }}>
                        Integration
                    </div>

                    <NavItem
                        icon={<FaWhatsapp />}
                        label="WhatsApp Bot"
                        active={activeTab === 'whatsapp'}
                        onClick={() => setActiveTab('whatsapp')}
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
                            textTransform: 'capitalize',
                            letterSpacing: '-0.02em'
                        }}>
                            {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="glass" style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748b',
                            cursor: 'pointer',
                            position: 'relative',
                            fontSize: '1.125rem'
                        }}>
                            <FaBell />
                            {stats.appointments > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    width: '10px',
                                    height: '10px',
                                    background: '#ef4444',
                                    borderRadius: '50%',
                                    border: '2px solid white'
                                }}></span>
                            )}
                        </button>

                        <div className="glass" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.875rem',
                            padding: '0.5rem 1.25rem 0.5rem 0.5rem',
                            borderRadius: '14px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '0.9375rem'
                            }}>
                                A
                            </div>
                            <div>
                                <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#0f172a', lineHeight: 1, marginBottom: '0.25rem' }}>
                                    Admin User
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    Super Admin
                                </p>
                            </div>
                        </div>
                    </div>
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
                        {activeTab === 'overview' && <Overview stats={stats} appointments={appointments} />}
                        {activeTab === 'stock' && <MedicalStock inventory={inventory} onAdd={handleAddInventory} onDelete={handleDeleteInventory} />}
                        {activeTab === 'payments' && <Payments appointments={appointments} stats={stats} />}
                        {activeTab === 'doctors' && (
                            selectedDoctor ? (
                                <DoctorProfileView 
                                    doctor={selectedDoctor} 
                                    onBack={() => setSelectedDoctor(null)} 
                                    onRefresh={() => { fetchData(); setSelectedDoctor(null); }} 
                                />
                            ) : (
                                <DoctorsTeam doctors={doctors} onRefresh={fetchData} onViewProfile={setSelectedDoctor} />
                            )
                        )}
                        {activeTab === 'whatsapp' && <WhatsAppConfig />}
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

// Navigation Item Component
const NavItem = ({ icon, label, active, onClick, badge, count }) => (
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
        {badge && (
            <span style={{
                background: active ? 'rgba(255,255,255,0.25)' : '#fef2f2',
                color: active ? 'white' : '#dc2626',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700'
            }}>
                {badge}
            </span>
        )}
        {count !== undefined && !badge && (
            <span style={{
                color: active ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: '600'
            }}>
                {count}
            </span>
        )}
    </button>
);

// Overview Section
const Overview = ({ stats, appointments }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Stats Grid */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
        }}>
            <StatCard
                title="Total Doctors"
                value={stats.doctors}
                change="+2.5%"
                icon={<FaUserMd />}
                gradient="linear-gradient(135deg, #0891b2, #06b6d4)"
            />
            <StatCard
                title="Total Patients"
                value={stats.patients}
                change="+12%"
                icon={<FaUsers />}
                gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
            />
            <StatCard
                title="Revenue"
                value={`₹${(stats.revenue / 1000).toFixed(1)}k`}
                change="+8.2%"
                icon={<FaMoneyBillWave />}
                gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
            />
            <StatCard
                title="Active Appointments"
                value={stats.appointments || '0'}
                change="Today"
                icon={<FaCalendarAlt />}
                gradient="linear-gradient(135deg, #10b981, #34d399)"
            />
        </div>

        {/* Recent Appointments */}
        <div className="glass-card">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.75rem'
            }}>
                <h3 style={{ fontSize: '1.375rem', fontWeight: '700', color: '#0f172a' }}>
                    Recent Appointments
                </h3>
                <button className="btn-ghost" style={{
                    color: '#0891b2',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                }}>
                    View All →
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {appointments.slice(0, 5).map((appt, i) => (
                    <div key={appt._id || i} className="card" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.25rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                            <div style={{
                                width: '52px',
                                height: '52px',
                                background: ['linear-gradient(135deg, #0891b2, #06b6d4)', 'linear-gradient(135deg, #3b82f6, #60a5fa)', 'linear-gradient(135deg, #8b5cf6, #a78bfa)', 'linear-gradient(135deg, #10b981, #34d399)'][i % 4],
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '1.125rem',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                            }}>
                                {(appt.patientId?.name || 'Patient')[0]}
                            </div>
                            <div>
                                <p style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem', fontSize: '1rem' }}>
                                    {appt.patientId?.name || 'Patient Name'}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                    {appt.doctorId?.userId?.name || 'Doctor'} • {appt.timeSlot}
                                </p>
                            </div>
                        </div>
                        <span className="badge" style={{
                            background: appt.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
                            color: appt.status === 'confirmed' ? '#065f46' : '#92400e',
                            border: `1px solid ${appt.status === 'confirmed' ? '#a7f3d0' : '#fde68a'}`,
                            fontWeight: '600',
                            textTransform: 'capitalize'
                        }}>
                            {appt.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Stat Card Component
const StatCard = ({ title, value, change, icon, gradient }) => (
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', position: 'relative' }}>
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
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
            }}>
                {icon}
            </div>
            <span style={{
                fontSize: '0.8125rem',
                fontWeight: '700',
                color: '#10b981',
                background: '#d1fae5',
                padding: '0.375rem 0.75rem',
                borderRadius: '8px'
            }}>
                {change}
            </span>
        </div>
        <h3 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.375rem', position: 'relative' }}>
            {value}
        </h3>
        <p style={{ fontSize: '0.9375rem', color: '#64748b', fontWeight: '500' }}>
            {title}
        </p>
    </div>
);

// Medical Stock Section
const MedicalStock = ({ inventory, onAdd, onDelete }) => (
    <div className="glass-card">
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
        }}>
            <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                    Inventory Management
                </h3>
                <p style={{ color: '#64748b' }}>Track and manage medical supplies</p>
            </div>
            <button className="btn btn-primary" onClick={onAdd}>
                <FaPlus /> Add Item
            </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Item Name
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Category
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Stock
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Price
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => {
                        const stockLevel = item.stockQuantity > 50 ? 'high' : item.stockQuantity > 20 ? 'medium' : 'low';
                        const colors = { high: '#10b981', medium: '#f59e0b', low: '#ef4444' };

                        return (
                            <tr key={item._id} className="card" style={{ background: 'white' }}>
                                <td style={{ padding: '1.25rem 1rem', fontWeight: '600', color: '#0f172a', borderRadius: '12px 0 0 12px' }}>
                                    {item.itemName}
                                </td>
                                <td style={{ padding: '1.25rem 1rem', color: '#64748b' }}>
                                    <span style={{
                                        padding: '0.375rem 0.75rem',
                                        background: '#f1f5f9',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}>
                                        {item.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontWeight: '600', color: '#0f172a', minWidth: '40px' }}>{item.stockQuantity}</span>
                                        <div style={{
                                            width: '100px',
                                            height: '8px',
                                            background: '#f1f5f9',
                                            borderRadius: '4px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${Math.min((item.stockQuantity / 100) * 100, 100)}%`,
                                                height: '100%',
                                                background: colors[stockLevel],
                                                borderRadius: '4px',
                                                transition: 'width 0.3s'
                                            }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1rem', fontFamily: 'monospace', fontWeight: '600', color: '#0f172a' }}>
                                    ₹{item.unitPrice}
                                </td>
                                <td style={{ padding: '1.25rem 1rem', textAlign: 'right', borderRadius: '0 12px 12px 0' }}>
                                    <button style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#0891b2',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        marginRight: '1rem'
                                    }}>
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(item._id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ef4444',
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

// Payments Section
const Payments = ({ appointments, stats }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div style={{ gridColumn: 'span 2' }} className="glass-card">
            <h3 style={{ fontSize: '1.375rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>
                Transaction History
            </h3>
            {appointments.filter(a => a.paymentStatus === 'completed').slice(0, 6).map((appt, i) => (
                <div key={appt._id || i} className="card" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem',
                    marginBottom: '0.875rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#dbeafe',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0891b2',
                            fontSize: '1.25rem'
                        }}>
                            <FaMoneyBillWave />
                        </div>
                        <div>
                            <p style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Consultation Fee</p>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                TRX-{889920 + i} • {appt.doctorId?.userId?.name || 'Doctor'}
                            </p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: '700', color: '#10b981', marginBottom: '0.375rem', fontSize: '1.125rem' }}>
                            +₹{appt.paymentAmount || 50}
                        </p>
                        <button style={{
                            background: 'none',
                            border: 'none',
                            color: '#0891b2',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}>
                            Download
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <div className="glass-card" style={{
            background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ opacity: 0.9, fontSize: '0.9375rem', marginBottom: '0.75rem', fontWeight: '500' }}>Total Balance</p>
                <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '2rem', letterSpacing: '-0.02em' }}>
                    ₹{(stats.revenue).toLocaleString()}
                </h2>
                <div style={{ display: 'flex', gap: '0.875rem' }}>
                    <button style={{
                        flex: 1,
                        padding: '0.875rem',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}>
                        Withdraw
                    </button>
                    <button style={{
                        flex: 1,
                        padding: '0.875rem',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}>
                        Reports
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Doctors Team Section
const DoctorsTeam = ({ doctors, onRefresh, onViewProfile }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        feesPerConsultation: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // First create the user
            const userRes = await axios.post(`${API_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: 'doctor123', // Default password
                phone: formData.phone,
                role: 'doctor'
            });

            // Then create the doctor profile
            await axios.post(`${API_URL}/doctors`, {
                userId: userRes.data._id,
                specialization: formData.specialization,
                experience: parseInt(formData.experience),
                feesPerConsultation: parseInt(formData.feesPerConsultation)
            });

            toast.success('Doctor added successfully!', {
                duration: 3000,
                icon: '🎉',
                style: {
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '16px 24px',
                    borderRadius: '12px'
                }
            });

            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', specialization: '', experience: '', feesPerConsultation: '' });
            onRefresh();

        } catch (error) {
            console.error('Error adding doctor:', error);
            toast.error(error.response?.data?.error || 'Failed to add doctor');
        }
        setSubmitting(false);
    };

    return (
        <>
            <div className="glass-card">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                            Medical Team
                        </h3>
                        <p style={{ color: '#64748b' }}>Manage doctor profiles and credentials</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <FaPlus /> Add Doctor
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {doctors.map((doctor, i) => (
                        <div key={doctor._id} className="card card-hover" style={{ padding: '1.5rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: ['linear-gradient(135deg, #0891b2, #06b6d4)', 'linear-gradient(135deg, #3b82f6, #60a5fa)', 'linear-gradient(135deg, #8b5cf6, #a78bfa)'][i % 3],
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                marginBottom: '1.25rem',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                            }}>
                                {doctor.userId?.name?.[0] || 'D'}
                            </div>
                            <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.375rem' }}>
                                {doctor.userId?.name || 'Doctor Name'}
                            </h4>
                            <p style={{ fontSize: '0.9375rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                {doctor.specialization}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                                {doctor.experience} years experience
                            </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '1rem',
                                borderTop: '1px solid #f1f5f9'
                            }}>
                                <span style={{ fontWeight: '700', color: '#0891b2', fontSize: '1.125rem' }}>
                                    ₹{doctor.feesPerConsultation || 50}
                                </span>
                                <button onClick={() => onViewProfile(doctor)} style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#0891b2',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer'
                                }}>
                                    View Profile →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Doctor Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease-out'
                }} onClick={() => setShowModal(false)}>
                    <div
                        className="glass-card"
                        style={{
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            padding: '2.5rem',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                                    Add New Doctor
                                </h3>
                                <p style={{ color: '#64748b' }}>Fill in the doctor's details below</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: '#fef2f2',
                                    border: 'none',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    color: '#dc2626',
                                    fontSize: '1.25rem',
                                    cursor: 'pointer',
                                    fontWeight: '700'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Dr. John Smith"
                                    required
                                    style={{ marginBottom: 0 }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="doctor@hospital.com"
                                        required
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="+1 234 567 8900"
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                                    Specialization *
                                </label>
                                <select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    style={{
                                        marginBottom: 0,
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2364748b\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 1rem center',
                                        paddingRight: '3rem'
                                    }}
                                >
                                    <option value="" disabled>Select a specialization</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Orthopedic">Orthopedic</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Ophthalmologist">Ophthalmologist</option>
                                    <option value="Psychiatrist">Psychiatrist</option>
                                    <option value="ENT Specialist">ENT Specialist</option>
                                    <option value="General Physician">General Physician</option>
                                    <option value="Dentist">Dentist</option>
                                    <option value="Surgeon">Surgeon</option>
                                    <option value="Radiologist">Radiologist</option>
                                    <option value="Anesthesiologist">Anesthesiologist</option>
                                    <option value="Pulmonologist">Pulmonologist</option>
                                    <option value="Gastroenterologist">Gastroenterologist</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                                        Experience (years) *
                                    </label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="10"
                                        min="0"
                                        required
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                                        Consultation Fee (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="feesPerConsultation"
                                        value={formData.feesPerConsultation}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="50"
                                        min="0"
                                        required
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: 'white',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        color: '#64748b',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-primary"
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        fontSize: '1rem',
                                        opacity: submitting ? 0.7 : 1
                                    }}
                                >
                                    {submitting ? 'Adding...' : 'Add Doctor'} {!submitting && <FaPlus />}
                                </button>
                            </div>
                        </form>
                    </div>

                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideUp {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};

// WhatsApp Config Section
const WhatsAppConfig = () => (
    <div className="glass-card" style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '3rem',
        textAlign: 'center'
    }}>
        <div style={{
            width: '96px',
            height: '96px',
            background: 'linear-gradient(135deg, #25d366, #128c7e)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            margin: '0 auto 2rem',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)'
        }}>
            <FaWhatsapp />
        </div>

        <h3 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            WhatsApp Reminder Bot
        </h3>
        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '2.5rem', maxWidth: '540px', margin: '0 auto 2.5rem', fontSize: '1.0625rem' }}>
            Automate appointment reminders via WhatsApp. Patients receive notifications 24 hours before their scheduled time.
        </p>

        <div className="card" style={{
            textAlign: 'left',
            marginBottom: '2rem',
            background: '#f0fdf4',
            border: '2px solid #bbf7d0',
            padding: '1.5rem'
        }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', marginBottom: '0.875rem', letterSpacing: '0.05em' }}>
                Message Preview
            </p>
            <p style={{ color: '#0f172a', lineHeight: '1.7', fontSize: '0.9375rem' }}>
                "Hello! This is a reminder for your appointment with <strong>Dr. Smith</strong> tomorrow at <strong>10:00 AM</strong> at MediCare+. See you then! 🏥"
            </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" style={{
                background: 'linear-gradient(135deg, #25d366, #128c7e)',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
            }}>
                Activate Bot
            </button>
            <button className="btn btn-secondary">
                Edit Templates
            </button>
        </div>
    </div>
);

// Doctor Profile View / Edit Section
const DoctorProfileView = ({ doctor, onBack, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: doctor.userId?.name || '',
        specialization: doctor.specialization || '',
        experience: doctor.experience || 0,
        feesPerConsultation: doctor.feesPerConsultation || 50
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`https://abi-hospital-backend.onrender.com/api/doctors/${doctor._id}`, {
                specialization: formData.specialization,
                experience: parseInt(formData.experience),
                feesPerConsultation: parseInt(formData.feesPerConsultation)
            });
            // If we also want to update user name we'd need another endpoint, let's stick to doctor info for demo
            
            toast.success('Doctor profile updated successfully!');
            setIsEditing(false);
            onRefresh();
        } catch (err) {
            toast.error('Failed to update doctor profile');
        }
        setSaving(false);
    };

    return (
        <div className="glass-card" style={{ padding: '2.5rem' }}>
            <button onClick={onBack} style={{
                background: 'none', border: 'none', color: '#64748b',
                fontWeight: '600', cursor: 'pointer', marginBottom: '2rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
                ← Back to Doctors Team
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                        color: 'white', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '2rem', fontWeight: '800'
                    }}>
                        {formData.name?.[0] || 'D'}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{formData.name}</h2>
                        <p style={{ color: '#64748b', fontSize: '1.125rem' }}>{doctor.userId?.email || 'N/A'}</p>
                    </div>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                        <FaEdit /> Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem', background: '#f8fafc', padding: '2rem', borderRadius: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Specialization</label>
                            <input name="specialization" value={formData.specialization} onChange={handleChange} className="input" required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Experience (Years)</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="input" required />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Consultation Fee (₹)</label>
                        <input type="number" name="feesPerConsultation" value={formData.feesPerConsultation} onChange={handleChange} className="input" required />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Profile'}</button>
                    </div>
                </form>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: '#f8fafc', padding: '2rem', borderRadius: '16px' }}>
                    <div>
                        <p style={{ color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>Specialization</p>
                        <p style={{ fontSize: '1.125rem', color: '#0f172a', fontWeight: '500' }}>{doctor.specialization}</p>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>Experience</p>
                        <p style={{ fontSize: '1.125rem', color: '#0f172a', fontWeight: '500' }}>{doctor.experience} years</p>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>Consultation Fee</p>
                        <p style={{ fontSize: '1.125rem', color: '#0f172a', fontWeight: '500' }}>₹{doctor.feesPerConsultation}</p>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>Role</p>
                        <p style={{ fontSize: '1.125rem', color: '#0f172a', fontWeight: '500', textTransform: 'capitalize' }}>{doctor.userId?.role || 'Doctor'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
