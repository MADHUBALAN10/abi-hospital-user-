import React, { useState, useEffect } from 'react';
import { FaUserMd, FaPills, FaMoneyBillWave, FaWhatsapp, FaChartPie, FaSignOutAlt, FaBell, FaUsers, FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaStethoscope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'https://abi-hospital-backend.onrender.com/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        revenue: 0
    });
    const [appointments, setAppointments] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [inventoryFormData, setInventoryFormData] = useState({
        itemName: '',
        category: '',
        stockQuantity: '',
        unitPrice: ''
    });
    const [editingInventoryId, setEditingInventoryId] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        // Refresh appointments every 5 seconds for real-time updates
        const interval = setInterval(() => {
            if (activeTab === 'appointments' || activeTab === 'overview') {
                fetchData();
            }
        }, 5000);
        return () => clearInterval(interval);
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

    const handleOpenInventoryModal = (item = null) => {
        if (item) {
            setInventoryFormData({
                itemName: item.itemName,
                category: item.category,
                stockQuantity: item.stockQuantity,
                unitPrice: item.unitPrice
            });
            setEditingInventoryId(item._id);
        } else {
            setInventoryFormData({
                itemName: '',
                category: '',
                stockQuantity: '',
                unitPrice: ''
            });
            setEditingInventoryId(null);
        }
        setShowInventoryModal(true);
    };

    const handleCloseInventoryModal = () => {
        setShowInventoryModal(false);
        setEditingInventoryId(null);
        setInventoryFormData({
            itemName: '',
            category: '',
            stockQuantity: '',
            unitPrice: ''
        });
    };

    const handleSaveInventory = async () => {
        if (!inventoryFormData.itemName || !inventoryFormData.category || !inventoryFormData.stockQuantity || !inventoryFormData.unitPrice) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            if (editingInventoryId) {
                // Update existing item
                const res = await axios.put(`${API_URL}/inventory/${editingInventoryId}`, inventoryFormData);
                setInventory(inventory.map(item => item._id === editingInventoryId ? res.data : item));
                toast.success('Item updated successfully');
            } else {
                // Add new item
                const res = await axios.post(`${API_URL}/inventory`, inventoryFormData);
                setInventory([...inventory, res.data]);
                toast.success('Item added successfully');
            }
            handleCloseInventoryModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save item');
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

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await axios.put(`${API_URL}/appointments/${appointmentId}`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
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
                        icon={<FaCalendarAlt />}
                        label="Appointments"
                        active={activeTab === 'appointments'}
                        onClick={() => setActiveTab('appointments')}
                        count={appointments.length}
                    />
                    <NavItem
                        icon={<FaUserMd />}
                        label="Doctors"
                        active={activeTab === 'doctors'}
                        onClick={() => setActiveTab('doctors')}
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
                        {activeTab === 'overview' && <Overview stats={stats} appointments={appointments} onStatusUpdate={handleStatusUpdate} />}
                        {activeTab === 'appointments' && <AppointmentsTab appointments={appointments} onRefresh={fetchData} />}
                        {activeTab === 'stock' && <MedicalStock inventory={inventory} onAdd={() => handleOpenInventoryModal()} onEdit={handleOpenInventoryModal} onDelete={handleDeleteInventory} />}
                        {activeTab === 'payments' && <Payments appointments={appointments} stats={stats} />}
                        {/* {activeTab === 'doctors' && <DoctorsTeam doctors={doctors} onRefresh={fetchData} />} */}
                        {activeTab === 'whatsapp' && <WhatsAppConfig />}
                    </>
                )}
            </main>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

            {/* Inventory Form Modal */}
            {showInventoryModal && (
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
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                        animation: 'slideUp 0.4s ease-out'
                    }}>
                        {/* Close Button */}
                        <button
                            onClick={handleCloseInventoryModal}
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
                            {editingInventoryId ? '✏️ Edit Item' : '📦 Add New Item'}
                        </h2>

                        {/* Form Fields */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                Item Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Paracetamol 500mg"
                                value={inventoryFormData.itemName}
                                onChange={(e) => setInventoryFormData({ ...inventoryFormData, itemName: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                Category
                            </label>
                            <select
                                value={inventoryFormData.category}
                                onChange={(e) => setInventoryFormData({ ...inventoryFormData, category: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    cursor: 'pointer'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="">Select Category</option>
                                <option value="Medicine">Medicine</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Supplies">Supplies</option>
                                <option value="Vaccines">Vaccines</option>
                                <option value="Antibiotics">Antibiotics</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g., 100"
                                    value={inventoryFormData.stockQuantity}
                                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, stockQuantity: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    Unit Price ($)
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g., 10"
                                    step="0.01"
                                    value={inventoryFormData.unitPrice}
                                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, unitPrice: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        {inventoryFormData.stockQuantity && inventoryFormData.unitPrice && (
                            <div style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                                borderRadius: '12px',
                                border: '2px solid #bae6fd',
                                marginBottom: '2rem'
                            }}>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Total Value:
                                </p>
                                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0369a1' }}>
                                    ${(parseFloat(inventoryFormData.stockQuantity) * parseFloat(inventoryFormData.unitPrice)).toFixed(2)}
                                </p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                onClick={handleCloseInventoryModal}
                                style={{
                                    padding: '1rem',
                                    background: '#f1f5f9',
                                    color: '#0f172a',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.background = '#e2e8f0';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = '#f1f5f9';
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSaveInventory}
                                style={{
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                                }}
                            >
                                {editingInventoryId ? '💾 Update Item' : '➕ Add Item'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
const Overview = ({ stats, appointments, onStatusUpdate }) => (
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
                value={`$${(stats.revenue / 1000).toFixed(1)}k`}
                change="+8.2%"
                icon={<FaMoneyBillWave />}
                gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
            />
            <StatCard
                title="Pending"
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
                        <select
                            value={appt.status.toLowerCase()}
                            onChange={(e) => onStatusUpdate(appt._id, e.target.value)}
                            style={{
                                padding: '0.375rem 2rem 0.375rem 1rem',
                                background: appt.status.toLowerCase() === 'approved' ? '#d1fae5' : '#fef3c7',
                                color: appt.status.toLowerCase() === 'approved' ? '#065f46' : '#92400e',
                                border: `1px solid ${appt.status.toLowerCase() === 'approved' ? '#a7f3d0' : '#fde68a'}`,
                                borderRadius: '20px',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                appearance: 'none',
                                outline: 'none',
                                textTransform: 'capitalize',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${appt.status.toLowerCase() === 'approved' ? '065f46' : '92400e'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.5rem center',
                                backgroundSize: '1em'
                            }}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                        </select>
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
const MedicalStock = ({ inventory, onAdd, onEdit, onDelete }) => {
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const totalItems = inventory.length;
    const totalStock = inventory.reduce((sum, item) => sum + item.stockQuantity, 0);
    const lowStockItems = inventory.filter(item => item.stockQuantity <= 20).length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.stockQuantity * item.unitPrice), 0);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const res = await axios.get(`${API_URL}/inventory`);
            setInventory(res.data);
            toast.success('✅ Stock updated successfully');
        } catch (error) {
            toast.error('Failed to refresh inventory');
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div>
            {/* Analytics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{
                    background: '#f0f4ff',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: '#4c63d2',
                    border: '1px solid #e0e7ff',
                    boxShadow: '0 4px 12px rgba(79, 99, 210, 0.08)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '2rem' }}>📦</div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7c8ff2' }}>Total Items</p>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#4c63d2' }}>{totalItems}</p>
                    <p style={{ fontSize: '0.875rem', color: '#8b9ddd' }}>Medical supplies in stock</p>
                </div>

                <div style={{
                    background: '#f0fdf4',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: '#15803d',
                    border: '1px solid #dcfce7',
                    boxShadow: '0 4px 12px rgba(21, 128, 61, 0.08)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '2rem' }}>📊</div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#22c55e' }}>Total Stock</p>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#15803d' }}>{totalStock}</p>
                    <p style={{ fontSize: '0.875rem', color: '#4ade80' }}>Units available</p>
                </div>

                <div style={{
                    background: '#fffbeb',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: '#b45309',
                    border: '1px solid #fef3c7',
                    boxShadow: '0 4px 12px rgba(180, 83, 9, 0.08)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '2rem' }}>⚠️</div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706' }}>Low Stock</p>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#b45309' }}>{lowStockItems}</p>
                    <p style={{ fontSize: '0.875rem', color: '#f59e0b' }}>Items below 20 units</p>
                </div>

                <div style={{
                    background: '#eff6ff',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: '#0c4a6e',
                    border: '1px solid #e0f2fe',
                    boxShadow: '0 4px 12px rgba(12, 74, 110, 0.08)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '2rem' }}>💰</div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0284c7' }}>Total Value</p>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0c4a6e' }}>${totalValue.toFixed(0)}</p>
                    <p style={{ fontSize: '0.875rem', color: '#0ea5e9' }}>Inventory value</p>
                </div>
            </div>

            {/* Table Card */}
            <div className="glass-card">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                            📋 Inventory Management
                        </h3>
                        <p style={{ color: '#64748b' }}>Track and manage medical supplies</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#f1f5f9',
                                color: '#0891b2',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                fontWeight: '700',
                                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s ease',
                                opacity: isRefreshing ? 0.6 : 1
                            }}
                            onMouseOver={(e) => {
                                if (!isRefreshing) {
                                    e.target.style.background = '#e0f2fe';
                                    e.target.style.borderColor = '#0891b2';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isRefreshing) {
                                    e.target.style.background = '#f1f5f9';
                                    e.target.style.borderColor = '#e2e8f0';
                                }
                            }}
                        >
                            🔄 {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <button className="btn btn-primary" onClick={onAdd} style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <FaPlus /> Add Item
                        </button>
                    </div>
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
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Value
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.length > 0 ? (
                                inventory.map((item) => {
                                    const stockLevel = item.stockQuantity > 50 ? 'high' : item.stockQuantity > 20 ? 'medium' : 'low';
                                    const colors = { high: '#10b981', medium: '#f59e0b', low: '#ef4444' };
                                    const itemValue = item.stockQuantity * item.unitPrice;

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
                                                ${item.unitPrice}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', fontWeight: '600', color: '#3b82f6' }}>
                                                ${itemValue.toFixed(2)}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', textAlign: 'right', borderRadius: '0 12px 12px 0' }}>
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#0891b2',
                                                        fontWeight: '600',
                                                        fontSize: '0.875rem',
                                                        cursor: 'pointer',
                                                        marginRight: '1rem',
                                                        transition: 'color 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.color = '#0369a1'}
                                                    onMouseOut={(e) => e.target.style.color = '#0891b2'}
                                                >
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
                                                        cursor: 'pointer',
                                                        transition: 'color 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.color = '#dc2626'}
                                                    onMouseOut={(e) => e.target.style.color = '#ef4444'}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>No inventory items yet</p>
                                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Click "Add Item" to add your first medical supply</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Doctors Team Section
const DoctorsTeam = ({ doctors, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [showSpecModal, setShowSpecModal] = useState(false);
    const [specializations, setSpecializations] = useState([
        "Cardiologist", "Dermatologist", "Neurologist", "Pediatrician",
        "Orthopedic", "Gynecologist", "Ophthalmologist", "Psychiatrist",
        "ENT Specialist", "General Physician", "Dentist", "Surgeon",
        "Radiologist", "Anesthesiologist", "Pulmonologist", "Gastroenterologist"
    ]);
    const [newSpec, setNewSpec] = useState("");
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

    const handleAddSpecialization = (e) => {
        e.preventDefault();
        if (newSpec.trim() && !specializations.includes(newSpec.trim())) {
            setSpecializations([...specializations, newSpec.trim()].sort());
            setNewSpec("");
            setShowSpecModal(false);
            toast.success("Specialization added successfully!");
        } else if (specializations.includes(newSpec.trim())) {
            toast.error("Specialization already exists");
        }
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
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn"
                            onClick={() => setShowSpecModal(true)}
                            style={{
                                background: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '10px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <FaPlus /> Add Specialization
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <FaPlus /> Add Doctor
                        </button>
                    </div>
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
                                    ${doctor.feesPerConsultation || 50}
                                </span>
                                <button style={{
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

            {/* Add Specialization Modal */}
            {showSpecModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100, // Higher than regular modal
                    animation: 'fadeIn 0.2s ease-out'
                }} onClick={() => setShowSpecModal(false)}>
                    <div
                        className="glass-card"
                        style={{
                            maxWidth: '400px',
                            width: '90%',
                            padding: '2rem',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                                Doctor Specialization
                            </h3>
                            <button onClick={() => setShowSpecModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
                        </div>
                        <form onSubmit={handleAddSpecialization}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                                New Specialization Name
                            </label>
                            <input
                                type="text"
                                value={newSpec}
                                onChange={(e) => setNewSpec(e.target.value)}
                                className="input"
                                placeholder="e.g. Immunologist"
                                required
                                autoFocus
                                style={{ marginBottom: '1.5rem' }}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowSpecModal(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>Add Option</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Doctor Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
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
                            maxWidth: '650px',
                            width: '95%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            padding: '0',
                            animation: 'slideUp 0.3s ease-out',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{ 
                            padding: '2rem 2.5rem', 
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            background: 'white'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
                                    Add New Doctor
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Enter the doctor's details to create a new profile.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    color: '#64748b',
                                    fontSize: '1.25rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#fef2f2';
                                    e.currentTarget.style.color = '#ef4444';
                                    e.currentTarget.style.borderColor = '#fee2e2';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = '#f8fafc';
                                    e.currentTarget.style.color = '#64748b';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '2.5rem' }}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Personal Info Section */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                                            Full Name
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="Dr. John Smith"
                                                required
                                                style={{ marginBottom: 0, paddingLeft: '2.75rem' }}
                                            />
                                            <FaUserMd style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                                            Email Address
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="doctor@hospital.com"
                                                required
                                                style={{ marginBottom: 0, paddingLeft: '2.75rem' }}
                                            />
                                            <FaUsers style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                                            Specialization
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <select
                                                name="specialization"
                                                value={formData.specialization}
                                                onChange={handleChange}
                                                className="input"
                                                required
                                                style={{
                                                    marginBottom: 0,
                                                    paddingLeft: '2.75rem',
                                                    cursor: 'pointer',
                                                    appearance: 'none',
                                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2364748b\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'right 1rem center'
                                                }}
                                            >
                                                <option value="" disabled>Select Specialization</option>
                                                {specializations.map(spec => (
                                                    <option key={spec} value={spec}>{spec}</option>
                                                ))}
                                            </select>
                                            <FaStethoscope style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                                            Phone Number
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="+1 234 567 8900"
                                                style={{ marginBottom: 0, paddingLeft: '2.75rem' }}
                                            />
                                            <FaCalendarAlt style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                                            Experience (Years)
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="number"
                                                name="experience"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="e.g. 8"
                                                min="0"
                                                required
                                                style={{ marginBottom: 0, paddingLeft: '2.75rem' }}
                                            />
                                            <FaChartPie style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                                            Consultation Fee
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="number"
                                                name="feesPerConsultation"
                                                value={formData.feesPerConsultation}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="e.g. 50"
                                                min="0"
                                                required
                                                style={{ marginBottom: 0, paddingLeft: '2.75rem' }}
                                            />
                                            <FaMoneyBillWave style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '1rem',
                                            background: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            color: '#64748b',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.borderColor = '#cbd5e1';
                                            e.currentTarget.style.background = '#f8fafc';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.background = 'white';
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
                                            opacity: submitting ? 0.7 : 1,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                                        }}
                                    >
                                        {submitting ? 'Creating Profile...' : 'Add Doctor'} {!submitting && <FaPlus />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideUp {
                            from {
                                opacity: 0;
                                transform: translateY(20px) scale(0.95);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0) scale(1);
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

// Appointments Tab Component
const AppointmentsTab = ({ appointments, onRefresh }) => {
    const [filterStatus, setFilterStatus] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [updating, setUpdating] = React.useState(null);
    const [lastUpdateTime, setLastUpdateTime] = React.useState(null);

    // Auto-refresh when appointments data changes
    React.useEffect(() => {
        console.log('📊 Appointments data updated:', appointments.length, 'appointments');
        setLastUpdateTime(new Date().toLocaleTimeString());
    }, [appointments]);

    // Auto-refresh every 5 seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            console.log('🔄 Auto-refreshing appointments...');
            onRefresh();
        }, 5000);
        return () => clearInterval(interval);
    }, [onRefresh]);

    const filteredAppointments = appointments.filter(appt => {
        const matchesStatus = filterStatus === 'all' || appt.status?.toLowerCase() === filterStatus.toLowerCase();
        const matchesSearch = !searchTerm ||
            appt.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appt.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusOptions = ['Pending', 'Approved'];

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === 'approved') return { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' };
        if (statusLower === 'pending') return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
        return { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' };
    };

    const handleStatusUpdate = async (apptId, newStatus) => {
        setUpdating(apptId);
        try {
            await axios.put(`${API_URL}/appointments/${apptId}`, { status: newStatus });
            console.log('✅ Status updated to:', newStatus);
            toast.success(`Status updated to ${newStatus}! ✅`);
            // Immediate refresh without delay
            onRefresh();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
        setUpdating(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header with Search and Filter */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    flex: 1,
                    minWidth: '250px',
                    position: 'relative'
                }}>
                    <input
                        type="text"
                        placeholder="Search by patient or doctor name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '0.9375rem',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                        🔍
                    </span>
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        cursor: 'pointer',
                        background: 'white'
                    }}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <button
                    onClick={onRefresh}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9375rem'
                    }}
                >
                    Refresh
                </button>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 2rem',
                    background: '#f8fafc',
                    borderRadius: '16px',
                    border: '2px dashed #cbd5e1',
                    color: '#64748b'
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
                    <p style={{ fontSize: '1.0625rem', fontWeight: '600', marginBottom: '0.5rem' }}>No appointments found</p>
                    <p style={{ fontSize: '0.9375rem' }}>Try adjusting your filters or search terms</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredAppointments.map((appt, idx) => {
                        const colors = getStatusColor(appt.status);
                        const appointmentDate = new Date(appt.date);
                        const isUpcoming = appointmentDate > new Date();

                        return (
                            <div
                                key={appt._id || idx}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    border: '2px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    flexWrap: 'wrap',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                    borderLeft: `4px solid ${isUpcoming ? '#0891b2' : '#94a3b8'}`
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'}
                            >
                                {/* Patient Info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                                    <div style={{
                                        width: '52px',
                                        height: '52px',
                                        background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: '1.25rem',
                                        boxShadow: '0 4px 14px rgba(8, 145, 178, 0.3)'
                                    }}>
                                        {(appt.patientId?.name || 'P')[0]}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem', fontSize: '1rem' }}>
                                            {appt.patientId?.name || 'Unknown Patient'}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                            Patient ID: {appt.patientId?._id?.substring(0, 8) || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Doctor & Time Info */}
                                <div style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    alignItems: 'center',
                                    flex: 1,
                                    minWidth: '250px',
                                    padding: '0 1rem',
                                    borderLeft: '2px solid #f1f5f9',
                                    borderRight: '2px solid #f1f5f9'
                                }}>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                                            Doctor
                                        </p>
                                        <p style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9375rem' }}>
                                            {appt.doctorId?.userId?.name || 'Unknown Doctor'}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                                            Time
                                        </p>
                                        <p style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9375rem' }}>
                                            {appt.timeSlot || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                                            Date
                                        </p>
                                        <p style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9375rem' }}>
                                            {appointmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Dropdown Update */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    minWidth: '150px'
                                }}>
                                    <select
                                        value={appt.status || 'Pending'}
                                        onChange={(e) => handleStatusUpdate(appt._id, e.target.value)}
                                        disabled={updating === appt._id}
                                        style={{
                                            padding: '0.625rem 0.875rem',
                                            border: `2px solid ${colors.border}`,
                                            background: colors.bg,
                                            color: colors.text,
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            cursor: updating === appt._id ? 'not-allowed' : 'pointer',
                                            fontSize: '0.875rem',
                                            textTransform: 'capitalize',
                                            transition: 'all 0.2s',
                                            opacity: updating === appt._id ? 0.6 : 1
                                        }}
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    {updating === appt._id && (
                                        <p style={{ fontSize: '0.75rem', color: '#0891b2', fontWeight: '600', margin: '0', textAlign: 'center' }}>
                                            Updating...
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                borderRadius: '16px',
                border: '2px solid #bbf7d0'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Total Appointments
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: '800', color: '#065f46' }}>
                        {appointments.length}
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Pending
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: '800', color: '#065f46' }}>
                        {appointments.filter(a => a.status?.toLowerCase() === 'pending').length}
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Approved
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: '800', color: '#065f46' }}>
                        {appointments.filter(a => a.status?.toLowerCase() === 'approved').length}
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Completed
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: '800', color: '#065f46' }}>
                        {appointments.filter(a => a.status?.toLowerCase() === 'completed').length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
