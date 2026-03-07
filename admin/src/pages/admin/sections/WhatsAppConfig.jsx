import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppConfig = () => (
    <div className="admin-glass-card">
        <div className="admin-whatsapp-center">
            <div className="admin-wa-icon">
                <FaWhatsapp />
            </div>

            <h3 className="admin-wa-title">WhatsApp Reminder Bot</h3>
            <p className="admin-wa-desc">
                Automate appointment reminders via WhatsApp. Patients receive notifications
                24 hours before their scheduled time.
            </p>

            <div className="admin-wa-preview">
                <p className="admin-wa-preview-label">Message Preview</p>
                <p className="admin-wa-preview-text">
                    "Hello! This is a reminder for your appointment with{' '}
                    <strong>Dr. Smith</strong> tomorrow at <strong>10:00 AM</strong> at
                    MediCare+. See you then! 🏥"
                </p>
            </div>

            <div className="admin-wa-actions">
                <button
                    className="admin-btn admin-btn-primary"
                    style={{
                        background: 'linear-gradient(135deg, #25d366, #128c7e)',
                        boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                    }}
                >
                    Activate Bot
                </button>
                <button className="admin-btn admin-btn-secondary">
                    Edit Templates
                </button>
            </div>
        </div>
    </div>
);

export default WhatsAppConfig;
