import Element from './Element';

/**
 * Part of AST, non-token entity.
 * @class
 * @name Node
 */
export default class Node extends Element {
    isNode() {
        return true;
    }
}
