import React from 'react';
import { FaUserMd, FaUsers, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AVATARS = [
    'linear-gradient(135deg, #4f46e5, #6366f1)',
    'linear-gradient(135deg, #7e22ce, #9333ea)',
    'linear-gradient(135deg, #0891b2, #06b6d4)',
    'linear-gradient(135deg, #10b981, #34d399)',
];

const Overview = ({ stats, appointments }) => {
    // Generate mock analytics data derived from appointments/stats for demonstration
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Monthly Revenue (₹)',
                data: [4200, 5800, 7100, 8300, 11000, stats.revenue || 12400],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const statusCounts = appointments.reduce((acc, curr) => {
        acc[curr.status || 'pending'] = (acc[curr.status || 'pending'] || 0) + 1;
        return acc;
    }, {});

    const appointmentData = {
        labels: Object.keys(statusCounts).length > 0 ? Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1)) : ['Pending', 'Confirmed', 'Completed'],
        datasets: [
            {
                data: Object.keys(statusCounts).length > 0 ? Object.values(statusCounts) : [12, 19, 3],
                backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stats Grid */}
            <div className="admin-stats-grid">
                <StatCard
                    title="Total Doctors"
                    value={stats.doctors}
                    change="+2.5%"
                    icon={<FaUserMd />}
                    gradient="linear-gradient(135deg, #4f46e5, #6366f1)"
                />
                <StatCard
                    title="Total Patients"
                    value={stats.patients}
                    change="+12%"
                    icon={<FaUsers />}
                    gradient="linear-gradient(135deg, #7e22ce, #9333ea)"
                />
                <StatCard
                    title="Revenue"
                    value={`₹${((stats.revenue || 0) / 1000).toFixed(1)}k`}
                    change="+8.2%"
                    icon={<FaMoneyBillWave />}
                    gradient="linear-gradient(135deg, #10b981, #34d399)"
                />
                <StatCard
                    title="Pending"
                    value={stats.appointments || '0'}
                    change="Today"
                    icon={<FaCalendarAlt />}
                    gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
                />
            </div>

            {/* Analytics Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <div className="admin-glass-card" style={{ padding: '1.5rem' }}>
                    <div className="admin-section-header">
                        <h3 className="admin-section-title">Revenue Analytics</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Line
                            data={revenueData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="admin-glass-card" style={{ padding: '1.5rem' }}>
                    <div className="admin-section-header">
                        <h3 className="admin-section-title">Appointments by Status</h3>
                    </div>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut
                            data={appointmentData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: '70%',
                                plugins: { legend: { position: 'bottom' } }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="admin-glass-card">
                <div className="admin-section-header">
                    <h3 className="admin-section-title">Recent Appointments</h3>
                    <button className="admin-btn-ghost">View All →</button>
                </div>

                <div>
                    {appointments.slice(0, 5).map((appt, i) => (
                        <div key={appt._id || i} className="admin-appt-row">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                <div
                                    className="admin-appt-avatar"
                                    style={{ background: AVATARS[i % AVATARS.length] }}
                                >
                                    {(appt.patientId?.name || 'P')[0]}
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
                            <span className={`admin-badge ${appt.status || 'pending'}`}>
                                {appt.status || 'pending'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overview;
