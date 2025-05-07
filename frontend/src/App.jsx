// src/App.js
import React, { useState, useEffect, useMemo } from 'react';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControl';
import Settings from './components/Settings';
import Button from './components/Button'; // Reusable button
import { useTimer, MODE } from './hooks/useTimer';
import styles from './App.module.css'; // Main CSS file for the app

const DEFAULT_SETTINGS = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4, // Long break after 4 work sessions
};

function App() {
  // Try loading settings from localStorage, otherwise use defaults
  const loadSettings = () => {
      const saved = localStorage.getItem('pomofocusSettings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  };

  const [settings, setSettings] = useState(loadSettings());
  const [showSettings, setShowSettings] = useState(false);

  // Memoize timer hook dependencies to prevent unnecessary re-renders if only settings modal state changes
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

  // Save settings to localStorage whenever they change
  useEffect(() => {
      localStorage.setItem('pomofocusSettings', JSON.stringify(settings));
  }, [settings]);


  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    // Timer will automatically reset via its own useEffect dependency on settings
  };

  // Determine background color based on mode
  const getBackgroundColor = () => {
      switch(mode) {
          case MODE.WORK: return styles.bgWork;
          case MODE.SHORT_BREAK: return styles.bgShortBreak;
          case MODE.LONG_BREAK: return styles.bgLongBreak;
          default: return styles.bgWork;
      }
  }

  return (
    <div className={`${styles.appContainer} ${getBackgroundColor()}`}>
      <header className={styles.header}>
          <h1>Pomofocus Clone</h1>
          <Button
              onClick={() => setShowSettings(true)}
              variant="settingsToggle" // Use a specific variant if defined in Button.module.css
              className={styles.settingsButton} // Add specific class if needed
          >
            Settings
          </Button>
      </header>

      <main className={styles.mainContent}>
         {/* Mode Switch Buttons */}
        <div className={styles.MODEwitcher}>
             <Button onClick={() => switchMode(MODE.WORK)} className={mode === MODE.WORK ? styles.activeMode : ''}>Pomodoro</Button>
             <Button onClick={() => switchMode(MODE.SHORT_BREAK)} className={mode === MODE.SHORT_BREAK ? styles.activeMode : ''}>Short Break</Button>
             <Button onClick={() => switchMode(MODE.LONG_BREAK)} className={mode === MODE.LONG_BREAK ? styles.activeMode : ''}>Long Break</Button>
         </div>

        <TimerDisplay
          mode={mode}
          secondsLeft={secondsLeft}
          currentDuration={currentDuration} // Pass current duration for progress bar
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
        {/* Footer content if any */}
      </footer>
    </div>
  );
}

export default App;