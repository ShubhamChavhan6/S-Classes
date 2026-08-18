import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { FiSearch, FiBook, FiFilter, FiStar, FiUsers, FiGlobe, FiTv, FiCode } from 'react-icons/fi';
import '../../pages.css';

const GLOBAL_MULTILINGUAL_CATALOG = [
  { id: 'demo-1', title: 'CBSE Class 10 Mathematics — Full NCERT Course', mode: 'SCHOOL', level: 'INTERMEDIATE', subject: 'Mathematics', language: 'Hindi & English', source: 'YouTube (Dear Sir)', avgRating: 4.9, totalStudents: 15400, description: 'Complete NCERT Class 10 Maths coverage: Real Numbers, Polynomials, Linear Equations, Quadratic Equations, and Trigonometry with solved board PYQs.' },
  { id: 'demo-2', title: 'Class 10 CBSE Science — Physics & Chemistry (NCERT)', mode: 'SCHOOL', level: 'INTERMEDIATE', subject: 'Science', language: 'Hindi', source: 'YouTube (Physics Wallah)', avgRating: 4.9, totalStudents: 18200, description: 'Comprehensive CBSE Class 10 Science: Light Reflection, Electricity, Magnetic Effects, Chemical Reactions, and Acids/Bases with ray diagrams and numericals.' },
  { id: 'demo-4', title: 'Python Programming Full Course for Beginners in Hindi', mode: 'ADVANCED', level: 'BEGINNER', subject: 'Python', language: 'Hindi', source: 'Open Source (CodeWithHarry)', avgRating: 4.9, totalStudents: 22400, description: 'Learn Python programming from complete scratch in Hindi — syntax, data structures, OOP concepts, mini-projects, and interview prep.' },
  { id: 'demo-6', title: 'Full Stack Web Development (HTML, CSS, JS, React & Node)', mode: 'ADVANCED', level: 'INTERMEDIATE', subject: 'Web Dev', language: 'English & Hindi', source: 'YouTube (Apna College)', avgRating: 4.8, totalStudents: 14100, description: 'Build modern responsive websites and web applications. Master React.js, Express, Node.js, and MongoDB with practical projects.' },
  { id: 'demo-5', title: 'Spoken English & Grammar Masterclass for Indian Learners', mode: 'LANGUAGE', level: 'BEGINNER', subject: 'English', language: 'English & Hindi', source: 'Open Source (Dear Sir)', avgRating: 4.8, totalStudents: 12900, description: 'Master English grammar tenses, active/passive voice, vocabulary, pronunciation, and daily sentence practice.' },
  { id: 'demo-8', title: 'Hindi Language & Varnamala for Primary Students', mode: 'LANGUAGE', level: 'BEGINNER', subject: 'Hindi', language: 'Hindi', source: 'YouTube (Sunita Gupta)', avgRating: 4.8, totalStudents: 6400, description: 'Learn to read, write, and pronounce Hindi alphabets (क ख ग), matras, vocabulary, and simple stories.' },
  { id: 'demo-9', title: 'Data Structures & Algorithms (DSA) in C++ / Java', mode: 'ADVANCED', level: 'ADVANCED', subject: 'DSA', language: 'Hindi & English', source: 'YouTube (Striver / TakeUforward)', avgRating: 4.9, totalStudents: 11200, description: 'Crack campus placement interviews at top IT companies. Master Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, and DP.' },
  { id: 'demo-10', title: 'Marathi Language & Grammar — Alphabets & Conversation', mode: 'LANGUAGE', level: 'BEGINNER', subject: 'Marathi', language: 'Marathi', source: 'Open Source', avgRating: 4.7, totalStudents: 4900, description: 'Learn Marathi script (मराठी मूळाक्षरे), basic grammar rules, daily conversations, and school textbook lessons.' },
  { id: 'yt-1', title: 'JavaScript & React.js Complete Modern Web Dev Series', mode: 'ADVANCED', level: 'INTERMEDIATE', subject: 'JavaScript', language: 'English', source: 'YouTube Open Source', avgRating: 4.9, totalStudents: 8900, description: 'Deep dive into ES6+, async/await, DOM manipulation, React hooks, state management, and API integration.' },
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [catalog, setCatalog] = useState(GLOBAL_MULTILINGUAL_CATALOG);

  useEffect(() => {
    api.get('/courses?size=50')
      .then(res => {
        const list = res.data?.content || res.data;
        if (Array.isArray(list) && list.length > 0) {
          const combined = [...list, ...GLOBAL_MULTILINGUAL_CATALOG];
          // deduplicate
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          setCatalog(unique);
        }
      })
      .catch(() => setCatalog(GLOBAL_MULTILINGUAL_CATALOG));
  }, []);

  const hasQuery = Boolean(query.trim());

  const filteredResults = hasQuery
    ? catalog.filter(course => {
        const q = query.toLowerCase();
        const matchesQuery =
          course.title?.toLowerCase().includes(q) ||
          course.description?.toLowerCase().includes(q) ||
          course.subject?.toLowerCase().includes(q) ||
          course.language?.toLowerCase().includes(q);

        const matchesLang = !langFilter || course.language?.toLowerCase().includes(langFilter.toLowerCase());
        const matchesMode = !modeFilter || course.mode === modeFilter;
        const matchesLevel = !levelFilter || course.level === levelFilter;

        return matchesQuery && matchesLang && matchesMode && matchesLevel;
      })
    : [];

  const handleQuickTag = (tag) => {
    setQuery(tag);
  };

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(108, 99, 255, 0.12)', border: '1px solid rgba(108, 99, 255, 0.3)', borderRadius: '20px', color: 'var(--color-primary-light)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <FiGlobe /> Global Multilingual Open-Source Catalog
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
          Search Global Courses
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
          Search across programming languages, school subjects, and open-source YouTube playlists in Hindi, English, and regional languages.
        </p>
      </div>

      {/* Global Search Input Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
        <div style={{ position: 'relative' }}>
          <FiSearch size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Type query to search (e.g. Java 21, Java OOPs, ICSE Java, DSA, Math)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: '3.25rem', fontSize: '1.1rem', height: '56px', borderRadius: '16px', background: 'rgba(15, 15, 30, 0.8)', border: '2px solid rgba(108, 99, 255, 0.4)', color: '#fff' }}
          />
        </div>

        {/* Quick Tag Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Popular:</span>
          {['Java 21', 'Java OOPs', 'DSA in Java', 'ICSE Class 10 Java', 'Spring Boot', 'Class 10 Science'].map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTag(tag)}
              className="btn btn-sm"
              style={{ background: query === tag ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.06)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* When NO query is typed (Catalog visible only upon query) */}
      {!hasQuery && (
        <div className="card animate-fadeInUp" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem', textAlign: 'center', background: 'rgba(20, 20, 35, 0.6)', border: '1px border-dashed rgba(108, 99, 255, 0.3)', borderRadius: '20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Catalog Visible Upon Query
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Type a search term above to filter through our global collection of YouTube & Open Source learning modules across English, Hindi, and regional languages.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'left', marginTop: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <FiCode style={{ color: '#6c63ff', marginBottom: '0.5rem' }} size={22} />
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>Programming</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Python, JS, React, DSA</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <FiBook style={{ color: '#38bdf8', marginBottom: '0.5rem' }} size={22} />
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>NCERT & CBSE</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Class 5 to 12 Subjects</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <FiTv style={{ color: '#2ecc71', marginBottom: '0.5rem' }} size={22} />
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>Open Source</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>YouTube Playlists & Notes</div>
            </div>
          </div>
        </div>
      )}

      {/* When query IS provided */}
      {hasQuery && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem', background: 'rgba(15, 15, 25, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiFilter /> Filters:
            </span>

            <select className="filter-select" value={langFilter} onChange={e => setLangFilter(e.target.value)}>
              <option value="">All Languages</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Marathi">Marathi</option>
            </select>

            <select className="filter-select" value={modeFilter} onChange={e => setModeFilter(e.target.value)}>
              <option value="">All Categories</option>
              <option value="SCHOOL">School Subjects</option>
              <option value="ADVANCED">Programming & Tech</option>
              <option value="LANGUAGE">Language Learning</option>
            </select>

            <select className="filter-select" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>

            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
              Found {filteredResults.length} course{filteredResults.length === 1 ? '' : 's'}
            </span>
          </div>

          {filteredResults.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <FiBook size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3 style={{ marginBottom: '0.5rem', color: '#fff' }}>No Courses Found for "{query}"</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Try searching for keywords like "Python", "Math", "Science", or "Hindi".
              </p>
            </div>
          ) : (
            <div className="courses-grid">
              {filteredResults.map(course => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="card course-card animate-fadeInUp"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div className="course-card-thumb-placeholder">
                    <FiBook size={32} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="course-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-school" style={{ fontSize: '0.75rem' }}>
                        {course.subject || 'General'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#2ecc71', background: 'rgba(46,204,113,0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        🌐 {course.language || 'Multilingual'}
                      </span>
                    </div>

                    <div className="course-card-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                      {course.title}
                    </div>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', flex: 1 }}>
                      {course.description}
                    </p>

                    <div className="course-card-meta" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                      <span className="course-card-rating">
                        <FiStar size={12} /> {course.avgRating || 4.8}
                      </span>
                      <span><FiUsers size={12} /> {(course.totalStudents || 1200).toLocaleString()}</span>
                      <span style={{ color: 'var(--color-primary-light)', fontSize: '0.75rem' }}>{course.source || 'Open Source'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
