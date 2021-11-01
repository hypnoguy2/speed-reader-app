import { useState, useRef, useCallback, useEffect } from "react";
import { OptionManagerType, processScript } from "../Helpers";
import { useIndex } from "./IndexHook";

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

    const managersRef = useRef<OptionManagerType>({ ...manager });

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