// src/pages/courses/SampleLesson.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTv, FiZap, FiHelpCircle, FiArrowRight } from 'react-icons/fi';
import YouTubePlayer from '../../components/YouTubePlayer';
import '../../pages.css';

export default function SampleLesson() {
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'notes' | 'practice'
  const [selectedOption, setSelectedOption] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const sampleQuestion = {
    question: "A spherical mirror has a focal length of -15 cm. What type of mirror is it, and what will be the nature of the image formed for an object placed 30 cm in front of it?",
    options: [
      "Convex mirror; Real and Inverted image",
      "Concave mirror; Real, Inverted, and Same Size image",
      "Concave mirror; Virtual and Erect image",
      "Convex mirror; Virtual and Diminished image"
    ],
    correct: 1,
    explanation: "Since focal length f = -15 cm (negative sign), it is a Concave mirror. Using mirror formula 1/f = 1/v + 1/u with u = -30 cm: 1/(-15) = 1/v + 1/(-30) => 1/v = -1/15 + 1/30 = -1/30 => v = -30 cm. The image is formed 30 cm in front of the mirror (Real & Inverted), and magnification m = -v/u = -(-30)/(-30) = -1 (Same size as object)."
  };

  return (
    <div className="page-container" style={{ paddingBottom: '4rem' }}>
      {/* Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.15) 100%)',
        border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem', marginBottom: '2rem'
      }}>
        <div>
          <span className="badge" style={{ background: '#27ae6022', color: '#27ae60', fontWeight: 700 }}>
            ✨ Free Sample Preview • No Login Required
          </span>
          <h2 style={{ fontSize: '1.25rem', margin: '0.4rem 0 0' }}>
            Class 10 Physics — Light: Reflection and Refraction (Chapter 1)
          </h2>
        </div>
        <Link to="/register" className="btn btn-primary btn-sm">
          Unlock All 150+ Courses <FiArrowRight size={14} />
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('video')}
          className={`btn ${activeTab === 'video' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <FiTv /> 1. Video Lesson
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`btn ${activeTab === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <FiZap /> 2. AI Study Notes ✨
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`btn ${activeTab === 'practice' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <FiHelpCircle /> 3. Board Practice & Solution
        </button>
      </div>

      {/* Tab 1: Video */}
      {activeTab === 'video' && (
        <div style={{ marginBottom: '2rem' }}>
          <YouTubePlayer 
            videoId="aircAruvnKk" 
            title="Chapter 1: Laws of Reflection, Concave & Convex Mirrors" 
          />
        </div>
      )}

      {/* Tab 2: AI Study Notes */}
      {activeTab === 'notes' && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', lineHeight: 1.8, fontSize: '0.95rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-light)', marginBottom: '1rem' }}>
            ✨ AI-Generated Study Notes — Class 10 Physics Ch 1
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '1.25rem' }}>1. Laws of Reflection of Light</h3>
          <ul>
            <li><strong>First Law:</strong> The angle of incidence (\(i\)) is always equal to the angle of reflection (\(r\)).</li>
            <li><strong>Second Law:</strong> The incident ray, normal, and reflected ray all lie in the same plane.</li>
          </ul>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '1.25rem' }}>2. Mirror Formula & Magnification</h3>
          <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-light)', margin: '1rem 0' }}>
            <code>1/f = 1/v + 1/u</code><br />
            <code>Magnification m = -v/u = h'/h</code>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            <em>Note: Follow New Cartesian Sign Convention — object distance (u) is always negative.</em>
          </p>
        </div>
      )}

      {/* Tab 3: Practice Question */}
      {activeTab === 'practice' && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <span className="badge" style={{ background: 'var(--accent-light)22', color: 'var(--accent-light)', marginBottom: '0.75rem' }}>
            📝 Board Exam Practice Question
          </span>
          <h3 style={{ fontSize: '1.15rem', marginTop: '0.5rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            {sampleQuestion.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {sampleQuestion.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === sampleQuestion.correct;
              let bg = 'var(--glass-bg)';
              let borderColor = 'var(--glass-border)';

              if (showSolution) {
                if (isCorrect) { bg = 'rgba(39,174,96,0.15)'; borderColor = '#27ae60'; }
                else if (isSelected && !isCorrect) { bg = 'rgba(231,76,60,0.15)'; borderColor = '#e74c3c'; }
              } else if (isSelected) {
                borderColor = 'var(--accent-light)';
              }

              return (
                <div
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  style={{
                    padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    background: bg, border: `2px solid ${borderColor}`, fontWeight: 600, fontSize: '0.95rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowSolution(true)}
              disabled={selectedOption === null}
              className="btn btn-primary"
            >
              Check Answer & Show AI Step-by-Step Solution
            </button>
          </div>

          {showSolution && (
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(39,174,96,0.1)', border: '1px solid #27ae60', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: '#27ae60', marginTop: 0, marginBottom: '0.5rem' }}>💡 Step-by-Step AI Solution:</h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, margin: 0, color: 'var(--text-primary)' }}>
                {sampleQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Conversion Banner */}
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--glass-bg)', border: '2px solid var(--accent-light)' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Ready to master your board exams with S-Classes?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Get 24/7 AI tutoring, Maharashtra & CBSE board tests, and multilingual notes in Marathi, Hindi & English.
        </p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 700 }}>
          🚀 Create Free Student Account
        </Link>
      </div>
    </div>
  );
}
