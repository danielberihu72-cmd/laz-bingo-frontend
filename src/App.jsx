import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- የመጀመሪያው ገጽ መረጃዎች (States) ---
  const [balance, setBalance] = useState(500); 
  const [bet, setBet] = useState(10); 
  const [timer, setTimer] = useState(30); 
  const [soldCount, setSoldCount] = useState(88); 
  const [mySlots, setMySlots] = useState([]); 
  const [gameStarted, setGameStarted] = useState(false); 

  // --- የሁለተኛው ገጽ ጨዋታ መረጃዎች (States) ---
  const [calledBalls, setCalledBalls] = useState([]); 
  const [currentBall, setCurrentBall] = useState(null); 
  const [recentBalls, setRecentBalls] = useState([]); 
  const [isPlaying, setIsPlaying] = useState(false);

  const totalCartelas = Array.from({ length: 200 }, (_, i) => i + 1);

  // 1-75 ቁጥሮችን በየፊደሉ መመደቢያ ሰሌዳ
  const bingoBoardData = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  };

  // 🔴 አዲሱ አስተማማኝ ማስተካከያ፦ በምስሉ መሠረት 5x5 የቢንጎ ማትሪክስ በፎርሙላ ማመንጫ (በፍጹም አይቆረጥም!)
  const [playingCartelaNumbers, setPlayingCartelaNumbers] = useState([]);

  useEffect(() => {
    // 5 ረድፍ እና 5 አምድ (25 ሳጥን) ከነ FREE መካከለኛው ላይ በጥንቃቄ መፍጠሪያ
    const B_nums =;
    const I_nums =;
    const N_nums = [32, 35, "FREE", 41, 44];
    const G_nums =;
    const O_nums =;

    const matrix = [];
    for (let i = 0; i < 5; i++) {
      matrix.push([B_nums[i], I_nums[i], N_nums[i], G_nums[i], O_nums[i]]);
    }
    setPlayingCartelaNumbers(matrix);
  }, []);

  // 1. የመጀመሪያው ገጽ የሰዓት ቆጣሪ
  useEffect(() => {
    if (timer > 0 && !gameStarted) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !gameStarted) {
      setGameStarted(true); 
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

  const rawPrize = soldCount * 10;
  const netPrize = rawPrize - (rawPrize * 0.20);

  const handleSelectCartela = (num) => {
    if (mySlots.includes(num)) return;
    if (balance >= bet) {
      setMySlots([...mySlots, num]);
      setBalance((prev) => prev - bet);
    } else {
      alert("በቂ ሂሳብ የሎዎትም!");
    }
  };

  // ==========================================
  // 🔵 ገጽ 2፦ የጨዋታው ሜዳ (GAME BOARD) - 5x5 ማትሪክስ ያለው
  // ==========================================
  if (gameStarted) {
    return (
      <div className="app-container">
        <h1 className="main-title">ላዝ ቢንጎ</h1>

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

        <div className="ball-caller-section">
          <div className="recent-balls-container">
            <span className="recent-label">Recent</span>
            <div className="small-ball-circle">{recentBalls || '-'}</div>
            <div className="small-ball-circle">{recentBalls || '-'}</div>
            <div className="small-ball-circle">{recentBalls || '-'}</div>
          </div>

          <div className="main-ball-circle-container">
            <div className="main-ball-circle">
              {currentBall || 'ዝግጁ'}
            </div>
          </div>
        </div>

        <div className="game-split-layout">
          {/* የግራ ክፍል ሰሌዳ */}
          <div className="bingo-board-container left-side">
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

          {/* የቀኝ ክፍል ካርቴላ - ምስል 2 ላይ እንዳሳየኸኝ ፍጹም 5x5 አቀማመጥ */}
          <div className="right-side">
            <div className="card-title-center">💳 PLAYING CARTELA</div>
            <div className="playing-card-matrix">
              {['B', 'I', 'N', 'G', 'O'].map(letter => (
                <div key={letter} className="matrix-header">{letter}</div>
              ))}
              {playingCartelaNumbers.map((row, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  {row.map((cell, colIdx) => {
                    const isHit = calledBalls.includes(cell) || cell === "FREE";
                    return (
                      <div key={colIdx} className={`matrix-cell ${cell === "FREE" ? "free-cell" : ""} ${isHit ? "hit" : ""}`}>
                        {cell}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <button className="bingo-btn-win" onClick={() => alert("ካርዱ እየተረጋገጠ ነው...")}>🏆 BINGO 🏆</button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🟢 ገጽ 1፦ መነሻ የካርቴላ መምረጫ ገጽ
  // ==========================================
  return (
    <div className="app-container page-one-scaled">
      <h1 className="main-title">ላዝ ቢንጎ</h1>

      <div className="top-info-grid-p1">
        <div className="info-box-p1">
          <span className="info-label-p1 text-green">BALANCE</span>
          <span className="info-value-p1 text-green">{balance}</span>
        </div>
        <div className="info-box-p1">
          <span className="info-label-p1 text-red">BET</span>
          <span className="info-value-p1 text-red">{bet}</span>
        </div>
        <div className="info-box-p1">
          <span className="info-label-p1 text-yellow">TIME</span>
          <span className="info-value-p1 text-yellow">{timer}⏱️</span>
        </div>
        <div className="info-box-p1">
          <span className="info-label-p1 text-cyan">SOLD</span>
          <span className="info-value-p1 text-cyan">{soldCount}</span>
        </div>
      </div>

      <div className="your-slot-container-p1">
        <span className="slot-title-p1">YOUR SLOT</span>
        <div className="slot-box-p1">
          {mySlots.length > 0 ? (
            mySlots.map(num => <span key={num} className="selected-tag-p1">#{num}</span>)
          ) : (
            <span className="placeholder-text-p1">+ ካርቴላ ይምረጡ</span>
          )}
        </div>
      </div>

      <div className="selector-title-p1">ካርቴላ ይምረጡ (1 - 200)</div>
      <div className="cartela-grid-p1">
        {totalCartelas.map((num) => {
          const isMine = mySlots.includes(num);
          return (
            <button
              key={num}
              className={`cartela-cell-p1 ${isMine ? 'mine' : ''}`}
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
