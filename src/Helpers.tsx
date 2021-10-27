export const  pivot = (word: string) => {
    if (word === undefined) return "";
    
    var length = word.length;
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

        var start = word.slice(0, word.length / 2);
        var end = word.slice(word.length / 2, word.length);

        var result;
        result = "<span class='spray_start'>" + start.slice(0, start.length - 1);
        result = result + "</span><span class='spray_pivot'>";
        result = result + start.slice(start.length - 1, start.length);
        result = result + "</span><span class='spray_end'>";
        result = result + end;
        result = result + "</span>";
    } else {

        var tail = 22 - (word.length + 7);
        word = "......." + word + ".".repeat(tail);

        var start = word.slice(0, word.length / 2);
        var end = word.slice(word.length / 2, word.length);

        var result;
        result = "<span class='spray_start'>" + start.slice(0, start.length - 1);
        result = result + "</span><span class='spray_pivot'>";
        result = result + start.slice(start.length - 1, start.length);
        result = result + "</span><span class='spray_end'>";
        result = result + end;
        result = result + "</span>";
    }
    console.log(result);
    result = result.replace(/\./g, "<span class='invisible'>.</span>");
    return result;
}
