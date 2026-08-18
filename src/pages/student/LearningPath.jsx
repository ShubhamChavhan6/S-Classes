// src/pages/student/LearningPath.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { 
  FiStar, 
  FiPlayCircle, 
  FiArrowRight, 
  FiAward, 
  FiCompass, 
  FiTarget
} from 'react-icons/fi';
import { getStudentPersonalizedContent } from '../../utils/dynamicContent';

export default function LearningPath() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(authUser || null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoadingProfile(true);
      setLoadingRecommendations(true);

      let activeUser = authUser;

      try {
        const userRes = await api.get('/users/me');
        if (userRes.data) {
          activeUser = userRes.data;
          if (isMounted) setProfile(activeUser);
        }
      } catch {
        // Fallback to auth context
      } finally {
        if (isMounted) setLoadingProfile(false);
      }

      try {
        const qual = activeUser?.qualification || 'Senior Secondary';
        const stream = activeUser?.stream || '';
        const res = await api.get('/courses/recommendations', {
          params: { qualification: qual, stream }
        });

        if (isMounted && res.data && Array.isArray(res.data.courses)) {
          setRecommendedCourses(res.data.courses);
        }
      } catch (err) {
        console.error('Failed to fetch learning path recommendations:', err);
      } finally {
        if (isMounted) setLoadingRecommendations(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  const currentUser = profile || authUser;
  const qualificationLabel = currentUser?.qualification || 'Senior Secondary';
  const streamLabel = currentUser?.stream || 'General Stream';
  const personalized = useMemo(() => getStudentPersonalizedContent(currentUser), [currentUser]);

  const isLoading = loadingProfile || loadingRecommendations;

  if (isLoading) {
    return (
      <div className="page-container" style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="spinner" style={{ width: '36px', height: '36px' }} />
          <p style={{ color: '#cbd5e1', fontSize: '1rem', fontWeight: 600 }}>
            Building your personalized learning roadmap...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div className="card" style={{ padding: '1.75rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6), rgba(15, 23, 42, 0.8))', border: '1px solid rgba(108, 99, 255, 0.3)', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-accent" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                <FiTarget style={{ marginRight: '0.3rem' }} /> {personalized.titleLevel}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600 }}>
                {streamLabel}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
              🗺️ Personalized Learning Roadmap
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
              {personalized.tagline || 'Customized sequence of course modules and skill milestones tailored specifically to your qualification profile.'}
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Matched Qualification
            </div>
            <div style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 700, marginTop: '0.2rem' }}>
              {qualificationLabel.split('(')[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Courses Roadmap Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Recommended Course Sequence
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
              Step-by-step curriculum dynamically matched from live server recommendations
            </p>
          </div>
          <span className="badge badge-accent" style={{ fontSize: '0.82rem', padding: '0.35rem 0.8rem' }}>
            {recommendedCourses.length} Tailored Courses
          </span>
        </div>

        {recommendedCourses.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '16px' }}>
            <FiCompass size={36} style={{ color: '#818cf8', marginBottom: '0.75rem' }} />
            <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              No custom recommendations found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.25rem' }}>
              We could not find specialized course modules matching this specific qualification. Explore all available courses in our catalog!
            </p>
            <Link to="/courses" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem', textDecoration: 'none' }}>
              Browse All Courses
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recommendedCourses.map((course, index) => (
              <div 
                key={course.id || index}
                className="card"
                style={{
                  padding: '1.5rem',
                  background: 'rgba(30, 27, 75, 0.25)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  position: 'relative'
                }}
              >
                <div 
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6c63ff, #4f46e5)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)'
                  }}
                >
                  {index + 1}
                </div>

                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                      {course.subject}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <FiStar fill="#fbbf24" size={13} /> {course.avgRating || 4.9} ({course.totalStudents || 12000}+ students)
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.4rem 0' }}>
                    {course.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                    {course.description}
                  </p>

                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
                    <span>👨‍🏫 Instructor: <strong style={{ color: '#fff' }}>{course.instructorName || 'Senior Faculty'}</strong></span>
                    <span>📚 Lessons: <strong style={{ color: '#fff' }}>{course.totalLessons || 20} Modules</strong></span>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <Link
                    to={`/courses/${course.id}/learn?v=${course.videoId || ''}`}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.65rem 1.25rem', fontWeight: 600 }}
                  >
                    <FiPlayCircle size={16} /> Start Module <FiArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Milestones Overview */}
      <div className="card" style={{ padding: '1.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiAward style={{ color: '#818cf8' }} /> Roadmap Completion Milestones
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, marginBottom: '0.3rem' }}>STAGE 1</div>
            <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>Foundational Concepts</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>Core fundamentals and theory orientation</div>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, marginBottom: '0.3rem' }}>STAGE 2</div>
            <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>Interactive Practice</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>Hands-on exercises and video walkthroughs</div>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, marginBottom: '0.3rem' }}>STAGE 3</div>
            <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>Assessment & Mastery</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>Topic quizzes and milestone certification</div>
          </div>
        </div>
      </div>
    </div>
  );
}

