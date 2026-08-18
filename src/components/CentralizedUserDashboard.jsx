// src/components/CentralizedUserDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiBookOpen, 
  FiCpu, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiPlayCircle, 
  FiSearch, 
  FiPlusCircle, 
  FiZap, 
  FiAward, 
  FiTrash2, 
  FiArrowRight, 
  FiCode, 
  FiLayers, 
  FiTarget,
  FiFilter,
  FiX
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import YouTubePlayer from './YouTubePlayer';
import VoiceAiModal from './VoiceAiModal';
import { 
  getStudentPersonalizedContent, 
  getDailyStreak, 
  getWatchedCourses, 
  recordCourseWatch 
} from '../utils/dynamicContent';
import { 
  getAiTutorSessions, 
  saveAiTutorSession, 
  updateAiTutorSessionStatus, 
  deleteAiTutorSession 
} from '../utils/aiSessionManager';

export default function CentralizedUserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'courses' | 'ai-sessions' | 'goals'
  const [courseSearch, setCourseSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL'); // 'ALL' | 'IN_PROGRESS' | 'COMPLETED'
  const [aiSessionFilter, setAiSessionFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'RESOLVED'
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals & Drawers
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  // New AI session form state
  const [newTopic, setNewTopic] = useState('');
  const [newSubject, setNewSubject] = useState('Computer Science / Java');
  const [newMode, setNewMode] = useState('Step-by-Step Derivation');
  const [newDoubtPrompt, setNewDoubtPrompt] = useState('');

  // Daily goals state
  const [dailyGoals, setDailyGoals] = useState([
    { id: 'g-1', text: 'Solve 5 practice MCQs in AI Exam Arena', completed: true, points: 50 },
    { id: 'g-2', text: 'Watch 1 Java 21 LTS Lesson & execute code in Sandbox', completed: true, points: 75 },
    { id: 'g-3', text: 'Ask AI Tutor to verify Calculus Derivation or Science doubt', completed: false, points: 100 },
    { id: 'g-4', text: 'Revise Flashcard deck for Active Recall', completed: false, points: 40 }
  ]);

  // Sync with global events (e.g. when video watched, streak updated, or AI session changed)
  useEffect(() => {
    const handleUpdate = () => setRefreshKey(prev => prev + 1);
    window.addEventListener('sclasses_watched_courses_updated', handleUpdate);
    window.addEventListener('sclasses_streak_updated', handleUpdate);
    window.addEventListener('sclasses_ai_sessions_updated', handleUpdate);
    return () => {
      window.removeEventListener('sclasses_watched_courses_updated', handleUpdate);
      window.removeEventListener('sclasses_streak_updated', handleUpdate);
      window.removeEventListener('sclasses_ai_sessions_updated', handleUpdate);
    };
  }, []);

  // Compute live data structures
  const streak = useMemo(() => getDailyStreak(user), [user, refreshKey]);
  const personalized = useMemo(() => getStudentPersonalizedContent(user), [user, refreshKey]);
  
  // Real course history (with fallback defaults if user is exploring for the first time)
  const courseHistory = useMemo(() => {
    const watched = getWatchedCourses(user);
    if (watched && watched.length > 0) return watched;

    // Default seeded courses for the qualification level if no local watch history yet
    return [
      {
        id: 'c-101',
        title: 'Class 10 CBSE Complete Science Mastery',
        subject: 'Science',
        progress: 65,
        nextChapter: 'Chapter 4: Carbon and its Compounds (Redox Reactions)',
        videoId: '7vW2JpD__Cg',
        instructor: 'Dr. Sharma & S-Classes',
        lastActive: '2 hours ago',
        timestamp: Date.now() - 1000 * 60 * 120
      },
      {
        id: 'c-102',
        title: 'ICSE Class 10 Java Computer Applications & OOPs',
        subject: 'Coding',
        progress: 85,
        nextChapter: 'Lesson 8: Method Overloading & String Class Algorithms',
        videoId: 'rfscVS0vtbw',
        instructor: 'Prof. Verma (Java Specialist)',
        lastActive: 'Yesterday',
        timestamp: Date.now() - 1000 * 60 * 60 * 24
      },
      {
        id: 'c-103',
        title: 'Modern Java 21 LTS & Spring Boot 3 Microservices',
        subject: 'Coding',
        progress: 35,
        nextChapter: 'Module 3: Project Loom Virtual Threads vs Carrier Threads',
        videoId: 'eIrMbAQSU34',
        instructor: 'Shubham Chavhan',
        lastActive: '3 days ago',
        timestamp: Date.now() - 1000 * 60 * 60 * 72
      },
      {
        id: 'c-104',
        title: 'JEE Main & Advanced Coordinate Geometry & Calculus',
        subject: 'Maths',
        progress: 100,
        nextChapter: 'Mastery Completed: Definite Integrals PYQ Bank',
        videoId: 'fNKUz1N9N1g',
        instructor: 'Er. Rajesh Kumar',
        lastActive: 'Completed',
        timestamp: Date.now() - 1000 * 60 * 60 * 96
      }
    ];
  }, [user, refreshKey]);

  // AI Tutor Sessions
  const aiSessions = useMemo(() => getAiTutorSessions(user), [user, refreshKey]);

  // Calculated Progress Metrics
  const metrics = useMemo(() => {
    const totalCourses = courseHistory.length;
    const completedCourses = courseHistory.filter(c => (c.progress || 0) >= 100).length;
    const inProgressCourses = courseHistory.filter(c => (c.progress || 0) < 100).length;
    const avgProgress = totalCourses > 0 
      ? Math.round(courseHistory.reduce((acc, c) => acc + (c.progress || 0), 0) / totalCourses)
      : 0;

    const activeAiSessions = aiSessions.filter(s => s.status === 'ACTIVE').length;
    const resolvedAiSessions = aiSessions.filter(s => s.status === 'RESOLVED').length;

    const completedGoalCount = dailyGoals.filter(g => g.completed).length;
    const totalGoalXp = dailyGoals.filter(g => g.completed).reduce((acc, g) => acc + g.points, 0);

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      avgProgress,
      activeAiSessions,
      resolvedAiSessions,
      totalAiSessions: aiSessions.length,
      streakDays: streak?.count || 1,
      xpPoints: (completedCourses * 250) + (inProgressCourses * 100) + (activeAiSessions * 50) + totalGoalXp + 350,
      completedGoalCount,
      totalGoals: dailyGoals.length
    };
  }, [courseHistory, aiSessions, streak, dailyGoals]);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courseHistory.filter(course => {
      const matchesSearch = !courseSearch.trim() || 
        course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
        course.subject.toLowerCase().includes(courseSearch.toLowerCase()) ||
        (course.nextChapter && course.nextChapter.toLowerCase().includes(courseSearch.toLowerCase()));

      const isCompleted = (course.progress || 0) >= 100;
      if (courseFilter === 'COMPLETED') return matchesSearch && isCompleted;
      if (courseFilter === 'IN_PROGRESS') return matchesSearch && !isCompleted;
      return matchesSearch;
    });
  }, [courseHistory, courseSearch, courseFilter]);

  // Filtered AI Sessions
  const filteredAiSessions = useMemo(() => {
    return aiSessions.filter(session => {
      if (aiSessionFilter === 'ACTIVE') return session.status === 'ACTIVE';
      if (aiSessionFilter === 'RESOLVED') return session.status === 'RESOLVED';
      return true;
    });
  }, [aiSessions, aiSessionFilter]);

  // Handlers
  const handleToggleGoal = (goalId) => {
    setDailyGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, completed: !g.completed };
      }
      return g;
    }));
  };

  const handleStartNewAiSession = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const newSession = {
      id: `ai-sess-${Date.now()}`,
      topic: newTopic.trim(),
      subject: newSubject,
      mode: newMode,
      engine: 'Gemini 3.1 Pro (High Thinking)',
      status: 'ACTIVE',
      lastMessage: newDoubtPrompt.trim() || `Exploring step-by-step concepts in ${newTopic.trim()}...`,
      stepsCount: 1,
      resolved: false
    };

    saveAiTutorSession(user, newSession);
    setIsNewSessionModalOpen(false);
    setNewTopic('');
    setNewDoubtPrompt('');
    setActiveTab('ai-sessions');
  };

  const handleToggleSessionStatus = (sessionId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'RESOLVED' : 'ACTIVE';
    updateAiTutorSessionStatus(user, sessionId, newStatus);
  };

  const handleDeleteSession = (sessionId) => {
    deleteAiTutorSession(user, sessionId);
  };

  const handleOpenCourseVideo = (course) => {
    setSelectedVideo({
      id: course.videoId || 'rfscVS0vtbw',
      title: course.title
    });
    recordCourseWatch(user, course);
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Learner';
  const qualificationLabel = user?.qualification || 'Senior Secondary (Class 11 - 12)';
  const streamLabel = user?.stream || 'Computer Science / IT';

  return (
    <div className="centralized-dashboard-wrapper text-slate-100">
      
      {/* 1. Header Profile & Status Ribbon */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30 flex-shrink-0">
              {userName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {userName}&apos;s Learning Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {personalized.titleLevel || 'Active Scholar'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <FaFire className="text-orange-500" /> {metrics.streakDays} Day Streak
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {qualificationLabel} • {streamLabel}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <FiCpu /> Ask AI Tutor
            </button>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FiZap /> Voice Tutor
            </button>
            <Link
              to="/playground"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all no-underline"
            >
              <FiCode /> Java 21 Studio
            </Link>
          </div>

        </div>

        {/* Live KPI Performance Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Progress</div>
            <div className="text-xl font-black text-emerald-400 mt-1 flex items-center gap-1">
              <FiTrendingUp size={16} /> {metrics.avgProgress}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Courses</div>
            <div className="text-xl font-black text-indigo-400 mt-1 flex items-center gap-1">
              <FiBookOpen size={16} /> {metrics.inProgressCourses} Enrolled
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Tutor Sessions</div>
            <div className="text-xl font-black text-sky-400 mt-1 flex items-center gap-1">
              <FiCpu size={16} /> {metrics.activeAiSessions} Active
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Courses Completed</div>
            <div className="text-xl font-black text-purple-400 mt-1 flex items-center gap-1">
              <FiCheckCircle size={16} /> {metrics.completedCourses} Finished
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Academic XP</div>
            <div className="text-xl font-black text-amber-400 mt-1 flex items-center gap-1">
              <FiAward size={16} /> {metrics.xpPoints} XP
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Daily Goals</div>
            <div className="text-xl font-black text-teal-400 mt-1 flex items-center gap-1">
              <FiTarget size={16} /> {metrics.completedGoalCount}/{metrics.totalGoals} Done
            </div>
          </div>

        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FiTrendingUp /> Overview & Progress
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FiBookOpen /> Course History ({courseHistory.length})
        </button>

        <button
          onClick={() => setActiveTab('ai-sessions')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ai-sessions'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FiCpu /> Active AI Sessions ({metrics.activeAiSessions} Active / {aiSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'goals'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FiTarget /> Daily Goals & Milestones
        </button>
      </div>

      {/* 3. TAB 1: OVERVIEW & PROGRESS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main 2-column Grid: Subject Mastery & Continue Learning */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: In-Progress Courses & Learning Path */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <FiPlayCircle className="text-indigo-400" /> Continue In-Progress Courses
                    </h2>
                    <p className="text-xs text-slate-400">Pick up right where you left off</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('courses')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer bg-transparent border-none"
                  >
                    View All ({courseHistory.length}) <FiArrowRight />
                  </button>
                </div>

                <div className="space-y-3">
                  {courseHistory.slice(0, 3).map((course) => (
                    <div 
                      key={course.id}
                      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {course.subject}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <FiClock size={11} /> {course.lastActive || 'Recently'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white truncate">{course.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          📖 {course.nextChapter || 'Next lesson ready'}
                        </p>

                        {/* Progress bar */}
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-slate-700/60 overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
                              style={{ width: `${course.progress || 20}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-300 w-10 text-right">
                            {course.progress || 20}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleOpenCourseVideo(course)}
                          className="px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <FiPlayCircle /> Resume
                        </button>
                        <Link
                          to={`/courses/${course.id}/learn?v=${course.videoId || ''}`}
                          className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-700 hover:bg-slate-600 text-slate-200 no-underline"
                        >
                          Syllabus
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Breakdown Cards */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <FiLayers className="text-purple-400" /> Subject Mastery & Curriculum Matrix
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Mathematics & Calculus', level: '88% Mastery', count: '14/16 Chapters', color: 'from-blue-500 to-indigo-500', link: '/courses?subject=Maths' },
                    { name: 'Physics & Chemistry', level: '76% Mastery', count: '12/15 Chapters', color: 'from-emerald-500 to-teal-500', link: '/courses?subject=Science' },
                    { name: 'Java 21 LTS & DSA', level: '92% Mastery', count: '18/20 Modules', color: 'from-amber-500 to-orange-500', link: '/playground' },
                    { name: 'English & Communication', level: '85% Mastery', count: '8/10 Units', color: 'from-purple-500 to-pink-500', link: '/courses?subject=English' }
                  ].map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.link}
                      className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-all block text-slate-200 no-underline group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {sub.name}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">{sub.level}</span>
                      </div>
                      <div className="text-xs text-slate-400 mb-2">{sub.count} completed</div>
                      <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${sub.color}`} style={{ width: sub.level.split('%')[0] + '%' }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Active AI Sessions Card & Daily Goals */}
            <div className="space-y-6">
              
              {/* Active AI Sessions Widget */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FiCpu className="text-indigo-400" /> Active AI Tutor Sessions
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300">
                    {metrics.activeAiSessions} Active
                  </span>
                </div>

                <div className="space-y-3">
                  {aiSessions.slice(0, 2).map((session) => (
                    <div 
                      key={session.id}
                      className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide">
                          {session.subject}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          session.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white line-clamp-1">{session.topic}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 italic">
                        &quot;{session.lastMessage}&quot;
                      </p>
                      
                      <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{session.timestamp}</span>
                        <Link
                          to="/ai-tutor"
                          className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 no-underline"
                        >
                          Continue <FiArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setIsNewSessionModalOpen(true)}
                    className="w-full py-2.5 rounded-xl border border-dashed border-indigo-500/40 hover:border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FiPlusCircle /> Start New AI Doubt Session
                  </button>
                </div>
              </div>

              {/* Daily Goals Mini Tracker */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FiTarget className="text-teal-400" /> Daily Study Checklist
                  </h2>
                  <span className="text-xs font-bold text-emerald-400">
                    {metrics.completedGoalCount}/{metrics.totalGoals} Completed
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dailyGoals.map(goal => (
                    <label 
                      key={goal.id} 
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        goal.completed ? 'bg-slate-800/30 border-slate-800 text-slate-500' : 'bg-slate-800/60 border-slate-700/80 text-slate-200'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => handleToggleGoal(goal.id)}
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                      <span className={`text-xs flex-1 ${goal.completed ? 'line-through' : 'font-medium'}`}>
                        {goal.text}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        +{goal.points} XP
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 4. TAB 2: COURSE HISTORY & SYLLABI */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Controls Bar: Search & Filter */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search course history, topics, chapters..."
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <FiFilter /> Status:
              </span>
              {[
                { id: 'ALL', label: 'All Courses' },
                { id: 'IN_PROGRESS', label: 'In Progress' },
                { id: 'COMPLETED', label: 'Completed' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setCourseFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    courseFilter === f.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

          </div>

          {/* Course History Cards Grid */}
          {filteredCourses.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800">
              <FiBookOpen size={40} className="mx-auto text-slate-500 mb-3" />
              <h3 className="text-base font-bold text-white">No courses match your filter</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Explore the complete catalog to start learning new tracks and build your history.
              </p>
              <Link to="/courses" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white no-underline">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map(course => {
                const isCompleted = (course.progress || 0) >= 100;
                return (
                  <div 
                    key={course.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {course.subject}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {isCompleted ? '✓ Completed' : `${course.progress || 25}% In Progress`}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 leading-snug">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                        📖 Current Chapter: <span className="text-slate-300 font-medium">{course.nextChapter}</span>
                      </p>

                      <div className="text-[11px] text-slate-500 mb-4 flex items-center justify-between">
                        <span>👨‍🏫 {course.instructor || 'Senior Faculty'}</span>
                        <span>⏱ {course.lastActive || 'Recently'}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 mb-4">
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                            }`}
                            style={{ width: `${course.progress || 25}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenCourseVideo(course)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FiPlayCircle /> {isCompleted ? 'Review Class' : 'Resume Lesson'}
                      </button>
                      <Link
                        to={`/courses/${course.id}/learn?v=${course.videoId || ''}`}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 no-underline"
                      >
                        Notes
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 5. TAB 3: ACTIVE AI TUTOR SESSIONS */}
      {activeTab === 'ai-sessions' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Bar with Action */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Filter Sessions:</span>
              {[
                { id: 'ALL', label: `All (${aiSessions.length})` },
                { id: 'ACTIVE', label: `Active Now (${metrics.activeAiSessions})` },
                { id: 'RESOLVED', label: `Resolved (${metrics.resolvedAiSessions})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setAiSessionFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aiSessionFilter === f.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30 w-full sm:w-auto justify-center"
            >
              <FiPlusCircle /> New AI Tutor Session
            </button>

          </div>

          {/* AI Sessions List */}
          {filteredAiSessions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800">
              <FiCpu size={40} className="mx-auto text-slate-500 mb-3" />
              <h3 className="text-base font-bold text-white">No AI Tutor Sessions Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Start an interactive doubt solver session in Maths, Physics, Chemistry, or Java 21 LTS.
              </p>
              <button
                onClick={() => setIsNewSessionModalOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white cursor-pointer"
              >
                <FiPlusCircle /> Start New Session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAiSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {session.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/15 text-purple-300">
                        {session.mode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        session.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {session.status === 'ACTIVE' ? '● Active Session' : '✓ Resolved'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{session.topic}</h3>
                    
                    <div className="mt-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold mr-1">Latest Context:</span>
                      {session.lastMessage}
                    </div>

                    <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-500">
                      <span>🤖 {session.engine}</span>
                      <span>📖 {session.stepsCount || 3} Reasoning Steps</span>
                      <span>⏱ {session.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate('/ai-tutor')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <FiCpu /> Continue Chat
                    </button>
                    <button
                      onClick={() => handleToggleSessionStatus(session.id, session.status)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        session.status === 'ACTIVE'
                          ? 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
                          : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                      title={session.status === 'ACTIVE' ? 'Mark Resolved' : 'Reopen Session'}
                    >
                      <FiCheckCircle /> {session.status === 'ACTIVE' ? 'Resolve' : 'Reopen'}
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 cursor-pointer"
                      title="Delete Session"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 6. TAB 4: GOALS & MILESTONES */}
      {activeTab === 'goals' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Daily Study Goals Tracker */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FiTarget className="text-indigo-400" /> Daily Target Checklist
                  </h2>
                  <p className="text-xs text-slate-400">Complete daily tasks to maintain your learning streak</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  {metrics.completedGoalCount} / {metrics.totalGoals} Completed
                </span>
              </div>

              <div className="space-y-3">
                {dailyGoals.map(goal => (
                  <div
                    key={goal.id}
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      goal.completed 
                        ? 'bg-slate-800/30 border-slate-800/80 text-slate-400' 
                        : 'bg-slate-800/70 border-slate-700 text-slate-100 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => {}}
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                      <span className={`text-xs sm:text-sm ${goal.completed ? 'line-through' : 'font-semibold'}`}>
                        {goal.text}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 flex-shrink-0">
                      +{goal.points} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Milestones & Badges */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <FiAward className="text-amber-400" /> Scholar Milestones & Badges
              </h2>
              <div className="space-y-3">
                {[
                  { name: '🔥 3-Day Consistency Streak', desc: 'Active continuous learning across 3 consecutive days', unlocked: true, badge: 'Streak Master' },
                  { name: '☕ Java 21 Bytecode Explorer', desc: 'Compiled 5+ Java 21 programs in the sandboxed Code Studio', unlocked: true, badge: 'Java Pro' },
                  { name: '🤖 AI High Thinking Mode Scholar', desc: 'Resolved 5+ complex Science & Calculus derivations', unlocked: true, badge: 'AI Thinker' },
                  { name: '🏆 Timed Exam Ace', desc: 'Score >90% in CBSE / ICSE Mock Exam Arena', unlocked: false, badge: 'Coming Up' }
                ].map((m, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                      m.unlocked ? 'bg-slate-800/50 border-slate-700/80' : 'bg-slate-800/20 border-slate-800 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">{m.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      m.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {m.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 7. Modal: New AI Doubt Solver Session Launcher */}
      {isNewSessionModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsNewSessionModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiCpu className="text-indigo-400" /> Start AI Tutor Doubt Session
              </h3>
              <button 
                onClick={() => setIsNewSessionModalOpen(false)}
                className="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleStartNewAiSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Subject
                </label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Computer Science / Java">Java 21 LTS & Computer Science</option>
                  <option value="Mathematics">Class 10 / 12 Mathematics & Calculus</option>
                  <option value="Science / Physics">Physics (Optics, Mechanics & Electromagnetism)</option>
                  <option value="Science / Chemistry">Chemistry (Organic, Inorganic & Redox)</option>
                  <option value="Science / Biology">Biology (Bioenergetics & Genetics)</option>
                  <option value="General Studies">General Problem Solving & Aptitude</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Reasoning Mode
                </label>
                <select
                  value={newMode}
                  onChange={e => setNewMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Step-by-Step Derivation">Step-by-Step Mathematical/Science Derivation</option>
                  <option value="Concept Deep Dive">Intuitive Concept Deep Dive & Analogies</option>
                  <option value="Code Analysis & Bytecode">Java 21 Code Bug Fix & Bytecode Optimization</option>
                  <option value="Voice Interactive">Voice & Spoken Problem Breakdown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Topic or Concept Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Photosynthesis Dark Reaction or Thread Concurrency"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Specific Question or Doubt (Optional)
                </label>
                <textarea
                  placeholder="Type your exact question or equation to solve step-by-step..."
                  value={newDoubtPrompt}
                  onChange={e => setNewDoubtPrompt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  Launch AI Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Video Player Modal for Course Lesson Preview */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-white truncate pr-4">
                📺 {selectedVideo.title}
              </h3>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4">
              <YouTubePlayer videoId={selectedVideo.id} title={selectedVideo.title} autoPlayOnMount={true} />
            </div>
          </div>
        </div>
      )}

      {/* 9. Voice AI Modal */}
      <VoiceAiModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

    </div>
  );
}
