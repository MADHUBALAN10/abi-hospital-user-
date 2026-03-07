import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaUserMd, FaCalendarCheck, FaArrowRight, FaStethoscope, FaShieldAlt, FaBolt, FaClock } from 'react-icons/fa';

const Home = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>

            {/* Navigation */}
            <nav className="navbar">
                <div className="navbar-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #0891b2, #3b82f6)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem',
                            boxShadow: '0 4px 14px rgba(8, 145, 178, 0.3)'
                        }}>
                            <FaHeartbeat />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>
                            Medi<span style={{ color: '#0891b2' }}>Care+</span>
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/login" className="btn-ghost" style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline-flex' } }}>
                            Sign In
                        </Link>
                        <Link to="/login?mode=register" className="btn btn-primary">
                            Book Appointment <FaArrowRight style={{ fontSize: '0.875rem' }} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="section" style={{ paddingTop: '6rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

                        {/* Left Content */}
                        <div className="animate-fade-in" style={{ maxWidth: '600px' }}>
                            <div className="badge badge-primary" style={{ marginBottom: '2rem' }}>
                                <span style={{
                                    width: '8px',
                                    height: '8px',
                                    background: '#0891b2',
                                    borderRadius: '50%',
                                    animation: 'pulse-subtle 2s infinite'
                                }}></span>
                                #1 Trusted Healthcare Platform
                            </div>

                            <h1 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>
                                Healthcare <br />
                                <span className="text-gradient">Reimagined.</span>
                            </h1>

                            <p style={{
                                fontSize: '1.25rem',
                                marginBottom: '2rem',
                                maxWidth: '540px',
                                lineHeight: '1.8'
                            }}>
                                Experience the crystal-clear difference. Book top specialists, manage prescriptions,
                                and track your wellness journey in our next-gen portal.
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
                                <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                                    Get Started Now
                                </Link>
                                <button className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                                    Watch Demo
                                </button>
                            </div>

                            {/* Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '2rem',
                                paddingTop: '2rem',
                                borderTop: '1px solid rgba(0,0,0,0.1)'
                            }}>
                                <StatBox value="500+" label="Expert Doctors" />
                                <StatBox value="24/7" label="Instant Support" />
                                <StatBox value="100%" label="Patient Satisfaction" />
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="animate-fade-in" style={{ position: 'relative', animationDelay: '0.2s' }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '500px',
                                height: '500px',
                                background: 'radial-gradient(circle, rgba(8, 145, 178, 0.15), transparent 70%)',
                                borderRadius: '50%',
                                zIndex: -1
                            }}></div>

                            <div className="glass-card shadow-hard animate-float" style={{
                                padding: '1rem',
                                borderRadius: '2rem',
                                transform: `rotate(${scrollY * 0.02}deg)`,
                                transition: 'transform 0.1s ease-out'
                            }}>
                                <img
                                    src="https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21199.jpg"
                                    alt="Doctors Team"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '1.5rem',
                                        display: 'block'
                                    }}
                                />

                                {/* Floating Badge */}
                                <div className="glass" style={{
                                    position: 'absolute',
                                    bottom: '-20px',
                                    left: '-20px',
                                    padding: '1rem',
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    animation: 'float 3s ease-in-out infinite'
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.25rem'
                                    }}>
                                        <FaShieldAlt />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                                            Verified
                                        </p>
                                        <p style={{ fontWeight: '700', color: '#0f172a' }}>100% Secure</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section" style={{ background: 'rgba(255, 255, 255, 0.4)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Why Choose MediCare+?</h2>
                        <p style={{ fontSize: '1.125rem' }}>
                            We combine advanced technology with compassionate care to provide the best medical experience.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        <FeatureCard
                            icon={<FaUserMd />}
                            title="Expert Specialists"
                            description="Access to 500+ verified specialists in your area with top ratings and years of experience."
                            color="#0891b2"
                        />
                        <FeatureCard
                            icon={<FaClock />}
                            title="Instant Booking"
                            description="Book appointments in less than 2 minutes. Real-time availability, no waiting lines."
                            color="#3b82f6"
                        />
                        <FeatureCard
                            icon={<FaBolt />}
                            title="Advanced Care"
                            description="State of the art facilities and medical equipment for your safety and comfort."
                            color="#8b5cf6"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section">
                <div className="container">
                    <div className="glass-card" style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.1), rgba(59, 130, 246, 0.1))',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{ marginBottom: '1rem' }}>Ready to Experience Better Healthcare?</h2>
                        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                            Join thousands of patients who trust MediCare+ for their healthcare needs.
                        </p>
                        <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                            Get Started Today <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

const StatBox = ({ value, label }) => (
    <div>
        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
            {value}
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
            {label}
        </p>
    </div>
);

const FeatureCard = ({ icon, title, description, color }) => (
    <div className="glass-card">
        <div style={{
            width: '64px',
            height: '64px',
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.75rem',
            marginBottom: '1.5rem',
            boxShadow: `0 4px 14px ${color}40`
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#0f172a' }}>
            {title}
        </h3>
        <p style={{ lineHeight: '1.7', color: '#475569' }}>
            {description}
        </p>
    </div>
);

export default Home;
