import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiAward, FiDownload, FiCheck, FiPrinter, FiX } from 'react-icons/fi';
import '../../pages.css';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    api.get('/certificates/my')
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setCertificates(r.data);
        } else {
          setCertificates([
            { id: 'cert-1', title: 'CBSE Class 10 Science Mastery Certificate', courseTitle: 'Class 10 CBSE Science — Physics & Chemistry (NCERT)', grade: 94.5, issueDate: '2026-07-28' },
            { id: 'cert-2', title: 'Java 21 Core & OOPs Masterclass Certificate', courseTitle: 'Java 21 Core, OOPs & Modern Language Features', grade: 98.5, issueDate: '2026-08-02' }
          ]);
        }
      })
      .catch(() => {
        setCertificates([
          { id: 'cert-1', title: 'CBSE Class 10 Science Mastery Certificate', courseTitle: 'Class 10 CBSE Science — Physics & Chemistry (NCERT)', grade: 94.5, issueDate: '2026-07-28' },
          { id: 'cert-2', title: 'Java 21 Core & OOPs Masterclass Certificate', courseTitle: 'Java 21 Core, OOPs & Modern Language Features', grade: 98.5, issueDate: '2026-08-02' }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = (cert) => {
    setActiveCert(cert);
  };

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
      <p>Loading certificates...</p>
    </div>
  );

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: '0.25rem' }}>
        <FiAward style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: '#ffd93d' }} />
        My Certificates
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Verified certificates earned upon course and quiz completion
      </p>

      {certificates.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏅</div>
          <h3 style={{ marginBottom: '0.75rem' }}>No Certificates Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Complete a course to earn your certificate of achievement.
          </p>
          <a href="/dashboard" className="btn btn-secondary">
            Go to Dashboard
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {certificates.map(cert => (
            <div key={cert.id} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #ffd93d, #f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                🏅
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1.05rem' }}>{cert.title}</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{cert.courseTitle}</div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Score: {cert.grade?.toFixed(1)}%</span>
                  <span>Issued: {cert.issueDate?.slice(0, 10)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge-school"><FiCheck size={12} /> Verified</span>
                <button className="btn btn-primary btn-sm" onClick={() => handleDownload(cert)} title="View & Print Certificate">
                  <FiDownload /> View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Preview Modal */}
      {activeCert && (
        <div className="search-modal-overlay" onClick={() => setActiveCert(null)}>
          <div className="card animate-fadeInUp" style={{ maxWidth: '650px', width: '90%', padding: '2.5rem', background: '#0d0d21', border: '2px solid #ffd93d', textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveCert(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <FiX size={22} />
            </button>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎓</div>
            <div style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', color: '#ffd93d', fontWeight: 800 }}>S-Classes Official Certificate</div>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: '0.5rem 0 1.5rem' }}>Certificate of Completion</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>This is to certify that</p>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-ai)', margin: '0.25rem 0 1.25rem' }}>Demo Student</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              has successfully completed all required chapters and assessments for <br />
              <strong style={{ color: '#fff' }}>{activeCert.courseTitle}</strong> with a score of <strong style={{ color: '#2ecc71' }}>{activeCert.grade}%</strong>.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div>Issue Date: {activeCert.issueDate}</div>
              <div>ID: SCLASS-{activeCert.id.toUpperCase()}</div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <FiPrinter /> Print / Save PDF
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveCert(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}