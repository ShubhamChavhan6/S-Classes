import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { FiBook, FiClock, FiCheckCircle, FiLoader, FiUpload, FiArrowRight } from 'react-icons/fi';
import '../../pages.css';

export default function Assignments() {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [submitContent, setSubmitContent] = useState({});

  useEffect(() => {
    const url = courseId ? `/assignments/course/${courseId}` : '/assignments/my';
    api.get(url)
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setAssignments(r.data);
        } else {
          setAssignments([
            { id: 'asgn-1', title: 'NCERT Class 10 Maths: Linear Equations Practice Sheet', description: 'Solve 5 word problems on pair of linear equations in two variables. Show all steps clearly.', dueDate: '2026-08-20', maxMarks: 20, isSubmitted: false },
            { id: 'asgn-2', title: 'CBSE Class 10 Science: Ray Diagrams & Refraction Numericals', description: 'Draw ray diagrams for concave and convex lenses for 3 object positions. Calculate focal length using lens formula.', dueDate: '2026-08-22', maxMarks: 15, isSubmitted: false },
            { id: 'asgn-3', title: 'Java 21 Project: Student Portal with OOPs & Collections', description: 'Write a Java 21 class structure defining Student, Course, and GradeManager using HashMap, ArrayList, and encapsulation.', dueDate: '2026-08-25', maxMarks: 25, isSubmitted: true, grade: 25, feedback: 'Excellent Java OOPs encapsulation and collection structure!' },
          ]);
        }
      })
      .catch(() => {
        setAssignments([
          { id: 'asgn-1', title: 'NCERT Class 10 Maths: Linear Equations Practice Sheet', description: 'Solve 5 word problems on pair of linear equations in two variables. Show all steps clearly.', dueDate: '2026-08-20', maxMarks: 20, isSubmitted: false },
          { id: 'asgn-2', title: 'CBSE Class 10 Science: Ray Diagrams & Refraction Numericals', description: 'Draw ray diagrams for concave and convex lenses for 3 object positions. Calculate focal length using lens formula.', dueDate: '2026-08-22', maxMarks: 15, isSubmitted: false },
          { id: 'asgn-3', title: 'Java 21 Project: Student Portal with OOPs & Collections', description: 'Write a Java 21 class structure defining Student, Course, and GradeManager using HashMap, ArrayList, and encapsulation.', dueDate: '2026-08-25', maxMarks: 25, isSubmitted: true, grade: 25, feedback: 'Excellent Java OOPs encapsulation and collection structure!' },
        ]);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSubmit = async (assignmentId) => {
    setSubmitting(assignmentId);
    try {
      await api.post(`/assignments/${assignmentId}/submit`, {
        content: submitContent[assignmentId] || '',
        fileUrl: ''
      });
      setAssignments(assignments.map(a =>
        a.id === assignmentId ? { ...a, isSubmitted: true } : a
      ));
      setSubmitContent({ ...submitContent, [assignmentId]: '' });
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
      <p>Loading assignments...</p>
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>
            <FiBook style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--accent)' }} />
            Assignments
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Submit and track your assignment progress</p>
        </div>
        {courseId && (
          <Link to={`/courses/${courseId}`} className="btn btn-secondary btn-sm">
            <FiArrowRight /> Back to Course
          </Link>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <FiBook size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
          <h3 style={{ marginBottom: '0.75rem' }}>No Assignments</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {courseId ? 'No assignments for this course yet.' : 'Select a course to view its assignments.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {assignments.map(assignment => (
            <div key={assignment.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{assignment.title}</h3>
                    {assignment.isSubmitted ? (
                      <FiCheckCircle size={18} style={{ color: 'var(--success)' }} />
                    ) : (
                      <FiLoader size={18} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                  {assignment.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                      {assignment.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {assignment.dueDate && (
                      <span><FiClock size={12} style={{ marginRight: '0.25rem' }} />Due: {assignment.dueDate?.slice(0, 10)}</span>
                    )}
                    <span>Max: {assignment.maxMarks} marks</span>
                    {assignment.grade != null && (
                      <span style={{ color: 'var(--accent)' }}>Grade: {assignment.grade}/{assignment.maxMarks}</span>
                    )}
                  </div>
                  {assignment.feedback && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(0,210,211,0.08)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                      <strong>Feedback:</strong> {assignment.feedback}
                    </div>
                  )}
                </div>

                {!assignment.isSubmitted ? (
                  <div style={{ minWidth: 280 }}>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Write your answer here..."
                      value={submitContent[assignment.id] || ''}
                      onChange={e => setSubmitContent({ ...submitContent, [assignment.id]: e.target.value })}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSubmit(assignment.id)}
                      disabled={submitting === assignment.id || !(submitContent[assignment.id] || '').trim()}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {submitting === assignment.id ? 'Submitting...' : <><FiUpload /> Submit</>}
                    </button>
                  </div>
                ) : (
                  <span className="badge badge-school">Submitted</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}