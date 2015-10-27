/* flow */

const lineBreakRegex = /\r\n|\r|\n/;

export function getLines(input: string): string {
    return input.split(lineBreakRegex);
}
