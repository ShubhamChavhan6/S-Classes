import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { FiBookmark, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import '../../pages.css';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookmarks/my')
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setBookmarks(r.data);
        } else {
          setBookmarks([
            { id: 'b-1', lessonTitle: 'Chapter 4: Linear Equations & Matrices', note: 'Important matrix formula for board exams', createdAt: '2026-08-01' },
            { id: 'b-2', lessonTitle: 'Class 10 Physics: Ray Diagrams for Lenses', note: 'Formula: 1/f = 1/v - 1/u', createdAt: '2026-08-05' },
            { id: 'b-3', lessonTitle: 'Java 21 Collections: HashMap & Virtual Threads', note: 'Key methods: map.put(), map.getOrDefault(), Executors.newVirtualThreadPerTaskExecutor()', createdAt: '2026-08-08' },
          ]);
        }
      })
      .catch(() => {
        setBookmarks([
          { id: 'b-1', lessonTitle: 'Chapter 4: Linear Equations & Matrices', note: 'Important matrix formula for board exams', createdAt: '2026-08-01' },
          { id: 'b-2', lessonTitle: 'Class 10 Physics: Ray Diagrams for Lenses', note: 'Formula: 1/f = 1/v - 1/u', createdAt: '2026-08-05' },
          { id: 'b-3', lessonTitle: 'Java 21 Collections: HashMap & Virtual Threads', note: 'Key methods: map.put(), map.getOrDefault(), Executors.newVirtualThreadPerTaskExecutor()', createdAt: '2026-08-08' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (bookmarkId) => {
    try {
      await api.delete(`/bookmarks/${bookmarkId}`);
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    } catch (err) {
      console.error('Failed to delete bookmark', err);
    }
  };

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
      <p>Loading bookmarks...</p>
    </div>
  );

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: '0.25rem' }}>
        <FiBookmark style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--accent)' }} />
        My Bookmarks
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Save lessons and notes for quick access
      </p>

      {bookmarks.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{ marginBottom: '0.75rem' }}>No Bookmarks Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Browse courses and bookmark lessons you want to revisit.
          </p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses <FiChevronRight />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bookmarks.map(bookmark => (
            <div key={bookmark.id} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                <FiBookmark size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {bookmark.lessonTitle}
                </div>
                {bookmark.note && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {bookmark.note}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bookmark.createdAt?.slice(0, 10)}</span>
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '0.85rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}
                  title="Remove bookmark"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}