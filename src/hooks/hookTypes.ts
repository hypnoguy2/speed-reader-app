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

export type ScriptHookOptions = {
    managers?: OptionManagerType;
    operators?: OptionOperators;
};
