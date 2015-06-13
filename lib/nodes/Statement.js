import Node from './node';

/**
 * @class
 * @name Statement
 */
export default class Statement extends Node {
    get isStatement() {
        return true;
    }
}
