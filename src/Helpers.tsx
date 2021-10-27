import JsxParser from "react-jsx-parser";

export const  pivot = (word: string) => {
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

        result = "<span class='spray_start'>" + start.slice(0, start.length - 1);
        result = result + "</span><span class='spray_pivot'>";
        result = result + start.slice(start.length - 1, start.length);
        result = result + "</span><span class='spray_end'>";
        result = result + end;
        result = result + "</span>";
    } else {

        var tail = 22 - (word.length + 7);
        word = "......." + word + ".".repeat(tail);

        start = word.slice(0, word.length / 2);
        end = word.slice(word.length / 2, word.length);

        result = "<span class='spray_start'>" + start.slice(0, start.length - 1);
        result = result + "</span><span class='spray_pivot'>";
        result = result + start.slice(start.length - 1, start.length);
        result = result + "</span><span class='spray_end'>";
        result = result + end;
        result = result + "</span>";
    }
    result = result.replace(/\./g, "<span class='invisible'>.</span>");
    return <JsxParser jsx={result} />;
}

export const processScript = (s: string): string[] => {
    // removes whitespaces in options, then splits on whitespaces
    return splitString(s.replace(/<[^>]*>/gi, (match) => match.replace(/\s+/g, "")));
};

export const splitString = (s: string): string[] => {
    return s.split(/\s+/g);
};

