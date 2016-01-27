import Expression from '../Expression';
import getFunctionParams from './utils/getFunctionParams';

export default class FunctionExpression extends Expression {

    // TODO: get params from Property in case of setter

    constructor(childNodes) {
        super('FunctionExpression', childNodes);
        this._short = false;
        this._generatorFromProperty = false;
    }

    _acceptChildren(children) {
        let params = [];
        let id = null;
        let generator = false;
        let async = false;
        let short = false;

        if (children.isToken('Punctuator', '(')) {
            params = getFunctionParams(children);
            children.skipNonCode();
        } else {
            if (children.isToken('Identifier', 'async')) {
                async = true;
                children.passToken('Identifier', 'async');
                children.skipNonCode();
            }

            children.passToken('Keyword', 'function');
            children.skipNonCode();

            if (children.isToken('Punctuator', '*')) {
                generator = true;
                children.moveNext();
                children.skipNonCode();
            }

            if (children.isNode('Identifier')) {
                id = children.passNode();
                children.skipNonCode();
            }

            params = getFunctionParams(children);
            children.skipNonCode();
        }

        let body = children.passStatement();

        children.assertEnd();

        this._async = async;
        this._id = id;
        this._params = params;
        this._body = body;
        this._generator = generator;
        this._short = short;
    }

    _onSetParentElement(parentElement) {
        if (parentElement && (parentElement.type === 'Property' || parentElement.type === 'MethodDefinition')) {
            this._short = true;
            this._generatorFromProperty = parentElement._generator;
        } else {
            this._short = false;
            this._generatorFromProperty = false;
        }
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
        return false;
    }

    get id() {
        return this._id;
    }

    get generator() {
        return this._short ? this._generatorFromProperty : this._generator;
    }
}
