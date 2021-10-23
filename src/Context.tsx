import React, { createContext, ProviderProps, ReactNode, useState } from "react";

type SettingsContextProps = {
    fps: number,
    setFPS: (n: number) => void;
}

export const FPSContext = createContext<Partial<SettingsContextProps>>({});

export const FPSContextProvider = (props: {fps: number, setfps: (n:number) => void, children?: ReactNode}) => {
    const [token, setToken] = useState(0);
    console.log("context");
    return (
        <FPSContext.Provider value={{ fps: token, setFPS: setToken }}>
            {props.children}
        </FPSContext.Provider>
    );
};