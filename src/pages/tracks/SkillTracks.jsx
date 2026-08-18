// src/pages/tracks/SkillTracks.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FiClock, FiArrowRight, FiCheck } from 'react-icons/fi';
import '../../pages.css';

const LEVEL_COLORS = {
  BEGINNER: 'var(--accent-school)',
  INTERMEDIATE: 'var(--accent)',
  ADVANCED: 'var(--accent-advanced)',
};

// Demo tracks for when backend is unavailable
const DEMO_TRACKS = [
  {
    id: 'dt-java', name: 'Java 21 Enterprise, DSA & Spring Boot Track', icon: '☕',
    description: 'Master Java 21, Object-Oriented Design (OOPs), Data Structures & Algorithms (DSA), and Spring Boot Microservices for top tech placements.',
    level: 'ADVANCED', category: 'CS & Backend', estimatedHours: 150,
    courses: ['ICSE/CBSE Java Foundations', 'Java 21 Core, JVM & OOP Pillars', 'Data Structures & Algorithms in Java', 'Spring Boot 3 & REST APIs', 'Microservices & System Design'],
  },
  {
    id: 'dt-1', name: 'CBSE Class 10 Board Exam Booster', icon: '🎓',
    description: 'Complete NCERT chapter coverage for Class 10 Maths, Science & English with solved Board Previous Year Questions (PYQs).',
    level: 'BEGINNER', category: 'School', estimatedHours: 90,
    courses: ['NCERT Mathematics', 'Physics & Chemistry', 'Biology & Environment', 'English Grammar & Writing', 'Board Sample Papers & PYQs'],
  },
  {
    id: 'dt-2', name: 'JEE Main & Advanced Physics Foundation', icon: '⚡',
    description: 'Master Class 11 & 12 Physics concepts, formulas, and problem-solving shortcuts with top Indian educators.',
    level: 'ADVANCED', category: 'Entrance', estimatedHours: 140,
    courses: ['Kinematics & Mechanics', 'Laws of Motion & Energy', 'Electrostatics & Current', 'Magnetism & Optics', 'JEE Main Mock Papers'],
  },
  {
    id: 'dt-3', name: 'NEET Biology & Chemistry Special', icon: '🩺',
    description: 'NCERT line-by-line Biology mastery, Organic Chemistry mechanisms, and speed revision flashcards for NEET medical aspirants.',
    level: 'ADVANCED', category: 'Entrance', estimatedHours: 130,
    courses: ['Plant & Animal Cell Biology', 'Human Physiology', 'Genetics & Evolution', 'Organic & Inorganic Chemistry', 'NEET Speed Mocks'],
  },
  {
    id: 'dt-4', name: 'Full-Stack Web Development in Hindi', icon: '🌐',
    description: 'Learn HTML, CSS, JavaScript, React.js, Node.js and MongoDB with hands-on projects with Indian software mentors.',
    level: 'INTERMEDIATE', category: 'Web Dev', estimatedHours: 120,
    courses: ['HTML5 & CSS3 Flexbox/Grid', 'JavaScript ES6 Modern Synth', 'React.js 18 Framework', 'Node.js & Express REST APIs', 'MongoDB & Deployment'],
  },
  {
    id: 'dt-5', name: 'Python & Data Structures (DSA) for IT Placements', icon: '💻',
    description: 'Crack campus placement interviews at top IT companies in India. Master Python programming, Arrays, Trees, Graphs, and DP.',
    level: 'ADVANCED', category: 'CS', estimatedHours: 110,
    courses: ['Python Programming Basics', 'Arrays, Strings & Recursion', 'Linked Lists & Trees', 'Graph Algorithms & DP', 'Mock Technical Interviews'],
  },
  {
    id: 'dt-6', name: 'Spoken English & Communication for Indian Learners', icon: '💬',
    description: 'Build English fluency, correct common Indian English mistakes, master business communications and interview answers.',
    level: 'BEGINNER', category: 'Language', estimatedHours: 60,
    courses: ['Grammar Foundations', 'Daily Conversation Practice', 'Public Speaking & Confidence', 'Job Interview Skills'],
  },
  {
    id: 'dt-7', name: 'Indian Regional Languages (Hindi & Marathi)', icon: '🇮🇳',
    description: 'Learn to read, write, and converse fluently in Hindi and Marathi with interactive audio lessons and stories.',
    level: 'BEGINNER', category: 'Language', estimatedHours: 50,
    courses: ['Hindi Varnamala & Sentences', 'Marathi Alphabets & Grammar', 'Daily Vernacular Phrases', 'Indian Cultural Literature'],
  },
];

export default function SkillTracks() {
  const [tracks, setTracks] = useState([]);
  const [myTracks, setMyTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [usingDemo, setUsingDemo] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toastTimer = useRef(null);

  useEffect(() => {
    const authenticated = isAuthenticated();
    Promise.all([
      api.get('/tracks'),
      authenticated ? api.get('/tracks/my') : Promise.resolve({ data: [] })
    ]).then(([tracksRes, myRes]) => {
      const data = tracksRes.data || [];
      if (data.length > 0) {
        setTracks(data);
        setUsingDemo(false);
      } else {
        setTracks(DEMO_TRACKS);
        setUsingDemo(true);
      }
      setMyTracks((myRes.data || []).map(t => t.track?.id || t.id));
    }).catch(() => {
      setTracks(DEMO_TRACKS);
      setUsingDemo(true);
    }).finally(() => setLoading(false));
  }, []);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleEnroll = async (trackId) => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      await api.post(`/tracks/${trackId}/enroll`);
      setMyTracks(prev => [...prev, trackId]);
      showToast('✅ Enrolled in track successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('already') || err.response?.status === 409) {
        setMyTracks(prev => [...prev, trackId]);
        showToast('You are already enrolled in this track.', 'info');
      } else {
        showToast('Failed to enroll. Please try again.', 'error');
      }
    }
  };

  const categories = ['All', ...new Set(tracks.map(t => t.category).filter(Boolean))];

  const filteredTracks = selectedCategory === 'All'
    ? tracks
    : tracks.filter(t => t.category === selectedCategory);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '1.5rem', zIndex: 9999,
          padding: '1rem 1.5rem', borderRadius: 'var(--radius)',
          background: toast.type === 'error' ? 'rgba(231,76,60,0.95)' : toast.type === 'info' ? 'rgba(52,152,219,0.95)' : 'rgba(46,204,113,0.95)',
          color: 'white', fontWeight: 600, fontSize: '0.9rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          animation: 'fadeInUp 0.3s ease',
          maxWidth: 380,
        }}>
          {toast.message}
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>🎯 Learning Roadmaps</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.75rem' }}>
          Follow curated skill tracks to go from beginner to job-ready
        </p>
        {usingDemo && (
          <div className="alert alert-info" style={{ maxWidth: 500, margin: '1.5rem auto 0' }}>
            🗺️ Showing demo tracks — connect your backend to see live data.
          </div>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 2 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid-3">
        {filteredTracks.map(track => {
          const isEnrolled = myTracks.includes(track.id);
          const color = LEVEL_COLORS[track.level] || 'var(--accent)';
          return (
            <div key={track.id} className="card track-card" style={{ padding: '2rem', position: 'relative' }}>
              {isEnrolled && (
                <div className="track-enrolled-badge">✓ Enrolled</div>
              )}

              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{track.icon}</div>

              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{
                  background: `${color}20`, color,
                  padding: '0.2rem 0.6rem', borderRadius: '100px',
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase'
                }}>{track.level}</span>
                {track.category && (
                  <span style={{
                    background: 'var(--glass-bg)', color: 'var(--text-muted)',
                    padding: '0.2rem 0.6rem', borderRadius: '100px',
                    fontSize: '0.7rem', fontWeight: 600, marginLeft: '0.4rem',
                  }}>{track.category}</span>
                )}
              </div>

              <h3 style={{ marginBottom: '0.5rem', lineHeight: 1.3, fontSize: '1.1rem' }}>{track.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                {track.description}
              </p>

              {/* Course chips */}
              {track.courses && track.courses.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
                  {track.courses.slice(0, 4).map((c, i) => (
                    <span key={i} style={{
                      background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                      borderRadius: '100px', padding: '0.2rem 0.6rem',
                      fontSize: '0.7rem', color: 'var(--text-muted)',
                    }}>{c}</span>
                  ))}
                  {track.courses.length > 4 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0.2rem 0.4rem' }}>
                      +{track.courses.length - 4} more
                    </span>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span><FiClock size={12} /> {track.estimatedHours}h total</span>
                <span style={{ color }}>{track.category}</span>
              </div>

              <button
                className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleEnroll(track.id)}
                disabled={isEnrolled}
              >
                {isEnrolled ? <><FiCheck /> Enrolled</> : <>Enroll Now <FiArrowRight /></>}
              </button>
            </div>
          );
        })}
      </div>

      {filteredTracks.length === 0 && (
        <div className="loading-center">
          <div style={{ fontSize: '4rem' }}>🗺️</div>
          <h3>No tracks in this category</h3>
        </div>
      )}
    </div>
  );
}
