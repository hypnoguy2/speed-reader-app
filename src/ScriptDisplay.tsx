import { ReactNode, useEffect, useState } from "react";
import { idFunc, OptionManagerType, PivotFunctionType } from "./Helpers";
import { useScript } from "./hooks/ScriptHook";

export const useScriptDisplay = (initialScript: string) => {
    const { index, currentWord, setWPM, haltFor, breakFor, addOptionManagers, ...script } =
        useScript(initialScript, {
            log: (val) => {
                console.log(val);
            },
        });

    const [pivotFunction, setPivotFunction] = useState<PivotFunctionType>(() => idFunc);

    // Reading in script options
    useEffect(() => {
        addOptionManagers({
            wpm: setWPM,
            halt: haltFor,
            break: breakFor,
        } as OptionManagerType);
    }, [addOptionManagers, breakFor, haltFor, setWPM]);

    const [element, setElement] = useState<ReactNode>(<></>);

    useEffect(() => {
        setElement(pivotFunction(currentWord));
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
