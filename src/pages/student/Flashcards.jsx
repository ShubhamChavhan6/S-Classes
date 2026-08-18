import { useState, useEffect } from 'react';
import { 
  FiZap, 
  FiRotateCw, 
  FiCheckCircle, 
  FiArrowRight, 
  FiArrowLeft, 
  FiCpu, 
  FiLayers, 
  FiPlusCircle
} from 'react-icons/fi';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Flashcards() {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);
  const [activeDeckId, setActiveDeckId] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Custom AI Deck Generator state
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Self assessment state: { [cardId]: 'easy' | 'medium' | 'hard' }
  const [assessments, setAssessments] = useState({});

  useEffect(() => {
    async function fetchFlashcards() {
      try {
        setLoading(true);
        const res = await api.get('/flashcards');
        if (res.data && res.data.decks) {
          setDecks(res.data.decks);
          if (res.data.decks.length > 0) {
            setActiveDeckId(res.data.decks[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load flashcards:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFlashcards();
  }, []);

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];
  const currentCard = activeDeck?.cards?.[currentCardIndex];
  const totalCards = activeDeck?.cards?.length || 0;

  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0); // loop around
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    } else {
      setCurrentCardIndex(totalCards - 1);
    }
  };

  const handleAssessment = (cardId, rating) => {
    setAssessments(prev => ({
      ...prev,
      [cardId]: rating
    }));
    handleNextCard();
  };

  const handleGenerateCustomDeck = async (e) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    try {
      setIsGenerating(true);
      const res = await api.post('/flashcards/generate', { topic: customTopic });
      if (res.data && res.data.cards) {
        const newDeck = res.data;
        setDecks(prev => [newDeck, ...prev]);
        setActiveDeckId(newDeck.id);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setCustomTopic('');
      }
    } catch (err) {
      console.error('Failed to generate AI deck:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Progress calculations
  const reviewedCount = Object.keys(assessments).length;
  const easyCount = Object.values(assessments).filter(v => v === 'easy').length;

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="spinner" style={{ width: '36px', height: '36px' }} />
          <p style={{ color: '#cbd5e1', fontSize: '1rem', fontWeight: 600 }}>
            Loading Interactive Revision Flashcards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <div 
        className="card" 
        style={{ 
          padding: '2rem', 
          marginBottom: '2rem', 
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7), rgba(15, 23, 42, 0.9))', 
          border: '1px solid rgba(124, 58, 237, 0.3)', 
          borderRadius: '20px' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-accent" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                <FiZap style={{ marginRight: '0.3rem' }} /> Active Recall Hub
              </span>
              <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600 }}>
                {user?.qualification || 'Board & Coding Revision'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
              ⚡ AI Flashcard & Revision Decks
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
              Boost long-term retention through scientifically proven active recall flip cards, formula cheatsheets, and instant AI study deck generation.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Session Mastery
            </div>
            <div style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 800, marginTop: '0.2rem' }}>
              {easyCount} / {reviewedCount || 1} Mastered
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Deck Picker + Right Interactive Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Deck Selection & AI Deck Generator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Deck Selector */}
          <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiLayers style={{ color: '#818cf8' }} /> Select Revision Deck
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {decks.map((deck) => {
                const isActive = deck.id === activeDeckId;
                return (
                  <button
                    key={deck.id}
                    onClick={() => {
                      setActiveDeckId(deck.id);
                      setCurrentCardIndex(0);
                      setIsFlipped(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      background: isActive 
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(79, 70, 229, 0.15))' 
                        : 'rgba(255, 255, 255, 0.03)',
                      border: isActive ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.06)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isActive ? '#a5b4fc' : '#ffffff' }}>
                        {deck.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                        📚 {deck.subject} • {deck.cards?.length || 0} Cards
                      </div>
                    </div>
                    {isActive && <FiCheckCircle style={{ color: '#6366f1', flexShrink: 0 }} size={18} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Deck Generator Input */}
          <div className="card" style={{ padding: '1.5rem', background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.25)', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCpu style={{ color: '#a855f7' }} /> Generate Custom AI Deck
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
              Type any subject topic (e.g. "React Hooks", "Organic Chemistry", "Calculus") to build an instant flashcard deck.
            </p>

            <form onSubmit={handleGenerateCustomDeck} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input 
                type="text"
                placeholder="e.g., Java 21 OOPs & Streams..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isGenerating || !customTopic.trim()}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700
                }}
              >
                {isGenerating ? (
                  <>Building Deck...</>
                ) : (
                  <>
                    <FiPlusCircle size={16} /> Generate AI Flashcards
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive 3D Flip Flashcard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Top Card Navigation Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
              Card <span style={{ color: '#ffffff', fontWeight: 800 }}>{currentCardIndex + 1}</span> of {totalCards}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={handlePrevCard}
                className="btn"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '0.5rem 0.85rem' }}
              >
                <FiArrowLeft size={16} />
              </button>
              <button 
                onClick={handleNextCard}
                className="btn"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '0.5rem 0.85rem' }}
              >
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Progress Line */}
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${((currentCardIndex + 1) / (totalCards || 1)) * 100}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>

          {/* Flashcard Area */}
          {currentCard ? (
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                perspective: '1000px',
                cursor: 'pointer',
                minHeight: '380px'
              }}
            >
              <div
                style={{
                  width: '100%',
                  minHeight: '380px',
                  borderRadius: '24px',
                  padding: '2.25rem',
                  background: isFlipped 
                    ? 'linear-gradient(145deg, rgba(24, 24, 37, 0.95), rgba(15, 23, 42, 0.95))' 
                    : 'linear-gradient(145deg, rgba(30, 27, 75, 0.85), rgba(17, 24, 39, 0.95))',
                  border: isFlipped 
                    ? '1.5px solid rgba(16, 185, 129, 0.4)' 
                    : '1.5px solid rgba(99, 102, 241, 0.4)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.4s ease, border-color 0.3s ease',
                  position: 'relative'
                }}
              >
                {/* Header Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge" style={{ background: isFlipped ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)', color: isFlipped ? '#34d399' : '#818cf8', padding: '0.35rem 0.8rem' }}>
                    {isFlipped ? '💡 Explanation & Solution' : '❓ Question / Concept Prompt'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FiRotateCw size={14} /> Click card to flip
                  </span>
                </div>

                {/* Content */}
                <div style={{ margin: '1.5rem 0' }}>
                  {!isFlipped ? (
                    <div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.4, margin: 0 }}>
                        {currentCard.question}
                      </h2>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <p style={{ fontSize: '1.05rem', color: '#f1f5f9', lineHeight: 1.6, margin: 0 }}>
                        {currentCard.answer}
                      </p>

                      {currentCard.codeSnippet && (
                        <pre style={{
                          background: 'rgba(0, 0, 0, 0.5)',
                          padding: '1rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#38bdf8',
                          fontSize: '0.88rem',
                          overflowX: 'auto',
                          fontFamily: 'monospace',
                          margin: 0
                        }}>
                          <code>{currentCard.codeSnippet}</code>
                        </pre>
                      )}

                      {currentCard.tip && (
                        <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '0.75rem 1rem', borderRadius: '10px', borderLeft: '3px solid #fbbf24', fontSize: '0.85rem', color: '#fef08a' }}>
                          💡 <strong>Memory Tip:</strong> {currentCard.tip}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Footer */}
                <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                  {!isFlipped ? '👆 Tap to reveal answer' : '✅ Rate your confidence below'}
                </div>
              </div>
            </div>
          ) : null}

          {/* Confidence Self-Rating Action Controls */}
          <div className="card" style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.75rem', textAlign: 'center' }}>
              Self-Assessment Rating
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <button
                onClick={() => handleAssessment(currentCard?.id, 'hard')}
                className="btn"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                🔴 Hard (Retry)
              </button>

              <button
                onClick={() => handleAssessment(currentCard?.id, 'medium')}
                className="btn"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fde047',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                🟡 Medium
              </button>

              <button
                onClick={() => handleAssessment(currentCard?.id, 'easy')}
                className="btn"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#6ee7b7',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                🟢 Mastered!
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
