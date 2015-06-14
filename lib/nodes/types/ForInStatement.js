import Statement from '../Statement';
import ElementList from '../ElementList';

export default class ForInStatement extends Statement {
    constructor(childNodes) {
        super('ForInStatement', childNodes);
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

        children.passToken('Keyword', 'in');
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
