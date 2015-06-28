const lineBreakRegex = /\r\n|\r|\n/g;

export function countLineBreaks(input) {
    let match = input.match(lineBreakRegex);
    return match ? match.length : 0;
}
