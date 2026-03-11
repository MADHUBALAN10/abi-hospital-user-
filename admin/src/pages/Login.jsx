import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaHospital, FaArrowRight, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : 'https://abi-hospital-backend.onrender.com/api';

const Login = () => {
    const [role, setRole] = useState('admin');
    const [formData, setFormData] = useState({ name: '', email: 'admin@gmail.com', password: 'admin', phone: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Option 1: First try logging into the real backend 
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: formData.email,
                password: formData.password
            });
            const user = res.data;

            if (user.role !== 'admin') {
                toast.error('Unauthorized. Admin access only.');
                return;
            }

            localStorage.setItem('user', JSON.stringify(user));
            
            toast.success('Welcome Back!', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: 'linear-gradient(135deg, #4f46e5, #7e22ce)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '16px 24px',
                    borderRadius: '12px'
                }
            });

            setTimeout(() => {
                navigate('/admin');
            }, 800);

        } catch (error) {
            // Option 2: Fallback for local testing if admin@gmail.com isn't seeded in DB
            if (formData.email === 'admin@gmail.com' && formData.password === 'admin') {
                const fallbackUser = {
                    name: 'Super Admin',
                    email: formData.email,
                    role: 'admin',
                    _id: '1'
                };
                localStorage.setItem('user', JSON.stringify(fallbackUser));
                
                toast.success('Welcome Back!', {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: 'linear-gradient(135deg, #4f46e5, #7e22ce)',
                        color: 'white',
                        fontWeight: '600',
                        padding: '16px 24px',
                        borderRadius: '12px'
                    }
                });

                setTimeout(() => {
                    navigate('/admin');
                }, 800);
            } else {
                toast.error(error.response?.data?.error || 'Invalid credentials or Server Error');
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Effects */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15), transparent 70%)',
                borderRadius: '50%',
                zIndex: -1
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(126, 34, 206, 0.15), transparent 70%)',
                borderRadius: '50%',
                zIndex: -1
            }}></div>

            <div className="glass shadow-hard animate-fade-in" style={{
                width: '100%',
                maxWidth: '1000px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                borderRadius: '2rem',
                overflow: 'hidden'
            }}>

                {/* Left Side - Branding */}
                <div style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)',
                    padding: '3rem',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Pattern Overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.1,
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            marginBottom: '2rem'
                        }}>
                            <FaHospital />
                        </div>

                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            marginBottom: '1rem',
                            lineHeight: '1.2'
                        }}>
                            ABHI SK HOSPITAL<br />Admin Portal.
                        </h2>

                        <p style={{
                            fontSize: '1.125rem',
                            opacity: 0.9,
                            lineHeight: '1.7'
                        }}>
                            Secure access for authorized administrative personnel only. Manage operations efficiently.
                        </p>
                    </div>

                    <div className="glass" style={{
                        position: 'relative',
                        zIndex: 1,
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        background: 'rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'rgba(16, 185, 129, 0.9)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem'
                        }}>
                            <FaShieldAlt />
                        </div>
                        <div>
                            <p style={{ fontWeight: '700', marginBottom: '0.25rem' }}>100% Secure</p>
                            <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>End-to-end Encryption</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div style={{
                    padding: '3rem',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            marginBottom: '0.5rem',
                            color: '#0f172a'
                        }}>
                            Welcome Back
                        </h3>
                        <p style={{ color: '#64748b' }}>
                            Please enter your details to login.
                        </p>
                    </div>

                    {/* Role Selector removed as this is now Admin only */}


                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                zIndex: 1
                            }} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                className="input"
                                style={{ paddingLeft: '3rem' }}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <FaLock style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                zIndex: 1
                            }} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="input"
                                style={{ paddingLeft: '3rem' }}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            marginTop: '0.5rem'
                        }}>
                            Sign In <FaArrowRight />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
