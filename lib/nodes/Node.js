import NodeAssert from './NodeAssert';
import NodeList from './NodeList';

export default class Node {
    constructor(type, children) {
        this._type = type;

        this._initChildren(children);

        this._children = children;
        //this.loc = location;
        //this.range = range;

        this._onAbandon();

        this._firstNode = null;
        this._lastNode = null;
        this._firstToken = null;
        this._lastToken = null;
    }

    get type() {
        return this._type;
    }

    get parentNode() {
        return this._parentNode;
    }

    get nextSibling() {
        return this._nextSibling;
    }

    get previousSibling() {
        return this._previousSibling;
    }

    get nextToken() {
        return this._nextToken;
    }

    get previousToken() {
        return this._previousToken;
    }

    get firstToken() {
        return this._firstToken;
    }

    get lastToken() {
        return this._lastToken;
    }

    get codeLength() {
        let length = 0;
        for (let child of this._children) {
            length += child.codeLength;
        }
        return length;
    }

    get code() {
        let code = '';
        for (let child of this._children) {
            code += child.code;
        }
        return code;
    }

    get isExpression() {
        return false;
    }

    get isStatement() {
        return false;
    }

    get isToken() {
        return false;
    }

    get isWhitespace() {
        return false;
    }

    get isComment() {
        return false;
    }

    get isPattern() {
        return false;
    }

    get isAssignable() {
        return false;
    }

    get childNodes() {
        return this._childNodes;
    }

    _setChildren(newChildren) {
        this._acceptChildren(new NodeAssert(newChildren));
        this._children = newChildren;
        this._childNodes = new NodeList(newChildren);
    }

    _acceptChildren(children) {
        // Override
    }

    appendChildren(childNodes) {
        this._insertChildren(childNodes, this._children.length);
    }

    prependChildren(childNodes) {
        this._insertChildren(childNodes, 0);
    }

    replaceChildren(childNodes, referenceNode, replaceCount) {
        let nodeIndex = this._children.indexOf(referenceNode);

        if (nodeIndex === -1) {
            throw new Error('Reference node was not found.')
        }

        this._insertChildren(childNodes, nodeIndex, true, replaceCount);
    }

    insertChildrenBefore(childNodes, referenceNode) {
        let nodeIndex = this._children.indexOf(referenceNode);

        if (nodeIndex === -1) {
            throw new Error('Reference node was not found.')
        }

        this._insertChildren(childNodes, nodeIndex);
    }

    insertChildrenAfter(childNodes, referenceNode) {
        if (referenceNode.parentNode !== this) {
            throw new Error('Reference node was not found.')
        }

        var nextNode = referenceNode.nextSibling;

        if (nextNode) {
            this.insertChildrenAfter(childNodes, nextNode);
        } else {
            this.appendChildren(childNodes);
        }
    }

    _initChildren(childNodes) {
        this._insertChildren(childNodes, 0);
    }

    _insertChildren(childNodes, position, replace, replaceCount) {
        let nodesBefore;
        let nodesAfter;
        let nodeBefore;
        let nodeAfter;
        let newChildren;
        if (this._children) {
            nodesBefore = this._children.slice(0, position);
            nodesAfter = this._children.slice(replace ? position + replaceCount : position);
            nodeBefore = nodesBefore[nodesBefore.length - 1];
            nodeAfter = nodesAfter[0];
            newChildren = nodesBefore.concat(childNodes, nodesAfter);
        } else {
            newChildren = childNodes;
        }

        this._setChildren(newChildren);

        let firstNode = childNodes[0];
        let lastNode = childNodes[childNodes.length - 1];

        if (!nodeBefore) {
            this._firstNode = firstNode;
            this._firstToken = firstNode.firstToken;
        }

        if (!nodeAfter) {
            this._lastNode = lastNode;
            this._lastToken = lastNode.lastToken;
        }

        for (let i = 0; i < childNodes.length; i++) {
            let node = childNodes[i];
            let previousSibling = childNodes[i - 1] || nodeBefore || null;
            let nextSibling = childNodes[i + 1] || nodeAfter || null;
            let nextToken = (nextSibling ? nextSibling.firstToken : this._nextToken) || null;
            let previousToken = (previousSibling ? previousSibling.lastToken : this._previousToken) || null;

            node._onAdopt(this, nextSibling, previousSibling, nextToken, previousToken);
        }
    }

    _onAdopt(parentNode, nextSibling, previousSibling, nextToken, previousToken) {
        this._parentNode = parentNode;
        this._nextSibling = nextSibling;
        this._previousSibling = previousSibling;
        this._nextToken = nextToken;
        this._previousToken = previousToken;
    }

    _onAbandon() {
        this._parentNode = null;
        this._nextSibling = null;
        this._previousSibling = null;
        this._nextToken = null;
        this._previousToken = null;
    }

    _onNextSiblingChange(nextSibling) {
        this._nextSibling = nextSibling;
    }

    _onPreviousSiblingChange(previousSibling) {
        this._previousSibling = previousSibling;
    }

    _onNextTokenChange(nextToken) {
        this._nextToken = nextToken;
    }

    _onPreviousTokenChange(previousToken) {
        this._previousToken = previousToken;
    }
}

