// src/pages/kids/KidsHome.jsx
import { Link } from 'react-router-dom';

export default function KidsHome() {
  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '3rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1rem' }}>🎈 Kids Learning World</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Fun interactive games for alphabets, numbers, and phonics!</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/kids/alphabets" className="btn btn-primary" style={{ padding: '1rem 1.5rem', fontSize: '1.1rem' }}>🅰️ Learn Alphabets</Link>
        <Link to="/kids/numbers" className="btn btn-secondary" style={{ padding: '1rem 1.5rem', fontSize: '1.1rem' }}>🔢 Learn Numbers</Link>
      </div>
    </div>
  );
}
