import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. መሠረታዊ መረጃዎች (States)
  const [balance, setBalance] = useState(500); // ቀሪ ሂሳብ
  const [bet, setBet] = useState(10); // ውርርድ
  const [timer, setTimer] = useState(30); // የሰዓት ቆጣሪ (ከ30 ይጀምራል)
  const [soldCount, setSoldCount] = useState(12); // የተሸጡ ካርቴላዎች ብዛት
  
  const [mySlots, setMySlots] = useState([]); // ተጫዋቹ የገዛቸው ካርቴላዎች
  const [allSoldCartelas, setAllSoldCartelas] = useState([5, 18, 44]); // ለምሳሌ ሌሎች ተጫዋቾች ቀድመው የገዟቸው ካርቴላዎች
  
  const [gameStarted, setGameStarted] = useState(false); // ሰዓቱ ሲያልቅ ወደ ጨዋታ ሜዳ ለመሄድ

  // 2. የሰዓት ቆጣሪ አሠራር (Timer Logic)
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // ሰዓቱ 0 ሲደርስ አውቶማቲክ ወደ ጨዋታ ሜዳ ይወስደናል
      setGameStarted(true);
    }
  }, [timer]);

  // ከ1 እስከ 200 የካርቴላ ቁጥሮች ማመንጫ
  const totalCartelas = Array.from({ length: 200 }, (_, i) => i + 1);

  // 3. ካርቴላ የመምረጥ አሠራር
  const handleSelectCartela = (num) => {
    // ካርቴላው አስቀድሞ ከተሸጠ ወይም እኛ ከገዛነው ምንም አያደርግም
    if (allSoldCartelas.includes(num) || mySlots.includes(num)) return;

    // ብር ካለን ብቻ ነው መግዛት የምንችለው
    if (balance >= bet) {
      setMySlots([...mySlots, num]); // ወደ YOUR SLOT ይጨምረዋል
      setSoldCount((prev) => prev + 1); // SOLD ላይ 1 ይጨምራል
      setBalance((prev) => prev - bet); // ከባላንስ ላይ የቤቱን ብር ይቀንሳል
    } else {
      alert("ለማስያዝ በቂ ገንዘብ የለዎትም!");
    }
  };

  // 🔴 ገጽ 2፦ ሰዓቱ አልቆ ጨዋታው ሲጀምር የሚመጣው ጊዜያዊ ገጽ (እሱን ቀጥለን በዝርዝር እንሠራዋለን)
  if (gameStarted) {
    return (
      <div className="app-container">
        <div className="header">
          <h1 className="logo">🎰 ላኪ ቢንጎ 🎰</h1>
          <p className="subtitle" style={{color: '#00ffcc'}}>የጨዋታው ሜዳ ተከፍቷል!</p>
        </div>
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <p>የመረጧቸው ካርቴላዎች፦ {mySlots.join(', ') || 'ምንም አልመረጡም'}</p>
          <h2 style={{color: '#ff3399', marginTop: '20px'}}>⚠️ የሁለተኛውን ገጽ አሠራር ቀጥለን እንሠራዋለን...</h2>
        </div>
      </div>
    );
  }

  // 🟢 ገጽ 1፦ የመጀመሪያው መነሻ ገጽ ዲዛይን
  return (
    <div className="app-container">
      {/* ርዕስ */}
      <h1 className="main-title">ላዝ ቢንጎ</h1>

      {/* የላይኛው መረጃ ሰሌዳ */}
      <div className="top-info-grid">
        <div className="info-box">
          <span className="info-label text-green">BALANCE</span>
          <span className="info-value text-green">{balance}</span>
        </div>
        <div className="info-box">
          <span className="info-label text-red">BET</span>
          <span className="info-value text-red">{bet}</span>
        </div>
        <div className="info-box">
          <span className="info-label text-yellow">TIME</span>
          <span className="info-value text-yellow">{timer}⏱️</span>
        </div>
        <div className="info-box">
          <span className="info-label text-cyan">SOLD</span>
          <span className="info-value text-cyan">{soldCount}🎫</span>
        </div>
      </div>

      {/* YOUR SLOT ሳጥን */}
      <div className="your-slot-container">
        <span className="slot-title">YOUR SLOT</span>
        <div className="slot-box">
          {mySlots.length > 0 ? (
            mySlots.map(num => <span key={num} className="selected-tag">#{num}</span>)
          ) : (
            <span className="placeholder-text">+ ካርቴላ ይምረጡ</span>
          )}
        </div>
      </div>

      {/* የካርቴላ ቁጥሮች መዘርዘሪያ ሰሌዳ (1 - 200) */}
      <div className="selector-title">ካርቴላ ይምረጡ (1 - 200)</div>
      <div className="cartela-grid">
        {totalCartelas.map((num) => {
          const isMine = mySlots.includes(num);
          const isSold = allSoldCartelas.includes(num);
          
          return (
            <button
              key={num}
              disabled={isSold}
              className={`cartela-cell ${isMine ? 'mine' : ''} ${isSold ? 'sold' : ''}`}
              onClick={() => handleSelectCartela(num)}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
