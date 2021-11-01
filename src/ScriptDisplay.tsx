import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
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

/**
 * A hook to update an index at a certain rate (wpm)
 * @returns status flags and controls for the index runner
 */
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

/**
 * A hook that uses the index hook to go through a script. The script can have options.
 * @param initialScript script
 * @returns
 */
export const useScript = (initialScript: string, manager: OptionManagerType = {}) => {
    const indexHook = useIndex();
    const {
        index,
        handleStart,
        handlePause,
        handleResume,
        handleStop: stopIndex,
        handleReset,
    } = indexHook;

    const [script] = useState(initialScript);
    // const [managers, setManagers] = useState<OptionManagerType>({ ...manager });

    const indexRef = useRef(index);
    const splittedRef = useRef(["", ...processScript(script)]);
    const loopRef = useRef(2);

    const managersRef = useRef<OptionManagerType>({...manager});

    // empty interval/timeout to create reusable refs with useRef
    const breakRef = useRef(
        setTimeout(() => {
            return;
        }, 1000000)
    );

    const setLoops = useCallback((loops: number) => {
        loopRef.current = loops;
    }, []);

    const setOptionManagers = useCallback((manager: OptionManagerType) => {
        managersRef.current = { ...manager };
    }, []);

    const addOptionManagers = useCallback((manager: OptionManagerType) => {
        managersRef.current = { ...managersRef.current, ...manager };
    }, []);

    const handleStop = useCallback(() => {
        clearTimeout(breakRef.current);
        stopIndex();
    }, [stopIndex]);

    const resetScript = useCallback(() => {
        splittedRef.current = ["", ...processScript(script)];
    }, [script]);

    const breakFor = useCallback((value: number) => {
        splittedRef.current.splice(indexRef.current + 2, 0, "", `<halt=${value}>`);
    }, []);

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

    // option handle effect
    useEffect(() => {
        indexRef.current = index;

        const nextWord = splittedRef.current[index + 1];
        if (nextWord && nextWord.startsWith("<")) {
            for (const key in managersRef.current) {
                const option = nextWord.match(new RegExp(key + "=\\d+"));
                if (option) {
                    const newValue = option[0].match(/\d+/);
                    if (newValue) managersRef.current[key](newValue[0]);
                }
            }

            splittedRef.current = splittedRef.current.filter((w, i) => i !== index + 1);
        }
    }, [index]);

    // effect to handle script looping
    useEffect(() => {
        if (index >= splittedRef.current.length) {
            loopRef.current = loopRef.current - 1;
            if (loopRef.current === 0) handleStop();
            else {
                handleReset();
                resetScript();
                setTimeout(() => handleStart(), 1000);
            }
        }
    }, [index, handleStop, handleReset, handleStart, resetScript]);

    return {
        ...indexHook,
        currentWord: splittedRef.current[index],
        words: splittedRef.current,
        handleStop,
        haltFor,
        breakFor,
        setLoops,
        setOptionManagers,
        addOptionManagers,
    };
};

export const useScriptDisplay = (initialScript: string) => {
    const { index, currentWord, setWPM, haltFor, breakFor, addOptionManagers, ...script } =
        useScript(initialScript, {
            log: (val) => {
                console.log(val);
            },
        });

    // Reading in script options
    useEffect(() => {
        addOptionManagers({
            wpm: setWPM,
            halt: haltFor,
            break: breakFor,
        } as OptionManagerType);
    }, [addOptionManagers, breakFor, haltFor, setWPM]);

    const [element, setElement] = useState<ReactNode>(<span>{index}</span>);

    useEffect(() => {
        setElement(<span>{currentWord}</span>);
    }, [currentWord]);

    return {
        index,
        element,
        setWPM,
        breakFor,
        ...script,
    };
};

const ScriptDisplay = (props: ScriptDisplayProps) => {
    //const {element, handleStart, handlePause, ...} = useScriptDisplay(script);

    return (
        <div className="text-wrapper">
            <div className="text">{props.children}</div>
        </div>
    );
};

export default ScriptDisplay;
