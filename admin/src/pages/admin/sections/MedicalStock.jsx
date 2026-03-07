import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const MedicalStock = ({ inventory, onAdd, onDelete }) => (
    <div className="admin-glass-card">
        <div className="admin-section-header">
            <div>
                <h3 className="admin-section-title">Inventory Management</h3>
                <p className="admin-section-sub">Track and manage medical supplies</p>
            </div>
            <button className="admin-btn admin-btn-primary" onClick={onAdd}>
                <FaPlus /> Add Item
            </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => {
                        const stockLevel =
                            item.stockQuantity > 50 ? 'high' :
                                item.stockQuantity > 20 ? 'medium' : 'low';
                        const barColors = {
                            high: '#10b981',
                            medium: '#f59e0b',
                            low: '#ef4444',
                        };

                        return (
                            <tr key={item._id}>
                                <td>{item.itemName}</td>
                                <td>
                                    <span style={{
                                        padding: '0.375rem 0.75rem',
                                        background: '#f1f5f9',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                    }}>
                                        {item.category}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontWeight: '600', minWidth: '40px' }}>
                                            {item.stockQuantity}
                                        </span>
                                        <div className="admin-stock-bar-wrap">
                                            <div
                                                className="admin-stock-bar"
                                                style={{
                                                    width: `${Math.min((item.stockQuantity / 100) * 100, 100)}%`,
                                                    background: barColors[stockLevel],
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                                    ₹{item.unitPrice}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="admin-btn-icon">
                                        <FaEdit /> Edit
                                    </button>
                                    <button className="admin-btn-danger" onClick={() => onDelete(item._id)}>
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

export default MedicalStock;
