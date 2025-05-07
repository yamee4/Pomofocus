import React from "react";
import { formatTime } from "../utils/formatTime";
import styles from "../css/Timer.module.css";

import { MODE } from "../hooks/useTimer";

const TimerDisplay = ({ secondsLeft, mode, currentDuration }) => {
    const modeText = {
        [MODE.WORK]: 'Work',
        [MODE.SHORT_BREAK]: 'Short Break',
        [MODE.LONG_BREAK]: 'Long Break',
    }

    const progress = ((currentDuration - secondsLeft) / currentDuration) * 100;

    return (
        <div className={styles.timerDisplay}>
          <div className={styles.modeIndicator}>{modeText[mode]}</div>
          <div className={styles.time}>{formatTime(secondsLeft)}</div>
           {/* Optional Progress Bar */}
          <div className={styles.progressBarContainer}>
              <div
                  className={styles.progressBar}
                  style={{ width: `${progress}%` }}
              ></div>
          </div>
        </div>
    );
}

export default TimerDisplay;