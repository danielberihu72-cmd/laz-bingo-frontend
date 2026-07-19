import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- የመጀመሪያው ገጽ መረጃዎች (States) ---
  const [balance, setBalance] = useState(500); // ቀሪ ሂሳብ
  const [bet, setBet] = useState(10); // ውርርድ
  const [timer, setTimer] = useState(30); // የሰዓት ቆጣሪ (ከ30 ይጀምራል)
  const [soldCount, setSoldCount] = useState(13); // የተሸጡ ካርቴላዎች ብዛት
  const [mySlots, setMySlots] = useState([]); // ተጫዋቹ የገዛቸው ካርቴላዎች
  const [gameStarted, setGameStarted] = useState(false); // ጨዋታው መጀመሩን መቆጣጠሪያ (መጀመሪያ false ነው!)

  // --- የሁለተኛው ገጽ ጨዋታ መረጃዎች (States) ---
  const [calledBalls, setCalledBalls] = useState([16, 28, 38, 43, 66]); // ለሙከራ አስቀድመው የበሩ ቁጥሮች
  const [currentBall, setCurrentBall] = useState("I 28"); // አሁን የወጣው ዋና ኳስ
  const [recentBalls, setRecentBalls] = useState(["I 28", "O 66", "N 43"]); // የቅርብ ጊዜ 3 ኳሶች
  const [isPlaying, setIsPlaying] = useState(false);

  // ከ1 እስከ 200 የካርቴላ ቁጥሮች ማመንጫ
  const totalCartelas = Array.from({ length: 200 }, (_, i) => i + 1);

  // የቢንጎ ሰሌዳ ቁጥሮች አወቃቀር (B:1-15, I:16-30, N:31-45, G:46-60, O:61-75)
  const bingoBoardData = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  };

  // 🔴 ማስተካከያ 2፦ 5 በ 5 ሙሉ በሙሉ የተሟላ የቢንጎ ካርድ ቁጥሮች (ያለ ምንም መቆራረጥ!)
  const playingCartelaNumbers = [,
 ,
    [10, 21, "FREE", 49, 70],
,
    [15, 25, 40, 55, 75]
  ];

  // 1. የመጀመሪያው ገጽ የሰዓት ቆጣሪ ሎጅክ
  useEffect(() => {
    if (timer > 0 && !gameStarted) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !gameStarted) {
      setGameStarted(true); // ሰዓቱ 0 ሲደርስ አውቶማቲክ ወደ ጨዋታ ሜዳ ያሻግራል
      setIsPlaying(true);
    }
  }, [timer, gameStarted]);

  // 2. የሁለተኛው ገጽ አውቶማቲክ የቢንጎ ቁጥሮች ማውጫ (በየ 4 ሰከንዱ)
  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      setCalledBalls((prev) => {
        if (prev.length >= 75) {
          clearInterval(gameInterval);
          return prev;
        }

        let randomNumber;
        do {
          randomNumber = Math.floor(Math.random() * 75) + 1;
        } while (prev.includes(randomNumber));

        let letter = '';
        if (randomNumber <= 15) letter = 'B';
        else if (randomNumber <= 30) letter = 'I';
        else if (randomNumber <= 45) letter = 'N';
        else if (randomNumber <= 60) letter = 'G';
        else letter = 'O';

        const ballString = `${letter} ${randomNumber}`;
        setCurrentBall(ballString);

        setRecentBalls((oldRecent) => {
          const updated = [ballString, ...oldRecent];
          return updated.slice(0, 3);
        });

        return [...prev, randomNumber];
      });
    }, 4000);

    return () => clearInterval(gameInterval);
  }, [isPlaying]);

  // የሽልማት ስሌት (ተጫዋቾች * 10 ብር) - 20% ታክስ ተቀንሶ
  const rawPrize = soldCount * 10;
  const netPrize = rawPrize - (rawPrize * 0.20);

  // ካርቴላ መግዣ ፈንክሽን
  const handleSelectCartela = (num) => {
    if (mySlots.includes(num)) return;
    if (balance >= bet) {
      setMySlots([...mySlots, num]);
      setSoldCount((prev) => prev + 1);
      setBalance((prev) => prev - bet);
    } else {
      alert("በቂ ሂሳብ የሎዎትም!");
    }
  };

  // ==========================================
  // 🔵 ገጽ 2፦ የጨዋታው ሜዳ (GAME BOARD)
  // ==========================================
  if (gameStarted) {
    return (
      <div className="app-container">
        {/* የላይኛው መረጃ ክፍሎች */}
        <div className="top-info-grid">
          <div className="info-box border-magenta">
            <span className="info-label text-magenta">ድራሽ</span>
            <span className="info-value text-magenta">{netPrize} ETB</span>
          </div>
          <div className="info-box border-magenta">
            <span className="info-label text-magenta">ተጫዋቾች</span>
            <span className="info-value text-magenta">👥 {soldCount}</span>
          </div>
          <div className="info-box border-magenta">
            <span className="info-label text-magenta">Balls</span>
            <span className="info-value text-magenta">🔮 {calledBalls.length}/75</span>
          </div>
        </div>

        {/* የኳስ ማውጫ ክበቦች ክፍል */}
        <div className="ball-caller-section">
          <div className="recent-balls-container">
            <div className="small-ball-circle">{recentBalls[0] || '-'}</div>
            <div className="small-ball-circle">{recentBalls[1] || '-'}</div>
            <div className="small-ball-circle">{recentBalls[2] || '-'}</div>
            <span className="recent-label">Recent</span>
          </div>

          <div className="main-ball-circle-container">
            <div className="main-ball-circle">
              {currentBall || ' ዝግጁ '}
            </div>
          </div>
        </div>

        {/* መካከለኛ ክፍል፦ Playing Cartela (ሙሉ 5 በ 5 ማትሪክስ) */}
        <div className="card-title-center">💳 PLAYING CARTELA {mySlots.length > 0 ? `(#${mySlots.join(', ')})` : ''}</div>
        <div className="playing-card-matrix">
          {['B', 'I', 'N', 'G', 'O'].map(letter => (
            <div key={letter} className="matrix-header">{letter}</div>
          ))}
          {playingCartelaNumbers.flat().map((cell, idx) => {
            const isHit = calledBalls.includes(cell) || cell === "FREE";
            return (
              <div key={idx} className={`matrix-cell ${cell === "FREE" ? "free-cell" : ""} ${isHit ? "hit" : ""}`}>
                {cell}
              </div>
            );
          })}
        </div>

        {/* የቢንጎ ሙሉ ሰሌዳ (B-I-N-G-O ሰሌዳ ቁጥሮች በሙሉ) */}
        <div className="bingo-board-container">
          {Object.entries(bingoBoardData).map(([letter, numbers]) => (
            <div key={letter} className="board-row">
              <div className="board-letter-header">{letter}</div>
              <div className="board-numbers-grid">
                {numbers.map((num) => {
                  const isBallOut = calledBalls.includes(num);
                  return (
                    <div key={num} className={`board-number-cell ${isBallOut ? 'highlighted' : ''}`}>
                      {num}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button className="bingo-btn-win" onClick={() => alert("ካርዱ እየተረጋገጠ ነው...")}>🏆 ቢንጎ! (አሸነፍኩ) 🏆</button>
      </div>
    );
  }

  // ==========================================
  // 🟢 ገጽ 1፦ መነሻ የካርቴላ መምረጫ ገጽ (ሙሉ በሙሉ ተመልሷል!)
  // ==========================================
  return (
    <div className="app-container">
      <h1 className="main-title">ላዝ ቢንጎ</h1>

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
          <span className="info-value text-cyan">{soldCount}</span>
        </div>
      </div>

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

      <div className="selector-title">ካርቴላ ይምረጡ (1 - 200)</div>
      <div className="cartela-grid">
        {totalCartelas.map((num) => {
          const isMine = mySlots.includes(num);
          return (
            <button
              key={num}
              className={`cartela-cell ${isMine ? 'mine' : ''}`}
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
