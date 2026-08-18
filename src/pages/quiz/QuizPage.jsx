// src/pages/quiz/QuizPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';
import '../../pages.css';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const handleSubmitRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api.get(`/quiz/${id}`).catch(() => null),
      api.post(`/quiz/${id}/start`).catch(() => null)
    ]).then(([qRes, aRes]) => {
      if (qRes?.data) {
        setQuiz(qRes.data);
        setAttemptId(aRes?.data?.attemptId || `att-${Date.now()}`);
        setTimeLeft((qRes.data.timeLimitMins || 15) * 60);
      } else {
        const fallbackQuiz = {
          id: id || 'quiz-sample',
          title: 'Class 10 CBSE Board Exam Revision Quiz',
          description: 'Test your understanding of Mathematics, Physics, and Chemistry for board preparation.',
          timeLimitMins: 15,
          passingScore: 60,
          questions: [
            {
              id: 'q1',
              questionText: 'What is the sum of roots for the quadratic equation 2x² - 8x + 6 = 0?',
              optionA: '2',
              optionB: '4',
              optionC: '8',
              optionD: '-4',
              correctOption: 'B',
              points: 10
            },
            {
              id: 'q2',
              questionText: 'Which lens is used to correct myopia (nearsightedness)?',
              optionA: 'Convex Lens',
              optionB: 'Concave Lens',
              optionC: 'Cylindrical Lens',
              optionD: 'Bifocal Lens',
              correctOption: 'B',
              points: 10
            },
            {
              id: 'q3',
              questionText: 'What product is formed when Carbon Dioxide gas is passed through Lime Water?',
              optionA: 'Calcium Oxide',
              optionB: 'Calcium Carbonate (Milky precipitation)',
              optionC: 'Calcium Chloride',
              optionD: 'Sodium Bicarbonate',
              correctOption: 'B',
              points: 10
            },
            {
              id: 'q4',
              questionText: 'In Java, which keyword is used by a child class to inherit fields and methods from a parent class?',
              optionA: 'implements',
              optionB: 'extends',
              optionC: 'inherits',
              optionD: 'super',
              correctOption: 'B',
              points: 10
            }
          ]
        };
        setQuiz(fallbackQuiz);
        setAttemptId(`att-${Date.now()}`);
        setTimeLeft(15 * 60);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0 || result) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // auto-submit via ref to avoid stale closure
          handleSubmitRef.current?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft, result]);

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const selectOption = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const res = await api.post(`/quiz/${id}/submit`, { attemptId, answers });
      setResult(res.data);
    } catch {
      // Local scoring fallback
      if (quiz) {
        let score = 0, total = 0;
        quiz.questions?.forEach(q => {
          total += q.points || 10;
          if (answers[q.id] === q.correctOption) score += q.points || 10;
        });
        setResult({ score, totalMarks: total, percentage: total ? Math.round(score*100/total) : 0,
          passed: total ? score*100/total >= quiz.passingScore : false, passingScore: quiz.passingScore });
      }
    } finally {
      setSubmitting(false);
    }
  };
  // Keep ref in sync so the timer can call the latest version
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!quiz) return null;

  const q = quiz.questions?.[current];
  const OPTIONS = ['A', 'B', 'C', 'D'];

  // Result Screen
  if (result) {
    return (
      <div className="quiz-page">
        <div className="card" style={{ padding: '3rem', textAlign: 'center', animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
            {result.passed ? '🎉' : '💪'}
          </div>
          <h2 style={{ color: result.passed ? 'var(--success)' : 'var(--warning)', marginBottom: '0.75rem' }}>
            {result.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
          </h2>
          <div style={{ fontSize: '3rem', fontWeight: 900, margin: '1.5rem 0', background: 'linear-gradient(135deg, var(--accent), var(--accent-ai))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {result.percentage}%
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Score: {result.score} / {result.totalMarks} • Pass Mark: {result.passingScore}%
          </p>

          {result.answerReview?.length > 0 && (
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <h3 style={{ marginBottom: '1rem' }}>Answer Review</h3>
              {result.answerReview.map((a, i) => (
                <div key={i} className="card" style={{ padding: '1rem', marginBottom: '0.75rem', borderColor: a.isCorrect ? 'var(--success)' : 'var(--error)', background: a.isCorrect ? 'rgba(46,204,113,0.05)' : 'rgba(231,76,60,0.05)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: a.isCorrect ? 'var(--success)' : 'var(--error)', flexShrink: 0 }}>
                      {a.isCorrect ? <FiCheck /> : <FiX />}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{a.questionText}</div>
                      {!a.isCorrect && <div style={{ fontSize: '0.8rem', color: 'var(--error)' }}>Your answer: {a.selectedOption} • Correct: {a.correctOption}</div>}
                      {a.explanation && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>💡 {a.explanation}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/courses')}>Back to Courses</button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry Quiz</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      {/* Header */}
      <div className="quiz-header">
        <div>
          <div style={{ fontWeight: 700 }}>{quiz.title}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Question {current + 1} of {quiz.questions?.length}
          </div>
        </div>
        <div className="quiz-timer" style={{ color: timeLeft < 60 ? 'var(--error)' : 'var(--accent-ai)' }}>
          <FiClock size={16} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="progress-fill" style={{ width: `${((current + 1) / quiz.questions?.length) * 100}%` }} />
      </div>

      {/* Question */}
      {q && (
        <div className="card quiz-question-card">
          {q.imageUrl && <img src={q.imageUrl} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }} />}
          <h3 style={{ fontSize: '1.15rem', lineHeight: 1.5 }}>{q.questionText}</h3>

          <div className="question-options">
            {OPTIONS.map(opt => {
              const optText = q[`option${opt}`];
              if (!optText) return null;
              return (
                <button
                  key={opt}
                  className={`option-btn ${answers[q.id] === opt ? 'selected' : ''}`}
                  onClick={() => selectOption(q.id, opt)}
                >
                  <span className="option-label">{opt}</span>
                  {optText}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
        >← Previous</button>

        {current < (quiz.questions?.length ?? 0) - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setCurrent(c => c + 1)}
          >Next →</button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >{submitting ? 'Submitting...' : '🚀 Submit Quiz'}</button>
        )}
      </div>

      {/* Question dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        {quiz.questions?.map((qr, i) => (
          <div
            key={qr.id}
            onClick={() => setCurrent(i)}
            style={{
              width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, transition: 'all 0.2s',
              background: i === current ? 'var(--accent)' : answers[qr.id] ? 'rgba(46,204,113,0.3)' : 'var(--glass-bg)',
              border: `2px solid ${i === current ? 'var(--accent)' : answers[qr.id] ? 'var(--success)' : 'var(--glass-border)'}`,
              color: i === current ? 'white' : 'var(--text-secondary)'
            }}
          >{i + 1}</div>
        ))}
      </div>
    </div>
  );
}
