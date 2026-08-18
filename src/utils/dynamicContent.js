// src/utils/dynamicContent.js
// Utility helper to generate dynamic, qualification-tailored content for students
import { getUserStorageKey, getStoredItem, setStoredItem } from './storage';

const WATCHED_STORAGE_KEY_PREFIX = 'sclasses_watched_courses_';
const STREAK_STORAGE_KEY_PREFIX = 'sclasses_daily_streak_';

const WATCHED_EVENT = 'sclasses_watched_courses_updated';
const STREAK_EVENT = 'sclasses_streak_updated';

/**
 * Get daily streak data for a specific user
 */
export function getDailyStreak(user) {
  const storageKey = getUserStorageKey(STREAK_STORAGE_KEY_PREFIX, user);
  const data = getStoredItem(storageKey, null);
  if (!data) return { count: 3, lastCompletedDate: null };
  if (typeof data === 'number') return { count: data, lastCompletedDate: null };
  return { count: data.count ?? 3, lastCompletedDate: data.lastCompletedDate || null };
}

/**
 * Increment daily streak upon completing a course/lesson
 */
export function incrementDailyStreak(user) {
  const storageKey = getUserStorageKey(STREAK_STORAGE_KEY_PREFIX, user);
  const current = getDailyStreak(user);
  const todayStr = new Date().toISOString().split('T')[0];

  const updatedStreak = {
    count: (current.count || 0) + 1,
    lastCompletedDate: todayStr,
    updatedAt: Date.now()
  };

  setStoredItem(storageKey, updatedStreak, STREAK_EVENT, { userKey: storageKey, streak: updatedStreak });
  return updatedStreak;
}

/**
 * Get dynamic watched courses for a specific user from localStorage
 */
export function getWatchedCourses(user) {
  const storageKey = getUserStorageKey(WATCHED_STORAGE_KEY_PREFIX, user);
  const data = getStoredItem(storageKey, []);
  return Array.isArray(data) ? data : [];
}

/**
 * Record a course/video watch event dynamically for the student
 */
export function recordCourseWatch(user, courseData) {
  if (!courseData || !courseData.id) return [];
  const storageKey = getUserStorageKey(WATCHED_STORAGE_KEY_PREFIX, user);
  const current = getWatchedCourses(user);

  const existingIndex = current.findIndex(c => String(c.id) === String(courseData.id));
  const updatedItem = {
    id: courseData.id,
    title: courseData.title || 'Interactive Course Lesson',
    subject: courseData.subject || 'General',
    progress: courseData.progress || (existingIndex >= 0 ? Math.min(100, (current[existingIndex].progress || 20) + 15) : 25),
    nextChapter: courseData.chapterTitle || courseData.nextChapter || 'Next Chapter',
    videoId: courseData.videoId || '7vW2JpD__Cg',
    instructor: courseData.instructor || 'Senior Instructor',
    lastActive: 'Just now',
    timestamp: Date.now()
  };

  if (updatedItem.progress >= 100 || courseData.isCompleted) {
    incrementDailyStreak(user);
  }

  const updatedList = existingIndex >= 0
    ? current.map((c, idx) => idx === existingIndex ? { ...c, ...updatedItem } : c)
    : [updatedItem, ...current];

  setStoredItem(storageKey, updatedList, WATCHED_EVENT, { userKey: storageKey, courses: updatedList });
  return updatedList;
}

export function getStudentPersonalizedContent(user) {
  const qualification = user?.qualification || 'Senior Secondary (Class 11 - 12)';
  const stream = user?.stream || 'Computer Science / IT';
  const name = user?.name ? user.name.split(' ')[0] : 'Learner';

  // Lowercase checks for robust matching
  const qLower = qualification.toLowerCase();

  // Dynamic enrolled courses from user watch history ONLY
  const dynamicEnrolledCourses = getWatchedCourses(user);

  // 1. KIDS LEARNING (Class 1 - 3)
  if (qLower.includes('kids') || qLower.includes('pre-school') || qLower.includes('class 1-3')) {
    return {
      titleLevel: 'Kids Early Explorer',
      badgeColor: 'badge-gold',
      personalizedGreeting: `Hello little star, ${name}! Ready to play and learn? 🌟`,
      tagline: 'Fun phonics, interactive counting, rhymes & foundational games',
      subjects: [
        { name: 'Phonics & ABC', link: '/kids' },
        { name: 'Fun Maths & Shapes', link: '/kids' },
        { name: 'English Stories', link: '/kids' },
        { name: 'Kids Coding Games', link: '/playground' }
      ],
      enrolledCourses: dynamicEnrolledCourses,
      assignments: [],
      recommendedTracks: [
        { title: 'Foundational Phonics & Reading', desc: 'Step-by-step pronunciation and reading stories', link: '/kids' },
        { title: 'Interactive Math Games', desc: 'Visual addition, subtraction, and 2D/3D shapes', link: '/kids' }
      ],
      recommendedSyllabus: 'Early Primary Foundation (Ages 4-8)'
    };
  }

  // 2. MIDDLE SCHOOL (Class 4 - 8)
  if (qLower.includes('middle') || qLower.includes('class 4') || qLower.includes('class 8')) {
    return {
      titleLevel: 'Middle School Scholar',
      badgeColor: 'badge-school',
      personalizedGreeting: `Welcome back, ${name}! Keep building strong concepts! 🚀`,
      tagline: 'NCERT Math, General Science, English Grammar & Block Coding',
      subjects: [
        { name: 'NCERT Maths', link: '/courses?subject=Maths' },
        { name: 'General Science', link: '/courses?subject=Science' },
        { name: 'English Grammar', link: '/courses?subject=English' },
        { name: 'Scratch Coding', link: '/playground' }
      ],
      enrolledCourses: dynamicEnrolledCourses,
      assignments: [],
      recommendedTracks: [
        { title: 'Middle School STEM Track', desc: 'Core NCERT Science and Math with practical labs', link: '/courses?mode=SCHOOL' },
        { title: 'Young Coder Scratch & Python', desc: 'Visual logic and intro to real Python syntax', link: '/playground' }
      ],
      recommendedSyllabus: 'Class 6–8 CBSE & State Board Syllabus'
    };
  }

  // 3. SECONDARY SCHOOL (Class 9 - 10)
  if (qLower.includes('secondary school') || qLower.includes('class 9') || qLower.includes('class 10')) {
    return {
      titleLevel: 'Secondary Board Challenger (Class 9-10)',
      badgeColor: 'badge-accent',
      personalizedGreeting: `Welcome, ${name}! Gear up for Board Exam success! 🎓`,
      tagline: 'CBSE Class 10 NCERT Math, Physics, Chemistry & Python IT 402',
      subjects: [
        { name: 'Class 10 Mathematics', link: '/courses?subject=Maths' },
        { name: 'Physics & Chemistry', link: '/courses?subject=Science' },
        { name: 'Python IT 402', link: '/courses?subject=Coding' },
        { name: 'English Literature', link: '/courses?subject=English' }
      ],
      enrolledCourses: dynamicEnrolledCourses,
      assignments: [],
      recommendedTracks: [
        { title: 'Class 10 CBSE Board Mastery', desc: 'Complete NCERT solutions, sample papers & PYQs', link: '/courses?mode=SCHOOL' },
        { title: 'Python IT 402 Foundation', desc: 'School IT syllabus with hands-on coding practice', link: '/playground' }
      ],
      recommendedSyllabus: 'Class 10 CBSE / State Board Curriculum'
    };
  }

  // 4. UNDERGRADUATE (B.Tech / B.E. / BCA / B.Sc)
  if (qLower.includes('undergraduate') || qLower.includes('b.tech') || qLower.includes('bca') || qLower.includes('b.sc')) {
    return {
      titleLevel: 'Undergraduate Tech Developer',
      badgeColor: 'badge-advanced',
      personalizedGreeting: `Hello, ${name}! Boost your engineering & software career! 💻`,
      tagline: 'Data Structures, Full-Stack Web Development, System Design & CS Core',
      subjects: [
        { name: 'Data Structures & Algorithms', link: '/courses?subject=Coding' },
        { name: 'Full Stack Web Dev', link: '/courses?subject=Coding' },
        { name: 'DBMS & SQL Engineering', link: '/courses?subject=Coding' },
        { name: 'System Design & OS', link: '/courses?subject=Coding' }
      ],
      enrolledCourses: dynamicEnrolledCourses,
      assignments: [],
      recommendedTracks: [
        { title: 'Software Engineering Career Track', desc: 'DSA + Full Stack Web Dev + System Design', link: '/tracks' },
        { title: 'Interactive Python & JS Code Playground', desc: 'Build and run code live in browser', link: '/playground' }
      ],
      recommendedSyllabus: `${stream} Degree Curriculum`
    };
  }

  // 5. POSTGRADUATE / WORKING PROFESSIONAL / UPSKILLING
  if (qLower.includes('postgraduate') || qLower.includes('professional') || qLower.includes('working') || qLower.includes('m.tech') || qLower.includes('mca')) {
    return {
      titleLevel: 'Professional Tech Specialist & AI Architect',
      badgeColor: 'badge-gold',
      personalizedGreeting: `Welcome, ${name}! Master industry-grade AI & Cloud systems! ⚡`,
      tagline: 'Generative AI, Cloud DevOps, Distributed Microservices & Advanced System Design',
      subjects: [
        { name: 'Generative AI & LLMs', link: '/tracks' },
        { name: 'Cloud & DevOps', link: '/tracks' },
        { name: 'Microservices & Scale', link: '/tracks' },
        { name: 'Advanced System Architecture', link: '/tracks' }
      ],
      enrolledCourses: dynamicEnrolledCourses,
      assignments: [],
      recommendedTracks: [
        { title: 'Generative AI & LLM Systems Architect', desc: 'Building real-world AI pipelines & agents', link: '/tracks' },
        { title: 'Cloud Native & DevOps Engineering', desc: 'Kubernetes, Terraform & Production CI/CD', link: '/tracks' }
      ],
      recommendedSyllabus: 'Advanced Industry Upskilling'
    };
  }

  // 6. DEFAULT SENIOR SECONDARY (Class 11 - 12 Science / General)
  return {
    titleLevel: 'Senior Secondary Learner (Class 11 - 12)',
    badgeColor: 'badge-accent',
    personalizedGreeting: `Welcome back, ${name}! Elevate your academic preparation! 📖`,
    tagline: `Curriculum tailored for ${qualification} (${stream})`,
    subjects: [
      { name: 'Physics & Chemistry', link: '/courses?subject=Science' },
      { name: 'Class 12 Mathematics', link: '/courses?subject=Maths' },
      { name: 'Java 21 Computer Science', link: '/courses?subject=Coding' },
      { name: 'English Core', link: '/courses?subject=English' }
    ],
    enrolledCourses: dynamicEnrolledCourses,
    assignments: [],
    recommendedTracks: [
      { title: 'Class 12 Board Preparation Track', desc: 'Complete NCERT, sample papers & doubt support', link: '/courses?mode=SCHOOL' },
      { title: 'Java 21 & OOPs Programming Lab', desc: 'Hands-on Java coding exercises with instant evaluation', link: '/playground' }
    ],
    recommendedSyllabus: `${qualification} — ${stream} Syllabus`
  };
}

