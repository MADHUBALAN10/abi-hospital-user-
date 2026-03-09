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

const API_URL = 'http://localhost:5000/api';

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
                <div className="admin-logo">
                    <div className="admin-logo-icon">A</div>
                    <div>
                        <span className="admin-logo-text">Admin<span>Panel</span></span>
                        <span className="admin-logo-sub">MediCare+</span>
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
