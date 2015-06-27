export class SetIndex {
    constructor(type, children, isRoot) {
        this._isRoot = isRoot;
        this._type = type;
        if (children.length > 0) {
            this._firstChild = children[0];
            this._lastChild = children[children.length - 1];
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                child._nextSibling = children[i + 1] || null;
                child._previousSibling = children[i - 1] || null;
                child._parent = this;
            }
        }

        if (isRoot) {
            this._index = {};
            extendSetIndex(this, this._index);
        }
    }

    getRoot() {
        let element = this;
        while (element) {
            if (element._isRoot) {
                return element;
            }
            element = element._parent;
        }
        return null;
    }

    appendChild(element) {
        element._parent = this;

        element._previousSibling = this._lastChild;
        element._nextSibling = null;

        if (this._lastChild) {
            this._lastChild._nextSibling = element;
        } else {
            this._firstChild = this._lastChild = element;
        }
        this._lastChild = element;

        extendSetIndex(element, this.getRoot()._index);
    }

    removeChild(element) {
        if (element._parent === this) {
            if (element._previousSibling) {
                element._previousSibling._nextSibling = element._nextSibling;
            }

            if (element._nextSibling) {
                element._nextSibling._previousSibling = element._previousSibling;
            }

            if (element === this._lastChild) {
                this._lastChild = element._previousSibling;
            }

            if (element === this._firstChild) {
                this._firstChild = element._nextSibling;
            }

            element._parent = null;
        }

        subtractSetIndex(element, this.getRoot()._index);
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

function extendSetIndex(element, index) {
    let type = element._type;

    let indexItem;
    if (type in index) {
        indexItem = index[type];
    } else {
        indexItem = index[type] = new Set();
    }

    indexItem.add(element);

    let child = element._firstChild;
    while (child) {
        extendSetIndex(child, index);
        child = child._nextSibling;
    }
}

function subtractSetIndex(element, index) {
    let type = element._type;
    index[type].delete(element);

    let child = element._firstChild;
    while (child) {
        subtractSetIndex(child, index);
        child = child._nextSibling;
    }
}

export class HashIndex {
    constructor(type, children, isRoot) {
        this._isRoot = isRoot;
        this._uniqueId = '__id' + HashIndex._lastId++;
        this._type = type;

        if (children.length > 0) {
            this._firstChild = children[0];
            this._lastChild = children[children.length - 1];
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                child._nextSibling = children[i + 1] || null;
                child._previousSibling = children[i - 1] || null;
                child._parent = this;
            }
        }

        if (isRoot) {
            this._index = {};
            extendHashIndex(this, this._index);
        }
    }

    getRoot() {
        let element = this;
        while (element) {
            if (element._isRoot) {
                return element;
            }
            element = element._parent;
        }
        return null;
    }

    appendChild(element) {
        element._parent = this;

        element._previousSibling = this._lastChild;
        element._nextSibling = null;

        if (this._lastChild) {
            this._lastChild._nextSibling = element;
        } else {
            this._firstChild = this._lastChild = element;
        }
        this._lastChild = element;

        extendHashIndex(element, this.getRoot()._index);
    }

    removeChild(element) {
        if (element._parent === this) {
            if (element._previousSibling) {
                element._previousSibling._nextSibling = element._nextSibling;
            }

            if (element._nextSibling) {
                element._nextSibling._previousSibling = element._previousSibling;
            }

            if (element === this._lastChild) {
                this._lastChild = element._previousSibling;
            }

            if (element === this._firstChild) {
                this._firstChild = element._nextSibling;
            }

            element._parent = null;
        }

        subtractHashIndex(element, this.getRoot()._index);
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

function extendHashIndex(element, index) {
    let type = element._type;
    let indexItem;
    if (type in index) {
        indexItem = index[type];
    } else {
        indexItem = index[type] = {count: 0, elements: {}};
    }
    indexItem.count++;
    indexItem.elements[element._uniqueId] = element;

    let child = element._firstChild;
    while (child) {
        extendHashIndex(child, index);
        child = child._nextSibling;
    }
}

function subtractHashIndex(element, index) {
    let type = element._type;
    let indexItem = index[type];
    delete indexItem.elements[element._uniqueId];
    indexItem.count--;

    let child = element._firstChild;
    while (child) {
        subtractHashIndex(child, index);
        child = child._nextSibling;
    }
}

HashIndex._lastId = 1000000;

export class ArrayIndex {
    constructor(type, children, isRoot) {
        this._isRoot = isRoot;
        this._type = type;

        if (children.length > 0) {
            this._firstChild = children[0];
            this._lastChild = children[children.length - 1];
            let previousSibling = null;
            let child;
            for (let i = 0; i < children.length; i++) {
                child = children[i];
                child._previousSibling = previousSibling;
                if (previousSibling) {
                    previousSibling._nextSibling = child;
                }
                child._parent = this;
                previousSibling = child;
            }
            child._nextSibling = null;
        }

        if (isRoot) {
            this._index = {};
            extendArrayIndex(this, this._index);
        }
    }

    getRoot() {
        let element = this;
        while (element) {
            if (element._isRoot) {
                return element;
            }
            element = element._parent;
        }
        return null;
    }

    appendChild(element) {
        element._parent = this;

        element._previousSibling = this._lastChild;
        element._nextSibling = null;

        if (this._lastChild) {
            this._lastChild._nextSibling = element;
        } else {
            this._firstChild = this._lastChild = element;
        }
        this._lastChild = element;

        extendArrayIndex(element, this.getRoot()._index);
    }

    removeChild(element) {
        if (element._parent === this) {
            if (element._previousSibling) {
                element._previousSibling._nextSibling = element._nextSibling;
            }

            if (element._nextSibling) {
                element._nextSibling._previousSibling = element._previousSibling;
            }

            if (element === this._lastChild) {
                this._lastChild = element._previousSibling;
            }

            if (element === this._firstChild) {
                this._firstChild = element._nextSibling;
            }

            element._parent = null;

            subtractArrayIndex(element, this.getRoot()._index);
        }
    }

    select(type) {
        let elementSubIndex = this._index[type];
        if (elementSubIndex) {
            return elementSubIndex.concat();
        } else {
            return [];
        }
    }
}

function extendArrayIndex(element, index) {
    let type = element._type;
    let indexItem;
    if (type in index) {
        indexItem = index[type];
    } else {
        indexItem = index[type] = [];
    }
    indexItem[indexItem.length] = element;

    let child = element._firstChild;
    while (child) {
        extendArrayIndex(child, index);
        child = child._nextSibling;
    }
}

function subtractArrayIndex(element, index) {
    let type = element._type;
    let indexItem = index[type];
    indexItem.splice(indexItem.indexOf(element), 1);

    let child = element._firstChild;
    while (child) {
        subtractArrayIndex(child, index);
        child = child._nextSibling;
    }
}
