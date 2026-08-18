// src/pages/kids/AlphabetLearner.jsx
import { useState } from 'react';

export default function AlphabetLearner() {
  const [selected, setSelected] = useState('A');
  const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '3rem', textAlign: 'center' }}>
      <h1 style={{ color: '#6c63ff', fontSize: '2rem', marginBottom: '1.5rem' }}>🔤 Alphabet Phonics</h1>
      <div style={{ fontSize: '5rem', fontWeight: 900, color: '#f59e0b', margin: '1rem 0' }}>{selected}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
        {alphabets.map(char => (
          <button 
            key={char} 
            onClick={() => setSelected(char)} 
            className="btn btn-secondary" 
            style={{ width: '45px', height: '45px', fontSize: '1.2rem', fontWeight: 700, padding: 0 }}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}
