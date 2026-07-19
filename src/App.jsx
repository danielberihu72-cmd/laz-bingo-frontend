import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- የመጀመሪያው ገጽ መረጃዎች ---
  const [balance, setBalance] = useState(500);
  const [bet, setBet] = useState(10);
  const [timer, setTimer] = useState(30);
  const [soldCount, setSoldCount] = useState(13); // ምስሉ ላይ 13 ስለሆነ
  const [mySlots, setMySlots] = useState([13]); // ምስሉ ላይ የያዝከው #13 ስለሆነ
  const [gameStarted, setGameStarted] = useState(true); // ምስሉ ላይ ጨዋታው ስለጀመረ ቀጥታ true አድርገነዋል

  // --- የሁለተኛው ገጽ ጨዋታ መረጃዎች ---
  const [calledBalls, setCalledBalls] = useState([28, 66, 43, 38, 16]); // ምስሉ ላይ የወጡት ቁጥሮች
  const [currentBall, setCurrentBall] = useState("I 28"); // ምስሉ ላይ ያለው ዋና ኳስ
  const [recentBalls, setRecentBalls] = useState(["I 28", "O 66", "N 43"]); // ምስሉ ላይ ያሉ ትናንሽ ኳሶች
  const [isPlaying, setIsPlaying] = useState(true);

  const totalCartelas = Array.from({ length: 200 }, (_, i) => i + 1);

  const bingoBoardData = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  };

  // 🔴 ማስተካከያ፦ 5 በ 5 ሙሉ የቢንጎ ካርድ ቁጥሮች (ማትሪክስ)
  const playingCartelaNumbers = [,
 ,
    [10, 18, "FREE", 55, 62],
,
    [1, 30, 44, 60, 75]
  ];

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
      setSoldCount((prev) => prev + 1);
      setBalance((prev) => prev - bet);
    } else {
      alert("በቂ ሂሳብ የሎዎትም!");
    }
  };

  if (gameStarted) {
    return (
      <div className="app-container">
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

        <div className="card-title-center">#️⃣ PLAYING CARTELA (#13)</div>
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

  return (
    <div className="app-container">
      <h1 className="main-title">ላዝ ቢንጎ</h1>
      {/* የመጀመሪያው ገጽ ይዘት... */}
    </div>
  );
}

export default App;
