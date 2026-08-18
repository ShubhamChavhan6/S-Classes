// src/pages/Home.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdChildCare, MdSchool, MdAutoAwesome } from 'react-icons/md';
import { FiArrowRight, FiBook, FiCpu, FiSearch, FiZap, FiCode, FiCompass } from 'react-icons/fi';
import '../pages.css';

const FEATURED_ITEMS = [
  {
    id: 'java-21',
    to: '/playground',
    icon: <FiCode style={{ color: '#fbbf24' }} size={24} />,
    iconBg: 'rgba(245, 158, 11, 0.15)',
    tag: 'Programming',
    lang: 'Java 21',
    title: 'Java 21 LTS: Modern Core & Concurrency',
    subtitle: 'Interactive JDK 21 Compiler & OOPs Placement Lab',
    badgeColor: '#f59e0b'
  },
  {
    id: 'math-10',
    to: '/courses/course-1/learn',
    icon: <FiBook style={{ color: '#6c63ff' }} size={24} />,
    iconBg: 'rgba(108, 99, 255, 0.15)',
    tag: 'Mathematics',
    lang: 'Hindi & English',
    title: 'CBSE Class 10 Mathematics Masterclass',
    subtitle: '12 chapters • Board PYQs & Formula Revision Decks',
    badgeColor: '#6c63ff'
  },
  {
    id: 'science-10',
    to: '/courses/course-2/learn',
    icon: <FiZap style={{ color: '#00d2d3' }} size={24} />,
    iconBg: 'rgba(0, 210, 211, 0.15)',
    tag: 'Science',
    lang: 'Hindi & English',
    title: 'Class 10 Physics & Chemistry Laboratory',
    subtitle: '15 chapters • Ray Diagrams, Circuits & Numericals',
    badgeColor: '#00d2d3'
  },
  {
    id: 'lang-en',
    to: '/courses',
    icon: <FiBook style={{ color: '#ec4899' }} size={24} />,
    iconBg: 'rgba(236, 72, 153, 0.15)',
    tag: 'Language',
    lang: 'English / Hindi',
    title: 'Spoken English & Grammar Fluency Series',
    subtitle: 'Daily active communication & professional writing',
    badgeColor: '#ec4899'
  }
];

const HOME_TAGS = ['All', 'Programming', 'Language', 'Science', 'Mathematics'];

export default function Home() {
  const { user } = useAuth();
  const [activeTag, setActiveTag] = useState('All');

  const filteredFeatured = FEATURED_ITEMS.filter(item => 
    activeTag === 'All' || item.tag === activeTag
  );

  return (
    <div className="home-page page-container" style={{ paddingTop: '1rem', paddingBottom: '5rem' }}>
      
      {/* Top Floating Search Bar */}
      <div className="dark-search-bar animate-fadeInUp" style={{ maxWidth: '750px', margin: '0 auto 2.5rem' }}>
        <FiSearch className="dark-search-icon" style={{ color: 'var(--color-primary-light)' }} />
        <input 
          type="text" 
          className="dark-search-input" 
          placeholder="Search any course, topic, or coding subject (e.g., Java 21, Java OOPs, ICSE Java, React)..." 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              window.location.href = `/search?q=${encodeURIComponent(e.target.value)}`;
            }
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="text-center animate-fadeInUp" style={{ marginBottom: '3.5rem', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.1rem', background: 'rgba(108, 99, 255, 0.12)', border: '1px solid rgba(108, 99, 255, 0.3)', borderRadius: '100px', color: 'var(--color-primary-light)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <MdAutoAwesome size={16} style={{ color: '#ffd93d' }} /> 🇮🇳 India's AI-Powered Multilingual Learning Platform
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', fontWeight: 900, color: '#fff', margin: '0.5rem 0 1.25rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
          Learn Faster with <span style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #00d2d3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Personalized AI Tutoring</span>
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          Comprehensive NCERT syllabus for CBSE & Maharashtra boards, interactive coding playgrounds, 24/7 instant AI doubt solver, and fun learning for kids.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/courses" className="btn btn-primary btn-lg" style={{ borderRadius: '14px' }}>
            Explore All Courses <FiArrowRight />
          </Link>
          <Link to="/ai-tutor" className="btn btn-secondary btn-lg" style={{ borderRadius: '14px', border: '1px solid rgba(108, 99, 255, 0.4)' }}>
            <FiCpu style={{ color: 'var(--accent-ai)' }} /> Ask AI Tutor 24/7
          </Link>
          <Link to="/playground" className="btn btn-secondary btn-lg" style={{ borderRadius: '14px' }}>
            <FiCode style={{ color: 'var(--accent-school)' }} /> Code Lab
          </Link>
        </div>
      </div>

      {/* High-Impact Mode & Category Grid */}
      {!user && (
        <section className="section animate-fadeInUp" style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Explore Learning Tracks
            </h2>
            <Link to="/tracks" style={{ fontSize: '0.9rem', color: 'var(--color-primary-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              View All Tracks <FiArrowRight size={14} />
            </Link>
          </div>
          
          <div className="category-cards-grid">
            <Link to="/kids" className="category-card" style={{ textDecoration: 'none' }}>
              <div className="category-icon-box" style={{ background: 'rgba(255, 107, 157, 0.18)', color: '#ff6b9d' }}>
                <MdChildCare size={28} />
              </div>
              <h3>Kids World</h3>
              <p>Ages 4–8 • Phonics & Games</p>
            </Link>

            <Link to="/courses?mode=SCHOOL" className="category-card" style={{ textDecoration: 'none' }}>
              <div className="category-icon-box" style={{ background: 'rgba(78, 154, 241, 0.18)', color: '#4e9af1' }}>
                <MdSchool size={28} />
              </div>
              <h3>School Syllabus</h3>
              <p>Class 1–12 NCERT & Boards</p>
            </Link>

            <Link to="/playground" className="category-card" style={{ textDecoration: 'none' }}>
              <div className="category-icon-box" style={{ background: 'rgba(155, 89, 255, 0.18)', color: '#9b59ff' }}>
                <FiCode size={26} />
              </div>
              <h3>Java 21 Code Lab</h3>
              <p>Java, OOPs & Multi-lang Compiler</p>
            </Link>

            <Link to="/tracks" className="category-card" style={{ textDecoration: 'none' }}>
              <div className="category-icon-box" style={{ background: 'rgba(0, 210, 211, 0.18)', color: '#00d2d3' }}>
                <FiCompass size={26} />
              </div>
              <h3>Career Skill Tracks</h3>
              <p>Java 21, DSA & Spring Boot</p>
            </Link>
          </div>
        </section>
      )}

      {/* Popular Courses Showcase */}
      {!user && (
        <section className="section animate-fadeInUp" style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Popular Courses & Learning Modules
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>
                Filter verified curriculums across Programming, Language, Science & Mathematics.
              </p>
            </div>
            <Link to="/courses" style={{ fontSize: '0.9rem', color: 'var(--color-primary-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Browse Catalog <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Tag Filter Chips on Home */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
            {HOME_TAGS.map(tag => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '100px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isActive ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isActive ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tag === 'Programming' && '💻 '}
                  {tag === 'Language' && '🗣️ '}
                  {tag === 'Science' && '🔬 '}
                  {tag === 'Mathematics' && '📐 '}
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="popular-cards-grid">
            {filteredFeatured.map(item => (
              <Link key={item.id} to={item.to} className="popular-course-card" style={{ textDecoration: 'none' }}>
                <div className="popular-thumb-placeholder" style={{ background: item.iconBg }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem', alignItems: 'center' }}>
                    <span className="badge" style={{ fontSize: '0.7rem', background: `${item.badgeColor}22`, color: item.badgeColor, border: `1px solid ${item.badgeColor}44` }}>
                      {item.tag}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#2ecc71' }}>{item.lang}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* AI Feature Spotlight Card */}
      <section className="card animate-fadeInUp" style={{ padding: '2.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(20, 20, 45, 0.9) 0%, rgba(10, 10, 25, 0.95) 100%)', border: '1px solid rgba(108, 99, 255, 0.3)', marginBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-ai)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <FiCpu /> NEXT-GEN AI TUTOR
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
              Stuck on a tricky question? Ask your AI Tutor anytime.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Get instant step-by-step solutions for Math, Science, and Coding in simple Hindi, English, or Marathi. Try our voice & text enabled doubt resolution!
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/ai-tutor" className="btn btn-primary" style={{ borderRadius: '12px' }}>
                Try AI Doubt Solver Now
              </Link>
            </div>
          </div>

          <div style={{ background: 'rgba(10, 10, 20, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71' }}></div>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>S-Classes AI Assistant</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
              💬 <strong>Student:</strong> How do I solve quadratic equations using the quadratic formula?
            </div>
            <div style={{ fontSize: '0.85rem', color: '#f5f5ff', background: 'rgba(108, 99, 255, 0.15)', border: '1px solid rgba(108, 99, 255, 0.3)', padding: '0.75rem', borderRadius: '8px', lineHeight: 1.5 }}>
              ⚡ <strong>AI Tutor:</strong> For <em>ax² + bx + c = 0</em>, use the formula:<br />
              <code style={{ color: '#ffd93d', display: 'block', margin: '0.3rem 0' }}>x = (-b ± √(b² - 4ac)) / (2a)</code>
              1. Identify a, b, c.<br />
              2. Calculate Discriminant D = b² - 4ac.<br />
              3. Find roots x₁ and x₂!
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

