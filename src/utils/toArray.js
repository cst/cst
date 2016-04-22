/* @flow */

import from from 'array.from';

/**
 * Provides Array.from for older nodejs.
 */
export default function toArray<T>(input: Iterable<T>): T[] {
    return from(input);
}
