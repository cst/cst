import Node from './Node';

/**
 * @class
 * @name Expression
 */
export default class Expression extends Node {
    isExpression() {
        return true;
    }
}
