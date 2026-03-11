import React, { useState, useEffect } from 'react';
import {
    FaUserMd, FaPills, FaMoneyBillWave, FaWhatsapp,
    FaChartPie, FaSignOutAlt, FaBell, FaUserNurse,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// Styles
import './admin.css';

// Components
import NavItem from './components/NavItem';

// Sections
import Overview from './sections/Overview';
import MedicalStock from './sections/MedicalStock';
import Payments from './sections/Payments';
import DoctorsTeam from './sections/DoctorsTeam';
import WhatsAppConfig from './sections/WhatsAppConfig';
import NursesTeam from './sections/NursesTeam';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : 'https://abi-hospital-backend.onrender.com/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, revenue: 0 });
    const [appointments, setAppointments] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [nurses, setNurses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [apptRes, docRes, nurseRes] = await Promise.all([
                axios.get(`${API_URL}/appointments`),
                axios.get(`${API_URL}/doctors`),
                axios.get(`${API_URL}/nurses`),
            ]);
            setAppointments(apptRes.data);
            setDoctors(docRes.data);
            setNurses(nurseRes.data);

            if (activeTab === 'stock') {
                const invRes = await axios.get(`${API_URL}/inventory`);
                setInventory(invRes.data);
            }

            setStats({
                doctors: docRes.data.length,
                patients: new Set(apptRes.data.map((a) => a.patientId?._id)).size,
                appointments: apptRes.data.filter((a) => a.status === 'pending').length,
                revenue: apptRes.data
                    .filter((a) => a.paymentStatus === 'completed')
                    .reduce((sum, a) => sum + (a.paymentAmount || 0), 0),
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Using demo mode.');

            // Demo fallback
            setAppointments([{
                _id: '1',
                patientId: { _id: '1', name: 'Patricia Kenodi' },
                doctorId: { userId: { name: 'Dr. Sarah Johnson' } },
                date: new Date().toISOString(),
                timeSlot: '10:00 AM',
                status: 'confirmed',
            }]);
            setDoctors([{
                _id: '1',
                userId: { name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com' },
                specialization: 'Cardiologist',
                experience: 10,
            }]);
            setInventory([{
                _id: '1',
                itemName: 'Paracetamol 500mg',
                category: 'Medicine',
                stockQuantity: 120,
                unitPrice: 5,
            }]);
            setStats({ doctors: 12, patients: 845, appointments: 4, revenue: 12400 });
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const handleAddInventory = async (formData) => {
        try {
            const res = await axios.post(`${API_URL}/inventory`, formData);
            setInventory([...inventory, res.data]);
            toast.success('Item added successfully');
        } catch {
            toast.error('Failed to add item');
        }
    };

    const handleEditInventory = async (id, formData) => {
        try {
            const res = await axios.put(`${API_URL}/inventory/${id}`, formData);
            setInventory(inventory.map((item) => item._id === id ? res.data : item));
            toast.success('Item updated successfully');
        } catch {
            toast.error('Failed to update item');
        }
    };

    const handleDeleteInventory = async (id) => {
        try {
            await axios.delete(`${API_URL}/inventory/${id}`);
            setInventory(inventory.filter((item) => item._id !== id));
            toast.success('Item deleted');
        } catch {
            toast.error('Failed to delete item');
        }
    };

    /* ── Sidebar nav items config ─────────────────────────── */
    const navItems = [
        { id: 'overview', icon: <FaChartPie />, label: 'Dashboard', badge: stats.appointments > 0 ? stats.appointments : null },
        { id: 'doctors', icon: <FaUserMd />, label: 'Doctors', count: stats.doctors },
        { id: 'nurses', icon: <FaUserNurse />, label: 'Nurses', count: nurses.length },
        { id: 'stock', icon: <FaPills />, label: 'Inventory' },
        { id: 'payments', icon: <FaMoneyBillWave />, label: 'Payments' },
    ];

    /* ── Section renderer ────────────────────────────────── */
    const renderSection = () => {
        if (loading) {
            return (
                <div className="admin-loading">
                    <div className="admin-spinner" />
                    Loading…
                </div>
            );
        }
        switch (activeTab) {
            case 'overview': return <Overview stats={stats} appointments={appointments} />;
            case 'stock': return <MedicalStock inventory={inventory} doctors={doctors} onAdd={handleAddInventory} onEdit={handleEditInventory} onDelete={handleDeleteInventory} />;
            case 'payments': return <Payments appointments={appointments} stats={stats} />;
            case 'doctors': return <DoctorsTeam doctors={doctors} onRefresh={fetchData} />;
            case 'nurses': return <NursesTeam nurses={nurses} onRefresh={fetchData} />;
            case 'whatsapp': return <WhatsAppConfig />;
            default: return null;
        }
    };

    return (
        <div className="admin-layout">
            {/* ── Sidebar ────────────────────────────────────── */}
            <aside className="admin-sidebar">
                {/* Logo */}
                <div className="admin-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                        <span className="admin-logo-sub" style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500', display: 'block', marginTop: '3px' }}>Admin Panel</span>
                    </div>
                </div>

                {/* Primary Nav */}
                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                            badge={item.badge}
                            count={item.count}
                        />
                    ))}

                    <div className="admin-nav-section">Integration</div>

                    <NavItem
                        icon={<FaWhatsapp />}
                        label="WhatsApp Bot"
                        active={activeTab === 'whatsapp'}
                        onClick={() => setActiveTab('whatsapp')}
                    />
                </nav>

                {/* Logout */}
                <button className="admin-logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </button>
            </aside>

            {/* ── Main Content ───────────────────────────────── */}
            <main className="admin-main">
                {/* Header */}
                <header className="admin-header">
                    <div>
                        <h1>{activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'nurses' ? 'Nursing Staff' : activeTab === 'doctors' ? 'Doctors Team' : activeTab}</h1>
                        <p className="admin-header-date">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </p>
                    </div>

                    <div className="admin-header-actions">
                        {/* Notification Bell */}
                        <button className="admin-notif-btn">
                            <FaBell />
                            {stats.appointments > 0 && <span className="admin-notif-dot" />}
                        </button>

                        {/* Admin User Pill */}
                        <div className="admin-user-pill">
                            <div className="admin-user-avatar">A</div>
                            <div>
                                <p className="admin-user-name">Admin User</p>
                                <p className="admin-user-role">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Rendered Section */}
                {renderSection()}
            </main>
        </div>
    );
};

export default AdminDashboard;
