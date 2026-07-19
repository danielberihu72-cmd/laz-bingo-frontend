import React, { useState } from 'react';
import './App.css';

function App() {
  // ከ1 እስከ 200 የካርቴላ መምረጫ ቁጥሮች ማመንጫ
  const cartelaNumbers = Array.from({ length: 200 }, (_, i) => i + 1);
  const [selectedCartela, setSelectedCartela] = useState(null);

  // የናሙና ቢንጎ ካርድ ቁጥሮች (B-I-N-G-O)
  const bingoCard = [,
 ,
    [4, 26, "FREE", 49, 70],
,
    [5, 22, 40, 52, 70]
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1 className="logo">🎰 ላኪ ቢንጎ 🎰</h1>
        <p className="subtitle">ድራሽ 88 ETB | ታክስ 20%</p>
      </div>

      {/* Stats Container */}
      <div className="stats-container">
        <div className="stat-box">
          <span className="stat-title">የወጡ ቁጥሮች</span>
          <span className="stat-value"><span style={{color: 'red'}}>🔴</span> 0/75</span>
        </div>
        <div className="stat-box">
          <span className="stat-title">ተጫዋቾች</span>
          <span className="stat-value">👥 12</span>
        </div>
        <div className="stat-box">
          <span className="stat-title">የተሸጡ (Sold)</span>
          <span className="stat-value" style={{color: '#00ffcc'}}>🔥 45</span>
        </div>
      </div>

      {/* Cartela Selector (1 - 200) */}
      <div className="card-title">🔢 የካርቴላ ቁጥር ይምረጡ (1 - 200)</div>
      <div className="cartela-selector">
        {cartelaNumbers.map((num) => (
          <button 
            key={num} 
            className={`cartela-btn ${selectedCartela === num ? 'active' : ''}`}
            onClick={() => setSelectedCartela(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Bingo Card */}
      <div className="card-title">💳 የእርስዎ የጨዋታ ካርድ {selectedCartela && `(#${selectedCartela})`}</div>
      <div className="bingo-card">
        {['B', 'I', 'N', 'G', 'O'].map(letter => (
          <div key={letter} className="grid-header">{letter}</div>
        ))}
        {bingoCard.flat().map((cell, idx) => (
          <div key={idx} className={cell === "FREE" ? "free-cell" : "grid-cell"}>
            {cell}
          </div>
        ))}
      </div>

      {/* Timer Counter */}
      <div className="timer-container">
        ⏱️ ጨዋታው ለመጀመር የቀረው ሰዓት፦ <span className="timer-countdown">25 ሰከንድ</span>
      </div>

      {/* Action Button */}
      <button className="bingo-btn">🏆 ቢንጎ! (አሸነፍኩ) 🏆</button>
    </div>
  );
}

export default App;
