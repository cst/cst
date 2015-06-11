import Expression from '../Expression';
import NodeList from '../NodeList';

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
                children.assertPattern();
                params.push(children.currentNode);
                children.moveNext();
                children.skipNonCode();
                while (!children.isToken('Punctuator', ')')) {
                    children.assertToken('Punctuator', ',');
                    children.moveNext();
                    children.skipNonCode();
                    children.assertPattern();
                    params.push(children.currentNode);
                    children.moveNext();
                }
            }
            children.moveNext();
            children.skipNonCode();
        } else if (children.currentNode.isPattern) {
            params.push(children.currentNode);
            children.moveNext();
            children.skipNonCode();
        }

        children.assertToken('Punctuator', '=>');
        children.skipNonCode();

        this._params = new NodeList(params);
    }

    get params() {
        return this._params;
    }

    get id() {
        return null;
    }

    get generator() {
        return false;
    }

    get expression() {
        return this._expression;
    }
}
