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
};

const DoctorsTeam = ({ doctors, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
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
                            <div
                                className="admin-doctor-avatar"
                                style={{ background: DOCTOR_AVATARS[i % DOCTOR_AVATARS.length] }}
                            >
                                {doctor.userId?.name?.[0] || 'D'}
                            </div>
                            <h4 className="admin-doctor-name">
                                {doctor.userId?.name || 'Doctor Name'}
                            </h4>
                            <p className="admin-doctor-spec">{doctor.specialization}</p>
                            <p className="admin-doctor-exp">{doctor.experience} years experience</p>
                            <div className="admin-doctor-footer">
                                <span className="admin-doctor-fee">
                                    ₹{doctor.feesPerConsultation || 50}
                                </span>
                                <button className="admin-btn-ghost">View Profile →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Doctor Modal */}
            {showModal && (
                <div
                    className="admin-modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="admin-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal-header">
                            <div>
                                <h3 className="admin-modal-title">Add New Doctor</h3>
                                <p className="admin-modal-sub">Fill in the doctor's details below</p>
                            </div>
                            <button
                                className="admin-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-form" onSubmit={handleSubmit}>
                            <div>
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

                            <div className="admin-form-row">
                                <div>
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="doctor@hospital.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Specialization *</label>
                                <select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="" disabled>Select a specialization</option>
                                    {SPECIALIZATIONS.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-form-row">
                                <div>
                                    <label>Experience (years) *</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="10"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Consultation Fee (₹) *</label>
                                    <input
                                        type="number"
                                        name="feesPerConsultation"
                                        value={formData.feesPerConsultation}
                                        onChange={handleChange}
                                        placeholder="50"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-form-actions">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="admin-btn admin-btn-primary"
                                    style={{ opacity: submitting ? 0.7 : 1 }}
                                >
                                    {submitting ? 'Adding...' : <><FaPlus /> Add Doctor</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default DoctorsTeam;
