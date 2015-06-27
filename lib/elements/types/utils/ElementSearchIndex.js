export default class ElementSearchIndex {
    constructor() {
        this._nodeIndex = new ElementIndexByType();
        this._tokenIndex = new ElementIndexByType();
    }

    selectNodesByType(type) {
        return this._nodeIndex.select(type);
    }

    selectTokensByType(type) {
        return this._tokenIndex.select(type);
    }

    addElements(elements) {
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

    removeElements(elements) {
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

    select(type) {
        let items = this._index[type];
        if (items) {
            return items.concat();
        } else {
            return [];
        }
    }

    addElement(element) {
        let items = this._index[element._type];
        if (!items) {
            items = this._index[element._type] = [];
        }
        items[items.length] = element;
    }

    removeElement(element) {
        let items = this._index[element._type];
        items.splice(items.indexOf(element), 1);
    }
}
