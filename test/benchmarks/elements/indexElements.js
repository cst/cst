export class SetIndex {
    constructor(type, children) {
        this._type = type;
        let index = this._index = {
            [type]: new Set([this])
        };
        if (children.length > 0) {
            this._firstChild = children[0];
            this._lastChild = children[children.length - 1];
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                child._nextSibling = children[i + 1] || null;
                child._previousSibling = children[i - 1] || null;
                for (var elementType in child._index) {
                    let childSet = child._index[elementType];
                    if (elementType in index) {
                        let parentSet = index[elementType];
                        for (let item of childSet) {
                            parentSet.add(item);
                        }
                    } else {
                        index[elementType] = new Set(childSet);
                    }
                }
            }
        }
    }

    select(type) {
        let elementSet = this._index[type];
        if (elementSet) {
            let result = new Array(elementSet.size);
            let i = 0;
            for (let element of elementSet) {
                result[i] = element;
                i++;
            }
            return result;
        } else {
            return [];
        }
    }
}

export class HashIndex {
    constructor(type, children) {
        this._uniqueId = '__id' + HashIndex._lastId++;

        this._type = type;
        let index = this._index = {
            [type]: {count: 0, elements: {[this._uniqueId]: this}}
        };

        if (children.length > 0) {
            this._firstChild = children[0];
            this._lastChild = children[children.length - 1];
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                child._nextSibling = children[i + 1] || null;
                child._previousSibling = children[i - 1] || null;
                for (var elementType in child._index) {
                    let childSubIndex = child._index[elementType];
                    if (!(elementType in index)) {
                        index[elementType] = {count: 0, elements: {}};
                    }
                    let parentSubIndex = index[elementType];
                    parentSubIndex.count += childSubIndex.count;
                    let parentSubIndexElements = parentSubIndex.elements;
                    let childSubIndexElements = childSubIndex.elements;
                    for (var elementId in childSubIndexElements) {
                        parentSubIndexElements[elementId] = childSubIndexElements[elementId];
                    }
                }
            }
        }
    }

    select(type) {
        let elementSubIndex = this._index[type];
        if (elementSubIndex) {
            let result = new Array(elementSubIndex.count);
            let elements = elementSubIndex.elements;
            let i = 0;
            for (let elementId in elements) {
                result[i] = elements[elementId];
                i++;
            }
            return result;
        } else {
            return [];
        }
    }
}

HashIndex._lastId = 1000000;

export class ArrayIndex {
    constructor(type, children) {
        this._type = type;
        let index = this._index = {
            [type]: {elements: [this]}
        };

        if (children.length > 0) {
            this._firstChild = children[0];
            this._lastChild = children[children.length - 1];
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                child._nextSibling = children[i + 1] || null;
                child._previousSibling = children[i - 1] || null;
                for (var elementType in child._index) {
                    let childSubIndex = child._index[elementType];
                    if (!(elementType in index)) {
                        index[elementType] = {elements: []};
                    }
                    let parentSubIndex = index[elementType];
                    parentSubIndex.elements = parentSubIndex.elements.concat(childSubIndex.elements);
                }
            }
        }
    }

    select(type) {
        let elementSubIndex = this._index[type];
        if (elementSubIndex) {
            return elementSubIndex.elements.slice(0);
        } else {
            return [];
        }
    }
}
