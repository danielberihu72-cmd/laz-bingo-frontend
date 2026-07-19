import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- 🟢 ገጽ 1፦ መነሻ መረጃዎች ---
  const [balance, setBalance] = useState(500); 
  const [bet, setBet] = useState(10); 
  const [timer, setTimer] = useState(30); 
  const [soldCount, setSoldCount] = useState(88); 
  const [mySlot, setMySlot] = useState(null); 
  const [gameStarted, setGameStarted] = useState(false); 

  // --- 🔵 ገጽ 2፦ የጨዋታው ሜዳ መረጃዎች ---
  const [calledBalls, setCalledBalls] = useState([]); 
  const [currentBall, setCurrentBall] = useState(null); 
  const [recentBalls, setRecentBalls] = useState([]); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [userHits, setUserHits] = useState(["FREE"]); 

  const totalCartelas = Array.from({ length: 200 }, (_, i) => i + 1);

  const bingoBoardData = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  };

  // 🔴 100% ሙሉ የቢንጎ ማትሪክስ (25ቱም ቁጥሮች አንድም ሳይጎድል በአንድ መስመር ተጽፈዋል!)
  const playingCartelaNumbers = [, [5, 19, 42, 48, 71], [14, 29, "FREE", 41, 70], [9, 21, 38, 55, 63], [2, 17, 35, 60, 69]
  ];

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

  // 2. የሁለተኛው ገጽ ቁጥሮች በየ 4 ሰከንዱ የማውጫ ሎጅክ
  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      setCalledBalls((prev) => {
        if (prev.length >= 75) {
          clearInterval(gameInterval);
          resetToPageOne(); 
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
    if (mySlot === num) {
      setMySlot(null); setBalance((prev) => prev + bet); setSoldCount((prev) => prev - 1); return; 
    }
    if (mySlot !== null) { setBalance((prev) => prev + bet); setSoldCount((prev) => prev - 1); }
    if (balance >= bet) {
      setMySlot(num); setSoldCount((prev) => prev + 1); setBalance((prev) => prev - bet);
    } else { alert("በቂ ሂሳብ የሎዎትም!"); }
  };

  // ተጫዋቹ በራሱ ካርቴላ ላይ ቁጥር ሲነካ በእጅ የሚበራበት (Select) ሎጅክ
  const handleCellClick = (cellValue) => {
    if (cellValue === "FREE") return;

    if (userHits.includes(cellValue)) {
      setUserHits(userHits.filter(item => item !== cellValue));
      return;
    }

    if (calledBalls.includes(cellValue)) {
      setUserHits([...userHits, cellValue]);
    } else {
      alert("⚠️ ይህ ቁጥር ገና አልተጠራም!");
    }
  };

  // የቢንጎ አሸናፊነት ማረጋገጫ (ተጫዋቹ በእጁ ያበራቸውን ብቻ ነው የሚፈትሸው)
  const checkBingoWin = () => {
    for (let row of playingCartelaNumbers) {
      if (row.every(cell => userHits.includes(cell))) return triggerWin();
    }

    for (let col = 0; col < 5; col++) {
      let colMatch = true;
      for (let row = 0; row < 5; row++) {
        if (!userHits.includes(playingCartelaNumbers[row][col])) colMatch = false;
      }
      if (colMatch) return triggerWin();
    }

    let diag1Match = true;
    let diag2Match = true;
    for (let i = 0; i < 5; i++) {
      if (!userHits.includes(playingCartelaNumbers[i][i])) diag1Match = false;
      if (!userHits.includes(playingCartelaNumbers[i][4 - i])) diag2Match = false;
    }
    if (diag1Match || diag2Match) return triggerWin();

    alert("❌ ገና አልሰሩም! ያበሩት ቁጥር መስመር አልሠራም።");
  };

  const triggerWin = () => {
    setIsPlaying(false);
    setBalance((prev) => prev + netPrize); 
    alert(`🎉🎉 ቢንጎ! የ ${netPrize} ETB ድራሽ አሸናፊ ሆነዋል! 🏆`);
    resetToPageOne();
  };

  // ወደ መጀመሪያው ገጽ መመለሻ ዑደት
  const resetToPageOne = () => {
    setCalledBalls([]);
    setCurrentBall(null);
    setRecentBalls([]);
    setIsPlaying(false);
    setUserHits(["FREE"]); 
    setMySlot(null);
    setTimer(30); 
    setSoldCount(88); 
    setGameStarted(false);
  };

  if (gameStarted) {
    return (
      <div className="app-container">
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

        <div className="game-split-layout">
          {/* የግራ ክፍል ሰሌዳ - 1-75 ቁጥሮች በአምድ መልክ */}
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

          {/* የቀኝ ክፍል ካርቴላ እና የኳስ መጥሪያዎች */}
          <div className="right-side">
            <div className="ball-caller-section">
              <div className="recent-balls-container">
                <span className="recent-label">Recent</span>
                <div className="small-ball-circle">{recentBalls[0] || '-'}</div>
                <div className="small-ball-circle">{recentBalls[1] || '-'}</div>
                <div className="small-ball-circle">{recentBalls[2] || '-'}</div>
              </div>
              <div className="main-ball-circle">
                {currentBall || 'ዝግጁ'}
              </div>
            </div>

            <div className="card-title-center">💳 PLAYING CARTELA {mySlot && `(#${mySlot})`}</div>
            <div className="playing-card-matrix">
              {['B', 'I', 'N', 'G', 'O'].map(letter => (
                <div key={letter} className="matrix-header">{letter}</div>
              ))}
              {playingCartelaNumbers.map((row, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  {row.map((cell, colIdx) => {
                    const isSelected = userHits.includes(cell) || cell === "FREE";
                    return (
                      <div 
                        key={colIdx} 
                        className={`matrix-cell clickable-cell ${cell === "FREE" ? "free-cell" : ""} ${isSelected ? "hit" : ""}`}
                        onClick={() => handleCellClick(cell)}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <button className="bingo-btn-win" onClick={checkBingoWin}>🏆 BINGO 🏆</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container page-one-scaled">
      <h1 className="main-title-neon">🎰 ላዝ ቢንጎ 🎰</h1>
      <div className="top-info-grid-p1">
        <div className="info-box-p1"><span className="info-label-p1 text-green">BALANCE</span><span className="info-value-p1 text-green">{balance}</span></div>
        <div className="info-box-p1"><span className="info-label-p1 text-red">BET</span><span className="info-value-p1 text-red">{bet}</span></div>
        <div className="info-box-p1"><span className="info-label-p1 text-yellow">TIME</span><span className="info-value-p1 text-yellow">{timer}⏱️</span></div>
        <div className="info-box-p1"><span className="info-label-p1 text-cyan">SOLD</span><span className="info-value-p1 text-cyan">{soldCount}</span></div>
      </div>
      <div className="your-slot-container-p1">
        <span className="slot-title-p1">YOUR SLOT</span>
        <div className="slot-box-p1">{mySlot !== null ? <span className="selected-tag-p1">#{mySlot}</span> : <span className="placeholder-text-p1">+ ካርቴላ ይምረጡ</span>}</div>
      </div>
      <div className="selector-title-p1">ካርቴላ ይምረጡ (1 - 200)</div>
      <div className="cartela-grid-p1">
        {totalCartelas.map((num) => {
          const isMine = mySlot === num; 
          return <button key={num} className={`cartela-cell-p1 ${isMine ? 'mine' : ''}`} onClick={() => handleSelectCartela(num)}>{num}</button>
        })}
      </div>
    </div>
  );
}

export default App;
