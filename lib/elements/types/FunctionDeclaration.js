import Statement from '../Statement';
import getFunctionParams from './utils/getFunctionParams';

export default class FunctionDeclaration extends Statement {
    constructor(childNodes) {
        super('FunctionDeclaration', childNodes);
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

        let id = children.passNode('Identifier');
        children.skipNonCode();

        params = getFunctionParams(children);
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this._id = id;
        this._params = params;
        this._body = body;
        this._generator = generator;
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
        return this._generator;
    }
}
