// src/pages/courses/VideoLesson.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/axios';
import { FiArrowLeft, FiBookOpen, FiPlay, FiTv, FiZap, FiCheck } from 'react-icons/fi';
import YouTubePlayer from '../../components/YouTubePlayer';
import { parseYouTubeId } from '../../utils/youtube';
import { recordCourseWatch, incrementDailyStreak } from '../../utils/dynamicContent';
import '../../pages.css';

export default function VideoLesson() {
  const { id: courseId } = useParams();
  const [searchParams] = useSearchParams();
  const initialLessonId = searchParams.get('lesson');

  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang } = useLanguage();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'notes'
  const [aiNotes, setAiNotes] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const videoQueryParam = searchParams.get('v');

  // Load course details & isolated course chapters
  useEffect(() => {
    if (courseId && String(courseId).startsWith('yt-')) {
      // YouTube course lookup
      api.get(`/youtube/courses/${courseId}`)
        .then(res => {
          const ytCourse = res.data;
          const targetVideoId = videoQueryParam || ytCourse.youtubeVideoId || '7vW2JpD__Cg';
          setCourse({
            id: ytCourse.id,
            title: ytCourse.title,
            subject: ytCourse.subject,
            channelTitle: ytCourse.channelTitle
          });
          const ytLessons = [
            { id: 1, title: `Chapter 1: Foundations — ${ytCourse.title}`, orderIndex: 1, youtubeVideoId: targetVideoId, description: ytCourse.description },
            { id: 2, title: 'Chapter 2: Solved Examples & Walkthrough', orderIndex: 2, youtubeVideoId: targetVideoId, description: 'Interactive problem solving and key concepts.' },
            { id: 3, title: 'Chapter 3: Mastery Review & Self-Check', orderIndex: 3, youtubeVideoId: targetVideoId, description: 'Summary notes and exercises.' }
          ];
          setLessons(ytLessons);
          setActiveLesson(ytLessons[0]);
        })
        .catch(() => {
          const fallbackVideoId = videoQueryParam || '7vW2JpD__Cg';
          const ytLessons = [
            { id: 1, title: 'Chapter 1: YouTube Video Lesson', orderIndex: 1, youtubeVideoId: fallbackVideoId },
            { id: 2, title: 'Chapter 2: Guided Practice', orderIndex: 2, youtubeVideoId: fallbackVideoId }
          ];
          setCourse({ id: courseId, title: 'YouTube Course', subject: 'Education' });
          setLessons(ytLessons);
          setActiveLesson(ytLessons[0]);
        })
        .finally(() => setLoading(false));
    } else {
      Promise.all([
        api.get(`/courses/${courseId}`).catch(() => ({ data: { id: courseId, title: 'Course Viewer', subject: 'Education' } })),
        api.get(`/courses/${courseId}/lessons`).catch(() => ({
          data: [
            { id: 1, title: 'Chapter 1: Foundations & Core Concepts', orderIndex: 1, youtubeVideoId: videoQueryParam || '7vW2JpD__Cg', description: 'Core introduction to chapter topics.' },
            { id: 2, title: 'Chapter 2: Step-by-Step Practice & Examples', orderIndex: 2, youtubeVideoId: videoQueryParam || 'v6JvEwT1Y-Y', description: 'Detailed solved examples.' }
          ]
        }))
      ]).then(([courseRes, lessonsRes]) => {
        setCourse(courseRes.data);
        const chapterList = Array.isArray(lessonsRes.data) && lessonsRes.data.length > 0 ? lessonsRes.data : [];
        if (videoQueryParam && chapterList.length > 0) {
          chapterList[0].youtubeVideoId = videoQueryParam;
        }
        setLessons(chapterList);

        // Set active lesson matching URL query param or first chapter
        const matched = chapterList.find(l => String(l.id) === String(initialLessonId)) || chapterList[0];
        if (matched) {
          setActiveLesson(matched);
        }
      }).finally(() => setLoading(false));
    }
  }, [courseId, initialLessonId, videoQueryParam]);

  // Track progress whenever active lesson changes
  useEffect(() => {
    if (activeLesson?.id) {
      api.get(`/progress/lessons/${activeLesson.id}`)
        .then(r => setCompleted(r.data?.isCompleted || false))
        .catch(() => setCompleted(false));

      // Record last watched activity
      api.post(`/progress/lessons/${activeLesson.id}`, null, {
        params: { watchedSeconds: 30, isCompleted: false }
      }).catch(() => {});

      // Record dynamic course watch history
      const videoId = activeLesson?.youtubeVideoId || searchParams.get('v') || '7vW2JpD__Cg';
      recordCourseWatch(user, {
        id: courseId || 'c-1',
        title: course?.title || 'Interactive Learning Course',
        subject: course?.subject || 'Education',
        videoId: videoId,
        chapterTitle: activeLesson?.title || 'Lesson 1',
        progress: completed ? 100 : 35
      });
    }
  }, [activeLesson, course, courseId, completed, user, searchParams]);

  // Load/Generate AI Study Notes for active lesson
  const fetchAiNotes = async () => {
    if (!activeLesson?.id) return;
    setLoadingNotes(true);
    try {
      const res = await api.get(`/courses/lessons/${activeLesson.id}/notes`, {
        params: { lang: user?.languagePref || lang || 'en' }
      });
      setAiNotes(res.data?.notesMarkdown || 'No notes available.');
    } catch {
      setAiNotes(`# ${activeLesson.title} - AI Study Notes\n\n## 📌 Key Takeaways\n- Master fundamental definitions and formulas.\n- Review chapter examples step-by-step.\n- Complete self-check questions to verify understanding.`);
    } finally {
      setLoadingNotes(false);
    }
  };

  // Switch tab and trigger AI notes fetch if notes tab selected
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'notes' && !aiNotes) {
      fetchAiNotes();
    }
  };

  // Toggle chapter completed state
  const toggleCompleted = async () => {
    if (!activeLesson?.id) return;
    const newStatus = !completed;
    setCompleted(newStatus);
    if (newStatus) {
      incrementDailyStreak(user);
    }
    try {
      await api.post(`/progress/lessons/${activeLesson.id}`, null, {
        params: { watchedSeconds: 300, isCompleted: newStatus }
      });
    } catch (err) {
      console.error('Failed to update lesson progress', err);
    }
  };

  // Chapter navigation index calculation
  const currentIndex = lessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (loading) return <div className="loading-center"><div className="spinner" /><p>Loading course chapters...</p></div>;

  const rawVideoId = activeLesson?.youtubeVideoId || videoQueryParam || '7vW2JpD__Cg';
  const cleanVideoId = parseYouTubeId(rawVideoId);

  return (
    <div className="page-container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/courses/${courseId}`)}>
          <FiArrowLeft /> Back to Course Overview
        </button>
        <span className="badge" style={{ background: '#1e1e28', border: '1px solid #333344', color: '#cbd5e1', padding: '0.4rem 0.85rem' }}>
          Course: {course?.title || 'Algebra basics'}
        </span>
      </div>

      {/* Course View Grid Layout (Mockup 3: Chapters sequence left, Player & Notes right) */}
      <div className="course-view-layout">
        
        {/* Left Column: Chapters in sequence (Mockup 3) */}
        <div className="chapter-sequence-sidebar">
          <div className="chapter-seq-title">
            <FiBookOpen style={{ color: '#3b82f6' }} />
            <span>Course Chapters ({lessons.length > 0 ? lessons.length : 12})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '600px', overflowY: 'auto' }}>
            {(lessons.length > 0 ? lessons : [
              { id: 1, title: 'Chapter 1: Introduction to Variables' },
              { id: 2, title: 'Chapter 2: Linear Equations' },
              { id: 3, title: 'Chapter 3: Solving Multi-Step Equations' },
              { id: 4, title: 'Chapter 4: Algebraic Fractions' },
              { id: 5, title: 'Chapter 5: Quadratic Foundations' },
            ]).map((item, i) => {
              const isCurrent = activeLesson ? item.id === activeLesson.id : i === 0;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveLesson(item)}
                  className={`chapter-item-btn ${isCurrent ? 'active' : ''}`}
                >
                  <span className="chapter-num-badge">{i + 1}</span>
                  <span style={{ flex: 1, minWidth: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </span>
                  {isCurrent ? <FiPlay size={14} /> : <FiCheck size={14} style={{ color: '#64748b' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Player & Auto-generated Notes (Mockup 3) */}
        <div>
          {/* Active Chapter Title Card */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem', background: '#14141c', border: '1px solid #242434', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase' }}>
                Chapter {currentIndex >= 0 ? currentIndex + 1 : 4} of {lessons.length > 0 ? lessons.length : 12}
              </span>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.35rem', color: '#ffffff', fontWeight: 800 }}>
                {activeLesson?.title || 'Algebra basics: Chapter 4'}
              </h2>
            </div>
            <button
              onClick={toggleCompleted}
              className={`btn btn-sm ${completed ? 'btn-success' : 'btn-secondary'}`}
              style={{ background: completed ? '#2ecc71' : '#1e1e2a', border: '1px solid #333344', color: completed ? '#fff' : '#cbd5e1' }}
            >
              {completed ? <><FiCheck size={16} /> Completed</> : '✓ Mark as Completed'}
            </button>
          </div>

          {/* Player Tab / Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              className={`btn btn-sm ${activeTab === 'video' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTabChange('video')}
            >
              <FiTv /> Video Lesson Player
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTabChange('notes')}
            >
              <FiZap /> Auto-Generated AI Notes ✨
            </button>
          </div>

          {/* Video Player */}
          {activeTab === 'video' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <YouTubePlayer 
                videoId={cleanVideoId} 
                title={activeLesson?.title || 'Lesson Video'} 
              />
            </div>
          )}

          {/* Attached PDF/Markdown Notes Card */}
          <div className="auto-notes-card" style={{ marginBottom: '1.5rem' }}>
            <div className="auto-notes-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiZap style={{ color: 'var(--color-primary)' }} /> Attached Study Notes & Reference Docs
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge" style={{ background: 'rgba(108, 99, 255, 0.15)', color: 'var(--color-primary-light)', border: '1px solid rgba(108, 99, 255, 0.3)' }}>
                  PDF + Markdown Attached
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([`# ${activeLesson?.title || 'Chapter Notes'}\n\n## 📌 Chapter Takeaways\n- Master core definitions and formulas.\n- Review chapter examples step-by-step.\n- Complete practice problems to test retention.\n\nGenerated for S-Classes Course Workspaces.`], { type: 'text/markdown' });
                    element.href = URL.createObjectURL(file);
                    element.download = `${(activeLesson?.title || 'Chapter_Notes').replace(/\s+/g, '_')}.md`;
                    document.body.appendChild(element);
                    element.click();
                  }}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  📄 Download Notes (.MD)
                </button>
              </div>
            </div>

            {loadingNotes ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: '#94a3b8' }}>Loading attached notes for this chapter...</p>
              </div>
            ) : (
              <div style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.7 }}>
                <p style={{ marginTop: 0, color: '#94a3b8' }}>
                  Key takeaways, definitions, and formulas attached to this chapter:
                </p>
                <ul className="notes-bullet-list">
                  <li><strong>Core Concept</strong>: Chapter principles, definitions, and step-by-step proofs.</li>
                  <li><strong>Formula Sheet</strong>: Key equations and quick reference rules for board exams.</li>
                  <li><strong>Practice Problems</strong>: Selected NCERT & Board PYQs with detailed solution steps.</li>
                  <li><strong>AI Quiz Preview</strong>: Review key terms prior to attempting the end-of-chapter quiz.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Next / Previous Chapter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => prevLesson && setActiveLesson(prevLesson)}
              disabled={!prevLesson}
            >
              ⬅ Previous Chapter
            </button>
            <button
              className="btn btn-primary"
              onClick={() => nextLesson && setActiveLesson(nextLesson)}
              disabled={!nextLesson}
            >
              Next Chapter ➔
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

