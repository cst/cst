/* @flow */

const lineBreakRegex = /\r\n|\r|\n/;

export function getLines(input: string): Array<string> {
    return input.split(lineBreakRegex);
}
