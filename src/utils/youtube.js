// src/utils/youtube.js

// Guaranteed embed-friendly public educational video IDs
export const GUARANTEED_EMBEDDABLE_VIDEOS = {
  python: 'rfscVS0vtbw', // FreeCodeCamp Python
  webdev: 'L_LUpnjgPso', // FreeCodeCamp React
  math: 'fNKUz1N9N1g', // Khan Academy Algebra
  science: 'aircAruvnKk', // 3Blue1Brown / Science
  default: 'rfscVS0vtbw'
};

/**
 * Safely parses any YouTube URL, embed code, or video ID string into a clean 11-character YouTube video ID.
 */
export function parseYouTubeId(input) {
  if (!input) return GUARANTEED_EMBEDDABLE_VIDEOS.default;
  const str = String(input).trim();

  // Pure 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  // Handle YouTube URLs (watch?v=, youtu.be/, embed/, Shorts, etc.)
  const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }

  return GUARANTEED_EMBEDDABLE_VIDEOS.default;
}

/**
 * Builds a clean, high-performance YouTube embed URL with safety parameters.
 * Note: autoplay=0 by default to prevent YouTube third-party embed blockages.
 */
export function getYouTubeEmbedUrl(videoId, autoplay = false) {
  const cleanId = parseYouTubeId(videoId);
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    playsinline: '1'
  });
  return `https://www.youtube.com/embed/${cleanId}?${params.toString()}`;
}

/**
 * Gets a direct YouTube watch URL for external playback fallback.
 */
export function getYouTubeWatchUrl(videoId) {
  const cleanId = parseYouTubeId(videoId);
  return `https://www.youtube.com/watch?v=${cleanId}`;
}

/**
 * Returns a high-res thumbnail URL for a YouTube video.
 */
export function getYouTubeThumbnailUrl(videoId) {
  const cleanId = parseYouTubeId(videoId);
  return `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
}

