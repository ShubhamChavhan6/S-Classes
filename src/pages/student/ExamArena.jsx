import { useState, useEffect } from 'react';
import { 
  FiAward, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiArrowRight, 
  FiArrowLeft, 
  FiZap, 
  FiCpu, 
  FiRotateCw,
  FiPrinter,
  FiBookOpen,
  FiActivity
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { incrementDailyStreak } from '../../utils/dynamicContent';

export default function ExamArena() {
  const { user } = useAuth();
  
  // Quiz parameters
  const [topic, setTopic] = useState('Java 21 Core, OOPs & Data Structures (DSA)');
  const [level, setLevel] = useState(user?.qualification || 'Undergraduate');
  const [numQuestions, setNumQuestions] = useState(5);

  // Exam state
  const [examState, setExamState] = useState('setup'); // 'setup' | 'loading' | 'active' | 'results'
  const [examData, setExamData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: optionIndex }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timerId;
    if (examState === 'active' && timeLeftSeconds > 0) {
      timerId = setInterval(() => {
        setTimeLeftSeconds(prev => prev - 1);
        setTimeSpentSeconds(prev => prev + 1);
      }, 1000);
    } else if (examState === 'active' && timeLeftSeconds <= 0) {
      handleSubmitExam();
    }
    return () => clearInterval(timerId);
  }, [examState, timeLeftSeconds]);

  // Quick preset topics
  const PRESET_TOPICS = [
    { title: 'Java 21 Core, OOPs & Collections', level: 'Undergraduate' },
    { title: 'Java DSA: Arrays, Trees & Graphs', level: 'Undergraduate' },
    { title: 'ICSE Class 10 Java & BlueJ', level: 'Secondary' },
    { title: 'Class 10 CBSE Science & Math', level: 'Secondary' },
    { title: 'Spring Boot 3 & Microservices', level: 'Postgraduate' }
  ];

  const handleStartExam = async () => {
    try {
      setExamState('loading');
      setUserAnswers({});
      setCurrentIndex(0);

      const res = await api.post('/api/exam/generate', {
        topic,
        level,
        numQuestions
      });

      if (res.data && res.data.questions) {
        setExamData(res.data);
        setTimeLeftSeconds(res.data.totalTimeSeconds || 600);
        setTimeSpentSeconds(0);
        setExamState('active');
      }
    } catch (err) {
      console.error('Failed to start exam:', err);
      setExamState('setup');
    }
  };

  const handleSelectOption = (qIdx, optIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleSubmitExam = () => {
    setExamState('results');
    // Increment daily streak upon finishing exam!
    incrementDailyStreak(user);
  };

  // Score calculations
  const calculateScore = () => {
    if (!examData || !examData.questions) return { score: 0, total: 0, percentage: 0 };
    let correct = 0;
    examData.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    const total = examData.questions.length;
    const percentage = Math.round((correct / (total || 1)) * 100);
    return { score: correct, total, percentage };
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const { score, total, percentage } = calculateScore();

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      
      {/* Banner Header */}
      <div 
        className="card" 
        style={{ 
          padding: '2rem', 
          marginBottom: '2rem', 
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.85), rgba(15, 23, 42, 0.95))', 
          border: '1px solid rgba(124, 58, 237, 0.35)', 
          borderRadius: '20px' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-accent" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                <FiZap style={{ marginRight: '0.3rem' }} /> S-Classes Exam Arena
              </span>
              <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600 }}>
                AI Mock Test & Evaluation Engine
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
              🎯 Live AI Mock Exam & Practice Arena
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
              Take timed mock tests, receive instant AI solution breakdowns, and earn daily study streak points to master your board exams and technical subjects.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.85rem 1.25rem', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Daily Practice
              </div>
              <div style={{ fontSize: '1.15rem', color: '#ef4444', fontWeight: 800, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaFire style={{ color: '#f97316' }} /> Active Recall
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SETUP PHASE */}
      {examState === 'setup' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Preset Exam Cards */}
          <div className="card" style={{ padding: '1.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiBookOpen style={{ color: '#818cf8' }} /> Popular Mock Exam Presets
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {PRESET_TOPICS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(preset.title);
                    setLevel(preset.level);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '1rem 1.25rem',
                    borderRadius: '14px',
                    background: topic === preset.title 
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(79, 70, 229, 0.15))' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: topic === preset.title ? '1.5px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: topic === preset.title ? '#a5b4fc' : '#ffffff' }}>
                      {preset.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      🎓 {preset.level} Level
                    </div>
                  </div>
                  {topic === preset.title && <FiCheckCircle style={{ color: '#6366f1' }} size={20} />}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Subject Config Form */}
          <div className="card" style={{ padding: '1.75rem', background: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.25)', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCpu style={{ color: '#a855f7' }} /> Configure AI Test Parameters
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Exam Subject / Syllabus Topic
                </label>
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. CBSE Class 10 Physics, React & Node.js..."
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    Grade Qualification
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Kids">Kids (Ages 4-8)</option>
                    <option value="Middle">Middle (Class 4-8)</option>
                    <option value="Secondary">Secondary (Class 9-10)</option>
                    <option value="Senior Secondary">Senior Sec (Class 11-12)</option>
                    <option value="Undergraduate">Undergraduate / Tech</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    Questions
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    <option value={3}>3 Questions (Express)</option>
                    <option value={5}>5 Questions (Standard)</option>
                    <option value={10}>10 Questions (Comprehensive)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleStartExam}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  marginTop: '0.5rem'
                }}
              >
                <FiZap size={18} /> Launch AI Mock Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING PHASE */}
      {examState === 'loading' && (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div className="spinner" style={{ width: '42px', height: '42px' }} />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                Generating AI Questions for "{topic}"...
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
                Synthesizing exam-style multiple choice problems and verification steps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE TEST PHASE */}
      {examState === 'active' && examData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Question View Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Top Timer Bar */}
            <div 
              style={{ 
                display: 'flex', 
                justify: 'space-between', 
                alignItems: 'center', 
                padding: '1rem 1.5rem', 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '16px' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
                <span>Question</span>
                <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>
                  {currentIndex + 1}
                </span>
                <span>of {examData.questions.length}</span>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  color: timeLeftSeconds < 120 ? '#ef4444' : '#10b981', 
                  fontWeight: 800, 
                  fontSize: '1.1rem',
                  background: timeLeftSeconds < 120 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '10px'
                }}
              >
                <FiClock size={18} /> {formatTime(timeLeftSeconds)}
              </div>
            </div>

            {/* Current Question Card */}
            {(() => {
              const q = examData.questions[currentIndex];
              if (!q) return null;
              const selectedOpt = userAnswers[currentIndex];

              return (
                <div 
                  className="card" 
                  style={{ 
                    padding: '2.25rem', 
                    background: 'linear-gradient(145deg, rgba(30, 27, 75, 0.7), rgba(15, 23, 42, 0.9))', 
                    border: '1px solid rgba(99, 102, 241, 0.3)', 
                    borderRadius: '24px',
                    minHeight: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between'
                  }}
                >
                  <div>
                    {q.conceptTag && (
                      <span className="badge badge-accent" style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
                        🏷️ {q.conceptTag}
                      </span>
                    )}

                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.4, margin: '0 0 1.5rem 0' }}>
                      {q.question}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {q.options?.map((opt, oIdx) => {
                        const isSelected = selectedOpt === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(currentIndex, oIdx)}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '1rem 1.25rem',
                              borderRadius: '14px',
                              background: isSelected 
                                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.35), rgba(79, 70, 229, 0.2))' 
                                : 'rgba(255, 255, 255, 0.03)',
                              border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                              color: isSelected ? '#ffffff' : '#cbd5e1',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.85rem',
                              fontSize: '0.98rem',
                              fontWeight: isSelected ? 700 : 500
                            }}
                          >
                            <span 
                              style={{ 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '50%', 
                                background: isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.08)', 
                                color: '#fff', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                flexShrink: 0
                              }}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                    <button
                      onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="btn"
                      style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.65rem 1.25rem' }}
                    >
                      <FiArrowLeft size={16} /> Previous
                    </button>

                    {currentIndex < examData.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        className="btn btn-primary"
                        style={{ padding: '0.65rem 1.5rem', fontWeight: 700 }}
                      >
                        Next Question <FiArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitExam}
                        className="btn btn-success"
                        style={{ padding: '0.65rem 1.75rem', fontWeight: 800, background: '#10b981' }}
                      >
                        Submit Exam <FiCheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right Column Question Navigator */}
          <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: '0 0 1rem 0' }}>
              Question Grid
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {examData.questions.map((_, qIdx) => {
                const isAnswered = userAnswers[qIdx] !== undefined;
                const isCurrent = currentIndex === qIdx;

                return (
                  <button
                    key={qIdx}
                    onClick={() => setCurrentIndex(qIdx)}
                    style={{
                      height: '42px',
                      borderRadius: '10px',
                      background: isCurrent 
                        ? '#6366f1' 
                        : isAnswered 
                          ? 'rgba(16, 185, 129, 0.25)' 
                          : 'rgba(255, 255, 255, 0.05)',
                      border: isCurrent 
                        ? '2px solid #ffffff' 
                        : isAnswered 
                          ? '1px solid #10b981' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmitExam}
              className="btn btn-success"
              style={{ width: '100%', padding: '0.85rem', fontWeight: 800, background: '#10b981' }}
            >
              Finish & Evaluate Score
            </button>
          </div>
        </div>
      )}

      {/* RESULTS PHASE */}
      {examState === 'results' && examData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Score Summary Box */}
          <div 
            className="card animate-fadeInUp" 
            style={{ 
              padding: '2.5rem', 
              borderRadius: '24px', 
              background: 'linear-gradient(135deg, rgba(20, 20, 45, 0.95), rgba(10, 10, 25, 0.98))', 
              border: '1.5px solid rgba(124, 58, 237, 0.4)',
              textAlign: 'center'
            }}
          >
            <span className="badge badge-accent" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              🏆 Official Exam Evaluation Complete
            </span>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              {percentage >= 80 ? '🌟 Outstanding Mastery!' : percentage >= 50 ? '👍 Solid Effort!' : '📘 Keep Practicing!'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 2rem 0' }}>
              Target Subject: <strong style={{ color: '#ffffff' }}>{examData.topic}</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Final Score</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#6366f1', marginTop: '0.2rem' }}>
                  {score} / {total}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Accuracy Rate</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: percentage >= 70 ? '#10b981' : '#f59e0b', marginTop: '0.2rem' }}>
                  {percentage}%
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Time Elapsed</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>
                  {formatTime(timeSpentSeconds)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setExamState('setup')}
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.75rem', fontWeight: 800, borderRadius: '12px' }}
              >
                <FiRotateCw size={18} /> Retake / New Mock Test
              </button>

              <button
                onClick={() => setShowCertificateModal(true)}
                className="btn"
                style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '0.85rem 1.75rem', fontWeight: 700, borderRadius: '12px' }}
              >
                <FiPrinter size={18} /> View Scorecard Report
              </button>
            </div>
          </div>

          {/* Detailed Solutions Breakdown */}
          <div className="card" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiActivity style={{ color: '#818cf8' }} /> Question-by-Question Solution Analysis
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {examData.questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div 
                    key={idx}
                    style={{
                      padding: '1.5rem',
                      borderRadius: '16px',
                      background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                      border: isCorrect ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {isCorrect ? (
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                          <FiCheckCircle size={14} style={{ marginRight: '0.2rem' }} /> Correct
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                          <FiXCircle size={14} style={{ marginRight: '0.2rem' }} /> Incorrect / Skipped
                        </span>
                      )}
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>
                        Question {idx + 1}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: '0 0 1rem 0' }}>
                      {q.question}
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                      {q.options.map((opt, oIdx) => {
                        const isThisCorrect = oIdx === q.correctIndex;
                        const isThisUserAns = oIdx === userAns;

                        return (
                          <div 
                            key={oIdx}
                            style={{
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              background: isThisCorrect 
                                ? 'rgba(16, 185, 129, 0.2)' 
                                : isThisUserAns 
                                  ? 'rgba(239, 68, 68, 0.2)' 
                                  : 'rgba(255, 255, 255, 0.03)',
                              border: isThisCorrect 
                                ? '1px solid #10b981' 
                                : isThisUserAns 
                                  ? '1px solid #ef4444' 
                                  : '1px solid rgba(255, 255, 255, 0.05)',
                              color: '#ffffff',
                              fontSize: '0.9rem'
                            }}
                          >
                            <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                            {isThisCorrect && ' ✅'}
                            {isThisUserAns && !isThisCorrect && ' ❌'}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #6366f1', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      💡 <strong>AI Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Official Scorecard Modal */}
      {showCertificateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', background: '#0f172a', border: '2px solid #6366f1', borderRadius: '24px', textAlign: 'center' }}>
            <FiAward size={48} style={{ color: '#fbbf24', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              S-Classes Official Academic Report
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>
              Candidate: <strong style={{ color: '#fff' }}>{user?.name || 'Student Candidate'}</strong>
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', textAlign: 'left', lineHeight: 1.6, fontSize: '0.95rem', color: '#e2e8f0' }}>
              <div><strong>Subject Evaluated:</strong> {examData?.topic}</div>
              <div><strong>Score Attained:</strong> {score} / {total} ({percentage}%)</div>
              <div><strong>Evaluation Date:</strong> {new Date().toLocaleDateString()}</div>
              <div><strong>Status:</strong> Verified Active Recall Practice</div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => window.print()} 
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}
              >
                Print / Save PDF
              </button>
              <button 
                onClick={() => setShowCertificateModal(false)} 
                className="btn"
                style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', padding: '0.75rem 1.5rem' }}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
