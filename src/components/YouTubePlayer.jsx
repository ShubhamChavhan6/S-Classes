// src/components/YouTubePlayer.jsx
import { useState, useEffect } from 'react';
import { FiPlay, FiExternalLink, FiRefreshCw, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { parseYouTubeId, getYouTubeWatchUrl } from '../utils/youtube';

export default function YouTubePlayer({ 
  videoId, 
  title = 'Lesson Video', 
  autoPlayOnMount = false,
  aspectRatio = '16/9'
}) {
  const cleanId = parseYouTubeId(videoId);
  const [isPlaying, setIsPlaying] = useState(autoPlayOnMount);
  const [useNoCookie, setUseNoCookie] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(`https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`);

  // Reset state when video ID changes
  useEffect(() => {
    setIsPlaying(autoPlayOnMount);
    setHasError(false);
    setThumbnailUrl(`https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`);
  }, [cleanId, autoPlayOnMount]);

  // Construct embed URL based on domain setting
  const domain = useNoCookie ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
  const embedParams = new URLSearchParams({
    autoplay: isPlaying ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    playsinline: '1',
    widget_referrer: window.location.origin
  });

  const embedUrl = `${domain}/embed/${cleanId}?${embedParams.toString()}`;
  const watchUrl = getYouTubeWatchUrl(cleanId);

  const toggleDomain = () => {
    setUseNoCookie(prev => !prev);
    setHasError(false);
  };

  return (
    <div className="youtube-player-wrapper" style={{ background: '#0d0d12', border: '1px solid #242434', borderRadius: '16px', padding: '0.75rem', overflow: 'hidden' }}>
      {/* Player Stage Container */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: aspectRatio, 
          borderRadius: '12px', 
          overflow: 'hidden', 
          background: '#000',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}
      >
        {!isPlaying ? (
          /* Poster / Cover view prior to play */
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${thumbnailUrl})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justify: 'center', 
              cursor: 'pointer',
              padding: '1.5rem',
              textAlign: 'center'
            }}
            onClick={() => setIsPlaying(true)}
          >
            {/* Play Button Icon */}
            <div 
              style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                boxShadow: '0 10px 25px rgba(108, 99, 255, 0.5)',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                marginBottom: '1rem'
              }}
              className="play-btn-pulse"
            >
              <FiPlay size={32} style={{ marginLeft: '4px' }} />
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              {title}
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, background: 'rgba(0,0,0,0.6)', padding: '0.4rem 0.9rem', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
              ▶ Click to start video lesson
            </p>
          </div>
        ) : (
          /* Active Embed iFrame */
          <iframe
            key={`${cleanId}-${useNoCookie ? 'nocookie' : 'standard'}`}
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            onError={() => setHasError(true)}
          />
        )}
      </div>

      {/* Error or Fallback Warning Notice */}
      {hasError && (
        <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: 'rgba(231, 76, 60, 0.12)', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '10px', color: '#ff6b6b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FiAlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>Video playback restricted by YouTube or browser sandbox.</strong>
            <div style={{ marginTop: '0.2rem', color: '#cbd5e1' }}>
              You can switch player mode or open the video directly in a new tab.
            </div>
          </div>
        </div>
      )}

      {/* Interactive Controls & Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', padding: '0.4rem 0.2rem', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.82rem', color: '#94a3b8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: useNoCookie ? '#2ecc71' : '#6c63ff', fontWeight: 600 }}>
            <FiShield size={14} /> {useNoCookie ? 'Privacy Enhanced (No-Cookie)' : 'Standard Embed'}
          </span>
          <button 
            type="button" 
            onClick={toggleDomain}
            style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}
          >
            Switch to {useNoCookie ? 'Standard Mode' : 'No-Cookie Mode'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {isPlaying && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsPlaying(false)}
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
            >
              <FiRefreshCw size={12} /> Reset Cover
            </button>
          )}

          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', borderRadius: '8px' }}
          >
            <FiExternalLink size={13} /> Open on YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}
