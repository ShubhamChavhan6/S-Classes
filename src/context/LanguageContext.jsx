import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    courses: "Courses",
    search: "Search Out-of-Scope",
    profile: "Profile",
    login: "Log In",
    signup: "Sign Up",
    kids: "Kids (Pre-K)",
    primary: "Primary (Grades 1-5)",
    secondary: "Secondary (Grades 6-10)",
    higherSecondary: "Higher Secondary (11-12)",
    collegeSkill: "College & Skill Tracks",
    continueLearning: "Continue Learning",
    curriculumSubjects: "Your Grade Subjects",
    scopedCourses: "Your Recommended Courses",
    aiNotes: "AI Study Notes",
    generateNotes: "✨ Generate AI Notes",
    nextChapter: "Next Chapter ➔",
    prevChapter: "⬅ Previous Chapter",
    markCompleted: "✓ Mark as Completed",
    completed: "Completed",
    previewCategory: "Preview Content",
    chooseLevel: "Select Your Learning Path"
  },
  hi: {
    home: "होम",
    dashboard: "डैशबोर्ड",
    courses: "पाठ्यक्रम",
    search: "अन्य विषय खोजें",
    profile: "प्रोफाइल",
    login: "लॉग इन",
    signup: "साइन अप",
    kids: "छोटे बच्चे (Pre-K)",
    primary: "प्राथमिक (कक्षा 1-5)",
    secondary: "माध्यमिक (कक्षा 6-10)",
    higherSecondary: "उच्च माध्यमिक (11-12)",
    collegeSkill: "कॉलेज और कौशल विकास",
    continueLearning: "पढ़ाई जारी रखें",
    curriculumSubjects: "आपकी कक्षा के विषय",
    scopedCourses: "आपके लिए अनुशंसित कोर्स",
    aiNotes: "AI स्टडी नोट्स",
    generateNotes: "✨ AI नोट्स तैयार करें",
    nextChapter: "अगला अध्याय ➔",
    prevChapter: "⬅ पिछला अध्याय",
    markCompleted: "✓ पूर्ण चिह्नित करें",
    completed: "पूर्ण",
    previewCategory: "सामग्री की झलक देखें",
    chooseLevel: "अपनी सीखने की श्रेणी चुनें"
  },
  mr: {
    home: "मुख्यपृष्ठ",
    dashboard: "डॅशबोर्ड",
    courses: "अभ्यासक्रम",
    search: "इतर विषय शोधा",
    profile: "प्रोफाईल",
    login: "लॉगिन",
    signup: "साइन अप",
    kids: "लहान मुले (Pre-K)",
    primary: "प्राथमिक (इयत्ता 1-5)",
    secondary: "माध्यमिक (इयत्ता 6-10)",
    higherSecondary: "उच्च माध्यमिक (11-12)",
    collegeSkill: "कॉलेज आणि कौशल्य विकास",
    continueLearning: "शीकणे सुरू ठेवा",
    curriculumSubjects: "तुमच्या वर्गाचे विषय",
    scopedCourses: "तुमच्यासाठी शिफारस केलेले कोर्स",
    aiNotes: "AI अभ्यास टीपा",
    generateNotes: "✨ AI नोट्स तयार करा",
    nextChapter: "पुढील धडा ➔",
    prevChapter: "⬅ मागील धडा",
    markCompleted: "✓ पूर्ण म्हणून चिन्हांकित करा",
    completed: "पूर्ण झाले",
    previewCategory: "सामग्रीची झलक पहा",
    chooseLevel: "तुमचा शिकण्याचा मार्ग निवडा"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('sclasses_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('sclasses_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
