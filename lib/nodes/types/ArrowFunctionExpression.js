import Expression from '../Expression';
import ElementList from '../ElementList';

export default class ArrowFunctionExpression extends Expression {
    constructor(childNodes) {
        super('ArrowFunctionExpression', childNodes);
    }

    _acceptChildren(children) {
        let params = [];

        if (children.isToken('Punctuator', '(')) {
            children.moveNext();
            children.skipNonCode();
            if (!children.isToken('Punctuator', ')')) {
                params.push(children.passPattern());
                children.skipNonCode();
                while (!children.isToken('Punctuator', ')')) {
                    children.passToken('Punctuator', ',');
                    children.skipNonCode();
                    params.push(children.passPattern());
                    children.skipNonCode();
                }
            }
            children.moveNext();
            children.skipNonCode();
        } else if (children.currentElement.isPattern) {
            params.push(children.currentElement);
            children.moveNext();
            children.skipNonCode();
        }

        children.passToken('Punctuator', '=>');
        children.skipNonCode();

        let expression = !children.currentElement.isStatement;

        let body;
        if (expression) {
            body = children.passExpression();
        } else {
            body = children.passStatement();
        }

        children.assertEnd();

        this._params = new ElementList(params);
        this._body = body;
        this._expression = expression;
    }

    get params() {
        return this._params;
    }

    get body() {
        return this._body;
    }

    get expression() {
        return this._expression;
    }

    get id() {
        return null;
    }

    get generator() {
        return false;
    }

}
