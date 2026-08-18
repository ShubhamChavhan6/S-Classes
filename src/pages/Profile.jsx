// src/pages/Profile.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { FiGrid, FiCompass, FiBookmark, FiAward, FiFileText, FiBookOpen, FiUsers, FiEdit2, FiCheck } from 'react-icons/fi';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    qualification: user?.qualification || 'Senior Secondary (Class 11 - 12)',
    stream: user?.stream || 'Computer Science / IT',
    institution: user?.institution || 'Central Board / State Board',
    gradeLevel: user?.gradeLevel || 'Class 12',
    targetGoal: user?.targetGoal || 'Coding & Software Development',
    skillLevel: user?.skillLevel || 'Beginner'
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile(formData);
      if (toast?.showToast) toast.showToast('Profile and Qualification updated successfully!', 'success');
      else if (toast?.addToast) toast.addToast('Profile updated!', 'success');
    }
    setIsEditing(false);
  };

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Header Profile Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #6c63ff, #4f46e5)', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(108, 99, 255, 0.4)'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {user?.name || 'Learner Profile'}
              </h2>
              <div style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {user?.email || 'student@example.com'} • {user?.phone || 'No Phone Added'}
              </div>
              <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-accent">{user?.role || 'STUDENT'}</span>
                <span className="badge badge-school">{user?.qualification || 'Class 12'}</span>
                {user?.accountType && (
                  <span className="badge badge-gold">Account Created By: {user.accountType}</span>
                )}
              </div>
            </div>
          </div>

          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsEditing(!isEditing)}
            style={{ gap: '0.4rem' }}
          >
            <FiEdit2 size={15} /> {isEditing ? 'Cancel Edit' : 'Edit Profile & Qualification'}
          </button>
        </div>

        <hr style={{ borderColor: 'var(--glass-border)', margin: '1.5rem 0' }} />

        {/* Dynamic Qualification & Skill Profile Editor Form */}
        {isEditing ? (
          <form onSubmit={handleSave} style={{ background: 'rgba(108, 99, 255, 0.05)', border: '1px solid rgba(108, 99, 255, 0.25)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiBookOpen color="#818cf8" size={18} /> Update Qualification & Personalization Profile
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Qualification Level</label>
                <select 
                  className="input-field" 
                  value={formData.qualification}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                >
                  <option value="Kids (Class 1 - 3)">Kids Early Primary (Class 1 - 3)</option>
                  <option value="Middle School (Class 4 - 8)">Middle School (Class 4 - 8)</option>
                  <option value="Secondary School (Class 9 - 10)">Secondary Board (Class 9 - 10)</option>
                  <option value="Senior Secondary (Class 11 - 12)">Senior Secondary (Class 11 - 12)</option>
                  <option value="Undergraduate (B.Tech / B.E. / BCA / B.Sc)">Undergraduate (B.Tech / BCA / B.Sc)</option>
                  <option value="Postgraduate / Working Professional">Postgraduate / Working Professional</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Stream / Field</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.stream} 
                  onChange={e => setFormData({ ...formData, stream: e.target.value })} 
                  placeholder="e.g. Computer Science, Science, Commerce"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>School / Institution Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.institution} 
                  onChange={e => setFormData({ ...formData, institution: e.target.value })} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Target Career Goal</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.targetGoal} 
                  onChange={e => setFormData({ ...formData, targetGoal: e.target.value })} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Current Skill Level</label>
                <select 
                  className="input-field" 
                  value={formData.skillLevel}
                  onChange={e => setFormData({ ...formData, skillLevel: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                <FiCheck size={16} /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          /* Student Qualification & Academic Background Display */
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiBookOpen color="#818cf8" size={18} /> Student Qualification & Academic Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>Current Qualification</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{user?.qualification || 'Senior Secondary (Class 11-12)'}</strong>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>School / College / Institution</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{user?.institution || 'Kendriya Vidyalaya / Central Board'}</strong>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>Stream / Specialization</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{user?.stream || 'Computer Science / IT'}</strong>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>Grade / Passing Year</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{user?.gradeLevel || 'Class 12'}</strong>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>Target Goal / Exam</span>
                <strong style={{ color: '#38bdf8', fontSize: '0.95rem' }}>{user?.targetGoal || 'Coding & Software Development'}</strong>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>Medium Language & Skill Level</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{user?.languagePref || 'English'} • {user?.skillLevel || 'Beginner'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Parent / Guardian Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiUsers color="#34d399" size={18} /> Parent & Guardian Contact Information
          </h3>

          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block' }}>Parent / Guardian Name</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{user?.parentName || 'Suresh Sharma'} ({user?.parentRelation || 'Father'})</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block' }}>Parent Contact Number</span>
                <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>{user?.parentPhone || '+91 98765 00000'}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block' }}>Parent Email Address</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{user?.parentEmail || 'Not Provided'}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.8rem', display: 'block' }}>Parent Occupation</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{user?.parentOccupation || 'Engineer / Business'}</strong>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--glass-border)', margin: '1.5rem 0' }} />

        {/* Learning Workspace Quick Shortcuts */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          My Learning Workspace & Portals
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          <Link to="/client" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.6rem', padding: '0.75rem 1rem' }}>
            <FiGrid size={16} color="var(--accent-light)" /> Client UI / Portal
          </Link>
          <Link to="/dashboard" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.6rem', padding: '0.75rem 1rem' }}>
            <FiCompass size={16} color="var(--accent-school)" /> Student Dashboard
          </Link>
          <Link to="/assignments" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.6rem', padding: '0.75rem 1rem' }}>
            <FiFileText size={16} color="var(--accent-lang)" /> Assignments
          </Link>
          <Link to="/my-bookmarks" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.6rem', padding: '0.75rem 1rem' }}>
            <FiBookmark size={16} color="var(--accent-kids)" /> Saved Bookmarks
          </Link>
          <Link to="/my-certificates" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.6rem', padding: '0.75rem 1rem' }}>
            <FiAward size={16} color="var(--accent-advanced)" /> Certificates
          </Link>
        </div>

      </div>
    </div>
  );
}
