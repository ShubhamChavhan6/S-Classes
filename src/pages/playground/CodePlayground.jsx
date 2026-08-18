// src/pages/playground/CodePlayground.jsx
import { useState, useEffect } from 'react';
import { 
  FiCode, 
  FiPlay, 
  FiCpu, 
  FiRefreshCw, 
  FiTrash2, 
  FiCheckCircle, 
  FiTerminal, 
  FiLayers,
  FiZap,
  FiFileText,
  FiBookOpen,
  FiCopy,
  FiSearch,
  FiDownload,
  FiHelpCircle,
  FiCheck,
  FiChevronRight,
  FiAward,
  FiBox,
  FiActivity
} from 'react-icons/fi';
import api from '../../api/axios';
import { useToast } from '../../components/Toast';
import { JAVA_CODE_REPOSITORY, JAVA_PROGRAM_CATEGORIES } from '../../data/javaCodeRepository';
import { JAVA_PROJECT_BLUEPRINTS } from '../../data/javaProjectBlueprints';
import { JAVA_QUIZ_QUESTIONS } from '../../data/javaQuizBank';

export default function CodePlayground() {
  const toast = useToast();
  
  // Navigation View Tab: 'ide' | 'visualizer' | 'vault' | 'blueprints' | 'quiz' | 'ai-architect'
  const [activeView, setActiveView] = useState('ide');

  // IDE State
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState(JAVA_CODE_REPOSITORY[0].code);
  const [stdinInput, setStdinInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState('output'); // 'output' | 'input' | 'ai'

  // Java Program Vault State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Architect State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('INTERMEDIATE');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratedResult, setAiGeneratedResult] = useState(null);

  // Java Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmittedQuiz, setIsSubmittedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Selected Project Blueprint
  const [selectedProject, setSelectedProject] = useState(JAVA_PROJECT_BLUEPRINTS[0]);

  // Visualizer JVM Step State
  const [jvmStep, setJvmStep] = useState(2);

  // Repository Source Files State
  const [repoFiles, setRepoFiles] = useState([]);
  const [selectedRepoFile, setSelectedRepoFile] = useState(null);
  const [isLoadingRepoFiles, setIsLoadingRepoFiles] = useState(false);

  useEffect(() => {
    const fetchJavaSources = async () => {
      try {
        setIsLoadingRepoFiles(true);
        const res = await api.get('/java/sources');
        if (res.data?.files && res.data.files.length > 0) {
          setRepoFiles(res.data.files);
          setSelectedRepoFile(res.data.files[0]);
        }
      } catch (err) {
        console.error('Failed to load Java repo sources:', err);
      } finally {
        setIsLoadingRepoFiles(false);
      }
    };
    fetchJavaSources();
  }, []);

  const filteredJavaPrograms = JAVA_CODE_REPOSITORY.filter(prog => {
    const matchesCategory = selectedCategory === 'All' || prog.category === selectedCategory;
    const matchesSearch = prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (newLang === 'java') {
      setCode(JAVA_CODE_REPOSITORY[0].code);
    } else if (newLang === 'python') {
      setCode(`# Python 3 Data Science & Algorithms\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint("=== Python 3 Output ===")\nprint("Fibonacci Sequence:", list(fibonacci(10)))`);
    } else if (newLang === 'cpp') {
      setCode(`// C++20 Standard Library\n#include <iostream>\n#include <vector>\n#include <numeric>\n\nint main() {\n    std::vector<int> numbers = {10, 20, 30, 40, 50};\n    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);\n    std::cout << "=== C++20 Output ===" << std::endl;\n    std::cout << "Sum of vector elements: " << sum << std::endl;\n    return 0;\n}`);
    } else if (newLang === 'javascript') {
      setCode(`// Modern JavaScript ES6+\nconst students = [\n  { name: 'Aarav', score: 95 },\n  { name: 'Priya', score: 88 },\n  { name: 'Rohan', score: 92 }\n];\n\nconsole.log('=== Node.js Execution ===');\nstudents.forEach(s => console.log(\`\${s.name}: \${s.score}%\`));`);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.showToast('Please enter code to run', 'warning');
      return;
    }

    try {
      setIsRunning(true);
      setActiveConsoleTab('output');
      const res = await api.post('/code/run', {
        code,
        language,
        input: stdinInput
      });

      setOutput(res.data);
      toast.showToast(`${language.toUpperCase()} execution completed!`, 'success');
    } catch (err) {
      console.error('Execution error:', err);
      toast.showToast('Failed to compile code', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleLoadProgram = (prog) => {
    setLanguage('java');
    setCode(prog.code);
    setActiveView('ide');
    toast.showToast(`Loaded "${prog.title}" into IDE!`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (progCode) => {
    navigator.clipboard.writeText(progCode);
    toast.showToast('Java code copied to clipboard!', 'success');
  };

  const handleDownloadJava = (codeContent, filename = 'Main.java') => {
    const element = document.createElement('a');
    const file = new Blob([codeContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.showToast(`Downloaded ${filename}`, 'success');
  };

  const handleGenerateAiJava = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGeneratingAi(true);
    try {
      const res = await api.post('/java/ai-generate', {
        prompt: aiPrompt,
        difficulty: aiDifficulty,
        framework: 'Java 21 OpenJDK'
      });
      if (res.data?.code) {
        setAiGeneratedResult(res.data);
        toast.showToast('Java 21 solution generated successfully!', 'success');
      }
    } catch (err) {
      console.error('AI Gen Error:', err);
      toast.showToast('Failed to generate AI Java solution', 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleQuizAnswer = (optionIdx) => {
    if (isSubmittedQuiz) return;
    setSelectedOption(optionIdx);
    setIsSubmittedQuiz(true);
    const currentQ = JAVA_QUIZ_QUESTIONS[currentQuizIndex];
    if (optionIdx === currentQ.correctIndex) {
      setQuizScore(prev => prev + 1);
      toast.showToast('Correct JVM analysis! +10 Points', 'success');
    } else {
      toast.showToast('Incorrect analysis. Review the JVM explanation below.', 'error');
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < JAVA_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmittedQuiz(false);
    } else {
      toast.showToast(`Quiz completed! You scored ${quizScore + (selectedOption === JAVA_QUIZ_QUESTIONS[currentQuizIndex].correctIndex ? 1 : 0)} / ${JAVA_QUIZ_QUESTIONS.length}`, 'info');
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      
      {/* Top Banner */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '1.25rem', 
          padding: '1.5rem 1.75rem', 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.15), rgba(245, 158, 11, 0.1))', 
          border: '1px solid rgba(99, 102, 241, 0.35)', 
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.25rem 0.65rem', borderRadius: '8px', background: '#6366f1', color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
              ☕ JAVA 21 ARCHITECTURE & JDK LAB
            </span>
            <span style={{ padding: '0.25rem 0.65rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', fontSize: '0.75rem', fontWeight: 800 }}>
              OpenJDK 21.0.2 LTS
            </span>
            <span style={{ color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <FiZap color="#38bdf8" /> Real-time JVM Simulator & AI Analyzer
            </span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCode color="#a855f7" /> Java 21 Code Studio & Enterprise Engine
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Write, compile, visualize JVM execution stack & heap, and inspect production-grade Java 21 projects.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleDownloadJava(code, 'Main.java')}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
            title="Download .java file"
          >
            <FiDownload size={15} /> Export .java
          </button>

          <button 
            onClick={handleRunCode}
            disabled={isRunning}
            style={{ 
              padding: '0.65rem 1.4rem', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              color: '#ffffff', 
              border: 'none', 
              fontWeight: 800, 
              fontSize: '0.92rem', 
              cursor: isRunning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            {isRunning ? <FiRefreshCw className="spin" size={16} /> : <FiPlay size={16} />}
            {isRunning ? 'Compiling JVM...' : 'Run Code (F5)'}
          </button>
        </div>
      </div>

      {/* Main Navigation Studio Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { id: 'ide', label: '⚡ Java 21 IDE & Compiler', icon: <FiCode size={15} /> },
          { id: 'visualizer', label: '🧠 JVM Stack & Heap Inspector', icon: <FiCpu size={15} /> },
          { id: 'vault', label: `📚 Java Code Vault (${JAVA_CODE_REPOSITORY.length})`, icon: <FiBookOpen size={15} /> },
          { id: 'repo-files', label: `📂 Java 21 Repo Files (${repoFiles.length || 8})`, icon: <FiLayers size={15} /> },
          { id: 'blueprints', label: `🏗️ Project Blueprints (${JAVA_PROJECT_BLUEPRINTS.length})`, icon: <FiBox size={15} /> },
          { id: 'ai-architect', label: '✨ AI Java Architect', icon: <FiZap size={15} /> },
          { id: 'quiz', label: `🎯 Java Output Quiz (${JAVA_QUIZ_QUESTIONS.length})`, icon: <FiHelpCircle size={15} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '12px',
              background: activeView === tab.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(15, 23, 42, 0.8)',
              border: activeView === tab.id ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeView === tab.id ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: activeView === tab.id ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: IDE & COMPILER */}
      {/* ========================================================================= */}
      {activeView === 'ide' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.95fr)', gap: '1.25rem', alignItems: 'stretch' }}>
          
          {/* Editor Container */}
          <div 
            className="card" 
            style={{ 
              padding: '0', 
              background: '#0d1117', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '560px'
            }}
          >
            {/* Editor Toolbar */}
            <div 
              style={{ 
                padding: '0.75rem 1rem', 
                background: '#161b22', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f87171' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399' }} />
                <span style={{ color: '#e6edf3', fontSize: '0.85rem', fontWeight: 700, marginLeft: '0.4rem', fontFamily: 'monospace' }}>
                  Main.java
                </span>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                  {language.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select 
                  value={language} 
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  style={{ 
                    padding: '0.35rem 0.65rem', 
                    borderRadius: '8px', 
                    background: '#0d1117', 
                    color: '#38bdf8', 
                    border: '1px solid rgba(56, 189, 248, 0.3)', 
                    fontWeight: 700, 
                    fontSize: '0.78rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="java">☕ Java 21 (OpenJDK)</option>
                  <option value="python">🐍 Python 3.12</option>
                  <option value="cpp">⚡ C++ 20</option>
                  <option value="javascript">🌐 JavaScript (ES6+)</option>
                </select>

                <button 
                  onClick={() => handleCopyCode(code)}
                  style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <FiCopy size={12} /> Copy
                </button>
                <button 
                  onClick={() => setCode('')}
                  style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <FiTrash2 size={12} /> Clear
                </button>
              </div>
            </div>

            {/* Code Textarea with Line Numbers */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', background: '#0d1117' }}>
              <div 
                style={{ 
                  width: '42px', 
                  padding: '1rem 0.5rem', 
                  background: '#090d13', 
                  color: '#484f58', 
                  fontFamily: 'monospace', 
                  fontSize: '0.85rem', 
                  lineHeight: '1.55rem', 
                  textAlign: 'right',
                  userSelect: 'none',
                  borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                {code.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your Java 21 class Main here..."
                spellCheck="false"
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: '#0d1117',
                  color: '#e6edf3',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '0.88rem',
                  lineHeight: '1.55rem',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  tabSize: 4
                }}
              />
            </div>
          </div>

          {/* Console Output & AI Analysis */}
          <div 
            className="card" 
            style={{ 
              padding: '0', 
              background: '#0a0d14', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '560px'
            }}
          >
            {/* Console Tabs */}
            <div 
              style={{ 
                padding: '0.5rem 1rem', 
                background: '#12161f', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '0.5rem'
              }}
            >
              <button 
                onClick={() => setActiveConsoleTab('output')}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  background: activeConsoleTab === 'output' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: activeConsoleTab === 'output' ? '#38bdf8' : '#94a3b8',
                  border: activeConsoleTab === 'output' ? '1px solid rgba(56, 189, 248, 0.3)' : 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <FiTerminal size={14} /> Console Output
              </button>

              <button 
                onClick={() => setActiveConsoleTab('input')}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  background: activeConsoleTab === 'input' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                  color: activeConsoleTab === 'input' ? '#c084fc' : '#94a3b8',
                  border: activeConsoleTab === 'input' ? '1px solid rgba(168, 85, 247, 0.3)' : 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <FiFileText size={14} /> Standard Input (Stdin)
              </button>

              {output?.aiExplanation && (
                <button 
                  onClick={() => setActiveConsoleTab('ai')}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    background: activeConsoleTab === 'ai' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: activeConsoleTab === 'ai' ? '#fbbf24' : '#94a3b8',
                    border: activeConsoleTab === 'ai' ? '1px solid rgba(245, 158, 11, 0.3)' : 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <FiCpu size={14} /> AI JVM Trace
                </button>
              )}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
              {activeConsoleTab === 'output' && (
                <div>
                  {output ? (
                    <div>
                      {/* Metric Badges */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', background: output.exitCode === 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: output.exitCode === 0 ? '#34d399' : '#f87171', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FiCheckCircle size={12} /> Exit Code: {output.exitCode}
                        </span>
                        {output.executionTimeMs && (
                          <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600 }}>
                            ⏱️ {output.executionTimeMs} ms
                          </span>
                        )}
                        {output.memoryUsedMb && (
                          <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', fontSize: '0.75rem', fontWeight: 600 }}>
                            🧠 {output.memoryUsedMb} MB Heap
                          </span>
                        )}
                      </div>

                      {/* Stdout Log */}
                      <div 
                        style={{ 
                          padding: '0.85rem', 
                          background: '#040608', 
                          borderRadius: '10px', 
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          color: '#e2e8f0',
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.45rem'
                        }}
                      >
                        {output.stdout || output.stderr || 'Execution finished with no stdout.'}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
                      <FiTerminal size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>Press "Run Code" above to compile on Java 21 OpenJDK</p>
                    </div>
                  )}
                </div>
              )}

              {activeConsoleTab === 'input' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Enter Custom Console Inputs (Scanner.nextLine() / cin / input()):
                  </label>
                  <textarea
                    value={stdinInput}
                    onChange={(e) => setStdinInput(e.target.value)}
                    placeholder="e.g. 5\n10 20 30 40 50"
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: '#040608',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {activeConsoleTab === 'ai' && output?.aiExplanation && (
                <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <FiCpu size={16} /> AI JVM Execution Diagnostic
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
                    {output.aiExplanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: JVM MEMORY & STACK INSPECTOR */}
      {/* ========================================================================= */}
      {activeView === 'visualizer' && (
        <div className="card" style={{ padding: '1.75rem', background: '#0a0d14', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontSize: '0.8rem', fontWeight: 800 }}>
                <FiActivity size={16} /> JVM RUNTIME ARCHITECTURE
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0 0 0' }}>
                🧠 Java Virtual Machine (JVM) Call Stack & Heap Graph
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Step: {jvmStep}/4</span>
              <button 
                onClick={() => setJvmStep(prev => Math.max(1, prev - 1))}
                disabled={jvmStep === 1}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
              >
                ◀ Prev Step
              </button>
              <button 
                onClick={() => setJvmStep(prev => Math.min(4, prev + 1))}
                disabled={jvmStep === 4}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Next Step ▶
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {/* 1. Thread Call Stack */}
            <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>
                <FiLayers size={16} /> Thread Call Stack (LIFO Frames)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {jvmStep >= 3 && (
                  <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>Frame: BankAccount.deposit(double amount)</div>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.2rem' }}>Local vars: <code>amount = 15000.0</code>, <code>this = #0x4A21</code></div>
                  </div>
                )}
                {jvmStep >= 2 && (
                  <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid #818cf8' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#818cf8' }}>Frame: SavingsAccount.&lt;init&gt;()</div>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.2rem' }}>super(accNo, name, bal) -&gt; <code>initialBalance = 75000.0</code></div>
                  </div>
                )}
                <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e2e8f0' }}>Frame: Main.main(String[] args)</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>References: <code>bank = #0x101F</code>, <code>acc1 = #0x4A21</code></div>
                </div>
              </div>
            </div>

            {/* 2. JVM Heap Memory */}
            <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '14px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>
                <FiCpu size={16} /> JVM Heap Memory (Objects & String Pool)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c084fc' }}>Object @ #0x4A21 [SavingsAccount]</div>
                  <div style={{ fontSize: '0.75rem', color: '#e2e8f0', marginTop: '0.25rem' }}>
                    • accountNumber: "SB-1001" (String Pool)<br />
                    • customerName: "Aarav Sharma" (String Pool)<br />
                    • balance: <strong>{jvmStep >= 3 ? '90000.0' : '75000.0'}</strong><br />
                    • annualInterestRate: 7.2%
                  </div>
                </div>

                <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24' }}>Object @ #0x101F [BankService]</div>
                  <div style={{ fontSize: '0.75rem', color: '#e2e8f0', marginTop: '0.25rem' }}>
                    • accounts: ConcurrentHashMap (Capacity: 16, Size: 2)
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Metaspace / Garbage Collector */}
            <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>
                <FiCheckCircle size={16} /> Metaspace & Garbage Collector
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>Loaded Classes:</strong> <code>Main.class</code>, <code>BankAccount.class</code>, <code>SavingsAccount.class</code>, <code>BankService.class</code></p>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>ZGC / G1 Status:</strong> 0 Major GC pauses. Eden Space allocated 14.2 MB.</p>
                <p style={{ margin: 0, color: '#34d399', fontWeight: 600 }}>Thread: Virtual Thread #21 (Project Loom active)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: JAVA CODE VAULT */}
      {/* ========================================================================= */}
      {activeView === 'vault' && (
        <div className="card" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(18, 18, 28, 0.95), rgba(10, 10, 18, 0.98))', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <FiBookOpen size={16} /> JAVA CODE VAULT & ALGORITHM REPOSITORY
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                ☕ Master Java Programs & ICSE / Board Solutions
              </h2>
            </div>

            {/* Search Filter Bar */}
            <div style={{ position: 'relative', width: '280px' }}>
              <FiSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Java programs, OOPs, DSA..."
                style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            {JAVA_PROGRAM_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  background: selectedCategory === cat ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedCategory === cat ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: selectedCategory === cat ? '#fff' : '#cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.1rem' }}>
            {filteredJavaPrograms.map((prog) => (
              <div
                key={prog.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: '14px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
                      {prog.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                      {prog.level}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem 0', lineHeight: 1.4 }}>
                    {prog.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 0.8rem 0', lineHeight: 1.5 }}>
                    {prog.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {prog.tags.map(t => (
                      <span key={t} style={{ fontSize: '0.7rem', color: '#a5b4fc', background: 'rgba(255, 255, 255, 0.03)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button
                    onClick={() => handleLoadProgram(prog)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  >
                    <FiPlay size={14} /> Load & Run Code
                  </button>
                  <button
                    onClick={() => handleCopyCode(prog.code)}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    title="Copy Java code"
                  >
                    <FiCopy size={14} />
                  </button>
                  <button
                    onClick={() => handleDownloadJava(prog.code, `${prog.id}.java`)}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    title="Download .java file"
                  >
                    <FiDownload size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: JAVA 21 REPOSITORY FILES & MAVEN SUITE */}
      {/* ========================================================================= */}
      {activeView === 'repo-files' && (
        <div className="card" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, #090d16, #0d121f)', border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <FiLayers size={16} /> REPOSITORY FILE TREE & APACHE MAVEN PROJECT
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📂 Java 21 Source Files (<a href="https://github.com/ShubhamChavhan6/S-classes-ai" target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'underline' }}>S-classes-ai</a>)
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  window.open('/api/java/download/pom.xml', '_blank');
                  toast.showToast('Downloading pom.xml', 'info');
                }}
                style={{ padding: '0.55rem 0.9rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <FiDownload size={14} /> Download pom.xml
              </button>
              <button
                onClick={() => {
                  if (selectedRepoFile) {
                    handleDownloadJava(selectedRepoFile.content, selectedRepoFile.name);
                  }
                }}
                style={{ padding: '0.55rem 0.9rem', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <FiDownload size={14} /> Download Selected File
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 320px) minmax(0, 1fr)', gap: '1.25rem', alignItems: 'start' }}>
            
            {/* File List Tree */}
            <div style={{ background: '#0a0d14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.4rem' }}>
                📁 java-src/com/sclasses/
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {repoFiles.length === 0 && !isLoadingRepoFiles && (
                  <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
                    Loading Java source files...
                  </div>
                )}
                {repoFiles.map((file) => {
                  const isSelected = selectedRepoFile?.name === file.name;
                  return (
                    <button
                      key={file.name}
                      onClick={() => setSelectedRepoFile(file)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid #6366f1' : '1px solid transparent',
                        color: isSelected ? '#ffffff' : '#cbd5e1',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 700 : 500,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                        <span style={{ color: '#fbbf24' }}>☕</span>
                        <span style={{ fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {file.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', color: '#94a3b8' }}>
                        {file.category}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Maven Build Box */}
              <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.3rem' }}>
                  🛠️ Maven CLI Build Command:
                </div>
                <code style={{ fontSize: '0.75rem', color: '#a5f3fc', display: 'block', background: 'rgba(0,0,0,0.5)', padding: '0.4rem', borderRadius: '6px' }}>
                  mvn clean compile exec:java
                </code>
              </div>
            </div>

            {/* File Viewer Box */}
            <div style={{ background: '#0a0d14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', overflow: 'hidden' }}>
              {selectedRepoFile ? (
                <div>
                  <div style={{ padding: '0.85rem 1.25rem', background: '#121722', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>
                        📄 {selectedRepoFile.path}
                      </span>
                      <span style={{ marginLeft: '0.75rem', color: '#94a3b8', fontSize: '0.78rem' }}>
                        ({(selectedRepoFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setLanguage('java');
                          setCode(selectedRepoFile.content);
                          setActiveView('ide');
                          toast.showToast(`Loaded ${selectedRepoFile.name} into IDE!`, 'success');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <FiPlay size={13} /> Run in IDE
                      </button>
                      <button
                        onClick={() => handleCopyCode(selectedRepoFile.content)}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <FiCopy size={13} /> Copy
                      </button>
                      <button
                        onClick={() => handleDownloadJava(selectedRepoFile.content, selectedRepoFile.name)}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <FiDownload size={13} />
                      </button>
                    </div>
                  </div>
                  <pre 
                    style={{ 
                      margin: 0, 
                      padding: '1.25rem', 
                      background: '#0d1117', 
                      color: '#e6edf3', 
                      fontFamily: 'monospace', 
                      fontSize: '0.88rem', 
                      lineHeight: '1.55', 
                      maxHeight: '540px', 
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {selectedRepoFile.content}
                  </pre>
                </div>
              ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  Select a Java source file to preview and execute.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: ENTERPRISE PROJECT BLUEPRINTS */}
      {/* ========================================================================= */}
      {activeView === 'blueprints' && (
        <div className="card" style={{ padding: '1.75rem', background: '#0a0d14', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 800 }}>
              <FiBox size={16} /> FULL-SYSTEM ARCHITECTURE & MULTI-CLASS JAVA PROJECTS
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0 0 0' }}>
              🏗️ Enterprise Java Project Blueprints
            </h2>
          </div>

          {/* Project Selector Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            {JAVA_PROJECT_BLUEPRINTS.map(proj => (
              <button
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  background: selectedProject.id === proj.id ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedProject.id === proj.id ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: selectedProject.id === proj.id ? '#000' : '#cbd5e1',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {proj.name}
              </button>
            ))}
          </div>

          {/* Active Project Details */}
          <div style={{ background: '#0d1117', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', background: '#161b22', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {selectedProject.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                  {selectedProject.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setLanguage('java');
                    setCode(selectedProject.code);
                    setActiveView('ide');
                    toast.showToast(`Loaded ${selectedProject.name} into IDE!`, 'info');
                  }}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <FiPlay size={14} /> Open in IDE & Run
                </button>
                <button
                  onClick={() => handleCopyCode(selectedProject.code)}
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <FiCopy size={14} /> Copy Full Code
                </button>
              </div>
            </div>

            <pre style={{ margin: 0, padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e6edf3', lineHeight: '1.5', maxHeight: '480px', overflowY: 'auto', background: '#090d13' }}>
              {selectedProject.code}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: AI JAVA ARCHITECT & GENERATOR */}
      {/* ========================================================================= */}
      {activeView === 'ai-architect' && (
        <div className="card" style={{ padding: '1.75rem', background: '#0a0d14', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '20px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.8rem', fontWeight: 800 }}>
              <FiZap size={16} /> GEMINI AI JAVA ARCHITECT
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0 0 0' }}>
              ✨ Instant Java 21 Code Generator & Problem Solver
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
              Describe any algorithm, ICSE/CBSE board problem, or Spring Boot microservice to get production-grade Java 21 code with unit tests.
            </p>
          </div>

          <form onSubmit={handleGenerateAiJava} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Build an LRU Cache with HashMap and Doubly Linked List in Java 21 with O(1) get and put operations..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                background: '#040608',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Target Level:</span>
                {['BEGINNER (School)', 'INTERMEDIATE (OOPs)', 'ADVANCED (Enterprise)'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setAiDifficulty(lvl.split(' ')[0])}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      background: aiDifficulty === lvl.split(' ')[0] ? '#a855f7' : 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isGeneratingAi || !aiPrompt.trim()}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: isGeneratingAi ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)'
                }}
              >
                {isGeneratingAi ? <FiRefreshCw className="spin" size={16} /> : <FiZap size={16} />}
                {isGeneratingAi ? 'Synthesizing Java 21...' : 'Generate Java Code'}
              </button>
            </div>
          </form>

          {aiGeneratedResult && (
            <div style={{ background: '#0d1117', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.3)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', background: '#161b22', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {aiGeneratedResult.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Time: {aiGeneratedResult.timeComplexity}</span>
                    <span style={{ fontSize: '0.75rem', color: '#c084fc' }}>Space: {aiGeneratedResult.spaceComplexity}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setLanguage('java');
                    setCode(aiGeneratedResult.code);
                    setActiveView('ide');
                    toast.showToast('Loaded AI Java solution into Compiler!', 'info');
                  }}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <FiPlay size={14} /> Open in IDE & Run
                </button>
              </div>

              <pre style={{ margin: 0, padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e6edf3', lineHeight: '1.5', maxHeight: '400px', overflowY: 'auto', background: '#090d13' }}>
                {aiGeneratedResult.code}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 6: JAVA OUTPUT PREDICTION QUIZ */}
      {/* ========================================================================= */}
      {activeView === 'quiz' && (
        <div className="card" style={{ padding: '1.75rem', background: '#0a0d14', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800 }}>
                <FiAward size={16} /> JAVA JVM OUTPUT & BUG PREDICTION ARENA
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0 0 0' }}>
                🎯 Question {currentQuizIndex + 1} of {JAVA_QUIZ_QUESTIONS.length}
              </h2>
            </div>

            <div style={{ padding: '0.4rem 0.85rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem' }}>
              Score: {quizScore} / {JAVA_QUIZ_QUESTIONS.length}
            </div>
          </div>

          {/* Current Question */}
          {(() => {
            const currentQ = JAVA_QUIZ_QUESTIONS[currentQuizIndex];
            return (
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                  {currentQ.question}
                </div>

                {/* Code Snippet */}
                <pre style={{ padding: '1rem', background: '#0d1117', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'monospace', fontSize: '0.88rem', color: '#e6edf3', lineHeight: '1.5', overflowX: 'auto', marginBottom: '1.25rem' }}>
                  {currentQ.code}
                </pre>

                {/* Options */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;
                    let optBg = 'rgba(255, 255, 255, 0.04)';
                    let optBorder = '1px solid rgba(255, 255, 255, 0.1)';
                    let optColor = '#e2e8f0';

                    if (isSubmittedQuiz) {
                      if (isCorrect) {
                        optBg = 'rgba(16, 185, 129, 0.2)';
                        optBorder = '1px solid #10b981';
                        optColor = '#34d399';
                      } else if (isSelected && !isCorrect) {
                        optBg = 'rgba(239, 68, 68, 0.2)';
                        optBorder = '1px solid #ef4444';
                        optColor = '#f87171';
                      }
                    } else if (isSelected) {
                      optBg = 'rgba(56, 189, 248, 0.2)';
                      optBorder = '1px solid #38bdf8';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={isSubmittedQuiz}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          background: optBg,
                          border: optBorder,
                          color: optColor,
                          textAlign: 'left',
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: isSubmittedQuiz ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>{opt}</span>
                        {isSubmittedQuiz && isCorrect && <FiCheck size={16} color="#34d399" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isSubmittedQuiz && (
                  <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      🧠 JVM Execution Diagnostic ({currentQ.conceptTag}):
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                      {currentQ.explanation}
                    </p>
                  </div>
                )}

                {/* Next Button */}
                {isSubmittedQuiz && (
                  <button
                    onClick={handleNextQuiz}
                    style={{
                      padding: '0.65rem 1.4rem',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    {currentQuizIndex < JAVA_QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'} <FiChevronRight size={16} />
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
