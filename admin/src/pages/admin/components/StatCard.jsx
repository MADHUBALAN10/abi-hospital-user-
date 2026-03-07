import React from 'react';

const StatCard = ({ title, value, change, icon, gradient }) => (
    <div className="admin-stat-card">
        {/* Background blur blob */}
        <div
            className="stat-bg-blob"
            style={{ background: gradient }}
        />

        <div className="stat-top">
            <div className="admin-stat-icon" style={{ background: gradient }}>
                {icon}
            </div>
            <span className="admin-stat-badge">{change}</span>
        </div>

        <h3 className="admin-stat-value">{value}</h3>
        <p className="admin-stat-title">{title}</p>
    </div>
);

export default StatCard;
