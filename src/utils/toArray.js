/* @flow */

/**
 * Provides Array.from for older nodejs.
 */
export default function toArray<T>(input: Iterable<T>): T[] {
    let result = [];

    for (let item of input) {
        result.push(item);
    }

    return result;
}
