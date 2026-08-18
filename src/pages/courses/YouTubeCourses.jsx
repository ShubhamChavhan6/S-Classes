// src/pages/courses/YouTubeCourses.jsx
import { useState, useEffect } from 'react';
import YouTubePlayer from '../../components/YouTubePlayer';
import { FiTv } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { recordCourseWatch } from '../../utils/dynamicContent';

export default function YouTubeCourses() {
  const { user } = useAuth();
  const [activeVideo, setActiveVideo] = useState({ id: 'fNKUz1N9N1g', title: 'CBSE Class 10 Math Quadratic Equations', instructor: 'Prof. Sharma', subject: 'Maths' });

  const videos = [
    { id: 'fNKUz1N9N1g', title: 'CBSE Class 10 Math Quadratic Equations', instructor: 'Prof. Sharma', subject: 'Maths' },
    { id: 'aircAruvnKk', title: 'Class 10 Physics: Electricity Full Lecture', instructor: 'Dr. Ananya Roy', subject: 'Science' },
    { id: 'rfscVS0vtbw', title: 'Python Full Course for Beginners', instructor: 'Karan Patel', subject: 'Coding' },
  ];

  const handleSelectVideo = (v) => {
    setActiveVideo(v);
    recordCourseWatch(user, {
      id: `yt-${v.id}`,
      title: v.title,
      subject: v.subject || 'Video Lecture',
      videoId: v.id,
      instructor: v.instructor,
      chapterTitle: 'Full YouTube Video Lecture',
      progress: 30
    });
  };

  useEffect(() => {
    recordCourseWatch(user, {
      id: `yt-${activeVideo.id}`,
      title: activeVideo.title,
      subject: activeVideo.subject || 'Video Lecture',
      videoId: activeVideo.id,
      instructor: activeVideo.instructor,
      chapterTitle: 'Full YouTube Video Lecture',
      progress: 30
    });
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FiTv color="#ff6b6b" /> Curated YouTube Video Courses
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.75rem' }}>{activeVideo.title}</h3>
          <YouTubePlayer videoId={activeVideo.id} title={activeVideo.title} />
        </div>

        <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ color: '#a5b4fc', fontSize: '0.9rem', margin: 0 }}>Course Playlist</h4>
          {videos.map(v => (
            <div 
              key={v.id} 
              onClick={() => handleSelectVideo(v)}
              style={{ padding: '0.75rem', background: activeVideo.id === v.id ? '#1e1b4b' : '#121218', border: '1px solid #242434', borderRadius: '8px', cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{v.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{v.instructor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
