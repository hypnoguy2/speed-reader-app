import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { standardWrapper, PivotFunctionType } from "./Helpers";
import { OptionManagerType, useScript } from "./hooks/ScriptHook";

export const useScriptDisplay = (initialScript: string) => {
    const scriptHook = useScript(initialScript, {
        log: (val) => {
            console.log(val);
        },
    });
    const {
        index,
        currentWord,
        indexRef,
        wordsRef,
        setWPM,
        handlePause,
        handleResume,
        addOptionManagers,
    } = scriptHook;

    const [element, setElement] = useState<ReactNode>(<></>);
    const [pivotFunction, setPivotFunction] = useState<PivotFunctionType>(() => standardWrapper);

    const fontsizeRef = useRef("10vw");

    // empty interval/timeout to create reusable refs with useRef
    const haltRef = useRef(
        setTimeout(() => {
            return;
        }, 1000000)
    );

    const setFontsize = useCallback((value: string) => {
        fontsizeRef.current = value;
    }, []);

    const breakFor = useCallback(
        (value: number) => {
            wordsRef.current.splice(indexRef.current + 2, 0, "", `<halt=${value}>`);
        },
        [indexRef, wordsRef]
    );

    const haltFor = useCallback(
        (value: number) => {
            handlePause();
            clearTimeout(haltRef.current);
            haltRef.current = setTimeout(() => {
                handleResume();
            }, value * 1000);
        },
        [handlePause, handleResume]
    );

    // Reading in script options
    useEffect(() => {
        addOptionManagers({
            wpm: setWPM,
            halt: haltFor,
            break: breakFor,
            fontsize: setFontsize,
        } as OptionManagerType);
    }, [addOptionManagers, breakFor, haltFor, setFontsize, setWPM]);

    useEffect(() => {
        setElement(
            <div className="h-100 w-100" style={{ fontSize: fontsizeRef.current }}>
                {pivotFunction(currentWord)}
            </div>
        );
    }, [currentWord, pivotFunction]);

    return {
        ...scriptHook,
        index,
        element,
        setWPM,
        breakFor,
        setPivotFunction,
    };
};
