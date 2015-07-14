const lineBreakRegex = /\r\n|\r|\n/;

export function getLines(input) {
    return input.split(lineBreakRegex);
}
