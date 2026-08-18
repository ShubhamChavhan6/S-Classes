// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0a0a12', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem 1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🎓</span> S-Classes
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary, #64748b)', fontSize: '0.82rem' }}>
            Next-generation AI-powered learning platform for students, kids, and developers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/client" style={{ color: '#94a3b8', textDecoration: 'none' }}>Client Portal</Link>
          <Link to="/courses" style={{ color: '#94a3b8', textDecoration: 'none' }}>Courses</Link>
          <Link to="/tracks" style={{ color: '#94a3b8', textDecoration: 'none' }}>Skill Tracks</Link>
          <Link to="/ai-tutor" style={{ color: '#94a3b8', textDecoration: 'none' }}>AI Tutor</Link>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
        © {new Date().getFullYear()} S-Classes Inc. All rights reserved.
      </div>
    </footer>
  );
}
