/* @flow */

import type Token from '../Token';
import type Node from '../Node';
import type Element from '../Element';
import type ElementAssert from '../ElementAssert';
import Statement from '../Statement';
import Traverse from '../../Traverse';

export default class Program extends Statement {
    constructor(childNodes: Array<any>) {
        super('Program', childNodes);

        this._isProgram = true;
        this._traverse = new Traverse();
        this._traverse.addElements(childNodes);
    }

    _traverse: Traverse;
    _body: Array<any>;
    _isProgram: boolean;

    _acceptChildren(children: ElementAssert) {
        if (children.isToken('Hashbang')) {
            children.passToken('Hashbang');
        }

        children.skipNonCode();

        let body = [];
        while (children.isStatement()) {
            body.push(children.passStatement());
            children.skipNonCode();
        }

        children.passToken('EOF');
        children.assertEnd();

        this._body = body;
    }

    /**
     * Returns node list with specified type from the tree.
     *
     * @param {String} type
     * @returns {Node[]}
     */
    selectNodesByType(type: string): Array<Node> {
        return this._traverse.selectNodesByType(type);
    }

    /**
     * Returns tokens list with specified type from the tree.
     *
     * @param {String} type
     * @returns {Token[]}
     */
    selectTokensByType(type: string): Array<Token> {
        return this._traverse.selectTokensByType(type);
    }

    _addElementsToSearchIndex(elements: Array<Element>) {
        this._traverse.addElements(elements);
    }

    _removeElementsFromSearchIndex(elements: Array<Element>) {
        this._traverse.removeElements(elements);
    }

    get body(): Array<any> {
        return this._body.concat();
    }
}
