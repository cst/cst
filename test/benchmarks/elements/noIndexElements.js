export class ArrayChildren {
    constructor(type, children) {
        this._type = type;
        this._children = children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            child._nextSibling = children[i + 1] || null;
            child._previousSibling = children[i - 1] || null;
            child._parent = this;
        }
    }

    appendChild(element) {
        element._parent = this;

        element._previousSibling = this._lastChild;
        element._nextSibling = null;

        this._children[this._children.length] = element;
        if (this._lastChild) {
            this._lastChild._nextSibling = element;
        } else {
            this._firstChild = this._lastChild = element;
        }
        this._lastChild = element;
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

            this._children.splice(this._children.indexOf(element), 1);
        }
    }

    select(type) {
        let result = [];
        if (this._type === type) {
            result.push(this);
        }
        this._select(type, result);
        return result;
    }

    _select(type, result) {
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (child._type === type) {
                result.push(child);
            }
            child._select(type, result);
        }
    }
}

export class ListChildren {
    constructor(type, children) {
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
    }

    select(type) {
        let result = [];
        if (this._type === type) {
            result.push(this);
        }
        this._select(type, result);
        return result;
    }

    _select(type, result) {
        let child = this._firstChild;
        while (child) {
            if (child._type === type) {
                result.push(child);
            }
            child._select(type, result);
            child = child._nextSibling;
        }
    }
}

export class ListChildrenNonRecursive extends ListChildren {

    select(type) {
        let bulkSize = 100;
        let result = new Array(bulkSize);
        let resultLength = 0;

        let queue = new Array(bulkSize);
        let queueLength = 1;
        queue[0] = this;

        while (queueLength > 0) {
            let item = queue[queueLength - 1];
            queueLength--;

            if (item._type === type) {
                if (result.length === resultLength) {
                    result = result.concat(new Array(bulkSize));
                }
                result[resultLength] = item;
                resultLength++;
            }

            let child = item._firstChild;
            while (child) {
                if (queue.length === queueLength) {
                    queue = queue.concat(new Array(bulkSize));
                }
                queue[queueLength] = child;
                queueLength++;
                child = child._nextSibling;
            }
        }

        return result.slice(0, resultLength);
    }
}

export class ListChildrenRecursiveClosure extends ListChildren {
    select(type) {
        let result = new Array(100);
        let length = 0;
        if (this._type === type) {
            result[0] = this;
            length++;
        }

        select(this);

        function select(item) {
            let child = item._firstChild;
            while (child) {
                if (child._type === type) {
                    if (length === result.length) {
                        result = result.concat(new Array(result.length));
                    }
                    result[length] = child;
                    length++;
                }
                if (child._firstChild) {
                    select(child);
                }
                child = child._nextSibling;
            }
        }

        return result.slice(0, length);
    }
}
