import Expression from '../Expression';
import getFunctionParams from './utils/getFunctionParams';

export default class ArrowFunctionExpression extends Expression {
    constructor(childNodes) {
        super('ArrowFunctionExpression', childNodes);
    }

    _acceptChildren(children) {
        let params = [];
        let async = false;

        if (children.isToken('Identifier', 'async')) {
            async = true;
            children.passToken('Identifier', 'async');
            children.skipNonCode();
        }

        if (children.isToken('Punctuator', '(')) {
            params = getFunctionParams(children);
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

        this._async = async;
        this._params = params;
        this._body = body;
        this._expression = expression;
    }

    get async() {
        return this._async;
    }

    get params() {
        return this._params.concat();
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
