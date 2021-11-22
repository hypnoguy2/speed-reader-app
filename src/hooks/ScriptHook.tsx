import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useIndex } from "./IndexHook";

export type OptionOperators = {
    open?: string;
    assign?: string;
    seperator?: string;
    close?: string;
};

export type ScheduledFunction = {
    delay: number;
    func: (value: string | number) => void;
    arg: string | number;
};

export type OptionManagerType = {
    [key: string]: [(value: string | number) => void, number];
};

export type ScriptOptions = {
    managers?: OptionManagerType;
    operators?: OptionOperators;
};

const defaultOperators: OptionOperators = {
    open: "<",
    assign: "=",
    seperator: ",",
    close: ">",
};

/**
 * A hook that uses the index hook to go through a script. The script can have options.
 * @param initialScript script
 * @returns
 */
export const useScript = (initialScript: string, options: ScriptOptions = {}) => {
    const indexHook = useIndex();
    const { index, handleStop, handleReset } = indexHook;
    const [script, setScript] = useState(initialScript);

    const indexRef = useRef(index);
    const operators = useMemo(() => {
        return { ...defaultOperators, ...options.operators };
    }, [options.operators]);

    const managersRef = useRef<OptionManagerType>({ ...options.managers });
    const schedulerRef = useRef<ScheduledFunction[]>([]);

    const processScript = useCallback(
        (s: string): string[] => {
            // RegExp compiles to "[^>]*>" with default operators
            const regexString = operators.open + "[^" + operators.close + "]*" + operators.close;
            // removes whitespaces in options, then splits on whitespaces
            return s
                .replace(new RegExp(regexString, "g"), (match) => match.replace(/\s+/g, ""))
                .split(/\s+/g);
        },
        [operators]
    );

    const splittedRef = useRef(["", ...processScript(script)]);

    const setOptionManagers = useCallback((manager: OptionManagerType) => {
        managersRef.current = { ...manager };
    }, []);

    const addOptionManagers = useCallback((manager: OptionManagerType) => {
        managersRef.current = { ...managersRef.current, ...manager };
    }, []);

    const resetScript = useCallback(() => {
        splittedRef.current = ["", "", ...processScript(script)];
        handleReset();
    }, [handleReset, processScript, script]);

    // when script is changed, reset the script
    useEffect(() => {
        resetScript();
    }, [resetScript]);

    // option handle effect
    useEffect(() => {
        indexRef.current = index;

        const nextWord = splittedRef.current[index + 1];
        if (nextWord && nextWord.startsWith(operators.open + "")) {
            // RegExp compiles to "/([^<,=]+)=([^,>]+)/g" with default operators. The paranthesis create capture groups
            const regExp = new RegExp(
                "([^" +
                    operators.open +
                    operators.seperator +
                    operators.assign +
                    "]+)" +
                    operators.assign +
                    "([^" +
                    operators.seperator +
                    operators.close +
                    "]+)",
                "g"
            );
            // look for all options
            const matches = nextWord.matchAll(regExp);
            let match = matches.next();

            // iterate over matches
            while (!match.done) {
                // option is registered in managers
                if (managersRef.current[match.value[1]]) {
                    // get manager touple
                    const touple = managersRef.current[match.value[1]];
                    // schedule function call
                    schedulerRef.current.push({
                        delay: touple[1],
                        func: touple[0],
                        arg: match.value[2],
                    });
                }
                match = matches.next();
            }

            splittedRef.current = splittedRef.current.filter((w, i) => i !== index + 1);
        }

        // call functions from scheduler
        for (const scheduledFunc of schedulerRef.current) {
            if (scheduledFunc.delay === 0) scheduledFunc.func(scheduledFunc.arg);
        }

        // filter all called functions and decrement delay
        schedulerRef.current = schedulerRef.current.filter((f) => f.delay !== 0);
        schedulerRef.current.forEach((f) => --f.delay);
    }, [index, operators]);

    // stop script when index reached the end
    useEffect(() => {
        if (index >= splittedRef.current.length) {
            handleStop();
        }
    }, [handleStop, index]);

    return {
        ...indexHook,
        script,
        index: indexRef.current,
        indexRef: indexRef,
        currentWord: splittedRef.current[index],
        wordsRef: splittedRef,
        operators,
        resetScript,
        setScript,
        setOptionManagers,
        addOptionManagers,
    };
};
