import React from 'react';

const NavItem = ({ icon, label, active, onClick, badge, count }) => (
    <button
        onClick={onClick}
        className={`admin-nav-item${active ? ' active' : ''}`}
    >
        <span className="nav-icon">{icon}</span>
        <span className="nav-label">{label}</span>

        {badge && (
            <span className="admin-nav-badge">{badge}</span>
        )}

        {count !== undefined && !badge && (
            <span className="admin-nav-count">{count}</span>
        )}
    </button>
);

export default NavItem;
