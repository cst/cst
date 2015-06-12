import Expression from '../Expression';
import ElementList from '../ElementList';

export default class FunctionExpression extends Expression {
    constructor(childNodes) {
        super('FunctionExpression', childNodes);
    }

    _acceptChildren(children) {
        let params = [];

        children.passToken('Keyword', 'function');
        children.skipNonCode();

        let generator = false;
        if (children.isToken('Punctuator', '*')) {
            generator = true;
            children.moveNext();
            children.skipNonCode();
        }

        let id = false;
        if (children.isNode('Identifier')) {
            id = children.passNode();
            children.skipNonCode();
        }

        children.passToken('Punctuator', '(');
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

        let body = children.passStatement();

        children.assertEnd();

        this._id = id;
        this._params = new ElementList(params);
        this._body = body;
        this._generator = generator;
    }

    get params() {
        return this._params;
    }

    get body() {
        return this._body;
    }

    get expression() {
        return false;
    }

    get id() {
        return this._id;
    }

    get generator() {
        return this._generator;
    }

}
