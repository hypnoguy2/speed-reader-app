import React, { useEffect, useRef, useState } from "react";

interface ScriptDisplayProps {
    script?: string;
    fontSize?: string | number;
    wpm?: number;
}

export const ScriptEvent = "script";

export const useScript = (initialState = "", wpm = 300) => {
    // sliced script
    const script = initialState.split(" ");
    const [index, setIndex] = useState(0);
    const [current, setCurrent] = useState(script[index]);
    const [speed, setSpeed] = useState(60000 / wpm);
    const [isActive, setIsActive] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const countRef = useRef(
        setInterval(() => {
            return;
        }, 1000000)
    ); // empty interval to create a reusable countRef with useRef

    useEffect(() => {
        setCurrent(script[index]);
        if (index >= script.length - 1) handlePause();
    }, [index, script]);

    const handleStart = () => {
        setIsActive(true);
        setIsRunning(true);
        countRef.current = setInterval(() => {
            setIndex((index) => {
                console.log(index);
                return index + 1;
            });
        }, speed);
    };

    const handlePause = () => {
        clearInterval(countRef.current);
        setIsRunning(false);
    };

    const handleResume = () => {
        setIsRunning(true);
        countRef.current = setInterval(() => {
            setIndex((timer) => timer + 1);
        }, speed);
    };

    const handleReset = () => {
        clearInterval(countRef.current);
        setIsActive(false);
        setIsRunning(false);
        setIndex(0);
    };

    const handleSpeedChange = (newSpeed: number) => {
        clearInterval(countRef.current);
        setSpeed(newSpeed);
        countRef.current = setInterval(() => {
            setIndex((index) => index + 1);
        }, newSpeed);
    };

    return {
        index,
        current,
        speed,
        isActive,
        isRunning,
        handleStart,
        handlePause,
        handleResume,
        handleReset,
        handleSpeedChange,
    };
};

const ScriptDisplay = (props: ScriptDisplayProps) => {
    const {
        isRunning,
        isActive,
        index,
        current,
        handleStart,
        handleResume: resume,
        handlePause,
    } = useScript(props.script, props.wpm);

    const handleResume = () => {
        if (isActive && !isRunning) resume();
        if (!isActive) handleStart();
    };

    const handleScriptEvent = (ev: Event) => {
        const action = (ev as CustomEvent).detail;
        if (action === "resume") handleResume();
        if (action === "pause") handlePause();
    };

    useEffect(() => {
        document.addEventListener(ScriptEvent, handleScriptEvent);

        return () => document.removeEventListener(ScriptEvent, handleScriptEvent);
    });

    return (
        <div className="text-wrapper">
            <div className="text">{current}</div>
        </div>
    );
};

export default ScriptDisplay;
