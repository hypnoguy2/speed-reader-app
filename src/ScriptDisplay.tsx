import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { processScript } from "./Helpers";

interface ScriptDisplayProps {
    script?: string;
    fontSize?: string | number;
    wpm?: number;
    children?: ReactNode;
}

interface OptionManagerType {
    [key: string]: (value: string | number) => void;
}

export const useIndex = () => {
    const [index, setIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const wpmRef = useRef(300);
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
        setIsRunning(true);
        clearInterval(countRef.current);
        countRef.current = setInterval(() => {
            setIndex((index) => index + 1);
        }, 60000 / wpmRef.current);
    }, []);

    const handleStart = useCallback(() => {
        setIsActive(true);
        setIsRunning(true);
        countRef.current = setInterval(() => {
            setIndex((index) => index + 1);
        }, 60000 / wpmRef.current);
    }, []);

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
    }, []);

    const setWPM = useCallback(
        (newWPM: number) => {
            wpmRef.current = newWPM;
            if (isRunning) {
                handlePause();
                handleResume();
            }
        },
        [isRunning, handlePause, handleResume]
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

export const useScript = (initialScript: string) => {
    const {
        index,
        wpm,
        isActive,
        isRunning,
        handleStart,
        handlePause,
        handleResume,
        handleReset,
        handleStop,
        setWPM,
    } = useIndex();

    const [script] = useState(initialScript);

    const splittedRef = useRef(processScript(script));

    // empty interval/timeout to create reusable refs with useRef
    const breakRef = useRef(
        setTimeout(() => {
            return;
        }, 1000000)
    );

    const breakFor = useCallback(
        (value: number) => {
            splittedRef.current.splice(index + 2, 0, "", `<halt=${value}>`);
        },
        [index]
    );

    const haltFor = useCallback(
        (value: number) => {
            handlePause();
            clearTimeout(breakRef.current);
            breakRef.current = setTimeout(() => {
                handleResume();
            }, value * 1000);
        },
        [handlePause, handleResume]
    );

    // Reading in script options
    const optionsManager: OptionManagerType = useMemo(() => {
        return {
            wpm: setWPM,
            halt: haltFor,
            break: breakFor,
        } as OptionManagerType;
    }, [setWPM, breakFor, haltFor]);

    useEffect(() => {
        const nextWord = splittedRef.current[index + 1];
        if (nextWord && nextWord.startsWith("<")) {
            for (const key in optionsManager) {
                const option = nextWord.match(new RegExp(key + "=\\d+"));
                if (option) {
                    const newValue = option[0].match(/\d+/);
                    if (newValue) optionsManager[key](newValue[0]);
                }
            }

            splittedRef.current = splittedRef.current.filter((w, i) => i !== index + 1);
        }
    }, [index, optionsManager]);

    useEffect(() => {
        if (index >= splittedRef.current.length) handleStop();
    }, [index, handleStop]);

    return {
        index,
        wpm,
        isActive,
        isRunning,
        currentWord: splittedRef.current[index],
        words: splittedRef.current,
        handleStart,
        handlePause,
        handleResume,
        handleStop,
        handleReset,
        breakFor,
        setWPM,
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
