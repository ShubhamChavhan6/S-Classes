// src/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  FiBook, FiCpu, FiFileText, FiLogOut, FiUser, FiSettings, 
  FiGrid, FiMenu, FiX, FiAward, FiSun, FiMoon, FiGlobe, 
  FiSearch, FiZap, FiBookmark, FiCompass, FiTv, FiCode, FiChevronDown
} from 'react-icons/fi';

const Navbar = ({ searchOpen, setSearchOpen }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { lang, setLang } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [exploreTag, setExploreTag] = useState('All');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  const dropdownRef = useRef(null);
  const exploreRef = useRef(null);
  const exploreTimeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleExploreMouseEnter = () => {
    if (exploreTimeoutRef.current) {
      clearTimeout(exploreTimeoutRef.current);
      exploreTimeoutRef.current = null;
    }
    setExploreOpen(true);
  };

  const handleExploreMouseLeave = () => {
    if (exploreTimeoutRef.current) {
      clearTimeout(exploreTimeoutRef.current);
    }
    exploreTimeoutRef.current = setTimeout(() => {
      setExploreOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (exploreTimeoutRef.current) {
        clearTimeout(exploreTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const getInitial = () => user?.name?.charAt(0)?.toUpperCase() || '?';

  // Primary nav links shown directly on desktop navbar
  const primaryNavLinks = [
    ...(isAuthenticated() ? [{ to: '/dashboard', icon: <FiGrid size={15} />, label: 'Dashboard' }] : []),
    { to: '/courses', icon: <FiBook size={15} />, label: 'Courses' },
    { to: '/ai-tutor', icon: <FiCpu size={15} />, label: 'AI Tutor', isAi: true },
  ];

  const EXPLORE_TAGS = ['All', 'Programming', 'Language', 'Science', 'Mathematics', 'AI & Tools'];

  // Categorized links nested under "Explore ▾" menu with tags
  const exploreCategories = [
    {
      title: '⚡ Code Lab & AI Engines',
      items: [
        { 
          to: '/playground', 
          icon: <FiCode size={16} />, 
          label: 'Java 21 Code Studio', 
          desc: 'Interactive compiler, OOPs, DSA & repo sources',
          badge: '☕ Java 21',
          badgeColor: '#f59e0b',
          iconBg: 'rgba(245, 158, 11, 0.15)',
          iconColor: '#fbbf24',
          tags: ['Programming', 'AI & Tools']
        },
        { 
          to: '/ai-tutor', 
          icon: <FiCpu size={16} />, 
          label: 'AI Doubt Solver', 
          desc: 'Instant concept explanations, voice help & quiz hints',
          badge: 'Gemini AI',
          badgeColor: '#818cf8',
          iconBg: 'rgba(99, 102, 241, 0.15)',
          iconColor: '#a5b4fc',
          tags: ['AI & Tools', 'Language', 'Science', 'Programming', 'Mathematics']
        },
        { 
          to: '/exam-arena', 
          icon: <FiAward size={16} />, 
          label: 'AI Exam Arena', 
          desc: 'Live timed mock tests with instant AI solutions & grading',
          badge: 'Timed Arena',
          badgeColor: '#10b981',
          iconBg: 'rgba(16, 185, 129, 0.15)',
          iconColor: '#34d399',
          tags: ['Science', 'Mathematics', 'Programming']
        },
      ]
    },
    {
      title: '📚 Academic & Career Tracks',
      items: [
        { 
          to: '/courses', 
          icon: <FiBook size={16} />, 
          label: 'All Courses & Syllabi', 
          desc: 'Browse CBSE, State Board & Java Master series',
          badge: 'Curriculum',
          badgeColor: '#38bdf8',
          iconBg: 'rgba(56, 189, 248, 0.15)',
          iconColor: '#38bdf8',
          tags: ['Programming', 'Language', 'Science', 'Mathematics']
        },
        { 
          to: '/flashcards', 
          icon: <FiZap size={16} />, 
          label: 'AI Revision Flashcards', 
          desc: 'Active recall formula decks & smart revision',
          badge: 'Active Recall',
          badgeColor: '#ec4899',
          iconBg: 'rgba(236, 72, 153, 0.15)',
          iconColor: '#f472b6',
          tags: ['Science', 'Language', 'Mathematics']
        },
        { 
          to: '/tracks', 
          icon: <FiCompass size={16} />, 
          label: 'Skill Roadmaps', 
          desc: 'Step-by-step developer & academic career roadmaps',
          badge: 'Roadmaps',
          badgeColor: '#a855f7',
          iconBg: 'rgba(168, 85, 247, 0.15)',
          iconColor: '#c084fc',
          tags: ['Programming', 'Science']
        },
        { 
          to: '/youtube-courses', 
          icon: <FiTv size={16} />, 
          label: 'YouTube Video Courses', 
          desc: 'Curated playlists, recorded lectures & chapters',
          badge: 'Free Videos',
          badgeColor: '#ef4444',
          iconBg: 'rgba(239, 68, 68, 0.15)',
          iconColor: '#f87171',
          tags: ['Programming', 'Science', 'Language', 'Mathematics']
        },
        { 
          to: '/kids', 
          icon: <FiZap size={16} />, 
          label: 'Kids Learning Hub', 
          desc: 'Gamified phonics, numbers & interactive stories',
          badge: 'Kids K-8',
          badgeColor: '#f97316',
          iconBg: 'rgba(249, 115, 22, 0.15)',
          iconColor: '#fb923c',
          tags: ['Language', 'Mathematics', 'Science']
        },
      ]
    }
  ];

  const QUICK_SEARCH_ITEMS = [
    { label: 'Java 21 JDK IDE & Compiler', type: 'Code Lab', path: '/playground' },
    { label: 'Java OOPs & DSA Placement Series', type: 'Course', path: '/courses' },
    { label: 'AI Exam Arena & Practice', type: 'Mock Test', path: '/exam-arena' },
    { label: 'AI Revision Flashcards (Java Core)', type: 'Study Tool', path: '/flashcards' },
    { label: 'Client Student Portal', type: 'Portal', path: '/client' },
    { label: 'ICSE Class 10 Java Computer Apps', type: 'School', path: '/courses' },
    { label: 'AI Doubt Solver', type: 'AI Tool', path: '/ai-tutor' },
    { label: 'Interactive Kids Phonics', type: 'Kids', path: '/kids' }
  ];

  const filteredSearch = QUICK_SEARCH_ITEMS.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleLabel = (role) => {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return 'System Administrator';
    if (role === 'INSTRUCTOR') return 'Educator / Instructor';
    return 'Student Learner';
  };

  return (
    <>
      <header className="navbar-wrapper">
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="navbar-inner">
            {/* Brand Logo */}
            <Link to="/" className="navbar-logo" title="S-Classes Learning Platform">
              <span className="navbar-logo-badge">🎓</span>
              <span>S-Classes</span>
            </Link>

            {/* Nav Links — Desktop */}
            <ul className="navbar-links">
              {primaryNavLinks.map(link => (
                <li key={link.to}>
                  <NavLink to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
                    {link.icon}
                    <span>{link.label}</span>
                    {link.isAi && <span className="badge badge-ai" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', marginLeft: '0.2rem' }}>AI</span>}
                    {location.pathname === link.to && <span className="nav-link-dot" />}
                  </NavLink>
                </li>
              ))}

              {/* Explore Mega-Dropdown */}
              <li 
                ref={exploreRef} 
                onMouseEnter={handleExploreMouseEnter}
                onMouseLeave={handleExploreMouseLeave}
                style={{ position: 'relative' }}
              >
                <button 
                  type="button"
                  onClick={() => setExploreOpen(prev => !prev)}
                  onFocus={handleExploreMouseEnter}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    padding: '0.45rem 0.95rem', 
                    borderRadius: 'var(--radius-pill)', 
                    color: exploreOpen ? '#fff' : 'var(--text-secondary)', 
                    background: exploreOpen ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    border: exploreOpen ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  aria-expanded={exploreOpen}
                >
                  <span>Explore</span>
                  <FiChevronDown size={14} style={{ transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: exploreOpen ? '#818cf8' : 'inherit' }} />
                </button>

                {exploreOpen && (
                  <div 
                    className="explore-mega-dropdown"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.65rem)',
                      right: '-120px',
                      width: '680px',
                      maxWidth: 'min(680px, calc(100vw - 2rem))',
                      background: 'linear-gradient(180deg, rgba(14, 18, 30, 0.98) 0%, rgba(9, 12, 22, 0.98) 100%)',
                      border: '1px solid rgba(99, 102, 241, 0.35)',
                      borderRadius: '20px',
                      padding: '1.25rem',
                      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(99, 102, 241, 0.12)',
                      zIndex: 1050,
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      animation: 'fadeInUp 0.22s ease-out'
                    }}
                  >
                    {/* Tag-Based Filter System Header */}
                    <div style={{ marginBottom: '1.1rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                          🏷️ Filter by Tag:
                        </span>
                        {exploreTag !== 'All' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExploreTag('All');
                            }}
                            style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Reset to All ✕
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {EXPLORE_TAGS.map(tag => {
                          const isActive = exploreTag === tag;
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExploreTag(tag);
                              }}
                              style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '100px',
                                fontSize: '0.73rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: isActive ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                                background: isActive ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255, 255, 255, 0.03)',
                                color: isActive ? '#ffffff' : '#94a3b8',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {tag === 'Programming' && '💻'}
                              {tag === 'Language' && '🗣️'}
                              {tag === 'Science' && '🔬'}
                              {tag === 'Mathematics' && '📐'}
                              {tag === 'AI & Tools' && '✨'}
                              <span>{tag}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Filtered Grid Categories - side by side in row */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', 
                      gap: '1.25rem',
                      alignItems: 'start'
                    }}>
                      {exploreCategories.map((category, catIdx) => {
                        const filteredItems = category.items.filter(item => 
                          exploreTag === 'All' || (item.tags && item.tags.includes(exploreTag))
                        );

                        if (filteredItems.length === 0) return null;

                        return (
                          <div key={catIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            <div style={{ 
                              fontSize: '0.74rem', 
                              fontWeight: 800, 
                              color: '#94a3b8', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.75px',
                              padding: '0.2rem 0.5rem',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <span>{category.title}</span>
                              <span style={{ fontSize: '0.65rem', background: 'rgba(255, 255, 255, 0.06)', padding: '0.1rem 0.4rem', borderRadius: '6px' }}>
                                {filteredItems.length}
                              </span>
                            </div>

                            {filteredItems.map(item => (
                              <Link 
                                key={item.to} 
                                to={item.to} 
                                onClick={() => setExploreOpen(false)}
                                className="explore-item-card"
                                style={{ 
                                  display: 'flex', 
                                  flexDirection: 'row',
                                  alignItems: 'center', 
                                  gap: '0.75rem', 
                                  padding: '0.6rem 0.75rem',
                                  borderRadius: '12px',
                                  textDecoration: 'none',
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  border: '1px solid rgba(255, 255, 255, 0.04)'
                                }}
                              >
                                <div 
                                  style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    borderRadius: '10px', 
                                    background: item.iconBg, 
                                    color: item.iconColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  {item.icon}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', marginBottom: '0.1rem' }}>
                                    <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.84rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span style={{ 
                                        fontSize: '0.65rem', 
                                        fontWeight: 800, 
                                        padding: '0.12rem 0.4rem', 
                                        borderRadius: '6px', 
                                        background: `${item.badgeColor}22`,
                                        color: item.badgeColor,
                                        border: `1px solid ${item.badgeColor}44`,
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                        lineHeight: 1
                                      }}>
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p style={{ margin: 0, fontSize: '0.71rem', color: '#94a3b8', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.desc}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer link to full Explore / Courses Catalog */}
                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Need full course matrix?
                      </span>
                      <Link 
                        to="/courses" 
                        onClick={() => setExploreOpen(false)}
                        style={{ color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        Explore All Learning Catalog →
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            </ul>

            {/* Actions — Desktop & Mobile */}
            <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Quick Search Trigger */}
              <button 
                className="nav-search-trigger" 
                onClick={() => setSearchOpen(true)}
                title="Search courses & topics (Ctrl+K)"
              >
                <FiSearch size={14} />
                <span>Search...</span>
                <kbd className="nav-search-kbd">⌘K</kbd>
              </button>

              {/* Theme Switcher Button (Shifted left of menu on mobile) */}
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={17} style={{ color: '#ffd93d' }} /> : <FiMoon size={17} style={{ color: 'var(--accent)' }} />}
              </button>

              {/* Language Selector - Desktop */}
              <div className="segmented-control desktop-only-action" title="Select Language">
                <FiGlobe size={14} style={{ color: 'var(--accent-ai)', marginLeft: '0.2rem' }} />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="en">EN</option>
                  <option value="hi">हिन्दी</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>

              {/* User Avatar Menu or Auth Buttons - Desktop */}
              <div className="desktop-only-action">
                {isAuthenticated() ? (
                  <div className="user-menu" ref={dropdownRef}>
                    <div
                      className="navbar-avatar"
                      onClick={() => setDropdownOpen(prev => !prev)}
                      title={user?.name}
                    >
                      {getInitial()}
                    </div>

                    {dropdownOpen && (
                      <div className="user-dropdown">
                        <div style={{ padding: '0.6rem 0.875rem 0.75rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.25rem' }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.925rem' }}>{user?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                          <div style={{ display: 'inline-block', marginTop: '0.35rem', padding: '0.15rem 0.5rem', borderRadius: '100px', background: 'rgba(108, 99, 255, 0.15)', color: 'var(--accent-light)', fontSize: '0.7rem', fontWeight: 700 }}>
                            {getRoleLabel(user?.role)}
                          </div>
                        </div>

                        <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                          <FiUser size={15} /> My Profile
                        </Link>
                        <Link to="/client" onClick={() => setDropdownOpen(false)}>
                          <FiGrid size={15} /> Client UI / Portal
                        </Link>
                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                          <FiCompass size={15} /> Student Dashboard
                        </Link>
                        <Link to="/my-bookmarks" onClick={() => setDropdownOpen(false)}>
                          <FiBookmark size={15} /> My Bookmarks
                        </Link>
                        <Link to="/my-learning" onClick={() => setDropdownOpen(false)}>
                          <FiCompass size={15} /> Learning Path
                        </Link>
                        <Link to="/my-certificates" onClick={() => setDropdownOpen(false)}>
                          <FiAward size={15} /> Certificates
                        </Link>
                        <Link to="/assignments" onClick={() => setDropdownOpen(false)}>
                          <FiFileText size={15} /> Assignments
                        </Link>

                        {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                          <Link to="/instructor" onClick={() => setDropdownOpen(false)}>
                            <FiSettings size={15} /> Instructor Panel
                          </Link>
                        )}

                        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                          <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                            <FiSettings size={15} /> Admin Panel
                          </Link>
                        )}

                        <div className="dropdown-divider" />

                        <button onClick={handleLogout} style={{ color: 'var(--error)' }}>
                          <FiLogOut size={15} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link to="/login" className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-pill)', padding: '0.4rem 0.9rem' }}>Login</Link>
                    <Link to="/register" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-pill)', padding: '0.4rem 1rem' }}>
                      <FiZap size={14} /> Get Started
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Option (Rightmost Position) */}
              <button
                className="hamburger-btn"
                onClick={() => setMobileOpen(prev => !prev)}
                aria-label="Toggle navigation menu"
                title="Menu"
              >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="search-modal-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <FiSearch size={18} style={{ color: 'var(--accent-ai)' }} />
              <input
                type="text"
                className="search-modal-input"
                placeholder="Search courses, skills, playground, or AI doubt solver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="search-modal-results">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                Quick Suggestions
              </div>
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item, i) => (
                  <div
                    key={i}
                    className="search-result-item"
                    onClick={() => {
                      navigate(item.path);
                      setSearchOpen(false);
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
                    <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>{item.type}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No matching courses or tools found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay & Drawer */}
      {mobileOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span className="navbar-logo" style={{ textDecoration: 'none' }}>🎓 S-Classes</span>
          <button className="hamburger-btn" onClick={() => setMobileOpen(false)} title="Close Menu">
            <FiX size={20} />
          </button>
        </div>

        {/* Mobile Quick Controls: Search & Language */}
        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button 
            type="button"
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.6rem 0.85rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
              borderRadius: '10px',
              color: 'var(--text-muted, #94a3b8)',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiSearch size={15} style={{ color: '#818cf8' }} /> Search courses, labs, exams...
            </span>
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' }}>⌘K</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FiGlobe size={13} style={{ color: '#818cf8' }} /> Language:
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'mr', label: 'मराठी' }
              ].map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  style={{
                    padding: '0.15rem 0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: lang === item.code ? '1px solid #6366f1' : '1px solid transparent',
                    background: lang === item.code ? '#6366f1' : 'transparent',
                    color: lang === item.code ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isAuthenticated() && (
          <div className="mobile-user-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.07)', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <div className="navbar-avatar" style={{ width: 42, height: 42, fontSize: '1rem', flexShrink: 0 }}>
                {getInitial()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{getRoleLabel(user?.role)}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.7rem',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <FiLogOut size={13} /> Logout
            </button>
          </div>
        )}

        <ul className="mobile-nav-links">
          {primaryNavLinks.map(link => (
            <li key={link.to}>
              <NavLink to={link.to} onClick={() => setMobileOpen(false)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  {link.icon} {link.label}
                </span>
              </NavLink>
            </li>
          ))}

          <li className="mobile-nav-divider" />
          <div style={{ padding: '0.4rem 1rem 0.2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Explore Tools by Tag:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {EXPLORE_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setExploreTag(tag)}
                  style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: exploreTag === tag ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: exploreTag === tag ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
                    color: exploreTag === tag ? '#ffffff' : '#94a3b8'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {exploreCategories.map((cat, catIdx) => {
            const filteredItems = cat.items.filter(item => 
              exploreTag === 'All' || (item.tags && item.tags.includes(exploreTag))
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={catIdx}>
                <li className="mobile-nav-divider" />
                <div style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{cat.title}</span>
                  <span style={{ fontSize: '0.65rem' }}>{filteredItems.length}</span>
                </div>
                {filteredItems.map(link => (
                  <li key={link.to}>
                    <NavLink to={link.to} onClick={() => setMobileOpen(false)}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ color: link.iconColor }}>{link.icon}</span> {link.label}
                      </span>
                      {link.badge && (
                        <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: `${link.badgeColor}22`, color: link.badgeColor, marginLeft: 'auto' }}>
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </div>
            );
          })}

          {isAuthenticated() && (
            <>
              <li className="mobile-nav-divider" />
              <div style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                My Student Account
              </div>
              <li><Link to="/profile" onClick={() => setMobileOpen(false)}><FiUser size={14} /> My Profile</Link></li>
              <li><Link to="/client" onClick={() => setMobileOpen(false)}><FiGrid size={14} /> Client UI / Portal</Link></li>
              <li><Link to="/assignments" onClick={() => setMobileOpen(false)}><FiFileText size={14} /> Assignments</Link></li>
              <li><Link to="/my-bookmarks" onClick={() => setMobileOpen(false)}><FiBookmark size={14} /> Saved Bookmarks</Link></li>
              <li><Link to="/my-certificates" onClick={() => setMobileOpen(false)}><FiAward size={14} /> Certificates</Link></li>

              {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <li><Link to="/instructor" onClick={() => setMobileOpen(false)}><FiSettings size={14} /> Instructor Panel</Link></li>
              )}
              {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <li><Link to="/admin" onClick={() => setMobileOpen(false)}><FiSettings size={14} /> Admin Panel</Link></li>
              )}

              <li className="mobile-nav-divider" />
              <li style={{ padding: '0.4rem 0.5rem 0.8rem' }}>
                <button 
                  onClick={handleLogout} 
                  style={{ 
                    color: '#ef4444', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.25)', 
                    borderRadius: '10px',
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem', 
                    padding: '0.75rem 1rem', 
                    width: '100%', 
                    fontSize: '0.9rem', 
                    fontWeight: 700,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FiLogOut size={16} /> Logout of Account
                </button>
              </li>
            </>
          )}

          {!isAuthenticated() && (
            <>
              <li className="mobile-nav-divider" />
              <li><Link to="/login" onClick={() => setMobileOpen(false)}><FiUser size={14} /> Login</Link></li>
              <li><Link to="/register" onClick={() => setMobileOpen(false)}>✨ Get Started Free</Link></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;

