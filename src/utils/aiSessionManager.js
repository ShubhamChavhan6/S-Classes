// src/utils/aiSessionManager.js
// Manager to track active AI Tutor sessions, step-by-step doubt solver threads, and voice interactions
import { getUserStorageKey, getStoredItem, setStoredItem } from './storage';

const AI_SESSIONS_PREFIX = 'sclasses_ai_tutor_sessions_';
const AI_SESSIONS_EVENT = 'sclasses_ai_sessions_updated';

const DEFAULT_SEEDED_SESSIONS = [
  {
    id: 'ai-sess-1',
    topic: 'Java 21 Virtual Threads & Project Loom Concurrency',
    subject: 'Computer Science / Java',
    mode: 'Step-by-Step Derivation',
    engine: 'Gemini 3.1 Pro (High Thinking)',
    status: 'ACTIVE',
    lastMessage: 'How do virtual threads differ from platform threads in memory allocation and carrier thread scheduling?',
    timestamp: '10 mins ago',
    createdTime: Date.now() - 1000 * 60 * 10,
    stepsCount: 4,
    resolved: false
  },
  {
    id: 'ai-sess-2',
    topic: 'Definite Integrals & Fundamental Theorem of Calculus',
    subject: 'Mathematics',
    mode: 'Concept Deep Dive',
    engine: 'Gemini 3.1 Pro (High Thinking)',
    status: 'RESOLVED',
    lastMessage: 'Step 3: Applied Riemann sum substitution and evaluated upper bound minus lower bound: F(b) - F(a).',
    timestamp: '2 hours ago',
    createdTime: Date.now() - 1000 * 60 * 120,
    stepsCount: 6,
    resolved: true
  },
  {
    id: 'ai-sess-3',
    topic: 'Photosynthesis Light vs Dark Reaction Bioenergetics',
    subject: 'Science / Biology',
    mode: 'Voice Interactive',
    engine: 'Gemini 3.1 Pro Voice',
    status: 'ACTIVE',
    lastMessage: 'Photophosphorylation generates ATP and NADPH in thylakoid grana for the Calvin cycle in stroma.',
    timestamp: 'Yesterday',
    createdTime: Date.now() - 1000 * 60 * 60 * 24,
    stepsCount: 3,
    resolved: false
  }
];

export function getAiTutorSessions(user) {
  const storageKey = getUserStorageKey(AI_SESSIONS_PREFIX, user);
  const data = getStoredItem(storageKey, null);
  if (!data || !Array.isArray(data)) {
    setStoredItem(storageKey, DEFAULT_SEEDED_SESSIONS);
    return DEFAULT_SEEDED_SESSIONS;
  }
  return data;
}

export function saveAiTutorSession(user, sessionData) {
  if (!sessionData) return [];
  const storageKey = getUserStorageKey(AI_SESSIONS_PREFIX, user);
  const currentSessions = getAiTutorSessions(user);

  const sessionId = sessionData.id || `ai-sess-${Date.now()}`;
  const existingIndex = currentSessions.findIndex(s => s.id === sessionId);

  const newSession = {
    id: sessionId,
    topic: sessionData.topic || 'General Problem Solving',
    subject: sessionData.subject || 'General Studies',
    mode: sessionData.mode || 'Step-by-Step Derivation',
    engine: sessionData.engine || 'Gemini 3.1 Pro (High Thinking)',
    status: sessionData.status || 'ACTIVE',
    lastMessage: sessionData.lastMessage || 'Exploring solution step by step...',
    timestamp: 'Just now',
    createdTime: sessionData.createdTime || Date.now(),
    stepsCount: sessionData.stepsCount || 1,
    resolved: sessionData.resolved || false
  };

  const updatedList = existingIndex >= 0
    ? currentSessions.map((s, idx) => idx === existingIndex ? { ...s, ...newSession } : s)
    : [newSession, ...currentSessions];

  setStoredItem(storageKey, updatedList, AI_SESSIONS_EVENT, { userKey: storageKey, sessions: updatedList });
  return updatedList;
}

export function updateAiTutorSessionStatus(user, sessionId, status) {
  const storageKey = getUserStorageKey(AI_SESSIONS_PREFIX, user);
  const currentSessions = getAiTutorSessions(user);

  const updatedList = currentSessions.map(s => {
    if (s.id === sessionId) {
      return {
        ...s,
        status: status,
        resolved: status === 'RESOLVED'
      };
    }
    return s;
  });

  setStoredItem(storageKey, updatedList, AI_SESSIONS_EVENT, { userKey: storageKey, sessions: updatedList });
  return updatedList;
}

export function deleteAiTutorSession(user, sessionId) {
  const storageKey = getUserStorageKey(AI_SESSIONS_PREFIX, user);
  const currentSessions = getAiTutorSessions(user);
  const updatedList = currentSessions.filter(s => s.id !== sessionId);

  setStoredItem(storageKey, updatedList, AI_SESSIONS_EVENT, { userKey: storageKey, sessions: updatedList });
  return updatedList;
}
