// src/components/VoiceAiModal.jsx
import { useState } from 'react';
import { FiMic, FiMicOff, FiCpu, FiVolume2, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { saveAiTutorSession } from '../utils/aiSessionManager';

export default function VoiceAiModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [aiVoiceResponse, setAiVoiceResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLang, setVoiceLang] = useState('en-IN');

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setSpokenText('Listening... speak your doubt in Maths, Science, or Java 21...');
      
      // Simulate voice recognition
      setTimeout(() => {
        const sampleQuery = 'Explain Virtual Threads carrier thread pinning in Java 21';
        setSpokenText(`"${sampleQuery}"`);
        setIsListening(false);
        setIsSpeaking(true);
        setAiVoiceResponse('Virtual threads in Java 21 unmount from carrier threads when blocking on I/O. However, inside synchronized blocks, they pin to the carrier thread. Prefer ReentrantLock to avoid pinning.');

        // Record active session
        saveAiTutorSession(user, {
          id: `voice-sess-${Date.now()}`,
          topic: sampleQuery,
          subject: 'Computer Science / Java',
          mode: 'Voice Interactive',
          engine: 'Gemini 3.1 Pro Voice',
          status: 'ACTIVE',
          lastMessage: 'Virtual threads unmount from carrier threads when blocking on I/O. Prefer ReentrantLock to avoid pinning.',
          stepsCount: 2
        });

        setTimeout(() => setIsSpeaking(false), 4500);
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: '#0f172a', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '24px', padding: '1.75rem', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.7)', position: 'relative' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
        >
          <FiX size={20} />
        </button>

        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 25px rgba(14, 165, 233, 0.35)' }}>
          <FiCpu size={28} />
        </div>

        <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          🎙️ Voice AI Tutor & Doubt Solver
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
          Real-time spoken reasoning in English, Hindi, & Marathi powered by Gemini 3.1 Pro
        </p>

        {/* Language Selection */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[
            { code: 'en-IN', label: 'English' },
            { code: 'hi-IN', label: 'हिन्दी' },
            { code: 'mr-IN', label: 'मराठी' }
          ].map(l => (
            <button
              key={l.code}
              onClick={() => setVoiceLang(l.code)}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: voiceLang === l.code ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                background: voiceLang === l.code ? '#6366f1' : 'rgba(255,255,255,0.05)',
                color: voiceLang === l.code ? '#fff' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Big Mic Push Button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={toggleListening}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: isListening 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : isSpeaking 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isListening 
                ? '0 0 35px rgba(239, 68, 68, 0.6)' 
                : '0 10px 30px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s ease',
              transform: isListening ? 'scale(1.08)' : 'scale(1)'
            }}
          >
            {isListening ? <FiMicOff size={32} /> : isSpeaking ? <FiVolume2 size={32} /> : <FiMic size={32} />}
          </button>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isListening ? '#f87171' : isSpeaking ? '#34d399' : '#818cf8', marginTop: '0.75rem' }}>
            {isListening ? 'Listening to your voice...' : isSpeaking ? 'AI Tutor is explaining out loud...' : 'Tap Mic & Ask your doubt'}
          </div>
        </div>

        {/* Output Transcript Box */}
        {(spokenText || aiVoiceResponse) && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1rem', textAlign: 'left', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            {spokenText && (
              <div style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#818cf8' }}>You asked:</strong> {spokenText}
              </div>
            )}
            {aiVoiceResponse && (
              <div style={{ color: '#e2e8f0', lineHeight: 1.5 }}>
                <strong style={{ color: '#34d399' }}>AI Answer:</strong> {aiVoiceResponse}
              </div>
            )}
          </div>
        )}

        <button 
          onClick={onClose} 
          style={{ width: '100%', padding: '0.65rem', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
        >
          Done / Close
        </button>
      </div>
    </div>
  );
}

