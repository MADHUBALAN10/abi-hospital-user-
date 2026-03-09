import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const NURSE_AVATARS = [
    'linear-gradient(135deg, #ec4899, #f472b6)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #06b6d4, #22d3ee)',
];

const DEPARTMENTS = [
    'General Ward', 'ICU', 'Emergency', 'Pediatrics',
    'Maternity', 'Oncology', 'Cardiology', 'Orthopedics',
    'Neurology', 'Surgery', 'Outpatient', 'Geriatrics',
];

const SHIFTS = ['Morning', 'Afternoon', 'Night'];

const EMPTY_FORM = {
    name: '', email: '', phone: '',
    department: '', shift: 'Morning',
    experience: '', gender: '', profileImage: ''
};

const NursesTeam = ({ nurses, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedNurse, setSelectedNurse] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '', department: '', shift: '', experience: '', gender: '', profileImage: ''
    });
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, profileImage: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setEditForm(prev => ({ ...prev, profileImage: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${API_URL}/nurses`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                department: formData.department,
                shift: formData.shift,
                experience: parseInt(formData.experience) || 0,
                gender: formData.gender,
                profileImage: formData.profileImage,
            });

            toast.success('Nurse added successfully! 🎉');
            setShowModal(false);
            setFormData(EMPTY_FORM);
            onRefresh();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add nurse');
        }
        setSubmitting(false);
    };

    const handleOpenProfile = (nurse) => {
        setSelectedNurse(nurse);
        setEditForm({
            name: nurse.userId?.name || '',
            department: nurse.department || '',
            shift: nurse.shift || 'Morning',
            experience: nurse.experience || '',
            gender: nurse.gender || '',
            profileImage: nurse.profileImage || ''
        });
        setIsEditing(false);
    };

    const handleEditChange = (e) =>
        setEditForm({ ...editForm, [e.target.name]: e.target.value });

    const handleUpdate = async () => {
        setSubmitting(true);
        try {
            await axios.put(`${API_URL}/nurses/${selectedNurse._id}`, {
                name: editForm.name,
                department: editForm.department,
                shift: editForm.shift,
                experience: parseInt(editForm.experience) || 0,
                gender: editForm.gender,
                profileImage: editForm.profileImage,
            });
            toast.success('Nurse profile updated!');
            setSelectedNurse(null);
            setIsEditing(false);
            onRefresh();
        } catch (error) {
            toast.error('Failed to update nurse profile');
        }
        setSubmitting(false);
    };

    const handleDelete = async (nurseId) => {
        if (!window.confirm('Remove this nurse from the system?')) return;
        try {
            await axios.delete(`${API_URL}/nurses/${nurseId}`);
            toast.success('Nurse removed');
            setSelectedNurse(null);
            onRefresh();
        } catch {
            toast.error('Failed to remove nurse');
        }
    };

    const shiftColor = (shift) => ({
        Morning: '#f59e0b',
        Afternoon: '#0891b2',
        Night: '#6366f1',
    }[shift] || '#64748b');

    return (
        <>
            {/* Nurses Grid */}
            <div className="admin-glass-card">
                <div className="admin-section-header">
                    <div>
                        <h3 className="admin-section-title">Nursing Staff</h3>
                        <p className="admin-section-sub">Manage nurses and ward assignments</p>
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
                        <FaPlus /> Add Nurse
                    </button>
                </div>

                {nurses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👩‍⚕️</div>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No nurses added yet</p>
                        <p style={{ fontSize: '0.875rem' }}>Click "Add Nurse" to get started</p>
                    </div>
                ) : (
                    <div className="admin-doctors-grid">
                        {nurses.map((nurse, i) => (
                            <div key={nurse._id} className="admin-doctor-card">
                                {nurse.profileImage ? (
                                    <img src={nurse.profileImage} alt={nurse.userId?.name} className="admin-doctor-avatar" style={{ objectFit: 'cover' }} />
                                ) : (
                                    <div className="admin-doctor-avatar" style={{ background: NURSE_AVATARS[i % NURSE_AVATARS.length] }}>
                                        {nurse.userId?.name?.[0] || 'N'}
                                    </div>
                                )}
                                <h4 className="admin-doctor-name">{nurse.userId?.name || 'Nurse'}</h4>
                                <p className="admin-doctor-spec">{nurse.department}</p>
                                <p className="admin-doctor-exp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: shiftColor(nurse.shift), display: 'inline-block' }}></span>
                                    {nurse.shift} Shift
                                </p>
                                <div className="admin-doctor-footer">
                                    <span className="admin-doctor-fee" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                                        {nurse.experience || 0} yrs exp
                                    </span>
                                    <button className="admin-btn-ghost" onClick={() => handleOpenProfile(nurse)}>View →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Nurse Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <div>
                                <h3 className="admin-modal-title">Add New Nurse</h3>
                                <p className="admin-modal-sub">Fill in the nurse's details below</p>
                            </div>
                            <button className="admin-modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form className="admin-form" onSubmit={handleSubmit}>
                            {/* Avatar + Name row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div className="dp-avatar-wrapper">
                                    {formData.profileImage ? (
                                        <img src={formData.profileImage} alt="Preview" className="dp-avatar-img" />
                                    ) : (
                                        <div className="dp-avatar-initial" style={{ fontSize: '1.75rem', background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}>N</div>
                                    )}
                                    <label className="dp-avatar-upload-btn">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAddImageUpload} />
                                    </label>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Full Name *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nurse Jane Smith" required />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div>
                                    <label>Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nurse@hospital.com" required />
                                </div>
                                <div>
                                    <label>Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div>
                                    <label>Department *</label>
                                    <select name="department" value={formData.department} onChange={handleChange} required style={{ cursor: 'pointer' }}>
                                        <option value="" disabled>Select department</option>
                                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Shift *</label>
                                    <select name="shift" value={formData.shift} onChange={handleChange} style={{ cursor: 'pointer' }}>
                                        {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div>
                                    <label>Experience (years)</label>
                                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="3" min="0" />
                                </div>
                                <div>
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} style={{ cursor: 'pointer' }}>
                                        <option value="">Not specified</option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
                                    {submitting ? 'Adding...' : <><FaPlus /> Add Nurse</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Nurse Profile Modal */}
            {selectedNurse && (
                <div className="admin-modal-overlay" onClick={() => { setSelectedNurse(null); setIsEditing(false); }}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <div className="admin-modal-header">
                            <div className="dp-profile-header">
                                <div className="dp-avatar-wrapper">
                                    {(isEditing ? editForm.profileImage : selectedNurse.profileImage) ? (
                                        <img
                                            src={isEditing ? editForm.profileImage || selectedNurse.profileImage : selectedNurse.profileImage}
                                            alt="Profile"
                                            className="dp-avatar-img"
                                        />
                                    ) : (
                                        <div className="dp-avatar-initial" style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}>
                                            {selectedNurse.userId?.name?.[0]?.toUpperCase() || 'N'}
                                        </div>
                                    )}
                                    {isEditing && (
                                        <label className="dp-avatar-upload-btn">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleEditImageUpload} />
                                        </label>
                                    )}
                                </div>

                                <div className="dp-name-col">
                                    {isEditing ? (
                                        <>
                                            <input type="text" name="name" value={editForm.name} onChange={handleEditChange} placeholder="Nurse Name" className="dp-name-input" />
                                            <select name="department" value={editForm.department} onChange={handleEditChange} className="dp-select">
                                                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="admin-modal-title" style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>
                                                {selectedNurse.userId?.name || 'Nurse'}
                                            </h3>
                                            <p className="admin-modal-sub" style={{ color: '#ec4899', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: shiftColor(selectedNurse.shift), display: 'inline-block' }}></span>
                                                {selectedNurse.department} · {selectedNurse.shift} Shift
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button
                                className="admin-modal-close"
                                onClick={() => { setSelectedNurse(null); setIsEditing(false); }}
                                style={{ alignSelf: 'flex-start', marginLeft: '1rem' }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                            <div className="dp-section-label">
                                <h4>Staff Details</h4>
                                {!isEditing && (
                                    <button className="dp-edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                                )}
                            </div>

                            {/* Email + Gender */}
                            <div className="dp-info-card-row">
                                <div>
                                    <p className="dp-field-label">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        Email
                                    </p>
                                    <p className="dp-field-value">{selectedNurse.userId?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="dp-field-label">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Gender
                                    </p>
                                    {isEditing ? (
                                        <select name="gender" value={editForm.gender} onChange={handleEditChange} className="dp-select">
                                            <option value="">Not specified</option>
                                            <option value="Female">Female</option>
                                            <option value="Male">Male</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className="dp-field-value">{selectedNurse.gender || 'Not specified'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Shift + Experience */}
                            <div className="dp-info-grid">
                                <div className="dp-info-card">
                                    <p className="dp-field-label">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Shift
                                    </p>
                                    {isEditing ? (
                                        <select name="shift" value={editForm.shift} onChange={handleEditChange} className="dp-select">
                                            {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    ) : (
                                        <p className="dp-field-value" style={{ color: shiftColor(selectedNurse.shift) }}>
                                            {selectedNurse.shift} Shift
                                        </p>
                                    )}
                                </div>
                                <div className="dp-info-card">
                                    <p className="dp-field-label">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        Experience
                                    </p>
                                    {isEditing ? (
                                        <input type="number" name="experience" value={editForm.experience} onChange={handleEditChange} className="dp-field-input" />
                                    ) : (
                                        <p className="dp-field-value">{selectedNurse.experience || 0} Years</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing ? (
                                <div className="dp-action-row">
                                    <button className="dp-btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button className="dp-btn-save" onClick={handleUpdate} disabled={submitting}>
                                        {submitting ? 'Saving...' : '✓ Save Changes'}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div className="dp-available-strip" style={{ flex: 1 }}>
                                        <div className="dp-available-dot"></div>
                                        <p>On duty · Active staff</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selectedNurse._id)}
                                        style={{ padding: '0.75rem 1.1rem', borderRadius: 10, border: '1.5px solid #fecaca', background: '#fff', color: '#dc2626', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default NursesTeam;
