import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const DOCTOR_AVATARS = [
    'linear-gradient(135deg, #0891b2, #06b6d4)',
    'linear-gradient(135deg, #3b82f6, #60a5fa)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
];

const SPECIALIZATIONS = [
    'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician',
    'Orthopedic', 'Gynecologist', 'Ophthalmologist', 'Psychiatrist',
    'ENT Specialist', 'General Physician', 'Dentist', 'Surgeon',
    'Radiologist', 'Anesthesiologist', 'Pulmonologist', 'Gastroenterologist',
];

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    feesPerConsultation: '',
    profileImage: '',
    gender: ''
};

const DoctorsTeam = ({ doctors, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editProfileForm, setEditProfileForm] = useState({
        name: '', specialization: '', experience: '', feesPerConsultation: '', gender: '', profileImage: ''
    });
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const userRes = await axios.post(`${API_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: 'doctor123',
                phone: formData.phone,
                role: 'doctor',
            });

            await axios.post(`${API_URL}/doctors`, {
                userId: userRes.data._id,
                specialization: formData.specialization,
                experience: parseInt(formData.experience),
                feesPerConsultation: parseInt(formData.feesPerConsultation),
                profileImage: formData.profileImage,
                gender: formData.gender,
            });

            toast.success('Doctor added successfully!', {
                duration: 3000,
                icon: '🎉',
                style: {
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '16px 24px',
                    borderRadius: '12px',
                },
            });

            setShowModal(false);
            setFormData(EMPTY_FORM);
            onRefresh();
        } catch (error) {
            console.error('Error adding doctor:', error);
            toast.error(error.response?.data?.error || 'Failed to add doctor');
        }
        setSubmitting(false);
    };

    const handleAddImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenProfile = (doctor) => {
        setSelectedDoctor(doctor);
        setEditProfileForm({
            name: doctor.userId?.name || '',
            specialization: doctor.specialization || '',
            experience: doctor.experience || '',
            feesPerConsultation: doctor.feesPerConsultation || '',
            gender: doctor.gender || '',
            profileImage: doctor.profileImage || ''
        });
        setIsEditingProfile(false);
    };

    const handleProfileEditChange = (e) => {
        setEditProfileForm({ ...editProfileForm, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditProfileForm(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        setSubmitting(true);
        try {
            await axios.put(`${API_URL}/doctors/${selectedDoctor._id}`, {
                name: editProfileForm.name,
                specialization: editProfileForm.specialization,
                experience: parseInt(editProfileForm.experience),
                feesPerConsultation: parseInt(editProfileForm.feesPerConsultation),
                gender: editProfileForm.gender,
                profileImage: editProfileForm.profileImage
            });
            toast.success('Doctor profile updated successfully!');
            setSelectedDoctor(null);
            setIsEditingProfile(false);
            onRefresh();
        } catch (error) {
            console.error('Error updating doctor profile:', error);
            toast.error('Failed to update doctor profile');
        }
        setSubmitting(false);
    };

    return (
        <>
            {/* Doctors Grid */}
            <div className="admin-glass-card">
                <div className="admin-section-header">
                    <div>
                        <h3 className="admin-section-title">Medical Team</h3>
                        <p className="admin-section-sub">Manage doctor profiles and credentials</p>
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
                        <FaPlus /> Add Doctor
                    </button>
                </div>

                <div className="admin-doctors-grid">
                    {doctors.map((doctor, i) => (
                        <div key={doctor._id} className="admin-doctor-card">
                            {doctor.profileImage ? (
                                <img
                                    src={doctor.profileImage}
                                    alt={doctor.userId?.name}
                                    className="admin-doctor-avatar"
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div
                                    className="admin-doctor-avatar"
                                    style={{ background: DOCTOR_AVATARS[i % DOCTOR_AVATARS.length] }}
                                >
                                    {doctor.userId?.name?.[0] || 'D'}
                                </div>
                            )}
                            <h4 className="admin-doctor-name">
                                {doctor.userId?.name || 'Doctor Name'}
                            </h4>
                            <p className="admin-doctor-spec">{doctor.specialization}</p>
                            <p className="admin-doctor-exp">{doctor.experience} years experience</p>
                            <div className="admin-doctor-footer">
                                <span className="admin-doctor-fee">
                                    ₹{doctor.feesPerConsultation || 50}
                                </span>
                                <button className="admin-btn-ghost" onClick={() => handleOpenProfile(doctor)}>View Profile →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Doctor Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <div>
                                <h3 className="admin-modal-title">Add New Doctor</h3>
                                <p className="admin-modal-sub">Fill in the doctor's details below</p>
                            </div>
                            <button className="admin-modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form className="admin-form" onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className="dp-avatar-wrapper">
                                    {formData.profileImage ? (
                                        <img
                                            src={formData.profileImage}
                                            alt="Profile Preview"
                                            className="dp-avatar-img"
                                        />
                                    ) : (
                                        <div className="dp-avatar-initial" style={{ fontSize: '1.75rem' }}>D</div>
                                    )}
                                    <label className="dp-avatar-upload-btn">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAddImageUpload} />
                                    </label>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Dr. John Smith"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div>
                                    <label>Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@hospital.com" required />
                                </div>
                                <div>
                                    <label>Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div>
                                    <label>Specialization *</label>
                                    <select name="specialization" value={formData.specialization} onChange={handleChange} required style={{ cursor: 'pointer' }}>
                                        <option value="" disabled>Select a specialization</option>
                                        {SPECIALIZATIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} style={{ cursor: 'pointer' }}>
                                        <option value="">Not specified</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div>
                                    <label>Experience (years) *</label>
                                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="10" min="0" required />
                                </div>
                                <div>
                                    <label>Consultation Fee (₹) *</label>
                                    <input type="number" name="feesPerConsultation" value={formData.feesPerConsultation} onChange={handleChange} placeholder="50" min="0" required />
                                </div>
                            </div>

                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
                                    {submitting ? 'Adding...' : <><FaPlus /> Add Doctor</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Doctor Profile Modal */}
            {selectedDoctor && (
                <div
                    className="admin-modal-overlay"
                    onClick={() => {
                        setSelectedDoctor(null);
                        setIsEditingProfile(false);
                    }}
                >
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>

                        {/* ── Header: Avatar + Name + Close ── */}
                        <div className="admin-modal-header">
                            <div className="dp-profile-header">
                                <div className="dp-avatar-wrapper">
                                    {(isEditingProfile ? editProfileForm.profileImage : selectedDoctor.profileImage) ? (
                                        <img
                                            src={isEditingProfile ? editProfileForm.profileImage || selectedDoctor.profileImage : selectedDoctor.profileImage}
                                            alt="Profile"
                                            className="dp-avatar-img"
                                        />
                                    ) : (
                                        <div className="dp-avatar-initial">
                                            {selectedDoctor.userId?.name?.[0]?.toUpperCase() || 'D'}
                                        </div>
                                    )}
                                    {isEditingProfile && (
                                        <label className="dp-avatar-upload-btn">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>

                                <div className="dp-name-col">
                                    {isEditingProfile ? (
                                        <>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editProfileForm.name}
                                                onChange={handleProfileEditChange}
                                                placeholder="Doctor Name"
                                                className="dp-name-input"
                                            />
                                            <select
                                                name="specialization"
                                                value={editProfileForm.specialization}
                                                onChange={handleProfileEditChange}
                                                className="dp-select"
                                            >
                                                {SPECIALIZATIONS.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="admin-modal-title" style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>
                                                {selectedDoctor.userId?.name || 'Doctor Name'}
                                            </h3>
                                            <p className="admin-modal-sub" style={{ color: '#0891b2', fontWeight: 600 }}>
                                                {selectedDoctor.specialization}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button
                                className="admin-modal-close"
                                onClick={() => { setSelectedDoctor(null); setIsEditingProfile(false); }}
                                style={{ alignSelf: 'flex-start', marginLeft: '1rem' }}
                            >
                                ×
                            </button>
                        </div>

                        {/* ── Body: Profile Details ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                            <div className="dp-section-label">
                                <h4>Profile Details</h4>
                                {!isEditingProfile && (
                                    <button className="dp-edit-btn" onClick={() => setIsEditingProfile(true)}>
                                        ✏️ Edit Profile
                                    </button>
                                )}
                            </div>

                            {/* Email + Gender row */}
                            <div className="dp-info-card-row">
                                <div>
                                    <p className="dp-field-label">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        Email
                                    </p>
                                    <p className="dp-field-value">{selectedDoctor.userId?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="dp-field-label">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Gender
                                    </p>
                                    {isEditingProfile ? (
                                        <select name="gender" value={editProfileForm.gender} onChange={handleProfileEditChange} className="dp-select">
                                            <option value="">Not specified</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className="dp-field-value">{selectedDoctor.gender || 'Not specified'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Experience + Fee grid */}
                            <div className="dp-info-grid">
                                <div className="dp-info-card">
                                    <p className="dp-field-label">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        Experience
                                    </p>
                                    {isEditingProfile ? (
                                        <input type="number" name="experience" value={editProfileForm.experience} onChange={handleProfileEditChange} className="dp-field-input" />
                                    ) : (
                                        <p className="dp-field-value">{selectedDoctor.experience} Years</p>
                                    )}
                                </div>
                                <div className="dp-info-card">
                                    <p className="dp-field-label">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Consultation Fee
                                    </p>
                                    {isEditingProfile ? (
                                        <input type="number" name="feesPerConsultation" value={editProfileForm.feesPerConsultation} onChange={handleProfileEditChange} className="dp-field-input accent-input" />
                                    ) : (
                                        <p className="dp-field-value accent">₹{selectedDoctor.feesPerConsultation}</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditingProfile ? (
                                <div className="dp-action-row">
                                    <button className="dp-btn-cancel" onClick={() => setIsEditingProfile(false)}>
                                        Cancel
                                    </button>
                                    <button className="dp-btn-save" onClick={handleUpdateProfile} disabled={submitting}>
                                        {submitting ? 'Saving...' : '✓ Save Changes'}
                                    </button>
                                </div>
                            ) : (
                                <div className="dp-available-strip">
                                    <div className="dp-available-dot"></div>
                                    <p>Currently available for appointments</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default DoctorsTeam;
