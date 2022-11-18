import { useState, useRef, useCallback } from "react";

const initialWPM = 300

/**
 * A hook to update an index at a certain rate (wpm)
 * @returns status flags and controls for the index runner
 */
export const useIndex = () => {
    const [index, setIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const wpmRef = useRef(initialWPM);
    const countRef = useRef(
        setInterval(() => {
            return;
        }, 1000000)
    ); // empty interval to create a reusable countRef with useRef

    const handlePause = useCallback(() => {
        clearInterval(countRef.current);
        setIsRunning(false);
    }, []);

    const handleResume = useCallback(() => {
        if (isActive) {
            setIsRunning(true);
            clearInterval(countRef.current);
            countRef.current = setInterval(() => {
                setIndex((index) => index + 1);
            }, 60000 / wpmRef.current);
        }
    }, [isActive]);

    const handleStart = useCallback(() => {
        if (!isActive) {
            setIsActive(true);
            setIsRunning(true);
            countRef.current = setInterval(() => {
                setIndex((index) => index + 1);
            }, 60000 / wpmRef.current);
        }
    }, [isActive]);

    const handleStop = useCallback(() => {
        clearInterval(countRef.current);
        setIsRunning(false);
        setIsActive(false);
    }, []);

    const handleReset = useCallback(() => {
        clearInterval(countRef.current);
        setIsActive(false);
        setIsRunning(false);
        setIndex(0);
        setWPM(initialWPM);
    }, []);

    const setWPM = useCallback(
        (newWPM: number) => {
            wpmRef.current = newWPM;
            if (isRunning) {
                handleResume();
            }
        },
        [isRunning, handleResume]
    );

    return {
        index,
        wpm: wpmRef.current,
        isActive,
        isRunning,
        handleStart,
        handlePause,
        handleResume,
        handleReset,
        handleStop,
        setWPM,
    };
};
