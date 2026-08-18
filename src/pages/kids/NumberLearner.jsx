// src/pages/kids/NumberLearner.jsx
import { useState } from 'react';

export default function NumberLearner() {
  const [num, setNum] = useState(1);
  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '3rem', textAlign: 'center' }}>
      <h1 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '1.5rem' }}>🔢 Number Counting</h1>
      <div style={{ fontSize: '6rem', fontWeight: 900, color: '#60a5fa' }}>{num}</div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button onClick={() => setNum(Math.max(1, num - 1))} className="btn btn-secondary">- Less</button>
        <button onClick={() => setNum(num + 1)} className="btn btn-primary">+ More</button>
      </div>
    </div>
  );
}
