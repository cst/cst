import Statement from '../Statement';
import ElementList from '../ElementList';
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
        while (!children.isEnd) {
            body.push(children.passStatement());
            children.skipNonCode();
        }

        children.assertEnd();

        this._body = new ElementList(body);
    }

    selectNodesByType(type) {
        return this._searchIndex.selectNodesByType(type);
    }

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
        return this._body;
    }
}
