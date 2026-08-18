// src/pages/courses/CourseDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';

export default function CourseDetail() {
  const { id } = useParams();

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="card" style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <span className="badge badge-accent">Course Overview</span>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0.75rem 0' }}>Class 10 Curriculum Course #{id}</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Comprehensive video lectures, practice quizzes, and previous year question breakdowns verified by senior educators.
        </p>
        <Link to={`/courses/${id}/learn`} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <FiPlay /> Start First Lesson
        </Link>
      </div>
    </div>
  );
}
