// src/pages/courses/CourseList.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBook, FiSearch, FiCode, FiAward, 
  FiClock, FiStar, FiPlay, FiFilter
} from 'react-icons/fi';

const LEARNING_COURSES = [
  // Programming & Software
  {
    id: 'java-21-mastery',
    title: 'Java 21 LTS: Modern Core, OOPs & Enterprise Concurrency',
    category: 'Programming',
    tags: ['Programming', 'Java 21', 'OOPs', 'Backend'],
    level: 'Intermediate',
    lessonsCount: 36,
    duration: '42 hrs',
    rating: 4.9,
    studentsCount: '12.4k',
    board: 'Tech / Placement',
    badgeColor: '#f59e0b',
    description: 'Deep dive into Java 21 features: Pattern Matching, Records, Sealed Classes, Virtual Threads, and JVM Memory Bytecode internals.',
    actionLink: '/playground',
    actionText: 'Launch Java 21 IDE',
    isPlayground: true
  },
  {
    id: 'icse-java-10',
    title: 'ICSE Class 10 Java Computer Applications & Board PYQs',
    category: 'Programming',
    tags: ['Programming', 'School', 'Java 21', 'ICSE'],
    level: 'Beginner',
    lessonsCount: 28,
    duration: '30 hrs',
    rating: 4.95,
    studentsCount: '8.7k',
    board: 'ICSE Board',
    badgeColor: '#3b82f6',
    description: '100% syllabus aligned for ICSE Class 10. Master Strings, Arrays, Functions, Nested Loops, and solved past 10-year board questions.',
    actionLink: '/courses/course-5/learn',
    actionText: 'Start ICSE Java'
  },
  {
    id: '3',
    title: 'Python & Data Structures from Scratch to Placements',
    category: 'Programming',
    tags: ['Programming', 'Python', 'DSA', 'Algorithms'],
    level: 'Beginner',
    lessonsCount: 32,
    duration: '38 hrs',
    rating: 4.85,
    studentsCount: '15.1k',
    board: 'Placement Prep',
    badgeColor: '#10b981',
    description: 'Master Python syntax, OOP, dynamic arrays, linked lists, binary trees, recursion, and algorithm optimization with LeetCode problems.',
    actionLink: '/courses/3/learn',
    actionText: 'Start Python DSA'
  },
  {
    id: '4',
    title: 'Full-Stack Web Development: React 18, Node & REST APIs',
    category: 'Programming',
    tags: ['Programming', 'React', 'JavaScript', 'Web Dev'],
    level: 'Intermediate',
    lessonsCount: 28,
    duration: '35 hrs',
    rating: 4.88,
    studentsCount: '9.8k',
    board: 'Career Track',
    badgeColor: '#8b5cf6',
    description: 'Build production-ready web apps with React, custom hooks, Tailwind CSS, Node.js Express server, and secure JWT authentication.',
    actionLink: '/courses/4/learn',
    actionText: 'Start Web Dev'
  },

  // Language & Verbal Mastery
  {
    id: 'lang-english-fluency',
    title: 'Spoken English Mastery, Grammar & Professional Writing',
    category: 'Language',
    tags: ['Language', 'English', 'Grammar', 'Communication'],
    level: 'Beginner',
    lessonsCount: 25,
    duration: '22 hrs',
    rating: 4.89,
    studentsCount: '18.3k',
    board: 'General & Career',
    badgeColor: '#ec4899',
    description: 'Develop spoken fluency, correct common Indian English mistakes, master email writing, public speaking, and active vocabulary.',
    actionLink: '/courses/course-lang-en/learn',
    actionText: 'Start English'
  },
  {
    id: 'lang-hindi-vyakaran',
    title: 'CBSE Class 9 & 10 Hindi Vyakaran, Sahitya & Rachna',
    category: 'Language',
    tags: ['Language', 'Hindi', 'School', 'Grammar'],
    level: 'Beginner',
    lessonsCount: 20,
    duration: '18 hrs',
    rating: 4.92,
    studentsCount: '7.2k',
    board: 'CBSE Board',
    badgeColor: '#f97316',
    description: 'Complete NCERT Hindi Sparsh & Sanchayan chapters, Sandhi, Samas, Muhavare, Alankar, and board essay/letter formats.',
    actionLink: '/courses/course-lang-hi/learn',
    actionText: 'Start Hindi'
  },
  {
    id: 'lang-marathi-sahitya',
    title: 'Maharashtra State Board Marathi Aksharbharati & Vyakaran',
    category: 'Language',
    tags: ['Language', 'Marathi', 'School', 'State Board'],
    level: 'Beginner',
    lessonsCount: 18,
    duration: '16 hrs',
    rating: 4.91,
    studentsCount: '5.9k',
    board: 'Maharashtra State',
    badgeColor: '#06b6d4',
    description: 'Thorough coverage of Marathi grammar, Sulabhbharati prose/poetry, comprehension questions, and board exam writing skills.',
    actionLink: '/courses/course-lang-mr/learn',
    actionText: 'Start Marathi'
  },
  {
    id: 'lang-french-intro',
    title: 'French Language for Beginners (A1 Level & School)',
    category: 'Language',
    tags: ['Language', 'French', 'Beginner', 'Vocabulary'],
    level: 'Beginner',
    lessonsCount: 16,
    duration: '14 hrs',
    rating: 4.82,
    studentsCount: '3.4k',
    board: 'International / CBSE',
    badgeColor: '#6366f1',
    description: 'Basic French greetings, verbs (être/avoir), numbers, everyday conversation, pronunciation phonetics, and interactive quizzes.',
    actionLink: '/courses/course-lang-fr/learn',
    actionText: 'Start French'
  },

  // Science
  {
    id: '2',
    title: 'Class 10 Physics: Electricity, Magnetism & Ray Optics',
    category: 'Science',
    tags: ['Science', 'Physics', 'School', 'CBSE'],
    level: 'Intermediate',
    lessonsCount: 18,
    duration: '24 hrs',
    rating: 4.94,
    studentsCount: '14.2k',
    board: 'CBSE & State',
    badgeColor: '#00d2d3',
    description: 'Master Ohm’s law, series/parallel circuits, Fleming’s left-hand rule, mirror/lens formula numericals, and ray diagram step-by-steps.',
    actionLink: '/courses/2/learn',
    actionText: 'Start Physics'
  },
  {
    id: 'sci-chemistry-reactions',
    title: 'Class 10 Chemistry: Chemical Reactions, Acids, Bases & Metals',
    category: 'Science',
    tags: ['Science', 'Chemistry', 'School', 'CBSE'],
    level: 'Beginner',
    lessonsCount: 22,
    duration: '26 hrs',
    rating: 4.91,
    studentsCount: '11.5k',
    board: 'NCERT CBSE',
    badgeColor: '#10b981',
    description: 'Balanced equation shortcuts, pH scale calculations, reactivity series, carbon compounds, and laboratory practical reactions.',
    actionLink: '/courses/course-chem/learn',
    actionText: 'Start Chemistry'
  },
  {
    id: 'sci-biology-genetics',
    title: 'Class 10 Biology: Life Processes, Control & Genetics',
    category: 'Science',
    tags: ['Science', 'Biology', 'School', 'Medical Foundation'],
    level: 'Beginner',
    lessonsCount: 20,
    duration: '21 hrs',
    rating: 4.93,
    studentsCount: '10.8k',
    board: 'CBSE & NEET Prep',
    badgeColor: '#14b8a6',
    description: 'Detailed animations of human circulatory system, nephron structure, Mendel’s laws of inheritance, and reproductive systems.',
    actionLink: '/courses/course-bio/learn',
    actionText: 'Start Biology'
  },

  // Mathematics
  {
    id: '1',
    title: 'CBSE Class 10 Mathematics Masterclass & PYQ Solver',
    category: 'Mathematics',
    tags: ['Mathematics', 'School', 'CBSE', 'Algebra', 'Trigonometry'],
    level: 'Intermediate',
    lessonsCount: 24,
    duration: '32 hrs',
    rating: 4.97,
    studentsCount: '21.6k',
    board: 'CBSE Board',
    badgeColor: '#6c63ff',
    description: 'Step-by-step solutions for Quadratic Equations, Arithmetic Progressions, Trigonometric Identities, Circles, and Surface Areas.',
    actionLink: '/courses/1/learn',
    actionText: 'Start Mathematics'
  },
  {
    id: 'math-geometry-trig',
    title: 'Class 10 Coordinate Geometry & Trigonometric Proofs',
    category: 'Mathematics',
    tags: ['Mathematics', 'Geometry', 'Trigonometry', 'School'],
    level: 'Intermediate',
    lessonsCount: 15,
    duration: '18 hrs',
    rating: 4.88,
    studentsCount: '8.4k',
    board: 'CBSE & ICSE',
    badgeColor: '#a855f7',
    description: 'Distance formula, Section formula, Area of triangles, Heights and Distances angle of elevation/depression word problems.',
    actionLink: '/courses/course-math-trig/learn',
    actionText: 'Start Geometry'
  },

  // AI & Data
  {
    id: 'ai-prompt-engineering',
    title: 'Generative AI, Prompt Engineering & LLM Application Lab',
    category: 'AI & Data',
    tags: ['AI & Data', 'Programming', 'AI & Tools', 'Gemini'],
    level: 'Beginner',
    lessonsCount: 14,
    duration: '16 hrs',
    rating: 4.96,
    studentsCount: '16.7k',
    board: 'Future Tech',
    badgeColor: '#f43f5e',
    description: 'Build real-world AI applications with Gemini 2.5 API, zero-shot and few-shot prompt crafting, function calling, and RAG pipelines.',
    actionLink: '/ai-tutor',
    actionText: 'Launch AI Tutor',
    isAi: true
  }
];

const AVAILABLE_TAGS = [
  'All',
  'Programming',
  'Language',
  'Science',
  'Mathematics',
  'AI & Data',
  'School'
];

const DIFFICULTY_LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function CourseList() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate tag counts
  const tagCounts = useMemo(() => {
    const counts = { All: LEARNING_COURSES.length };
    AVAILABLE_TAGS.forEach(tag => {
      if (tag === 'All') return;
      counts[tag] = LEARNING_COURSES.filter(c => 
        c.tags.includes(tag) || c.category === tag
      ).length;
    });
    return counts;
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return LEARNING_COURSES.filter(course => {
      // Tag matching
      const matchesTag = selectedTag === 'All' || 
        course.tags.includes(selectedTag) || 
        course.category === selectedTag;

      // Level matching
      const matchesLevel = selectedLevel === 'All Levels' || 
        course.level.toLowerCase() === selectedLevel.toLowerCase();

      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.tags.some(t => t.toLowerCase().includes(query)) ||
        course.board.toLowerCase().includes(query);

      return matchesTag && matchesLevel && matchesSearch;
    });
  }, [selectedTag, selectedLevel, searchQuery]);

  return (
    <div className="page-container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      
      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(14, 165, 233, 0.12) 100%)', 
        border: '1px solid rgba(99, 102, 241, 0.3)', 
        borderRadius: '20px', 
        padding: '2rem 1.75rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '100px', color: '#a5b4fc', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <FiAward size={14} /> Comprehensive Learning Catalog
          </div>
          <h1 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
            fontWeight: 900, 
            color: '#ffffff', 
            margin: '0 0 0.5rem 0', 
            lineHeight: 1.18,
            letterSpacing: '-0.025em',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
          }}>
            Explore All Courses, Syllabi & Coding Labs
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.98rem', margin: 0, lineHeight: 1.55 }}>
            Filter verified curriculums across <strong style={{ color: '#fbbf24' }}>Programming</strong>, <strong style={{ color: '#f472b6' }}>Language Fluency</strong>, <strong style={{ color: '#38bdf8' }}>Science</strong>, and <strong style={{ color: '#a855f7' }}>Mathematics</strong> with interactive AI tutoring and live compilation.
          </p>
        </div>
      </div>

      {/* Control Panel: Tag Filter System & Search */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', background: '#0b0f19', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px' }}>
        
        {/* Search Input Bar */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.1rem' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, keyword, board, or language (e.g. Java, Physics, English, Class 10)..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.8rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#ffffff',
              fontSize: '0.92rem',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#cbd5e1',
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Tag Filters Row */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              <FiFilter size={13} /> Filter by Domain Tag:
            </div>
            {(selectedTag !== 'All' || selectedLevel !== 'All Levels' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTag('All');
                  setSelectedLevel('All Levels');
                  setSearchQuery('');
                }}
                style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Reset All Filters ✕
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {AVAILABLE_TAGS.map(tag => {
              const isActive = selectedTag === tag;
              const count = tagCounts[tag] || 0;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '100px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    border: isActive ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isActive ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    transition: 'all 0.18s ease',
                    boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.35)' : 'none'
                  }}
                >
                  {tag === 'Programming' && '💻'}
                  {tag === 'Language' && '🗣️'}
                  {tag === 'Science' && '🔬'}
                  {tag === 'Mathematics' && '📐'}
                  {tag === 'AI & Data' && '✨'}
                  {tag === 'School' && '🏫'}
                  <span>{tag}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.1rem 0.4rem', 
                    borderRadius: '100px', 
                    background: isActive ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#ffffff' : '#94a3b8'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level Filters & Status Bar */}
        <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginRight: '0.25rem' }}>Level:</span>
            {DIFFICULTY_LEVELS.map(level => {
              const isLevelActive = selectedLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(level)}
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: isLevelActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    color: isLevelActive ? '#ffffff' : '#94a3b8'
                  }}
                >
                  {level}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Showing <strong style={{ color: '#fff' }}>{filteredCourses.length}</strong> of {LEARNING_COURSES.length} courses
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredCourses.map(course => (
            <div 
              key={course.id} 
              className="card course-explorer-card" 
              style={{ 
                padding: '1.5rem', 
                background: 'linear-gradient(180deg, #0e1320 0%, #090c16 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Card Header Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
                    padding: '0.2rem 0.55rem', 
                    borderRadius: '6px', 
                    background: `${course.badgeColor}22`,
                    color: course.badgeColor,
                    border: `1px solid ${course.badgeColor}44`,
                    textTransform: 'uppercase'
                  }}>
                    {course.category}
                  </span>
                  
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.04)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {course.board}
                  </span>
                </div>

                {/* Course Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
                  {course.title}
                </h3>

                {/* Course Description */}
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  {course.description}
                </p>

                {/* Tag Pills List */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1.1rem' }}>
                  {course.tags.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTag(t)}
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '100px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: selectedTag === t ? '#818cf8' : '#cbd5e1',
                        cursor: 'pointer'
                      }}
                      title={`Filter by ${t}`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Footer: Stats & Actions */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  fontSize: '0.75rem', 
                  color: '#94a3b8',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '1rem'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiBook size={13} style={{ color: '#818cf8' }} /> {course.lessonsCount} Lessons
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiClock size={13} style={{ color: '#38bdf8' }} /> {course.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 700 }}>
                    <FiStar size={13} /> {course.rating}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                  <Link 
                    to={course.actionLink} 
                    className="btn btn-primary btn-sm" 
                    style={{ 
                      borderRadius: '10px', 
                      fontWeight: 700, 
                      gap: '0.35rem', 
                      justifyContent: 'center',
                      background: course.isPlayground ? 'linear-gradient(135deg, #f59e0b, #d97706)' : undefined
                    }}
                  >
                    {course.isPlayground ? <FiCode size={14} /> : <FiPlay size={14} />}
                    {course.actionText}
                  </Link>

                  <Link 
                    to={`/courses/${course.id}`} 
                    className="btn btn-secondary btn-sm" 
                    style={{ borderRadius: '10px', padding: '0.4rem 0.65rem' }}
                    title="View syllabus & details"
                  >
                    <FiBook size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: '#0b0f19', borderRadius: '16px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
            No courses found matching your filter criteria
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            Try selecting a different tag such as <strong>Programming</strong>, <strong>Language</strong>, or <strong>Science</strong>, or clear the search query.
          </p>
          <button
            onClick={() => {
              setSelectedTag('All');
              setSelectedLevel('All Levels');
              setSearchQuery('');
            }}
            className="btn btn-primary"
            style={{ borderRadius: '10px', margin: '0 auto' }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

