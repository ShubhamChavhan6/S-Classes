// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { FiUser, FiShield, FiUserCheck, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLoginSubmit = async (userEmail, userPass, role = 'STUDENT', name = '') => {
    try {
      await login({
        email: userEmail,
        name: name || userEmail.split('@')[0],
        role: role,
        qualification: 'Secondary',
        stream: 'Science'
      }, userPass);
      toast.showToast(`Logged in successfully as ${role}`, 'success');
      navigate('/dashboard');
    } catch {
      toast.showToast('Logged in as guest learner', 'success');
      navigate('/dashboard');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password);
  };

  return (
    <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <div 
        className="card" 
        style={{ 
          maxWidth: '460px', 
          width: '100%', 
          padding: '2.5rem', 
          background: 'linear-gradient(135deg, rgba(18, 18, 28, 0.95), rgba(10, 10, 18, 0.98))', 
          border: '1px solid rgba(99, 102, 241, 0.3)', 
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)' 
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 900 }}>
            S
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.4rem 0' }}>Welcome Back</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Sign in to continue your S-Classes learning journey</p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div style={{ marginBottom: '1.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '0.78rem', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            ⚡ One-Click Demo Sign In
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleLoginSubmit('student@sclasses.com', 'demo123', 'STUDENT', 'Aarav Sharma')}
              style={{ padding: '0.6rem 0.5rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}
            >
              <FiUser size={16} style={{ color: '#818cf8' }} /> Student
            </button>

            <button
              type="button"
              onClick={() => handleLoginSubmit('parent@sclasses.com', 'demo123', 'PARENT', 'Rajesh Sharma')}
              style={{ padding: '0.6rem 0.5rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}
            >
              <FiShield size={16} style={{ color: '#34d399' }} /> Parent
            </button>

            <button
              type="button"
              onClick={() => handleLoginSubmit('instructor@sclasses.com', 'demo123', 'INSTRUCTOR', 'Dr. Verma')}
              style={{ padding: '0.6rem 0.5rem', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}
            >
              <FiUserCheck size={16} style={{ color: '#c084fc' }} /> Instructor
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          <span>or sign in with email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="student@sclasses.com" 
              className="form-control" 
              style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="form-control" 
              style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '0.5rem', width: '100%', padding: '0.9rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            Sign In <FiArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: '#94a3b8', margin: '1.5rem 0 0 0' }}>
          Don't have an account? <Link to="/register" style={{ color: '#818cf8', fontWeight: 700 }}>Register now</Link>
        </p>
      </div>
    </div>
  );
}

