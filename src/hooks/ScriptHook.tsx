import { useState, useRef, useCallback, useEffect } from "react";
import { useIndex } from "./IndexHook";

export type OptionManagerType = {
    [key: string]: (value: string | number) => void;
}

const processScript = (s: string): string[] => {
    // removes whitespaces in options, then splits on whitespaces
    return s
        .replace(/<[^>]*>/gi, (match) =>
            match.replace(/\s+/g, "").replace(/</g, " <").replace(/>/g, ">")
        )
        .split(/\s+/g);
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
        handleStop: stopIndex,
        handleReset,
    } = indexHook;
    const [script, setScript] = useState(initialScript);

    const indexRef = useRef(index);
    const splittedRef = useRef(["", ...processScript(script)]);
    const loopRef = useRef(2);

    const managersRef = useRef<OptionManagerType>({ ...manager });

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
        stopIndex();
    }, [stopIndex]);

    const resetScript = useCallback(() => {
        splittedRef.current = ["", ...processScript(script)];
    }, [script]);

    // option handle effect
    useEffect(() => {
        indexRef.current = index;

        const nextWord = splittedRef.current[index + 1];
        if (nextWord && nextWord.startsWith("<")) {
            for (const key in managersRef.current) {
                const option = nextWord.match(new RegExp(key + "=[^,>]+"));
                if (option) {
                    const newValue = option[0].match(/=([^,>]+)/); // the paranthesis create a capture group
                    if (newValue) managersRef.current[key](newValue[1]); // use value of capture group to get value
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
        index: indexRef.current,
        indexRef: indexRef,
        currentWord: splittedRef.current[index],
        wordsRef: splittedRef,
        handleStop,
        setLoops,
        resetScript,
        setScript,
        setOptionManagers,
        addOptionManagers,
    };
};
