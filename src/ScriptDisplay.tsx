import { ReactNode, useEffect, useState } from "react";
import { OptionManagerType } from "./Helpers";
import { useScript } from "./hooks/ScriptHook";

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
