import Statement from '../Statement';
import ElementSearchIndex from './utils/ElementSearchIndex';

export default class Program extends Statement {
    constructor(childNodes) {
        super('Program', childNodes);

        this._isProgram = true;
        this._searchIndex = new ElementSearchIndex();
        this._searchIndex.addElements(childNodes);
    }

    _acceptChildren(children) {
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
    selectNodesByType(type) {
        return this._searchIndex.selectNodesByType(type);
    }

    /**
     * Returns tokens list with specified type from the tree.
     *
     * @param {String} type
     * @returns {Token[]}
     */
    selectTokensByType(type) {
        return this._searchIndex.selectTokensByType(type);
    }

    _addElementsToSearchIndex(elements) {
        this._searchIndex.addElements(elements);
    }

    _removeElementsFromSearchIndex(elements) {
        this._searchIndex.removeElements(elements);
    }

    get body() {
        return this._body.concat();
    }
}
