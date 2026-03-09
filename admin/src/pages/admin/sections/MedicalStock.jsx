import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaPills, FaSave } from 'react-icons/fa';

/* ─────────────────────────────────────────────────────────
   Shared form fields for both Add and Edit modals
───────────────────────────────────────────────────────── */
const MedicineForm = ({ form, onChange, doctors, isEdit }) => (
    <div className="admin-form">
        {/* Medicine Name */}
        <div>
            <label htmlFor="inv-itemName">Medicine / Item Name *</label>
            <input
                id="inv-itemName"
                name="itemName"
                type="text"
                placeholder="e.g. Paracetamol 500mg"
                value={form.itemName}
                onChange={onChange}
                required
            />
        </div>

        {/* Category */}
        <div>
            <label htmlFor="inv-category">Category *</label>
            <select
                id="inv-category"
                name="category"
                value={form.category}
                onChange={onChange}
            >
                <option value="Medicine">Medicine</option>
                <option value="Surgical">Surgical</option>
                <option value="Equipment">Equipment</option>
                <option value="Consumable">Consumable</option>
                <option value="Other">Other</option>
            </select>
        </div>

        {/* Stock & Price */}
        <div className="admin-form-row">
            <div>
                <label htmlFor="inv-stock">Stock Quantity *</label>
                <input
                    id="inv-stock"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    placeholder="e.g. 100"
                    value={form.stockQuantity}
                    onChange={onChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="inv-price">Unit Price (₹) *</label>
                <input
                    id="inv-price"
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 25.00"
                    value={form.unitPrice}
                    onChange={onChange}
                    required
                />
            </div>
        </div>

        {/* Manufacturer & Expiry */}
        <div className="admin-form-row">
            <div>
                <label htmlFor="inv-manufacturer">Manufacturer</label>
                <input
                    id="inv-manufacturer"
                    name="manufacturer"
                    type="text"
                    placeholder="e.g. Sun Pharma"
                    value={form.manufacturer}
                    onChange={onChange}
                />
            </div>
            <div>
                <label htmlFor="inv-expiry">Expiry Date</label>
                <input
                    id="inv-expiry"
                    name="expiryDate"
                    type="date"
                    value={form.expiryDate}
                    onChange={onChange}
                />
            </div>
        </div>

        {/* Assign to Doctor */}
        <div>
            <label htmlFor="inv-doctor">Assign to Doctor</label>
            <select
                id="inv-doctor"
                name="assignedDoctorId"
                value={form.assignedDoctorId}
                onChange={onChange}
            >
                <option value="">— Select a Doctor (optional) —</option>
                {doctors && doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                        {doc.userId?.name || 'Unknown'} — {doc.specialization || 'General'}
                    </option>
                ))}
            </select>
            {/* Doctor listing preview */}
            {doctors && doctors.length > 0 && (
                <div className="inv-doctor-list">
                    {doctors.map((doc) => (
                        <button
                            key={doc._id}
                            type="button"
                            className={`inv-doctor-chip ${form.assignedDoctorId === doc._id ? 'selected' : ''}`}
                            onClick={() => onChange({ target: { name: 'assignedDoctorId', value: doc._id } })}
                        >
                            <span className="inv-dc-avatar">
                                {(doc.userId?.name || 'D')[0].toUpperCase()}
                            </span>
                            <span className="inv-dc-info">
                                <span className="inv-dc-name">{doc.userId?.name || 'Unknown'}</span>
                                <span className="inv-dc-spec">{doc.specialization || 'General'}</span>
                            </span>
                            {form.assignedDoctorId === doc._id && (
                                <span className="inv-dc-check">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Description */}
        <div>
            <label htmlFor="inv-description">Description</label>
            <input
                id="inv-description"
                name="description"
                type="text"
                placeholder="Brief description (optional)"
                value={form.description}
                onChange={onChange}
            />
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────
   Add Medicine Modal
───────────────────────────────────────────────────────── */
const AddMedicineModal = ({ onClose, onSubmit, doctors }) => {
    const [form, setForm] = useState({
        itemName: '',
        category: 'Medicine',
        stockQuantity: '',
        unitPrice: '',
        manufacturer: '',
        expiryDate: '',
        assignedDoctorId: '',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.itemName || !form.stockQuantity || !form.unitPrice) return;
        setSubmitting(true);
        await onSubmit({
            ...form,
            stockQuantity: Number(form.stockQuantity),
            unitPrice: Number(form.unitPrice),
        });
        setSubmitting(false);
    };

    return (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="admin-modal inv-modal">
                <div className="admin-modal-header">
                    <div>
                        <div className="inv-modal-icon"><FaPills /></div>
                        <h2 className="admin-modal-title" style={{ marginTop: '0.75rem' }}>Add Medicine</h2>
                        <p className="admin-modal-sub">Fill in the details to add a new inventory item</p>
                    </div>
                    <button className="admin-modal-close" onClick={onClose} title="Close"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <MedicineForm form={form} onChange={handleChange} doctors={doctors} />
                    <div className="admin-form-actions" style={{ marginTop: '1.5rem' }}>
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                            {submitting ? 'Adding…' : <><FaPlus /> Add to Inventory</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   Edit Medicine Modal
───────────────────────────────────────────────────────── */
const EditMedicineModal = ({ item, onClose, onSubmit, doctors }) => {
    const [form, setForm] = useState({
        itemName: item.itemName || '',
        category: item.category || 'Medicine',
        stockQuantity: item.stockQuantity ?? '',
        unitPrice: item.unitPrice ?? '',
        manufacturer: item.manufacturer || '',
        expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
        assignedDoctorId: item.assignedDoctorId || '',
        description: item.description || '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.itemName || !form.stockQuantity || !form.unitPrice) return;
        setSubmitting(true);
        await onSubmit(item._id, {
            ...form,
            stockQuantity: Number(form.stockQuantity),
            unitPrice: Number(form.unitPrice),
        });
        setSubmitting(false);
    };

    return (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="admin-modal inv-modal">
                <div className="admin-modal-header">
                    <div>
                        <div className="inv-modal-icon inv-modal-icon-edit"><FaEdit /></div>
                        <h2 className="admin-modal-title" style={{ marginTop: '0.75rem' }}>Edit Medicine</h2>
                        <p className="admin-modal-sub">Update the details for <strong>{item.itemName}</strong></p>
                    </div>
                    <button className="admin-modal-close" onClick={onClose} title="Close"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <MedicineForm form={form} onChange={handleChange} doctors={doctors} isEdit />
                    <div className="admin-form-actions" style={{ marginTop: '1.5rem' }}>
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                            {submitting ? 'Saving…' : <><FaSave /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   MedicalStock Section (main export)
───────────────────────────────────────────────────────── */
const MedicalStock = ({ inventory, doctors = [], onAdd, onEdit, onDelete }) => {
    const [showAdd, setShowAdd] = useState(false);
    const [editItem, setEditItem] = useState(null); // holds the item being edited

    const handleAddSubmit = async (data) => {
        await onAdd(data);
        setShowAdd(false);
    };

    const handleEditSubmit = async (id, data) => {
        await onEdit(id, data);
        setEditItem(null);
    };

    return (
        <>
            <div className="admin-glass-card">
                {/* Header */}
                <div className="admin-section-header">
                    <div>
                        <h3 className="admin-section-title">Inventory Management</h3>
                        <p className="admin-section-sub">Track and manage medical supplies</p>
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={() => setShowAdd(true)}>
                        <FaPlus /> Add Item
                    </button>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Price</th>
                                <th>Assigned Doctor</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{
                                        textAlign: 'center',
                                        color: '#94a3b8',
                                        padding: '3rem 1rem',
                                        fontStyle: 'italic',
                                    }}>
                                        No items found. Click "+ Add Item" to get started.
                                    </td>
                                </tr>
                            ) : inventory.map((item) => {
                                const stockLevel =
                                    item.stockQuantity > 50 ? 'high' :
                                        item.stockQuantity > 20 ? 'medium' : 'low';
                                const barColors = { high: '#10b981', medium: '#f59e0b', low: '#ef4444' };

                                // Find assigned doctor name
                                const assignedDoc = doctors.find(
                                    (d) => d._id === item.assignedDoctorId
                                );

                                return (
                                    <tr key={item._id}>
                                        <td>{item.itemName}</td>
                                        <td>
                                            <span className="inv-category-badge">{item.category}</span>
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
                                        <td>
                                            {assignedDoc ? (
                                                <span className="inv-assigned-doc">
                                                    <span className="inv-doc-dot" />
                                                    {assignedDoc.userId?.name || 'Dr.'}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>—</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                className="admin-btn-icon"
                                                onClick={() => setEditItem(item)}
                                                title="Edit this item"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                className="admin-btn-danger"
                                                onClick={() => onDelete(item._id)}
                                                title="Delete this item"
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

            {/* Add Modal */}
            {showAdd && (
                <AddMedicineModal
                    doctors={doctors}
                    onClose={() => setShowAdd(false)}
                    onSubmit={handleAddSubmit}
                />
            )}

            {/* Edit Modal */}
            {editItem && (
                <EditMedicineModal
                    item={editItem}
                    doctors={doctors}
                    onClose={() => setEditItem(null)}
                    onSubmit={handleEditSubmit}
                />
            )}
        </>
    );
};

export default MedicalStock;
