import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { idFunc, OptionManagerType, PivotFunctionType } from "./Helpers";
import { useScript } from "./hooks/ScriptHook";

export const useScriptDisplay = (initialScript: string) => {
    const { index, currentWord, setWPM, haltFor, breakFor, addOptionManagers, ...script } =
        useScript(initialScript, {
            log: (val) => {
                console.log(val);
            },
        });

    const [element, setElement] = useState<ReactNode>(<></>);
    const [pivotFunction, setPivotFunction] = useState<PivotFunctionType>(() => idFunc);

    const fontsizeRef = useRef("10vw");

    const setFontsize = useCallback((value: string) => {
        fontsizeRef.current = value;
    }, []);

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
            <div style={{ fontSize: fontsizeRef.current }}>{pivotFunction(currentWord)}</div>
        );
    }, [currentWord, pivotFunction]);

    return {
        index,
        element,
        setWPM,
        breakFor,
        setPivotFunction,
        ...script,
    };
};
