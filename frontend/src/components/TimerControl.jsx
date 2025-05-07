import React from "react";
import Button from "./Button";
import styles from '../css/TimerControl.module.css';

const TimerControls = ({ isActive, onStart, onPause, onReset }) => {
    return (
      <div className={styles.controls}>
        {isActive ? (
          <Button onClick={onPause} variant="control" className={styles.mainControl}>
            Pause
          </Button>
        ) : (
          <Button onClick={onStart} variant="control" className={styles.mainControl}>
            Start
          </Button>
        )}
        <Button onClick={onReset} variant="control" disabled={isActive} className={styles.resetButton}>
          Reset
        </Button>
      </div>
    );
  };
  
  export default TimerControls;