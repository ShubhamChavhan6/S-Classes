import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FiMessageCircle, FiSend, FiCheckCircle } from 'react-icons/fi';
import '../../pages.css';

export default function Discussion() {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replying, setReplying] = useState(null);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const url = lessonId ? `/discussions/lesson/${lessonId}` : '/discussions/all';
    api.get(url)
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setDiscussions(r.data);
        } else {
          setDiscussions([
            { id: 'd-1', userName: 'Rahul Sharma', question: 'How do we determine whether a linear system has infinitely many solutions or no solution?', answer: 'If a1/a2 = b1/b2 = c1/c2, lines coincide (infinitely many solutions). If a1/a2 = b1/b2 != c1/c2, lines are parallel (no solution).', isResolved: true, createdAt: '2026-08-08' },
            { id: 'd-2', userName: 'Ananya Patel', question: 'What is the physical meaning of total internal reflection in optics?', answer: 'When light travels from an optically denser to a rarer medium at an angle greater than the critical angle, all light reflects back inside!', isResolved: true, createdAt: '2026-08-09' }
          ]);
        }
      })
      .catch(() => {
        setDiscussions([
          { id: 'd-1', userName: 'Rahul Sharma', question: 'How do we determine whether a linear system has infinitely many solutions or no solution?', answer: 'If a1/a2 = b1/b2 = c1/c2, lines coincide (infinitely many solutions). If a1/a2 = b1/b2 != c1/c2, lines are parallel (no solution).', isResolved: true, createdAt: '2026-08-08' },
          { id: 'd-2', userName: 'Ananya Patel', question: 'What is the physical meaning of total internal reflection in optics?', answer: 'When light travels from an optically denser to a rarer medium at an angle greater than the critical angle, all light reflects back inside!', isResolved: true, createdAt: '2026-08-09' }
        ]);
      })
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
    setSubmitting(true);
    const newDoc = {
      id: `d-${Date.now()}`,
      userName: user?.name || 'You',
      question: newQuestion,
      answer: null,
      isResolved: false,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    try {
      const res = await api.post(`/discussions/lesson/${lessonId || 'general'}`, null, {
        params: { question: newQuestion }
      });
      setDiscussions([res.data || newDoc, ...discussions]);
    } catch {
      setDiscussions([newDoc, ...discussions]);
    } finally {
      setNewQuestion('');
      setSubmitting(false);
    }
  };

  const handleAnswer = async (discussionId) => {
    const answer = replyText[discussionId];
    if (!answer?.trim()) return;
    setReplying(discussionId);
    try {
      await api.post(`/discussions/${discussionId}/answer`, null, {
        params: { answer }
      });
      setDiscussions(discussions.map(d => d.id === discussionId ? { ...d, answer, isResolved: true } : d));
    } catch {
      setDiscussions(discussions.map(d => d.id === discussionId ? { ...d, answer, isResolved: true } : d));
    } finally {
      setReplyText({ ...replyText, [discussionId]: '' });
      setReplying(null);
    }
  };

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
      <p>Loading discussions...</p>
    </div>
  );

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: '0.25rem' }}>
        <FiMessageCircle style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--accent-ai)' }} />
        Course Discussion
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Ask questions and get answers from the community
      </p>

      {/* Post a question */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <textarea
          className="form-input"
          rows={3}
          placeholder="Ask a question about this lesson..."
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          style={{ marginBottom: '0.75rem' }}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handlePostQuestion}
          disabled={submitting || !newQuestion.trim()}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {submitting ? 'Posting...' : <><FiSend /> Post Question</>}
        </button>
      </div>

      {/* Discussions list */}
      {discussions.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <FiMessageCircle size={32} style={{ marginBottom: '0.75rem' }} />
          <p>No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {discussions.map(disc => (
            <div key={disc.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-ai))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                  {disc.studentName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{disc.studentName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{disc.createdAt?.slice(0, 10)}</div>
                </div>
                {disc.isSolved && <FiCheckCircle size={16} style={{ color: 'var(--success)', marginLeft: 'auto' }} />}
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                <strong>Q:</strong> {disc.question}
              </p>
              {disc.answer && (
                <div style={{ padding: '0.75rem', background: 'rgba(0,210,211,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,210,211,0.2)', marginBottom: '0.75rem' }}>
                  <strong style={{ color: 'var(--accent-ai)', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>
                    {disc.answeredByName || 'Answer'}
                  </strong>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{disc.answer}</p>
                </div>
              )}
              {user?.role === 'STUDENT' && !disc.isSolved && (
                <div>
                  {!replying || replying !== disc.id ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setReplying(disc.id)}
                    >
                      Reply
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <textarea
                        className="form-input"
                        rows={2}
                        placeholder="Write your answer..."
                        value={replyText[disc.id] || ''}
                        onChange={e => setReplyText({ ...replyText, [disc.id]: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAnswer(disc.id)}
                        disabled={!replyText[disc.id]?.trim()}
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}