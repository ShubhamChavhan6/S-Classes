// src/utils/storage.js
// Centralized, type-safe local storage & event broadcaster utility to eliminate duplicate code across all managers

/**
 * Derives a consistent storage key from user object and prefix
 */
export function getUserStorageKey(prefix, user) {
  const userKey = user?.id || user?.email || 'guest_user';
  return `${prefix}${userKey}`;
}

/**
 * Safely reads and parses JSON data from localStorage
 */
export function getStoredItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading key "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

/**
 * Safely writes JSON data to localStorage and optionally dispatches a custom window event
 */
export function setStoredItem(key, value, eventName = null, eventDetail = null) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (eventName && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail ?? value }));
    }
    return true;
  } catch (err) {
    console.error(`Error writing key "${key}" to localStorage:`, err);
    return false;
  }
}

/**
 * Safely removes an item from localStorage
 */
export function removeStoredItem(key, eventName = null, eventDetail = null) {
  try {
    localStorage.removeItem(key);
    if (eventName && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }));
    }
    return true;
  } catch (err) {
    console.error(`Error removing key "${key}" from localStorage:`, err);
    return false;
  }
}
