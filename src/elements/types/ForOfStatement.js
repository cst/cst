import Statement from '../Statement';

export default class ForOfStatement extends Statement {
    constructor(childNodes) {
        super('ForOfStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'for');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let left;
        if (children.isNode('VariableDeclaration')) {
            left = children.currentElement;
            children.moveNext();
        } else {
            left = children.passAssignable();
        }
        children.skipNonCode();

        children.passToken('Identifier', 'of');
        children.skipNonCode();

        let right = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this._left = left;
        this._right = right;
        this._body = body;
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    get body() {
        return this._body;
    }

    get each() {
        return false;
    }
}
