import { useState, useRef, useCallback, useEffect, use} from "react";

export const MODE = {
    WORK: "work",
    SHORT_BREAK: "short_break",
    LONG_BREAK: "long_break",
};


export const useTimer = (settings) => {
    const {workMinutes, shortBreakMinutes, longBreakMinutes, longBreakInterval} = settings;

    const [mode, setMode] = useState(MODE.WORK);
    const [isActive, setIsActive] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
    const [pomodoroCount, setPomodoroCount] = useState(0);

    const intervalRef = useRef(null);

    const getDuration = useCallback(() => {
        switch (mode) {
            case MODE.WORK:
                return workMinutes * 60;
            case MODE.SHORT_BREAK:
                return shortBreakMinutes * 60;
            case MODE.LONG_BREAK:
                return longBreakMinutes * 60;
            default:
                return workMinutes * 60;
        }
    }, [mode, workMinutes, shortBreakMinutes, longBreakMinutes]);

    //Effect to handle the timer countdown
    useEffect(() => {
        if(isActive){
            intervalRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 0) {
                        clearInterval(intervalRef.current);
                        setIsActive(false);
                        
                        //optional: add a sound notification here
                        // const audio = new Audio('path/to/sound.mp3');

                        let nextMode = MODE.WORK;
                        let nextPomodoroCount = pomodoroCount;

                        if (mode === MODE.WORK) {
                            nextPomodoroCount = pomodoroCount + 1;
                            setPomodoroCount(nextPomodoroCount);
                            if (nextPomodoroCount % longBreakInterval === 0) {
                            nextMode = MODE.LONG_BREAK;
                            } else {
                            nextMode = MODE.SHORT_BREAK;
                            }
                        } else { // If it was a break
                            nextMode = MODE.WORK;
                            if (mode === MODE.LONG_BREAK) {
                                // Reset cycle count after long break
                                setPomodoroCount(0);
                                nextPomodoroCount = 0;
                            }
                        }

                        setMode(nextMode);
                        return getDuration(nextMode);
                    }
                    return prev - 1;
                });
            }, 1000);
        }else{
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, mode, getDuration, pomodoroCount, longBreakInterval]);

    //Effect to handle stopping the timer when the mode changes
    useEffect(() => {
        setIsActive(false);
        setMode(MODE.WORK);
        setSecondsLeft(getDuration(MODE.WORK));
        setPomodoroCount(0);
    }, [workMinutes, shortBreakMinutes, longBreakMinutes, longBreakInterval, getDuration]);

    const startTimer = () => {
        setIsActive(true);
    };

    const pauseTimer = () => {
        setIsActive(false);
    };

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setSecondsLeft(getDuration(mode)); // Reset to current mode's duration
    }, [mode, getDuration]);

    const switchMode = useCallback((newMode) => {
        setIsActive(false);
        setMode(newMode);
        setSecondsLeft(getDuration(newMode)); // Reset to new mode's duration
    }, [getDuration]);

    return {
        mode,
        isActive,
        secondsLeft,
        pomodoroCount,
        startTimer,
        pauseTimer,
        resetTimer,
        switchMode,
        currentDuration: getDuration(mode), // Current duration based on mode
    };
};

    