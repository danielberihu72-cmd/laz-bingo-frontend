import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- የመጀመሪያው ገጽ መረጃዎች (States) ---
  const [balance, setBalance] = useState(500); 
  const [bet, setBet] = useState(10); 
  const [timer, setTimer] = useState(30); 
  const [soldCount, setSoldCount] = useState(88); 
  
  // አንድ ካርቴላ ብቻ ለመቆጣጠር (ባዶ ከሆነ null ነው)
  const [mySlot, setMySlot] = useState(null); 
  const [gameStarted, setGameStarted] = useState(false); 

  // --- የሁለተኛው ገጽ ጨዋታ መረጃዎች (States) ---
  const [calledBalls, setCalledBalls] = useState([]); 
  const [currentBall, setCurrentBall] = useState(null); 
  const [recentBalls, setRecentBalls] = useState([]); 
  const [isPlaying, setIsPlaying] = useState(false);

  const totalCartelas = Array.from({ length: 200 }, (_, i) => i + 1);

  const bingoBoardData = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  };

  // 100% የተሟላ የቢንጎ ጨዋታ ማትሪክስ (25ቱም ቁጥሮች ያለ ምንም ክፍተት እዚህ ተጭነዋል)
  const [playingCartelaNumbers, setPlayingCartelaNumbers] = useState([]);

  useEffect(() => {
    const B_column =;
    const I_column =;
    const N_column = [35, 42, "FREE", 38, 44];
    const G_column =;
    const O_column =;

    const matrix = [];
    for (let i = 0; i < 5; i++) {
      matrix.push([B_column[i], I_column[i], N_column[i], G_column[i], O_column[i]]);
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

  // 2. የሁለተኛው ገጽ ቁጥሮች ማውጫ
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

  // 🔴 ማስተካከያ፦ ድጋሚ ሲነካ ምርጫውን የሚያጠፋ (Deselect) አዲስ የተስተካከለ ፈንክሽን
  const handleSelectCartela = (num) => {
    // ህግ 1፦ ተጫዋቹ የራሱን የመረጠውን ቁጥር ድጋሚ ከነካው ምርጫው ሙሉ በሙሉ ይጠፋል (Deselect)
    if (mySlot === num) {
      setMySlot(null); // ባዶ ያደርገዋል
      setBalance((prev) => prev + bet); // የተወራረደውን ብር ይመልሳል
      setSoldCount((prev) => prev - 1); // የተሸጠውን ቁጥር በ1 ይቀንሳል
      return; // ፈንክሽኑን እዚህ ላይ ያቆማል
    }

    // ህግ 2፦ ሌላ አዲስ ቁጥር ከተመረጠ የድሮውን አጥፍቶ በአዲሱ ይተካል
    if (mySlot !== null) {
      setBalance((prev) => prev + bet);
      setSoldCount((prev) => prev - 1);
    }

    // አዲሱን ምርጫ መመዝገብ
    if (balance >= bet) {
      setMySlot(num); 
      setSoldCount((prev) => prev + 1);
      setBalance((prev) => prev - bet);
    } else {
      alert("በቂ ሂሳብ የሎዎትም!");
    }
  };

  if (gameStarted) {
    return (
      <div className="app-container">
        {/* 🎰 መጀመሪያና መጨረሻ ላይ የጌም ምልክት ያለው ርዕስ */}
        <h1 className="main-title-neon">🎰 ላዝ ቢንጎ 🎰</h1>

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

          <div className="right-side">
            <div className="card-title-center">💳 PLAYING CARTELA {mySlot && `(#${mySlot})`}</div>
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

  return (
    <div className="app-container page-one-scaled">
      {/* 🎰 መጀመሪያና መጨረሻ ላይ የጌም ምልክት ያለው ርዕስ */}
      <h1 className="main-title-neon">🎰 ላዝ ቢንጎ 🎰</h1>

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
          {mySlot !== null ? (
            <span className="selected-tag-p1">#{mySlot}</span>
          ) : (
            <span className="placeholder-text-p1">+ ካርቴላ ይምረጡ</span>
          )}
        </div>
      </div>

      <div className="selector-title-p1">ካርቴላ ይምረጡ (1 - 200)</div>
      <div className="cartela-grid-p1">
        {totalCartelas.map((num) => {
          const isMine = mySlot === num; 
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
