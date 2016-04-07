/* @flow */

const lineBreakRegex = /\r\n|\r|\n/;
const lineBreakRegexGlobal = /\r\n|\r|\n/g;

export function getLines(input: string): string[] {
    return input.split(lineBreakRegex);
}

export function getLineInfo(code) {
    var lines = [];
    lineBreakRegexGlobal.lastIndex = 0;
    var lastOffset = 0;
    var match;
    while ((match = lineBreakRegexGlobal.exec(code)) !== null) {
        lines.push({
            offset: lastOffset,
            text: code.substring(lastOffset, match.index),
            lineBreak: match[0]
        });
        lastOffset = match.index + match[0].length;
    }
    lines.push({offset: lastOffset, text: code.substr(lastOffset), lineBreak: null});
    return lines;
}
