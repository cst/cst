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
        let typeIndex = this._index[type];
        if (typeIndex) {
            let result = new Array(typeIndex.count);
            let typeIndexHash = typeIndex.elements;
            let arrayPos = 0;
            for (let elementId in typeIndexHash) {
                result[arrayPos] = typeIndexHash[elementId];
                arrayPos++;
            }
            return result;
        } else {
            return [];
        }
    }

    addElement(element) {
        let typeIndex = this._index[element._type];
        if (!typeIndex) {
            typeIndex = this._index[element._type] = {count: 0, elements: {}};
        }
        typeIndex.elements[element._uniqueId] = element;
        typeIndex.count++;
    }

    removeElement(element) {
        let typeIndex = this._index[element._type];
        delete typeIndex.elements[element._uniqueId];
        typeIndex.count--;
    }
}
