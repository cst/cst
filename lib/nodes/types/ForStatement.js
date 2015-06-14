import Statement from '../Statement';
import ElementList from '../ElementList';

export default class ForStatement extends Statement {
    constructor(childNodes) {
        super('ForStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'for');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let init = null;

        if (!children.isToken('Punctuator', ';')) {
            if (children.isNode('VariableDeclaration')) {
                init = children.currentElement;
                children.moveNext();
            } else {
                init = children.passExpression();
            }
            children.skipNonCode();
        }

        children.passToken('Punctuator', ';');
        children.skipNonCode();

        let test = null;
        if (!children.isToken('Punctuator', ';')) {
            test = children.passExpression();
            children.skipNonCode();
        }

        children.passToken('Punctuator', ';');
        children.skipNonCode();

        let update = null;
        if (!children.isToken('Punctuator', ')')) {
            update = children.passExpression();
            children.skipNonCode();
        }

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this._init = init;
        this._test = test;
        this._update = update;
        this._body = body;
    }

    get init() {
        return this._init;
    }

    get test() {
        return this._test;
    }

    get update() {
        return this._update;
    }

    get body() {
        return this._body;
    }
}
