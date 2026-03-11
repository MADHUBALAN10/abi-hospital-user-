import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaHospital, FaArrowRight, FaEnvelope, FaShieldAlt, FaGoogle } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : 'https://abi-hospital-backend.onrender.com/api';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [role, setRole] = useState('patient');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.post(`${API_URL}/auth/google`, {
                    access_token: tokenResponse.access_token
                });
                const user = res.data;
                localStorage.setItem('user', JSON.stringify(user));
                setTimeout(() => {
                    if (user.role === 'doctor') {
                        navigate('/doctor');
                    } else if (user.role === 'admin') {
                        window.location.href = 'https://abi-hospital-admin.vercel.app/';
                    } else {
                        navigate('/patient');
                    }
                }, 800);
            } catch (error) {
                toast.error(error.response?.data?.error || 'Failed to authenticate with Google Server');
            }
        },
        onError: () => {
            toast.error('Google authorization popup failed or was closed.');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister && formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            const endpoint = isRegister
                ? `${API_URL}/auth/register`
                : `${API_URL}/auth/login`;

            const payload = isRegister
                ? { name: formData.name, email: formData.email, password: formData.password, role }
                : { email: formData.email, password: formData.password };

            const res = await axios.post(endpoint, payload);
            const user = res.data;

            localStorage.setItem('user', JSON.stringify(user));

            toast.success(isRegister ? 'Welcome to MediCare+!' : 'Welcome Back!', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: 'linear-gradient(135deg, #0891b2, #3b82f6)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '16px 24px',
                    borderRadius: '12px'
                }
            });

            setTimeout(() => {
                if (user.role === 'doctor') {
                    navigate('/doctor');
                } else if (user.role === 'admin') {
                    window.location.href = 'https://abi-hospital-admin.vercel.app/';
                } else {
                    navigate('/patient');
                }
            }, 800);

        } catch (error) {
            toast.error(error.response?.data?.error || 'Something went wrong');
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
                background: 'radial-gradient(circle, rgba(8, 145, 178, 0.15), transparent 70%)',
                borderRadius: '50%',
                zIndex: -1
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)',
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
                    background: 'linear-gradient(135deg, #0891b2 0%, #3b82f6 100%)',
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
                            Manage your health<br />with confidence.
                        </h2>

                        <p style={{
                            fontSize: '1.125rem',
                            opacity: 0.9,
                            lineHeight: '1.7'
                        }}>
                            Join thousands of patients and healthcare managers trusting our platform for seamless healthcare management.
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
                            {isRegister ? 'Get Started' : 'Welcome Back'}
                        </h3>
                        <p style={{ color: '#64748b' }}>
                            {isRegister ? 'Create your account in seconds.' : 'Please enter your details to login.'}
                        </p>
                    </div>

                    {/* Role Selector shown during Register */}
                    {isRegister && (
                        <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '0.5rem',
                            background: '#f1f5f9',
                            borderRadius: '12px',
                            marginBottom: '2rem'
                        }}>
                            {['patient', 'doctor'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        border: 'none',
                                        background: role === r ? 'white' : 'transparent',
                                        color: role === r ? '#0891b2' : '#64748b',
                                        fontWeight: role === r ? '700' : '500',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: role === r ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                                        textTransform: 'capitalize',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Google Sign-In Button */}
                    {!isRegister && (
                        <button
                            type="button"
                            onClick={() => handleGoogleLogin()}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'white',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                marginBottom: '1.5rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#0f172a',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0891b2'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                            <FaGoogle style={{ color: '#ea4335', fontSize: '1.25rem' }} />
                            Continue with Google
                        </button>
                    )}

                    {!isRegister && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {isRegister && (
                            <div style={{ position: 'relative' }}>
                                <FaUser style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#94a3b8',
                                    zIndex: 1
                                }} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    className="input"
                                    style={{ paddingLeft: '3rem' }}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

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
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {isRegister && (
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
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="input"
                                    style={{ paddingLeft: '3rem' }}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            marginTop: '0.5rem'
                        }}>
                            {isRegister ? 'Create Account' : 'Sign In'} <FaArrowRight />
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                type="button"
                                onClick={() => setIsRegister(!isRegister)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#0891b2',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                {isRegister ? 'Log in' : 'Register'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
