import { identity } from "lodash";
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
export const useScript = (initialScript: string, optionManager?: OptionManagerType) => {
    const { index, handlePause, handleResume, handleStop, setWPM, ...rest } = useIndex();

    const [script] = useState(initialScript);

    const splittedRef = useRef(["", ...processScript(script)]);

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
            ...optionManager,
        } as OptionManagerType;
    }, [setWPM, breakFor, haltFor, optionManager]);

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
        currentWord: splittedRef.current[index],
        words: splittedRef.current,
        handlePause,
        handleResume,
        handleStop,
        breakFor,
        setWPM,
        ...rest,
    };
};

export const useScriptDisplay = (initialScript: string) => {
    const { index, ...script } = useScript(initialScript, {
        log: (val) => {
            console.log(val);
        },
    });

    const [element, setElement] = useState<ReactNode>(<span>{index}</span>);

    useEffect(() => {
        setElement(<span>{index}</span>);
    }, [index]);

    return {
        index,
        element,
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
