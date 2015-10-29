/* @flow */

import type ElementAssert from '../../ElementAssert';
import type Element from '../../Element';

/**
 * Processes function parameters.
 *
 * @param {ElementAssert} children
 * @returns {Pattern[]}
 */
export default function getFunctionParams(children: ElementAssert): Array<Element> {
    let params = [];
    children.passToken('Punctuator', '(');
    children.skipNonCode();
    while (!children.isToken('Punctuator', ')')) {
        if (children.isToken('Punctuator', ',')) {
            children.moveNext();
            children.skipNonCode();
            children.assertToken('Punctuator', ')');
        } else {
            params.push(children.passPattern());
            children.skipNonCode();
            if (children.isToken('Punctuator', ',')) {
                children.moveNext();
                children.skipNonCode();
            }
        }
    }
    children.passToken('Punctuator', ')');
    return params;
}
