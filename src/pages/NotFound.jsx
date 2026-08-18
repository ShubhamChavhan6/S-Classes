// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#6c63ff', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0.5rem 0 1rem' }}>Page Not Found</h2>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Return Home</Link>
    </div>
  );
}
