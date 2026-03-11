import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaHeartbeat, FaUserMd, FaArrowRight, FaShieldAlt, FaBolt,
    FaClock, FaStar, FaChevronLeft, FaChevronRight, FaTrophy,
    FaMedal, FaCertificate, FaAward, FaQuoteLeft, FaWhatsapp, FaCheckSquare, FaBars, FaTimes
} from 'react-icons/fa';
import axios from 'axios';
import heroBgVideo from '../assets/Abhi_sk_hospital_gobi_720P.mp4';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : 'https://abi-hospital-backend.onrender.com/api';
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
        .ds-section { padding: 5rem 0 5rem; padding-top: 3rem; background: linear-gradient(160deg, #f0f9ff 0%, #faf5ff 100%); overflow: visible; }
        .ds-label   { display:inline-flex; align-items:center; gap:.4rem; background:#e0f2fe; color:#0891b2; padding:5px 14px; border-radius:20px; font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; margin-bottom:1rem; }
        .ds-heading { font-size:2.25rem; font-weight:800; color:#0f172a; margin-bottom:.5rem; }
        .ds-subtext { color:#64748b; font-size:1.0625rem; max-width:520px; margin:0 auto 3rem; }
        .ds-viewport { overflow:hidden; position:relative; }
        .ds-track    { display:flex; transition:transform .45s cubic-bezier(.25,.8,.25,1); will-change:transform; }

        .ds-card {
            flex-shrink:0;
            background:white;
            border-radius:24px;
            overflow:visible;
            box-shadow: 0 4px 24px rgba(0,0,0,.08);
            border:1.5px solid #e2e8f0;
            transition:box-shadow .25s, transform .25s;
            cursor:pointer;
            display:flex;
            flex-direction:column;
        }
        .ds-card:hover { box-shadow:0 18px 50px rgba(0,0,0,.14); transform:translateY(-6px); }

        .ds-card-top { height:90px; border-radius:24px 24px 0 0; flex-shrink:0; }
        .ds-photo-ring {
            width:110px; height:110px; border-radius:50%;
            overflow:hidden; border:4px solid white;
            box-shadow:0 6px 20px rgba(0,0,0,.15);
            margin:-55px auto 0;
            position:relative;
            z-index:2;
            background:#f1f5f9;
        }
        .ds-photo-ring img { width:100%; height:100%; object-fit:cover; }
        .ds-avatar {
            width:100%; height:100%;
            display:flex; align-items:center; justify-content:center;
            font-size:2rem; font-weight:800; color:white;
        }
        .ds-body { padding:1rem 1.5rem 1.6rem; text-align:center; flex:1; display:flex; flex-direction:column; }
        .ds-name  { font-size:1.05rem; font-weight:800; color:#0f172a; margin:.8rem 0 .3rem; line-height:1.3; }
        .ds-spec  { font-size:.8rem; font-weight:700; padding:4px 14px; border-radius:20px; display:inline-block; margin-bottom:1rem; }
        .ds-stats { display:flex; justify-content:center; gap:1.25rem; margin-bottom:1rem; }
        .ds-stat  { text-align:center; }
        .ds-stat-val { font-size:1.1rem; font-weight:800; color:#0f172a; }
        .ds-stat-lbl { font-size:.68rem; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
        .ds-divider  { height:1px; background:#f1f5f9; margin:.6rem 0; }
        .ds-awards   { display:flex; flex-direction:column; gap:.45rem; flex:1; }
        .ds-award-row{ display:flex; align-items:center; gap:.5rem; font-size:.78rem; color:#475569; font-weight:600; text-align:left; }
        .ds-fee-bar  { display:flex; justify-content:space-between; align-items:center; margin-top:1rem; padding:.75rem 1rem; background:#f8fafc; border-radius:12px; }
        .ds-fee-lbl  { font-size:.72rem; color:#94a3b8; font-weight:700; text-transform:uppercase; }
        .ds-fee-val  { font-size:1.1rem; font-weight:900; }
        .ds-book-btn { margin-top:.9rem; width:100%; padding:.65rem; border:none; border-radius:10px; font-weight:700; font-size:.875rem; cursor:pointer; color:white; transition:opacity .2s, transform .15s; }
        .ds-book-btn:hover { opacity:.88; transform:translateY(-1px); }

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

        .ds-rating { display:flex; justify-content:center; align-items:center; gap:.25rem; margin-top:.4rem; margin-bottom:.3rem; }

        @media (max-width:900px) { .ds-heading{font-size:1.75rem;} }

        /* Custom GEM Hospital Style Nav */
        .gem-nav-wrapper {
            position: sticky; top: 0; z-index: 999;
            background: #ffffff;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .gem-nav {
            display: flex; justify-content: space-between; align-items: center;
            max-width: 1400px; margin: 0 auto; padding: 10px 20px;
        }
        .gem-nav-logo {
            display: flex; align-items: center; gap: 10px; text-decoration: none;
        }
        .gem-nav-logo-text {
            color: #1e6b3b; font-weight: 800; font-size: 1.8rem; letter-spacing: -0.5px; margin:0; line-height: 1.1;
        }
        .gem-nav-logo-sub {
            color: #444; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; max-width: 250px;
            text-wrap: balance;
        }
        .gem-nav-links {
            display: flex; gap: 1.1rem; align-items: center;
        }
        .gem-nav-link {
            text-decoration: none; color: #064e3b; font-weight: 700; font-size: 0.85rem;
            display: flex; align-items: center; gap: 4px; transition: color 0.2s;
            background: none; border: none; cursor: pointer; font-family: inherit;
        }
        .gem-nav-link:hover { color: #15803d; }
        .gem-btn {
            background: #16a34a; color: white; padding: 10px 20px; border-radius: 6px; font-weight: 700;
            text-decoration: none; font-size: 0.95rem; transition: background 0.2s; border: none; cursor: pointer;
        }
        .gem-btn:hover { background: #15803d; }
        .gem-login-btn {
            background: transparent; color: #064e3b; padding: 8px 16px; border-radius: 6px; font-weight: 700;
            text-decoration: none; font-size: 0.9rem; border: 2px solid #16a34a; transition: all 0.2s; cursor: pointer;
        }
        .gem-login-btn:hover { background: #f0fdf4; }
        .gem-hamburger {
            display: none; background: none; border: none; cursor: pointer; color: #064e3b; padding: 4px;
        }
        .gem-mobile-menu {
            display: none; flex-direction: column; gap: 0; background: #fff;
            border-top: 1px solid #e2e8f0; padding: 8px 0;
        }
        .gem-mobile-menu.open { display: flex; }
        .gem-mobile-link {
            text-decoration: none; color: #064e3b; font-weight: 700; font-size: 0.95rem;
            padding: 14px 24px; border-bottom: 1px solid #f1f5f9; cursor: pointer;
            background: none; border-left: none; border-right: none; border-top: none;
            text-align: left; font-family: inherit; width: 100%;
        }
        .gem-mobile-link:hover { background: #f0fdf4; }
        .gem-mobile-link:last-child { border-bottom: none; }

        /* GEM Hero Style — Video Background */
        .gem-hero {
            position: relative;
            overflow: hidden;
            min-height: 620px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .gem-hero-video {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            min-width: 100%; min-height: 100%;
            width: auto; height: auto;
            object-fit: cover;
            z-index: 0;
        }
        .gem-hero-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(
                135deg,
                rgba(5, 46, 22, 0.78) 0%,
                rgba(5, 46, 22, 0.55) 50%,
                rgba(0, 0, 0, 0.35) 100%
            );
            z-index: 1;
        }
        .gem-hero-content {
            position: relative; z-index: 2;
            max-width: 900px;
            margin: 0 auto;
            width: 100%;
            padding: 80px 24px;
            text-align: center;
        }
        .gem-hero-badge {
            display: inline-block;
            background: rgba(22,163,74,0.25);
            border: 1px solid rgba(134,239,172,0.5);
            color: #86efac;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            padding: 6px 18px;
            border-radius: 20px;
            margin-bottom: 1.5rem;
        }
        .gem-hero-h1 {
            color: #ffffff;
            font-size: 3rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1rem;
            text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .gem-hero-h1 span { display: block; font-size: 1.9rem; color: #86efac; font-weight: 600; margin-top: 0.4rem; }
        .gem-hero-list {
            list-style: none; padding: 0;
            margin: 1.5rem auto 2.5rem;
            display: inline-flex; flex-direction: column; gap: 10px;
            text-align: left;
        }
        .gem-hero-list li {
            display: flex; align-items: center; gap: 12px;
            font-size: 1.1rem; color: rgba(255,255,255,0.92); font-weight: 500;
        }
        .gem-hero-list li svg { color: #4ade80; font-size: 1.3rem; flex-shrink: 0; }
        .gem-hero-actions {
            display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 2rem;
        }
        .gem-hero-btn-primary {
            background: #16a34a; color: white;
            padding: 14px 32px; border-radius: 8px;
            font-weight: 700; font-size: 1rem;
            text-decoration: none; border: none; cursor: pointer;
            transition: background 0.2s, transform 0.15s;
            display: inline-flex; align-items: center; gap: 8px;
        }
        .gem-hero-btn-primary:hover { background: #15803d; transform: translateY(-2px); }
        .gem-hero-btn-outline {
            background: transparent; color: white;
            padding: 13px 28px; border-radius: 8px;
            font-weight: 700; font-size: 1rem;
            text-decoration: none; border: 2px solid rgba(255,255,255,0.6); cursor: pointer;
            transition: all 0.2s;
            display: inline-flex; align-items: center; gap: 8px;
        }
        .gem-hero-btn-outline:hover { background: rgba(255,255,255,0.12); border-color: white; }
        
        /* Floating WhatsApp */
        .whatsapp-float {
            position: fixed; bottom: 30px; left: 30px; 
            width: 60px; height: 60px; background: #25d366; 
            border-radius: 50px; text-align: center; font-size: 35px;
            box-shadow: 2px 2px 8px rgba(0,0,0,0.2); z-index: 1000;
            display: flex; align-items: center; justify-content: center; color: white;
            text-decoration: none; transition: transform 0.2s;
        }
        .whatsapp-float:hover { transform: scale(1.1); }

        @media (max-width: 1024px) {
            .gem-nav-links { display: none; }
            .gem-hamburger { display: flex; align-items: center; justify-content: center; }
            .gem-hero-h1 { font-size: 2.2rem; }
            .gem-hero-h1 span { font-size: 1.5rem; }
            .gem-hero-list li { font-size: 1rem; }
        }

        /* Vision / Mission / Quality Policy */
        .vmq-wrapper {
            background: #f0fdf4;
            padding: 60px 24px;
        }
        .vmq-card {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 28px;
        }
        .vmq-item {
            background: #ffffff;
            border-radius: 20px;
            border: 1.5px solid #d1fae5;
            padding: 44px 36px 40px;
            box-shadow: 0 4px 24px rgba(22,163,74,0.08);
            transition: transform 0.25s, box-shadow 0.25s;
        }
        .vmq-item:hover {
            transform: translateY(-6px);
            box-shadow: 0 14px 40px rgba(22,163,74,0.14);
        }
        .vmq-icon {
            width: 76px; height: 76px;
            margin-bottom: 24px;
        }
        .vmq-title {
            font-size: 1.1rem; font-weight: 900;
            color: #111827; margin-bottom: 14px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        .vmq-text {
            font-size: 0.93rem; line-height: 1.9;
            color: #374151; text-align: justify;
        }
        .vmq-text span { color: #16a34a; font-weight: 700; }
        @media (max-width: 900px) {
            .vmq-card { grid-template-columns: 1fr; }
        }
    `}</style>
);

const AWARD_ICONS = [FaTrophy, FaMedal, FaCertificate, FaAward];
const AWARD_COLORS = ['#f59e0b','#8b5cf6','#0891b2','#10b981'];

/* ── Single doctor card ── */
const DocSlideCard = ({ doc, width }) => {
    const awards = doc.awards || AWARDS_POOL[0];

    return (
        <div className="ds-card" style={{ width, margin: '0 0.75rem' }}>

            {/* Coloured top bar */}
            <div className="ds-card-top" style={{
                background: `linear-gradient(135deg, ${doc.color}, ${doc.color}bb)`
            }} />

            {/* Photo ring — sits on top of the bar via negative margin */}
            <div className="ds-photo-ring">
                {doc.profileImage ? (
                    <img src={doc.profileImage} alt={doc.name} />
                ) : (
                    <div className="ds-avatar" style={{
                        background: `linear-gradient(135deg, ${doc.color}, ${doc.color}99)`
                    }}>
                        {doc.avatar || doc.name?.[0]}
                    </div>
                )}
            </div>

            <div className="ds-body">
                {/* Star rating */}
                <div className="ds-rating">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={13} color={i < Math.floor(doc.rating) ? '#f59e0b' : '#e2e8f0'} />
                    ))}
                    <span style={{ fontSize: '.78rem', fontWeight: '700', color: '#64748b', marginLeft: '5px' }}>
                        {doc.rating?.toFixed(1)}
                    </span>
                </div>

                {/* Name */}
                <p className="ds-name">{doc.name}</p>

                {/* Specialty badge */}
                <span className="ds-spec" style={{ background: `${doc.color}18`, color: doc.color }}>
                    {doc.specialty}
                </span>

                {/* Stats: experience + patients */}
                <div className="ds-stats">
                    <div className="ds-stat">
                        <div className="ds-stat-val">{doc.experience}+</div>
                        <div className="ds-stat-lbl">Yrs Exp.</div>
                    </div>
                    <div style={{ width: '1px', background: '#e2e8f0', alignSelf: 'stretch' }} />
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
                                <div style={{
                                    width: 22, height: 22, borderRadius: 6,
                                    background: `${aColor}18`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    <AwardIcon size={11} color={aColor} />
                                </div>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{award}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Fee row */}
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
                    <button className="ds-book-btn"
                        style={{ background: `linear-gradient(135deg, ${doc.color}, ${doc.color}cc)` }}>
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
        const count = w < 600 ? 1 : w < 960 ? 2 : 3;
        setVisibleCount(count);
        const gapTotal = (count - 1) * 24;
        setCardWidth(Math.floor((w - 64 - gapTotal) / count));
    }, []);

    useEffect(() => {
        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [updateLayout]);

    const maxIndex = Math.max(0, total - visibleCount);
    const next = useCallback(() => setIndex(i => (i >= maxIndex ? 0 : i + 1)), [maxIndex]);
    const prev = useCallback(() => setIndex(i => (i <= 0 ? maxIndex : i - 1)), [maxIndex]);

    useEffect(() => {
        timerRef.current = setInterval(next, 3500);
        return () => clearInterval(timerRef.current);
    }, [next]);

    const pause  = () => clearInterval(timerRef.current);
    const resume = () => { timerRef.current = setInterval(next, 3500); };

    const translateX = -(index * (cardWidth + 24));

    return (
        <div ref={wrapRef} style={{ position: 'relative', padding: '0 32px', paddingTop: '16px' }}
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        setMobileMenuOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

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
            <div className="gem-nav-wrapper">
                <nav className="gem-nav">
                    {/* Logo */}
                    <Link to="/" className="gem-nav-logo">
                        <FaHeartbeat size={40} color="#b91c1c" />
                        <div>
                            <p className="gem-nav-logo-text">ABHI  Health Care Center</p>
                        </div>
                    </Link>

                    {/* Desktop Nav Links - only real sections */}
                    <div className="gem-nav-links">
                        <Link to="/" className="gem-nav-link">Home</Link>
                        <button className="gem-nav-link" onClick={() => scrollToSection('doctors-section')}>Our Doctors</button>
                        <button className="gem-nav-link" onClick={() => scrollToSection('why-us-section')}>Why Us</button>
                        <button className="gem-nav-link" onClick={() => scrollToSection('reviews-section')}>Patient Reviews</button>
                        <button className="gem-nav-link" onClick={() => scrollToSection('cta-section')}>Contact</button>
                    </div>

                    {/* Right Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link to="/login" className="gem-login-btn">Login</Link>
                        <Link to="/login" className="gem-btn">Book Appointment</Link>
                        {/* Hamburger for mobile */}
                        <button className="gem-hamburger" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Toggle menu">
                            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Dropdown Menu */}
                <div className={`gem-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                    <Link to="/" className="gem-mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <button className="gem-mobile-link" onClick={() => scrollToSection('doctors-section')}>Our Doctors</button>
                    <button className="gem-mobile-link" onClick={() => scrollToSection('why-us-section')}>Why Us</button>
                    <button className="gem-mobile-link" onClick={() => scrollToSection('reviews-section')}>Patient Reviews</button>
                    <button className="gem-mobile-link" onClick={() => scrollToSection('cta-section')}>Contact</button>
                    <Link to="/login" className="gem-mobile-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link to="/login" className="gem-mobile-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#16a34a' }}>📅 Book Appointment</Link>
                </div>
            </div>

            {/* ── Hero — Video Background ── */}
            <section className="gem-hero">
                {/* Looping background video */}
                <video
                    className="gem-hero-video"
                    src={heroBgVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                />

                {/* Dark overlay for readability */}
                <div className="gem-hero-overlay" />

                {/* Hero content */}
                <div className="gem-hero-content">
                    <div className="gem-hero-badge">🏥 ABHI Health Care Centre</div>

                    <h1 className="gem-hero-h1">
                        Advanced Laparoscopic Care
                        <span>Expert Surgeons, Faster Healing</span>
                    </h1>

                    <ul className="gem-hero-list">
                        <li><FaCheckSquare /> Advanced Laparoscopic Surgery</li>
                        <li><FaCheckSquare /> Minimally Invasive &bull; Faster Recovery</li>
                        <li><FaCheckSquare /> Book Your Appointment Today!</li>
                    </ul>

                    <div className="gem-hero-actions">
                        <Link to="/login" className="gem-hero-btn-primary">
                            📅 Book Appointment
                        </Link>
                        <button
                            className="gem-hero-btn-outline"
                            onClick={() => scrollToSection('doctors-section')}
                        >
                            Our Doctors
                        </button>
                    </div>
                </div>
            </section>
            
            <a href="https://wa.me/something" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
            </a>


            {/* ══ DOCTOR SLIDER SECTION ══ */}
            <section id="doctors-section" className="ds-section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '0' }}>
                        <div className="ds-label"><FaUserMd /> Our Specialists</div>
                        <h2 className="ds-heading">Meet Our Expert Doctors</h2>
                        <p className="ds-subtext">
                            Consult with India's top-rated specialists. View their experience, awards &amp; book instantly.
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
            <div id="reviews-section"><ReviewSlider /></div>

            {/* ── Vision / Mission / Quality Policy ── */}
            <div className="vmq-wrapper">
                <div className="vmq-card">
                    {/* VISION */}
                    <div className="vmq-item">
                        <svg className="vmq-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="38" r="16" stroke="#16a34a" strokeWidth="3.5" />
                            <path d="M50 22 C50 22 30 38 50 54 C70 38 50 22 50 22Z" stroke="#16a34a" strokeWidth="3" fill="none"/>
                            <path d="M34 30 Q26 20 22 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
                            <path d="M66 30 Q74 20 78 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
                            <line x1="50" y1="10" x2="50" y2="4" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
                            <path d="M28 60 Q50 72 72 60" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round"/>
                            <line x1="50" y1="54" x2="50" y2="72" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
                            <path d="M36 72 L50 88 L64 72" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="vmq-title">Vision</p>
                        <p className="vmq-text">
                            To emerge as <span>global health care facilitator</span> providing
                            <span> world-class facilities</span> in tune with evolving technology
                            and promoting health endeavors with <span>quality service</span>.
                        </p>
                    </div>

                    {/* MISSION */}
                    <div className="vmq-item">
                        <svg className="vmq-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="30" y="18" width="40" height="50" rx="8" stroke="#16a34a" strokeWidth="3.5"/>
                            <path d="M44 18 V12 A6 6 0 0 1 56 12 V18" stroke="#16a34a" strokeWidth="3" fill="none"/>
                            <circle cx="50" cy="46" r="10" stroke="#16a34a" strokeWidth="3"/>
                            <line x1="50" y1="40" x2="50" y2="52" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
                            <line x1="44" y1="46" x2="56" y2="46" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M34 68 Q50 80 66 68" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round"/>
                            <ellipse cx="50" cy="78" rx="8" ry="4" stroke="#16a34a" strokeWidth="2.5"/>
                        </svg>
                        <p className="vmq-title">Mission</p>
                        <p className="vmq-text">
                            To provide <span>comprehensive health care</span> by the dedicated
                            efforts in bringing the <span>wellness of the society</span> to the
                            fore through the harmonious blend of
                            <span> technology expertise</span> and <span>compassion</span>.
                        </p>
                    </div>

                    {/* QUALITY POLICY */}
                    <div className="vmq-item">
                        <svg className="vmq-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="30" r="16" stroke="#16a34a" strokeWidth="3.5"/>
                            <path d="M34 30 Q22 30 22 50 L22 82 Q22 88 28 88 L72 88 Q78 88 78 82 L78 50 Q78 30 66 30" stroke="#16a34a" strokeWidth="3.5" fill="none"/>
                            <line x1="40" y1="56" x2="60" y2="56" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
                            <line x1="40" y1="66" x2="60" y2="66" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M44 14 L50 8 L56 14" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="vmq-title">Quality Policy</p>
                        <p className="vmq-text">
                            GEM Hospital is committed to providing
                            <span> value-added, innovative</span>, and continually improving
                            <span> quality health care services</span> interfaced with
                            <span> futuristic technology</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Features ── */}
            <section id="why-us-section" className="section" style={{ background: 'rgba(255,255,255,.4)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 4rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Why Choose GEM Hospital?</h2>
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
            <section id="cta-section" className="section">
                <div className="container">
                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(135deg,rgba(22,163,74,.08),rgba(20,184,166,.08))', maxWidth: 900, margin: '0 auto' }}>
                        <h2 style={{ marginBottom: '1rem', color: '#14532d' }}>Ready to Experience Better Healthcare?</h2>
                        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem' }}>
                            Join thousands of patients who trust GEM Hospital for advanced laparoscopic & surgical care.
                        </p>
                        <Link to="/login" className="gem-btn" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                            Book Appointment Today <FaArrowRight style={{ marginLeft: 8 }} />
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
