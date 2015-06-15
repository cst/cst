import Node from './node';

/**
 * @class
 * @name Expression
 */
export default class Expression extends Node {
    isExpression() {
        return true;
    }
}
