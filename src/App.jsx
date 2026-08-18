// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Kids
import KidsHome from './pages/kids/KidsHome';
import AlphabetLearner from './pages/kids/AlphabetLearner';
import NumberLearner from './pages/kids/NumberLearner';
import KidsQuiz from './pages/kids/KidsQuiz';

// Courses
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import VideoLesson from './pages/courses/VideoLesson';
import YouTubeCourses from './pages/courses/YouTubeCourses';


// Quiz
import QuizPage from './pages/quiz/QuizPage';

// AI Tutor
import AiTutor from './pages/ai/AiTutor';

// Tracks & Playground
import SkillTracks from './pages/tracks/SkillTracks';
import CodePlayground from './pages/playground/CodePlayground';

// Instructor/Admin
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AdminPanel from './pages/admin/AdminPanel';

// Student features
import ClientPortal from './pages/student/ClientPortal';
import Bookmarks from './pages/student/Bookmarks';
import LearningPath from './pages/student/LearningPath';
import CertificatesPage from './pages/student/Certificates';
import Achievements from './pages/student/Achievements';
import Assignments from './pages/student/Assignments';
import Discussion from './pages/student/Discussion';
import Search from './pages/student/Search';
import Flashcards from './pages/student/Flashcards';
import ExamArena from './pages/student/ExamArena';

// Marketing & Syllabus
import ForParents from './pages/marketing/ForParents';
import ForSchools from './pages/marketing/ForSchools';
import ForInstructors from './pages/marketing/ForInstructors';
import SyllabusMatrix from './pages/courses/SyllabusMatrix';
import SampleLesson from './pages/courses/SampleLesson';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <LanguageProvider>
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
          <main style={{ minHeight: 'calc(100vh - 80px)' }}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/youtube-courses" element={<YouTubeCourses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/tracks" element={<SkillTracks />} />
              <Route path="/playground" element={<CodePlayground />} />
              <Route path="/search" element={<Search />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-schools" element={<ForSchools />} />
              <Route path="/for-instructors" element={<ForInstructors />} />
              <Route path="/syllabus" element={<SyllabusMatrix />} />
              <Route path="/sample-lesson" element={<SampleLesson />} />

              {/* Kids Mode */}
              <Route path="/kids" element={<KidsHome />} />
              <Route path="/kids/alphabets" element={<AlphabetLearner />} />
              <Route path="/kids/numbers" element={<NumberLearner />} />

              {/* Client & Student Portal */}
              <Route path="/client" element={<ClientPortal />} />
              <Route path="/client/portal" element={<ClientPortal />} />
              <Route path="/client-ui" element={<ClientPortal />} />
              <Route path="/student-portal" element={<ClientPortal />} />

              {/* Protected */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Student features */}
              <Route path="/exam-arena" element={<ProtectedRoute><ExamArena /></ProtectedRoute>} />
              <Route path="/mock-exam" element={<ProtectedRoute><ExamArena /></ProtectedRoute>} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/my-bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
              <Route path="/my-learning" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
              <Route path="/my-certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
              <Route path="/assignments/:courseId" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
              <Route path="/discussion/:lessonId" element={<ProtectedRoute><Discussion /></ProtectedRoute>} />

              {/* Kids Quiz */}
              <Route path="/kids/quiz" element={<ProtectedRoute><KidsQuiz /></ProtectedRoute>} />

              {/* Learning */}
              <Route path="/courses/:id/learn" element={<ProtectedRoute><VideoLesson /></ProtectedRoute>} />
              <Route path="/lesson/:id" element={<ProtectedRoute><VideoLesson /></ProtectedRoute>} />
              <Route path="/quiz/:id" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />

              {/* AI & Tracks */}
              <Route path="/ai-tutor" element={<ProtectedRoute><AiTutor /></ProtectedRoute>} />

              {/* Instructor */}
              <Route path="/instructor" element={
                <ProtectedRoute requiredRole="INSTRUCTOR"><InstructorDashboard /></ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="SUPER_ADMIN"><AdminPanel /></ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
