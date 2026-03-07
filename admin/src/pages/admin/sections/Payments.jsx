import React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';

const Payments = ({ appointments, stats }) => (
    <div className="admin-payments-grid">
        {/* Transaction History */}
        <div className="admin-glass-card span-2">
            <h3 className="admin-section-title" style={{ marginBottom: '1.5rem' }}>
                Transaction History
            </h3>

            {appointments
                .filter((a) => a.paymentStatus === 'completed')
                .slice(0, 6)
                .map((appt, i) => (
                    <div key={appt._id || i} className="admin-txn-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="admin-txn-icon">
                                <FaMoneyBillWave />
                            </div>
                            <div>
                                <p style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>
                                    Consultation Fee
                                </p>
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
                                textDecoration: 'underline',
                            }}>
                                Download
                            </button>
                        </div>
                    </div>
                ))}
        </div>

        {/* Balance Card */}
        <div className="admin-balance-card">
            <div className="admin-balance-blob" />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <p className="admin-balance-label">Total Balance</p>
                <h2 className="admin-balance-amount">₹{stats.revenue.toLocaleString()}</h2>
                <div className="admin-balance-actions">
                    <button className="admin-balance-btn">Withdraw</button>
                    <button className="admin-balance-btn">Reports</button>
                </div>
            </div>
        </div>
    </div>
);

export default Payments;
