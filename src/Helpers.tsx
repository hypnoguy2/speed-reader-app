import { ReactNode } from "react";
import JsxParser from "react-jsx-parser";

export type PivotFunctionType = (w: string) => ReactNode;

export interface OptionManagerType {
    [key: string]: (value: string | number) => void;
}

export const standardWrapper = (w: string) => {
    return (
        <div className="text-wrapper">
            <div className="text">{w}</div>
        </div>
    );
};

export const pivot = (word: string): ReactNode => {
    if (word === undefined) return "";

    var length = word.length;
    let start, end, result;
    // Longer words are "right-weighted" for easier readability.
    if (length < 6) {
        var bit = 1;
        while (word.length < 22) {
            if (bit > 0) {
                word = word + ".";
            } else {
                word = "." + word;
            }
            bit = bit * -1;
        }

        start = word.slice(0, word.length / 2);
        end = word.slice(word.length / 2, word.length);

        result = "<span class='pivot-pre'>" + start.slice(0, start.length - 1);
        result = result + "</span><span class='pivot-mid'>";
        result = result + start.slice(start.length - 1, start.length);
        result = result + "</span><span class='pivot-post'>";
        result = result + end;
        result = result + "</span>";
    } else {
        var tail = 22 - (word.length + 7);
        word = "......." + word + ".".repeat(tail);

        start = word.slice(0, word.length / 2);
        end = word.slice(word.length / 2, word.length);

        result = "<span class='pivot-pre'>" + start.slice(0, start.length - 1);
        result = result + "</span><span class='pivot-mid'>";
        result = result + start.slice(start.length - 1, start.length);
        result = result + "</span><span class='pivot-post'>";
        result = result + end;
        result = result + "</span>";
    }
    result = result.replace(/\./g, "<span class='invisible'>.</span>");
    return (
        <div className="text-wrapper">
            <JsxParser className="text" jsx={result} />
        </div>
    );
};

export const processScript = (s: string): string[] => {
    // removes whitespaces in options, then splits on whitespaces
    return splitString(s.replace(/<[^>]*>/gi, (match) => match.replace(/\s+/g, "")));
};

export const splitString = (s: string): string[] => {
    return s.split(/\s+/g);
};

const getPivot = (word: string) => {
    var i = 5;
    switch (word.length) {
        case 1:
            i = 1; // first
            break;
        case 2:
        case 3:
        case 4:
        case 5:
            i = 2; // second
            break;
        case 6:
        case 7:
        case 8:
        case 9:
            i = 3; // third
            break;
        case 10:
        case 11:
        case 12:
        case 13:
            i = 4; // fourth
            break;
        default:
            i = 5; // fifth
    }
    return i;
};

export const show = (word: string) => {
    if (word === undefined) return "";

    const p = getPivot(word);

    return (
        <div className="pivot">
            <span className="pivot-pre">{word.substr(0, p - 1)}</span>
            <span className="pivot-mid">{word.substr(p - 1, 1)}</span>
            <span className="pivot-post">{word.substr(p, word.length - p)}</span>
        </div>
    );
};
