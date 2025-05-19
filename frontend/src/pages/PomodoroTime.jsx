import React, { useState, useEffect, useMemo } from 'react';
import TimerDisplay from '../components/TimerDisplay';
import TimerControls from '../components/TimerControl';
import Settings from '../components/Settings';
import Button from '../components/Button';
import Report from '../components/Report';
import TaskManager from '../components/TaskManager'; 
import { useTimer, MODE } from '../hooks/useTimer';
import styles from '../css/pages_css/pomodoro.module.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const DEFAULT_SETTINGS = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

function PomodoroTime() {
  const navigate = useNavigate();
  const location = useLocation(); // Not used in current snippet, keep if needed elsewhere

  const apiURL = import.meta.env.VITE_API_URL;

  const loadSettings = () => {
    const saved = localStorage.getItem('pomofocusSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  };

  const [settings, setSettings] = useState(loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Initialize tasks state - this will be managed within PomodoroTime
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('pomofocusTasks');
    // If savedTasks exist, parse them, otherwise initialize with an empty array
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Example session data for Report
  const [allSessions, setAllSessions] = useState(() => {
    const savedSessions = localStorage.getItem('pomofocusSessions');
    // If savedSessions exist, parse them, otherwise initialize with an empty array
    return savedSessions ? JSON.parse(savedSessions) : [];
  });


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
    currentDuration,
  } = useTimer(timerSettings, () => {
    // This callback is executed when a timer (work, short break, long break) completes
    const sessionType = mode;
    let sessionDuration = 0;

    if (sessionType === MODE.WORK) {
      sessionDuration = settings.workMinutes;
      if (activeTaskId) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === activeTaskId && !task.completed
              ? { ...task, completedPomodoros: (task.completedPomodoros || 0) + 1 }
              : task
          )
        );
      }
    } else if (sessionType === MODE.SHORT_BREAK) {
      sessionDuration = settings.shortBreakMinutes;
    } else if (sessionType === MODE.LONG_BREAK) {
      sessionDuration = settings.longBreakMinutes;
    }
    
    // Log the completed session
    if (sessionDuration > 0) {
        const newSession = {
            date: new Date().toISOString().split('T')[0],
            duration: sessionDuration,
            type: sessionType.toLowerCase().replace('_', '-') // e.g. 'work', 'short-break'
        };
        setAllSessions(prev => [...prev, newSession]);
    }
  });

  useEffect(() => {
    localStorage.setItem('pomofocusSettings', JSON.stringify(settings));
    localStorage.setItem('pomofocusTasks', JSON.stringify(tasks)); // Save tasks
    localStorage.setItem('pomofocusSessions', JSON.stringify(allSessions)); // Save sessions


    const currentTask = tasks.find(task => task.id === activeTaskId && !task.completed);
    const taskName = currentTask ? ` | ${currentTask.name}` : "";
    let titlePrefix = "Pomofocus Clone";
    if (mode === MODE.WORK) titlePrefix = "Work";
    else if (mode === MODE.SHORT_BREAK) titlePrefix = "Short Break";
    else if (mode === MODE.LONG_BREAK) titlePrefix = "Long Break";
    
    document.title = `${secondsLeft !== currentDuration ? '(' + Math.floor(secondsLeft / 60) + ':' + (secondsLeft % 60).toString().padStart(2, '0') + ') ' : ''}${titlePrefix}${taskName} - Pomofocus Clone`;

  }, [settings, mode, tasks, activeTaskId, allSessions, secondsLeft, currentDuration]);

  useEffect(() => {
    console.log(location.state);
    if (location.state) {
      const { name, email } = location.state.user;
      console.log(`User logged in: ${name}, ${email}`);
    }
  }, [location.state]);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);

    if (!isActive) {
        resetTimer(); 
    }
  };

  const getBackgroundColor = () => {
    switch (mode) {
      case MODE.WORK: return styles.bgWork;
      case MODE.SHORT_BREAK: return styles.bgShortBreak;
      case MODE.LONG_BREAK: return styles.bgLongBreak;
      default: return styles.bgWork;
    }
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  // --- Task Management Functions ---
  const addTask = (name, estPomodoros) => {
    const newTask = {
      id: Date.now(),
      name,
      estPomodoros: parseInt(estPomodoros, 10) || 1,
      completedPomodoros: 0,
      completed: false,
      notes: '',
    };
    setTasks(prevTasks => [newTask, ...prevTasks]); // Add to top
  };

  const updateTask = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null); // Deselect if current task is deleted
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed, completedPomodoros: !task.completed ? task.estPomodoros : task.completedPomodoros } : task
      )
    );
     if (activeTaskId === taskId) { // If completing the active task
        const task = tasks.find(t => t.id === taskId);
        if (task && !task.completed) { // Check if it's being marked as completed now
            // Do nothing, user might un-complete it
        } else {
             setActiveTaskId(null); // Deselect if it's marked as complete
        }
    }
  };

  const selectTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
        setActiveTaskId(taskId);
    } else if (task && task.completed) {
        setActiveTaskId(null); // Don't select completed tasks as active for work
    }
  };

  const handleLogout = async () => {
  try {
    await axios.post(`${apiURL}/api/user/logout`, {}, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Clear any localStorage or context if needed
    localStorage.removeItem('pomofocusTasks');
    localStorage.removeItem('pomofocusSessions');

    navigate('/', { replace: true });
  } catch (error) {
    console.error("Logout error:", error);
  }
};



  const activeTaskDetails = tasks.find(task => task.id === activeTaskId);

  return (
    <div className={`${styles.appContainer} ${getBackgroundColor()}`}>
      <header className={styles.header}>
        <h1>Pomofocus Clone</h1>
        <div className={styles.headerActions}>
          <Button onClick={() => setShowReport(true)} variant="settingsToggle" className={`${styles.headerButton} ${styles.appReportButton}`}>Report</Button>
          <Button onClick={() => setShowSettings(true)} variant="settingsToggle" className={`${styles.headerButton} ${styles.appSettingsButton}`}>Settings</Button>
          {location.state ? (
            <Button onClick={handleLogout} variant="settingsToggle" className={`${styles.headerButton} ${styles.appLogoutButton}`}>Logout</Button>
          ) : (
            <Button onClick={handleSignUpClick} variant="settingsToggle" className={`${styles.headerButton} ${styles.signUpButton}`}>Sign Up</Button>
          )}
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.modeSwitcher}>
          <Button onClick={() => switchMode(MODE.WORK)} className={`${styles.modeButton} ${mode === MODE.WORK ? styles.activeMode : ''}`}>Pomodoro</Button>
          <Button onClick={() => switchMode(MODE.SHORT_BREAK)} className={`${styles.modeButton} ${mode === MODE.SHORT_BREAK ? styles.activeMode : ''}`}>Short Break</Button>
          <Button onClick={() => switchMode(MODE.LONG_BREAK)} className={`${styles.modeButton} ${mode === MODE.LONG_BREAK ? styles.activeMode : ''}`}>Long Break</Button>
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
          // Disable start if it's WORK mode and no task is selected, or if a task is selected but it's already completed
          isStartDisabled={mode === MODE.WORK && (!activeTaskId || (activeTaskDetails && activeTaskDetails.completed))}
        />

        {/* --- Task Manager --- */}
        <div className={styles.taskAndCycleInfo}>
            <div className={styles.currentTaskDisplay}>
                {mode === MODE.WORK && activeTaskDetails && !activeTaskDetails.completed
                    ? `Working on: ${activeTaskDetails.name}`
                    : mode === MODE.WORK && !activeTaskDetails
                    ? "Select a task to start working"
                    : "Time for a break!" }
            </div>
            <div className={styles.cycleInfo}>
                Pomos in cycle: {pomodoroCount} / {settings.longBreakInterval}
            </div>
        </div>

       
        {/* --- END Task Manager --- */}
      </main>

       <TaskManager
          tasks={tasks}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onToggleTaskCompletion={toggleTaskCompletion}
          onSelectTask={selectTask}
          activeTaskId={activeTaskId}
        />

      {showSettings && (
        <Settings
          initialSettings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showReport && (
        <Report
          initialSessions={allSessions}
          initialTasks={tasks} // Pass current tasks to report
          onClose={() => setShowReport(false)}
        />
      )}

      <footer className={styles.footer}>
        {/* Footer content if any */}
      </footer>
    </div>
  );
}

export default PomodoroTime;