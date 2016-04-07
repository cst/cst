import Statement from '../Statement';
import getFunctionParams from './utils/getFunctionParams';

export default class FunctionDeclaration extends Statement {
    constructor(childNodes) {
        super('FunctionDeclaration', childNodes);
        this.expression = false;
        this.isFunction = true;
    }

    _acceptChildren(children) {
        let params;
        let async = false;
        let id = null;

        if (children.isToken('Identifier', 'async')) {
            async = true;
            children.passToken('Identifier', 'async');
            children.skipNonCode();
        }

        children.passToken('Keyword', 'function');
        children.skipNonCode();

        let generator = false;
        if (children.isToken('Punctuator', '*')) {
            generator = true;
            children.moveNext();
            children.skipNonCode();
        }

        if (children.isNode('Identifier')) {
            id = children.passNode('Identifier');
            children.skipNonCode();
        }

        params = getFunctionParams(children);
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this.async = async;
        this.id = id;
        this.params = params;
        this.body = body;
        this.generator = generator;
    }
}
