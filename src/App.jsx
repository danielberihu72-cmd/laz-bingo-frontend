import React, { useState, useEffect } from 'react';

// ከቴሌግራም ዌብ-አፕ ስካፎልድ ጋር ለማገናኘት (ካለ)
const tg = window.Telegram?.WebApp;

function App() {
  // የጨዋታው መረጃዎች (States)
  const [balance, setBalance] = useState(500); // 500 ብር ዲሞ አካውንት
  const [bet, setBet] = useState(10); // 10 ብር መጫወቻ
  const [timeLeft, setTimeLeft] = useState(30); // 30 ሰከንድ አውቶማቲክ ቆጣሪ
  const [selectedCartela, setSelectedCartela] = useState(null); // የተመረጠ ካርቴላ ቁጥር
  const [soldCount, setSoldCount] = useState(12); // ለዲሞ ያህል የተሸጡ ሰዎች ብዛት

  // የ 30 ሰከንድ አውቶማቲክ ቆጣሪ ህግ
  useEffect(() => {
    if (timeLeft === 0) {
      alert("ሰዓት አልቋል! ወደ ጨዋታው ገጽ በራስ-ሰር እየገባን ነው...");
      // እዚህ ላይ ወደ ቀጣዩ የጨዋታ ገጽ (Gameplay) የሚወስደው ሎጂክ ይገባል
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // ተጫዋቹ ካርቴላ ሲመርጥ የሚሰራ ህግ
  const handleSelectCartela = (number) => {
    if (selectedCartela === number) {
      // የመረጠውን መልሶ ሲነካው 10 ብሩ ይመለሳል
      setSelectedCartela(null);
      setBalance(balance + bet);
      setSoldCount(soldCount - 1);
    } else {
      if (selectedCartela !== null) {
        alert("በአንድ ጊዜ መያዝ የሚችሉት 1 ካርቴላ ብቻ ነው!");
        return;
      }
      if (balance < bet) {
        alert("በቂ ባላንስ የለዎትም!");
        return;
      }
      // አዲስ ካርቴላ ሲመርጥ ከባላንሱ 10 ብር ይቀንሳል
      setSelectedCartela(number);
      setBalance(balance - bet);
      setSoldCount(soldCount + 1);
    }
  };

  return (
    <div style={styles.container}>
      {/* የላይኛው መረጃ ሰሌዳ (Header) */}
      <div style={styles.header}>
        <div style={styles.infoBox}>
          <span style={styles.label}>BALANCE</span>
          <span style={{...styles.value, color: '#00ffcc', textShadow: '0 0 10px #00ffcc'}}>{balance} ብር</span>
        </div>
        <div style={styles.infoBox}>
          <span style={styles.label}>BET</span>
          <span style={{...styles.value, color: '#ff0055', textShadow: '0 0 10px #ff0055'}}>{bet} ብር</span>
        </div>
      </div>

      {/* የሰዓት እና የተሸጡ ካርቴላዎች ማሳያ */}
      <div style={styles.statusRow}>
        <div style={styles.statusBox}>
          <span style={styles.statusLabel}>TIME</span>
          <span style={styles.timerValue}>{timeLeft}⏱️</span>
        </div>
        <div style={styles.statusBox}>
          <span style={styles.statusLabel}>SOLD</span>
          <span style={styles.soldValue}>{soldCount}🎟️</span>
        </div>
      </div>

      {/* የተመረጠው ካርቴላ ማስቀመጫ (SLOT) */}
      <div style={styles.slotContainer}>
        <span style={styles.slotLabel}>YOUR SLOT</span>
        <div style={styles.slotBox}>
          {selectedCartela ? (
            <div style={styles.activeSlotCard}>ካርቴላ #{selectedCartela}</div>
          ) : (
            <span style={styles.emptySlotText}>+ ካርቴላ ይምረጡ</span>
          )}
        </div>
      </div>

      {/* ከ 1 እስከ 200 የተደረደሩ የኒዮን ካርቴላዎች ዝርዝር */}
      <h3 style={styles.sectionTitle}>ካርቴላ ይምረጡ (1 - 200)</h3>
      <div style={styles.gridContainer}>
        {Array.from({ length: 200 }, (_, i) => i + 1).map((num) => {
          const isSelected = selectedCartela === num;
          return (
            <button
              key={num}
              onClick={() => handleSelectCartela(num)}
              style={{
                ...styles.cartelaButton,
                borderColor: isSelected ? '#00ffcc' : '#ff0055',
                boxShadow: isSelected ? '0 0 15px #00ffcc' : '0 0 5px #ff0055',
                backgroundColor: isSelected ? '#00ffcc' : 'transparent',
                color: isSelected ? '#000000' : '#ffffff',
              }}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// አንተ የፈለግከው አይነት የNeon ዘመናዊ ስታይል (CSS in JS)
const styles = {
  container: {
    padding: '15px',
    backgroundColor: '#0d0d0d',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '15px',
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '40%',
  },
  label: { fontSize: '11px', color: '#888', fontWeight: 'bold' },
  value: { fontSize: '18px', fontWeight: 'bold', marginTop: '5px' },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '20px',
  },
  statusBox: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statusLabel: { fontSize: '13px', color: '#ffcc00', fontWeight: 'bold' },
  timerValue: { fontSize: '28px', fontWeight: 'bold', color: '#ffcc00', textShadow: '0 0 10px #ffcc00' },
  soldValue: { fontSize: '28px', fontWeight: 'bold', color: '#00ffcc', textShadow: '0 0 10px #00ffcc' },
  slotContainer: { width: '100%', maxWidth: '400px', marginBottom: '25px', textAlign: 'center' },
  slotLabel: { fontSize: '12px', color: '#aaa', fontWeight: 'bold', display: 'block', marginBottom: '8px' },
  slotBox: {
    border: '2px dashed #ff0055',
    boxShadow: '0 0 5px #ff0055',
    borderRadius: '12px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111'
  },
  emptySlotText: { color: '#555', fontSize: '14px' },
  activeSlotCard: {
    backgroundColor: '#00ffcc',
    color: '#000',
    padding: '8px 25px',
    borderRadius: '6px',
    fontWeight: 'bold',
    boxShadow: '0 0 15px #00ffcc'
  },
  sectionTitle: { color: '#ffffff', marginBottom: '15px', fontSize: '15px', letterSpacing: '1px' },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
    width: '100%',
    maxWidth: '400px',
    height: '350px',
    overflowY: 'scroll',
    padding: '10px',
    border: '1px solid #222',
    borderRadius: '8px',
    backgroundColor: '#050505',
  },
  cartelaButton: {
    height: '50px',
    borderRadius: '8px',
    border: '2px solid',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
};

export default App;
