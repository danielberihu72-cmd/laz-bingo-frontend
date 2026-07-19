import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- 🟢 ገጽ 1፦ የተረጋገጡ መረጃዎች ---
  const [balance, setBalance] = useState(500); 
  const [bet, setBet] = useState(10); 
  const [timer, setTimer] = useState(30); 
  const [soldCount, setSoldCount] = useState(89); 
  const [mySlot, setMySlot] = useState(null); 
  const [gameStarted, setGameStarted] = useState(false); 

  // --- 🔵 ገጽ 2፦ የጨዋታው ሜዳ መረጃዎች ---
  const [calledBalls, setCalledBalls] = useState([]); 
  const [currentBall, setCurrentBall] = useState("B 6"); 
  const [recentBalls, setRecentBalls] = useState(["B 6", "I 16"]); 
  const [isPlaying, setIsPlaying] = useState(false);
  
  // ተጫዋቹ በእጁ የነካቸውን ቁጥሮች መቆጣጠሪያ
  const [userHits, setUserHits] = useState(["FREE"]); 
  // የተሳሳቱ ሙከራዎችን መቁጠሪያ (Strikes)
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isBanned, setIsBanned] = useState(false); 

  const totalCartelas = Array.from({ length: 200 }, (_, i) => i + 1);

  const bingoBoardData = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  };

  // 🔴 100% ሙሉ ባለ 5 ረድፍ ካርቴላ (የቁጥሮች ማትሪክስ - ያለ ምንም ክፍተት ተጽፏል!)
  const playingCartelaNumbers = [,
 ,
    [10, 25, "FREE", 55, 70],
,
    [15, 30, 44, 60, 75]
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

  // 🔴 ገጽ 1 ምርጫ እና መልሶ ማጥፋት (Deselect) ፈንክሽን
  const handleSelectCartela = (num) => {
    // የመረጥከውን ቁጥር ራሱን ድጋሚ ከነካኸው ምርጫው ሙሉ በሙሉ ይጠፋል (Deselect)
    if (mySlot === num) {
      setMySlot(null); 
      setBalance((prev) => prev + bet); 
      setSoldCount((prev) => prev - 1); 
      return; 
    }

    if (mySlot !== null) {
      setBalance((prev) => prev + bet);
      setSoldCount((prev) => prev - 1);
    }

    if (balance >= bet) {
      setMySlot(num); 
      setSoldCount((prev) => prev + 1);
      setBalance((prev) => prev - bet);
    } else {
      alert("በቂ ሂሳብ የሎዎትም!");
    }
  };

  // 🔴 ገጽ 2 በእጅ ንክኪ እና የ3-Strike መከላከያ ህግ
  const handleCellClick = (cellValue) => {
    if (isBanned || cellValue === "FREE") return;

    // ሀ. አስቀድሞ የተመረጠ ቁጥር ከሆነ መልሶ ማጥፋት (Deselect) ይቻላል
    if (userHits.includes(cellValue)) {
      setUserHits(userHits.filter(item => item !== cellValue));
      return;
    }

    // ለ. ቁጥሩ በሰርቨሩ በትክክል ተጠርቶ ከሆነ ያበራለታል
    if (calledBalls.includes(cellValue) || cellValue === 6 || cellValue === 16) { // ለሙከራ ምስሉ ላይ ያሉትን ጨምረንበታል
      setUserHits([...userHits, cellValue]);
    } else {
      // ሐ. ያልተጠራ ቁጥር ከተነካ Strike ይቆጥራል
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      
      if (nextWrong >= 3) {
        setIsBanned(true);
        alert("🚨 ማሳሰቢያ፦ ያልተጠራ ቁጥር ደጋግመው 3 ጊዜ በመንካትዎ ካርቴላዎ ለዚህ ጨዋታ ታግዷል!");
      } else {
        alert(`⚠️ አልተጠራም! የተሳሳተ ሙከራ፡ ${nextWrong}/3`);
      }
    }
  };

  // 🔴 የቢንጎ አሸናፊነት ማረጋገጫ (BINGO Checking Logic)
  const checkBingoWin = () => {
    if (isBanned) return;

    // 5ቱንም አግድም ረድፎች መፈተሽ
    for (let row of playingCartelaNumbers) {
      if (row.every(cell => userHits.includes(cell))) return triggerWin();
    }

    // 5ቱንም የቁመት አምዶች መፈተሽ
    for (let col = 0; col < 5; col++) {
      let colMatch = true;
      for (let row = 0; row < 5; row++) {
        if (!userHits.includes(playingCartelaNumbers[row][col])) colMatch = false;
      }
      if (colMatch) return triggerWin();
    }

    // 2ቱን የሰያፍ (Diagonal) መስመሮች መፈተሽ
    const diag1 = [playingCartelaNumbers[0][0], playingCartelaNumbers[1][1], playingCartelaNumbers[2][2], playingCartelaNumbers[3][3], playingCartelaNumbers[4][4]];
    const diag2 = [playingCartelaNumbers[0][4], playingCartelaNumbers[1][3], playingCartelaNumbers[2][2], playingCartelaNumbers[3][1], playingCartelaNumbers[4][0]];
    
    if (diag1.every(cell => userHits.includes(cell))) return triggerWin();
    if (diag2.every(cell => userHits.includes(cell))) return triggerWin();

    alert("❌ ገና አልሰሩም! መስመርዎን በደንብ ያረጋግጡ።");
  };

  const triggerWin = () => {
    setIsPlaying(false);
    alert(`🎉🎉 እንኳን ደስ አለዎት! ቢንጎ ሰርተዋል። የ ${netPrize} ETB ድራሽ አሸናፊ ሆነዋል! 🏆`);
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

        <div className="ball-caller-section">
          <div className="recent-balls-container">
            <span className="recent-label">Recent</span>
            <div className="small-ball-circle">{recentBalls[0] || '-'}</div>
            <div className="small-ball-circle">{recentBalls[1] || '-'}</div>
            <div className="small-ball-circle">{recentBalls[2] || '-'}</div>
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
                    const isBallOut = calledBalls.includes(num) || num === 6 || num === 16;
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
            <div className={`playing-card-matrix ${isBanned ? 'banned-fade' : ''}`}>
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

            <button className="bingo-btn-win" disabled={isBanned} onClick={checkBingoWin}>
              🏆 BINGO 🏆
            </button>
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
