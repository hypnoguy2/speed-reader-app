import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useIndex } from "./IndexHook";

export type OptionOperators = {
    open?: string;
    assign?: string;
    seperator?: string;
    close?: string;
};

export type OptionManagerType = {
    [key: string]: (value: string | number) => void;
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
        splittedRef.current = ["", ...processScript(script)];
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
            for (const key in managersRef.current) {
                // RegExp compiles to 'key + "=[^,>]+"' with default operators
                const optionRegExp = new RegExp(
                    key + operators.assign + "[^" + operators.seperator + operators.close + "]+"
                );
                const option = nextWord.match(optionRegExp);
                if (option) {
                    // RegExp compiles to "([^,>]+)" with default operators, the paranthesis create a capture group
                    const valueRegExp = new RegExp(
                        operators.assign + "([^" + operators.seperator + operators.close + "]+)"
                    );
                    const newValue = option[0].match(valueRegExp);
                    if (newValue) managersRef.current[key](newValue[1]); // use value of capture group to get value
                }
            }

            splittedRef.current = splittedRef.current.filter((w, i) => i !== index + 1);
        }
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
