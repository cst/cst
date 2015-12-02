/* @flow */

import type Element from './elements/Element';
import type Node from './elements/Node';
import type Token from './elements/Token';

export default class Traverse {
    constructor() {
        this._nodeIndex = new ElementIndexByType();
        this._tokenIndex = new ElementIndexByType();
    }

    _nodeIndex: ElementIndexByType;
    _tokenIndex: ElementIndexByType;

    selectNodesByType(type: string): Array<Node> {
        return this._nodeIndex.select(type);
    }

    selectTokensByType(type: string): Array<Token> {
        return this._tokenIndex.select(type);
    }

    selectTokensByValue(value: string): Array<Token> {
        return this._tokenIndex.values(value);
    }

    addElements(elements: Array<Element>): void {
        let nodeIndex = this._nodeIndex;
        let tokenIndex = this._tokenIndex;

        for (let i = 0; i < elements.length; i++) {
            addElementTree(elements[i]);
        }

        function addElementTree(element) {
            if (element.isToken) {
                tokenIndex.addElement(element);
            } else {
                nodeIndex.addElement(element);
                let child = element._firstChild;
                while (child) {
                    addElementTree(child);
                    child = child._nextSibling;
                }
            }
        }
    }

    removeElements(elements: Array<Element>): void {
        let nodeIndex = this._nodeIndex;
        let tokenIndex = this._tokenIndex;

        for (let i = 0; i < elements.length; i++) {
            removeElementTree(elements[i]);
        }

        function removeElementTree(element) {
            if (element.isToken) {
                tokenIndex.removeElement(element);
            } else {
                nodeIndex.removeElement(element);
                let child = element._firstChild;
                while (child) {
                    removeElementTree(child);
                    child = child._nextSibling;
                }
            }
        }
    }
}

class ElementIndexByType {
    constructor() {
        this._index = {};
    }

    _index: Object;

    select(type: string): Array<any> {
        let items = this._index[type];
        if (items) {
            return items.concat();
        } else {
            return [];
        }
    }

    values(value: string): Array<any> {
        let result = [];

        for (let type in this._index) {
            this._index[type].forEach(token => {
                if (token.value === value) {
                    result.push(token);
                }
            });
        }

        return result;
    }

    addElement(element: Element): void {
        let items = this._index[element._type];
        if (!items) {
            items = this._index[element._type] = [];
        }
        items[items.length] = element;
    }

    removeElement(element: Element): void {
        let items = this._index[element._type];
        items.splice(items.indexOf(element), 1);
    }
}
