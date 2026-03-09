import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    FaHeartbeat, FaUserMd, FaArrowRight, FaShieldAlt, FaBolt,
    FaClock, FaStar, FaChevronLeft, FaChevronRight, FaTrophy,
    FaMedal, FaCertificate, FaAward, FaQuoteLeft
} from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const COLORS   = ['#0891b2','#8b5cf6','#10b981','#f59e0b','#ec4899','#3b82f6'];

/* ── Demo awards pool ── */
const AWARDS_POOL = [
    ['Best Cardiologist 2023', 'AIIMS Excellence Award', '15+ Research Papers'],
    ['Derm Excellence 2022', 'Gold Medalist MBBS', 'WHO Certified'],
    ['Paediatric Star Award', 'Best Doctor – Apollo', 'IAP Fellowship'],
    ['Neuroscience Award', 'NIMHANS Outstanding', '20+ Publications'],
    ['Ortho Innovator 2023', 'Limca Book Record', 'Min. of Health Award'],
    ['Gynaec of the Year', 'FIGO Fellowship', 'State Govt Recognition'],
    ['Eye Care Champion', 'AIOC Gold Medal', '10K+ Surgeries'],
    ['Mental Health Pioneer', 'WHO Mental Health Award', 'TED Speaker'],
];

const DEMO_DOCTORS = [
    { name:'Dr. Arun Kumar',  specialty:'Cardiologist',    experience:14, fee:800, avatar:'AK', color:'#0891b2', awards:AWARDS_POOL[0], patients:1240, rating:4.9 },
    { name:'Dr. Priya Sharma',specialty:'Dermatologist',   experience:9,  fee:600, avatar:'PS', color:'#8b5cf6', awards:AWARDS_POOL[1], patients:980,  rating:4.8 },
    { name:'Dr. Ravi Menon',  specialty:'Neurologist',     experience:17, fee:950, avatar:'RM', color:'#10b981', awards:AWARDS_POOL[3], patients:1560, rating:4.9 },
    { name:'Dr. Sneha Pillai',specialty:'Paediatrician',   experience:11, fee:700, avatar:'SP', color:'#f59e0b', awards:AWARDS_POOL[2], patients:2100, rating:5.0 },
    { name:'Dr. Kiran Raj',   specialty:'Orthopaedic',     experience:13, fee:850, avatar:'KR', color:'#ec4899', awards:AWARDS_POOL[4], patients:890,  rating:4.7 },
    { name:'Dr. Anita Iyer',  specialty:'Gynaecologist',   experience:16, fee:780, avatar:'AI', color:'#3b82f6', awards:AWARDS_POOL[5], patients:3200, rating:4.9 },
];

/* ── Inline styles sheet ── */
const SliderStyle = () => (
    <style>{`
        .ds-section { padding: 5rem 0; background: linear-gradient(160deg, #f0f9ff 0%, #faf5ff 100%); overflow: hidden; }
        .ds-label   { display:inline-flex; align-items:center; gap:.4rem; background:#e0f2fe; color:#0891b2; padding:5px 14px; border-radius:20px; font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; margin-bottom:1rem; }
        .ds-heading { font-size:2.25rem; font-weight:800; color:#0f172a; margin-bottom:.5rem; }
        .ds-subtext { color:#64748b; font-size:1.0625rem; max-width:520px; margin:0 auto 3rem; }
        .ds-viewport { overflow:hidden; position:relative; }
        .ds-track    { display:flex; transition:transform .45s cubic-bezier(.25,.8,.25,1); will-change:transform; }

        .ds-card {
            flex-shrink:0;
            background:white;
            border-radius:24px;
            overflow:hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,.06);
            border:1.5px solid #e2e8f0;
            transition:box-shadow .25s, transform .25s;
            cursor:pointer;
        }
        .ds-card:hover { box-shadow:0 16px 48px rgba(0,0,0,.12); transform:translateY(-4px); }

        .ds-card-top { height:10px; }
        .ds-photo-ring {
            width:100px; height:100px; border-radius:50%;
            overflow:hidden; border:4px solid white;
            box-shadow:0 4px 16px rgba(0,0,0,.12);
            margin:-50px auto 0;
            position:relative;
        }
        .ds-photo-ring img { width:100%; height:100%; object-fit:cover; }
        .ds-avatar {
            width:100%; height:100%;
            display:flex; align-items:center; justify-content:center;
            font-size:2rem; font-weight:800; color:white;
        }
        .ds-body { padding:1rem 1.5rem 1.5rem; text-align:center; }
        .ds-name  { font-size:1.1rem; font-weight:800; color:#0f172a; margin:.75rem 0 .2rem; }
        .ds-spec  { font-size:.82rem; font-weight:700; padding:3px 12px; border-radius:20px; display:inline-block; margin-bottom:.9rem; }
        .ds-stats { display:flex; justify-content:center; gap:1.25rem; margin-bottom:1rem; }
        .ds-stat  { text-align:center; }
        .ds-stat-val { font-size:1.1rem; font-weight:800; color:#0f172a; }
        .ds-stat-lbl { font-size:.68rem; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
        .ds-divider  { height:1px; background:#f1f5f9; margin:.75rem 0; }
        .ds-awards   { display:flex; flex-direction:column; gap:.4rem; }
        .ds-award-row{ display:flex; align-items:center; gap:.5rem; font-size:.78rem; color:#475569; font-weight:600; }
        .ds-fee-bar  { display:flex; justify-content:space-between; align-items:center; margin-top:.9rem; padding:.7rem 1rem; background:#f8fafc; border-radius:12px; }
        .ds-fee-lbl  { font-size:.75rem; color:#94a3b8; font-weight:700; text-transform:uppercase; }
        .ds-fee-val  { font-size:1.125rem; font-weight:900; }
        .ds-book-btn { margin-top:.8rem; width:100%; padding:.6rem; border:none; border-radius:10px; font-weight:700; font-size:.875rem; cursor:pointer; color:white; transition:opacity .2s; }
        .ds-book-btn:hover { opacity:.88; }

        .ds-arrow {
            position:absolute; top:50%; transform:translateY(-50%);
            width:44px; height:44px; border-radius:50%;
            background:white; border:2px solid #e2e8f0;
            box-shadow:0 4px 14px rgba(0,0,0,.1);
            display:flex; align-items:center; justify-content:center;
            cursor:pointer; transition:all .2s; z-index:10; color:#0f172a;
        }
        .ds-arrow:hover { background:#0891b2; color:white; border-color:#0891b2; }
        .ds-arrow-left  { left:-22px; }
        .ds-arrow-right { right:-22px; }

        .ds-dots { display:flex; justify-content:center; gap:.5rem; margin-top:2rem; }
        .ds-dot  { width:8px; height:8px; border-radius:4px; background:#e2e8f0; border:none; cursor:pointer; transition:all .3s; padding:0; }
        .ds-dot.active { width:28px; background:#0891b2; }

        .ds-rating { display:flex; justify-content:center; align-items:center; gap:.25rem; margin-bottom:.5rem; }

        @media (max-width:900px) { .ds-heading{font-size:1.75rem;} }
    `}</style>
);

const AWARD_ICONS = [FaTrophy, FaMedal, FaCertificate, FaAward];
const AWARD_COLORS = ['#f59e0b','#8b5cf6','#0891b2','#10b981'];

/* ── Single doctor card ── */
const DocSlideCard = ({ doc, width }) => {
    const Icon0 = AWARD_ICONS[0];
    const Icon1 = AWARD_ICONS[1];
    const Icon2 = AWARD_ICONS[2];
    const awards = doc.awards || AWARDS_POOL[0];

    return (
        <div className="ds-card" style={{ width, margin: '0 0.75rem' }}>
            {/* Coloured top bar */}
            <div className="ds-card-top" style={{ background: `linear-gradient(90deg, ${doc.color}, ${doc.color}bb)` }} />

            {/* Photo */}
            <div className="ds-photo-ring">
                {doc.profileImage ? (
                    <img src={doc.profileImage} alt={doc.name} />
                ) : (
                    <div className="ds-avatar" style={{ background: `linear-gradient(135deg, ${doc.color}, ${doc.color}bb)` }}>
                        {doc.avatar}
                    </div>
                )}
            </div>

            <div className="ds-body">
                {/* Rating */}
                <div className="ds-rating">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={12} color={i < Math.floor(doc.rating) ? '#f59e0b' : '#e2e8f0'} />
                    ))}
                    <span style={{ fontSize: '.75rem', fontWeight: '700', color: '#64748b', marginLeft: '4px' }}>
                        {doc.rating?.toFixed(1)}
                    </span>
                </div>

                <p className="ds-name">{doc.name}</p>
                <span className="ds-spec" style={{ background: `${doc.color}18`, color: doc.color }}>
                    {doc.specialty}
                </span>

                {/* Stats row */}
                <div className="ds-stats">
                    <div className="ds-stat">
                        <div className="ds-stat-val">{doc.experience}+</div>
                        <div className="ds-stat-lbl">Years Exp.</div>
                    </div>
                    <div style={{ width: '1px', background: '#e2e8f0' }} />
                    <div className="ds-stat">
                        <div className="ds-stat-val">{doc.patients?.toLocaleString('en-IN')}</div>
                        <div className="ds-stat-lbl">Patients</div>
                    </div>
                </div>

                <div className="ds-divider" />

                {/* Awards */}
                <div className="ds-awards">
                    {awards.slice(0, 3).map((award, i) => {
                        const AwardIcon = AWARD_ICONS[i % AWARD_ICONS.length];
                        const aColor    = AWARD_COLORS[i % AWARD_COLORS.length];
                        return (
                            <div className="ds-award-row" key={i}>
                                <div style={{ width: 22, height: 22, borderRadius: 6, background: `${aColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <AwardIcon size={11} color={aColor} />
                                </div>
                                {award}
                            </div>
                        );
                    })}
                </div>

                {/* Fee */}
                <div className="ds-fee-bar">
                    <div>
                        <div className="ds-fee-lbl">Consultation Fee</div>
                        <div className="ds-fee-val" style={{ color: doc.color }}>
                            ₹{doc.fee?.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8', fontWeight: '600' }}>Per Visit</div>
                </div>

                {/* Book button */}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button className="ds-book-btn" style={{ background: `linear-gradient(135deg, ${doc.color}, ${doc.color}cc)` }}>
                        Book Appointment →
                    </button>
                </Link>
            </div>
        </div>
    );
};

/* ── Main Slider ── */
const DoctorSlider = ({ doctors }) => {
    const [index, setIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);
    const [cardWidth, setCardWidth] = useState(280);
    const timerRef = useRef(null);
    const wrapRef  = useRef(null);

    const docs = doctors.length >= 3 ? doctors : [...doctors, ...DEMO_DOCTORS].slice(0, Math.max(doctors.length, 6));
    const total = docs.length;

    const updateLayout = useCallback(() => {
        const w = wrapRef.current?.offsetWidth || 900;
        const count = w < 600 ? 1 : w < 900 ? 2 : 3;
        setVisibleCount(count);
        setCardWidth(Math.floor((w - count * 24 - 48) / count));
    }, []);

    useEffect(() => {
        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [updateLayout]);

    const maxIndex = Math.max(0, total - visibleCount);

    const next = useCallback(() => setIndex(i => (i >= maxIndex ? 0 : i + 1)), [maxIndex]);
    const prev = useCallback(() => setIndex(i => (i <= 0 ? maxIndex : i - 1)), [maxIndex]);

    // Auto-play
    useEffect(() => {
        timerRef.current = setInterval(next, 3500);
        return () => clearInterval(timerRef.current);
    }, [next]);

    const pause = () => clearInterval(timerRef.current);
    const resume = () => { timerRef.current = setInterval(next, 3500); };

    const translateX = -(index * (cardWidth + 24));

    return (
        <div ref={wrapRef} style={{ position: 'relative', padding: '0 32px' }}
            onMouseEnter={pause} onMouseLeave={resume}>

            {/* Left arrow */}
            <button className="ds-arrow ds-arrow-left" onClick={prev} aria-label="Previous">
                <FaChevronLeft size={16} />
            </button>

            {/* Slider viewport */}
            <div className="ds-viewport">
                <div className="ds-track" style={{ transform: `translateX(${translateX}px)` }}>
                    {docs.map((doc, i) => (
                        <DocSlideCard key={i} doc={doc} width={cardWidth} />
                    ))}
                </div>
            </div>

            {/* Right arrow */}
            <button className="ds-arrow ds-arrow-right" onClick={next} aria-label="Next">
                <FaChevronRight size={16} />
            </button>

            {/* Dots */}
            <div className="ds-dots">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                        key={i}
                        className={`ds-dot ${i === index ? 'active' : ''}`}
                        onClick={() => setIndex(i)}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

/* ── Patient Reviews Component ── */
const REVIEWS_DATA = [
    { name: "Rahul Sharma", doctor: "Dr. Arun Kumar", rating: 5, text: "Dr. Arun is brilliant! Had an emergency heart complication and his prompt consultation over Medicare+ saved a lot of trouble. The hospital staff handled everything smoothly.", av: "R", color: "#0891b2" },
    { name: "Sita Menon", doctor: "Dr. Priya Sharma", rating: 5, text: "Dr. Priya was so patient. Listened to all my skin concerns and provided a routine that solved my acne issues. Highly recommend visiting her at this hospital.", av: "S", color: "#8b5cf6" },
    { name: "Vikram S.", doctor: "Dr. Ravi Menon", rating: 5, text: "Superb experience booking a neuro consultation. Dr. Ravi assessed the reports meticulously. Very happy with the care given by the nursing team.", av: "V", color: "#10b981" },
];

const ReviewSlider = () => {
    return (
        <section style={{ padding: '5rem 0', background: 'white', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="ds-label" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <FaStar style={{ marginBottom: 2 }} /> Patient Reviews
                    </div>
                    <h2 className="ds-heading">What Our Patients Say</h2>
                    <p className="ds-subtext">Real success stories from patients who consulted our top doctors.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {REVIEWS_DATA.map((rev, i) => (
                        <div key={i} className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative', border: '1.5px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                            <FaQuoteLeft size={40} color="#f8fafc" style={{ position: 'absolute', top: 20, left: 20, zIndex: 0 }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', gap: '2px', marginBottom: '1.2rem' }}>
                                    {[...Array(5)].map((_, idx) => (
                                        <FaStar key={idx} size={15} color={idx < Math.floor(rev.rating) ? '#f59e0b' : '#e2e8f0'} />
                                    ))}
                                </div>
                                <p style={{ fontSize: '1.0625rem', color: '#334155', lineHeight: 1.8, marginBottom: '2rem', fontStyle: 'italic' }}>
                                    "{rev.text}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '2px solid #f8fafc', paddingTop: '1.5rem' }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${rev.color}, ${rev.color}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.3rem', flexShrink: 0, boxShadow: `0 4px 12px ${rev.color}40` }}>
                                        {rev.av}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', marginBottom: 2 }}>{rev.name}</p>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Consulted: <span style={{ color: rev.color }}>{rev.doctor}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ══════════════════════════════════════
   HOME PAGE
══════════════════════════════════════ */
const Home = () => {
    const [scrollY, setScrollY] = useState(0);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fn = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/doctors`)
            .then(res => {
                const mapped = res.data.map((doc, i) => ({
                    name:         'Dr. ' + (doc.userId?.name || 'Doctor'),
                    specialty:    doc.specialization || 'Specialist',
                    experience:   doc.experience     || 5,
                    fee:          doc.feesPerConsultation || 500,
                    rating:       4.5 + (i % 5) * 0.1,
                    patients:     200 + i * 120,
                    avatar:       (doc.userId?.name?.[0] || 'D') + (doc.userId?.name?.split(' ')[1]?.[0] || ''),
                    color:        COLORS[i % COLORS.length],
                    profileImage: doc.profileImage || null,
                    awards:       AWARDS_POOL[i % AWARDS_POOL.length],
                }));
                setDoctors(mapped);
            })
            .catch(() => setDoctors(DEMO_DOCTORS));
    }, []);

    return (
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
            <SliderStyle />

            {/* ── Navbar ── */}
            <nav className="navbar">
                <div className="navbar-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                        <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#0891b2,#3b82f6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 14px rgba(8,145,178,.3)' }}>
                            <FaHeartbeat />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
                            Medi<span style={{ color: '#0891b2' }}>Care+</span>
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '8px 18px 8px 8px',
                                border: '2px solid #0891b2',
                                borderRadius: '50px',
                                color: '#0891b2',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: 'white',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background='#0891b2'; e.currentTarget.style.color='white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.color='#0891b2'; }}
                            >
                                {/* Patient avatar circle */}
                                <div style={{
                                    width: 30, height: 30, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '1rem', flexShrink: 0,
                                }}>
                                    <FaUserMd size={14} />
                                </div>
                                Patient Login
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="section" style={{ paddingTop: '6rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center' }}>
                        <div className="animate-fade-in" style={{ maxWidth: 600 }}>
                            <div className="badge badge-primary" style={{ marginBottom: '2rem' }}>
                                <span style={{ width: 8, height: 8, background: '#0891b2', borderRadius: '50%', animation: 'pulse-subtle 2s infinite' }} />
                                #1 Trusted Healthcare Platform in India
                            </div>
                            <h1 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>
                                Healthcare <br /><span className="text-gradient">Reimagined.</span>
                            </h1>
                            <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: 540, lineHeight: 1.8 }}>
                                Book top specialists, manage prescriptions, and track your wellness journey—all in one premium portal.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
                                <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                                    Book Appointment
                                </Link>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,.1)' }}>
                                <StatBox value="500+" label="Expert Doctors" />
                                <StatBox value="24/7" label="Instant Support" />
                                <StatBox value="100%" label="Patient Satisfaction" />
                            </div>
                        </div>

                        <div className="animate-fade-in" style={{ position: 'relative', animationDelay: '.2s' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(8,145,178,.15),transparent 70%)', borderRadius: '50%', zIndex: -1 }} />
                            <div className="glass-card shadow-hard animate-float" style={{ padding: '1rem', borderRadius: '2rem', transform: `rotate(${scrollY * 0.02}deg)`, transition: 'transform .1s ease-out' }}>
                                <img src="https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21199.jpg" alt="Doctors Team" style={{ width: '100%', height: 'auto', borderRadius: '1.5rem', display: 'block' }} />
                                <div className="glass" style={{ position: 'absolute', bottom: -20, left: -20, padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '.75rem', animation: 'float 3s ease-in-out infinite' }}>
                                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}><FaShieldAlt /></div>
                                    <div>
                                        <p style={{ fontSize: '.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Verified</p>
                                        <p style={{ fontWeight: 700, color: '#0f172a' }}>100% Secure</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ DOCTOR SLIDER SECTION ══ */}
            <section className="ds-section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '0' }}>
                        <div className="ds-label"><FaUserMd /> Our Specialists</div>
                        <h2 className="ds-heading">Meet Our Expert Doctors</h2>
                        <p className="ds-subtext">
                            Consult with India's top-rated specialists. View their experience, awards & book instantly.
                        </p>
                    </div>

                    <DoctorSlider doctors={doctors.length > 0 ? doctors : DEMO_DOCTORS} />

                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Link to="/login" className="btn btn-primary" style={{ padding: '.875rem 2rem', fontSize: '1rem' }}>
                            View All Doctors <FaArrowRight style={{ fontSize: '.875rem' }} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Reviews ── */}
            <ReviewSlider />

            {/* ── Features ── */}
            <section className="section" style={{ background: 'rgba(255,255,255,.4)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 4rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Why Choose MediCare+?</h2>
                        <p style={{ fontSize: '1.125rem' }}>Advanced technology meets compassionate care.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2rem' }}>
                        <FeatureCard icon={<FaUserMd />} title="Expert Specialists"   description="500+ verified specialists with top ratings and years of experience." color="#0891b2" />
                        <FeatureCard icon={<FaClock />}  title="Instant Booking"      description="Book in under 2 minutes. Real-time slots, zero waiting." color="#3b82f6" />
                        <FeatureCard icon={<FaBolt />}   title="Advanced Care"        description="State-of-the-art facilities and equipment for your safety." color="#8b5cf6" />
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="section">
                <div className="container">
                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(135deg,rgba(8,145,178,.1),rgba(59,130,246,.1))', maxWidth: 900, margin: '0 auto' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Ready to Experience Better Healthcare?</h2>
                        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem' }}>
                            Join thousands of patients across India who trust MediCare+.
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
        <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '.25rem' }}>{value}</h3>
        <p style={{ fontSize: '.875rem', color: '#64748b', fontWeight: 500 }}>{label}</p>
    </div>
);

const FeatureCard = ({ icon, title, description, color }) => (
    <div className="glass-card">
        <div style={{ width: 64, height: 64, background: `linear-gradient(135deg,${color},${color}dd)`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.75rem', marginBottom: '1.5rem', boxShadow: `0 4px 14px ${color}40` }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '.75rem', color: '#0f172a' }}>{title}</h3>
        <p style={{ lineHeight: 1.7, color: '#475569' }}>{description}</p>
    </div>
);

export default Home;
