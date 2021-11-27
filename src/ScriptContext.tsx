import { createContext, useContext } from "react";

import { useScriptRender } from "./hooks/RenderHook";
import { example } from "./Scripts";

// https://kentcdodds.com/blog/how-to-use-react-context-effectively
type ScriptProviderProps = { children: React.ReactNode };

const ScriptContext = createContext<ReturnType<typeof useScriptRender> | undefined>(undefined);

const ScriptProvider = ({ children }: ScriptProviderProps) => {
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = useScriptRender(example);
    return <ScriptContext.Provider value={value}>{children}</ScriptContext.Provider>;
};

const useContextScript = () => {
    const context = useContext(ScriptContext);
    if (context === undefined) {
        throw new Error("useContextScript must be used within a ScriptProvider");
    }
    return context;
};

export { ScriptProvider, useContextScript };
