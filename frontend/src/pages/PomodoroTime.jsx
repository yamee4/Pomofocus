// src/App.js
import React, { useState, useEffect, useMemo} from 'react';
import TimerDisplay from '../components/TimerDisplay';
import TimerControls from '../components/TimerControl';
import Settings from '../components/Settings';
import Button from '../components/Button'; 
import { useTimer, MODE } from '../hooks/useTimer';
import styles from '../css/pages_css/pomodoro.module.css';
import { useLocation, useNavigate } from 'react-router-dom';



const DEFAULT_SETTINGS = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4, // Long break after 4 work sessions
};

function PomodoroTime() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const loadSettings = () => {
      const saved = localStorage.getItem('pomofocusSettings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  };

  const [settings, setSettings] = useState(loadSettings());
  const [showSettings, setShowSettings] = useState(false);

  const timerSettings = useMemo(() => ({
      workMinutes: settings.workMinutes,
      shortBreakMinutes: settings.shortBreakMinutes,
      longBreakMinutes: settings.longBreakMinutes,
      longBreakInterval: settings.longBreakInterval,
  }), [settings]);

  const {
    mode,
    isActive,
    secondsLeft,
    pomodoroCount,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    currentDuration
  } = useTimer(timerSettings);

  useEffect(() => {
      localStorage.setItem('pomofocusSettings', JSON.stringify(settings));
      document.title = `${mode === MODE.WORK ? "Work" : mode === MODE.SHORT_BREAK ? "Short Break" : "Long Break"} - Pomofocus Clone`;
  }, [settings, mode]); // Added mode to update document title

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const getBackgroundColor = () => {
      switch(mode) {
          case MODE.WORK: return styles.bgWork;
          case MODE.SHORT_BREAK: return styles.bgShortBreak;
          case MODE.LONG_BREAK: return styles.bgLongBreak;
          default: return styles.bgWork;
      }
  }

  // Placeholder functions for new buttons
  const handleReportClick = () => {
    console.log("Report button clicked. Implement navigation or modal here.");
    // Example: window.alert("Report functionality to be implemented!");
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };


  return (
    <div className={`${styles.appContainer} ${getBackgroundColor()}`}>
      <header className={styles.header}>
          <h1>Pomofocus Clone</h1>
          <div className={styles.headerActions}>
            <Button
                onClick={handleReportClick}
                variant="settingsToggle" // Base variant from Button.module.css
                className={`${styles.headerButton} ${styles.appReportButton}`} // Added appReportButton
            >
                Report
            </Button>
            <Button
                onClick={() => setShowSettings(true)}
                variant="settingsToggle" // Base variant
                className={`${styles.headerButton} ${styles.appSettingsButton}`} // Added appSettingsButton
            >
                Settings
            </Button>
            <Button
                onClick={handleSignUpClick}
                variant="settingsToggle"
                className={`${styles.headerButton} ${styles.signUpButton}`}
            >
                Sign Up
            </Button>
          </div>
      </header>

      {/* ... rest of your App.js JSX ... */}
      <main className={styles.mainContent}>
         <div className={styles.modeSwitcher}>
             <Button onClick={() => switchMode(MODE.WORK)} className={mode === MODE.WORK ? styles.activeMode : ''}>Pomodoro</Button>
             <Button onClick={() => switchMode(MODE.SHORT_BREAK)} className={mode === MODE.SHORT_BREAK ? styles.activeMode : ''}>Short Break</Button>
             <Button onClick={() => switchMode(MODE.LONG_BREAK)} className={mode === MODE.LONG_BREAK ? styles.activeMode : ''}>Long Break</Button>
         </div>
         
        <TimerDisplay
          mode={mode}
          secondsLeft={secondsLeft}
          currentDuration={currentDuration}
        />
        <TimerControls
          isActive={isActive}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
        />
        <div className={styles.cycleInfo}>
          Completed Pomodoros in cycle: {pomodoroCount} / {settings.longBreakInterval}
        </div>
      </main>

      {showSettings && (
        <Settings
          initialSettings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}

export default PomodoroTime;