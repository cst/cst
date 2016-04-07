/* @flow */

import Node from './Node';

/**
 * Base class for all expression nodes.
 *
 * @name Expression
 * @class
 * @abstract
 */
export default class Expression extends Node {
    constructor(type, children) {
        super(type, children);
        this.isExpression = true;
    }
}
