import { ReactNode, useRef, useState } from "react";

interface ScriptDisplayProps {
    script?: string;
    fontSize?: string | number;
    wpm?: number;
    children?: ReactNode;
}

export const ScriptEvent = "script";

export const useScript = (initialState: string[] = []) => {
    const [index, setIndex] = useState(0);
    const [wpm, setWPM] = useState(300);
    const [isActive, setIsActive] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const countRef = useRef(
        setInterval(() => {
            return;
        }, 1000000)
    ); // empty interval to create a reusable countRef with useRef

    const handleStart = () => {
        setIsActive(true);
        setIsRunning(true);
        countRef.current = setInterval(() => {
            setIndex((index) => {
                return index + 1;
            });
        }, 60000 / wpm);
    };

    const handlePause = () => {
        console.log("paused");
        clearInterval(countRef.current);
        setIsRunning(false);
    };

    const handleResume = () => {
        console.log("resume with wpm: " + wpm);
        setIsRunning(true);
        countRef.current = setInterval(() => {
            setIndex((timer) => timer + 1);
        }, 60000 / wpm);
    };

    const handleReset = () => {
        
        console.log("reset");
        clearInterval(countRef.current);
        setIsActive(false);
        setIsRunning(false);
        setIndex(0);
    };

    const handleWPMChange = (newWPM: number) => {
        clearInterval(countRef.current);
        setWPM(newWPM);
        if (isActive && isRunning)
            countRef.current = setInterval(() => {
                setIndex((index) => index + 1);
            }, 60000 / newWPM);
    };

    return {
        index,
        wpm,
        isActive,
        isRunning,
        handleStart,
        handlePause,
        handleResume,
        handleReset,
        handleWPMChange,
    };
};

const ScriptDisplay = (props: ScriptDisplayProps) => {
    // const {
    //     isRunning,
    //     isActive,
    //     index,
    //     current,
    //     handleStart,
    //     handleResume: resume,
    //     handlePause,
    // } = useScript(props.script, props.wpm);

    // const handleResume = () => {
    //     if (isActive && !isRunning) resume();
    //     if (!isActive) handleStart();
    // };

    // const handleScriptEvent = (ev: Event) => {
    //     const action = (ev as CustomEvent).detail;
    //     if (action === "resume") handleResume();
    //     if (action === "pause") handlePause();
    // };

    // useEffect(() => {
    //     document.addEventListener(ScriptEvent, handleScriptEvent);

    //     return () => document.removeEventListener(ScriptEvent, handleScriptEvent);
    // });

    return (
        <div className="text-wrapper">
            <div className="text">{props.children}</div>
        </div>
    );
};

export default ScriptDisplay;
