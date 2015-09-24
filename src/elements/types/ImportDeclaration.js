import ModuleDeclaration from '../ModuleDeclaration';

export default class ImportDeclaration extends ModuleDeclaration {
    constructor(childNodes) {
        super('ImportDeclaration', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'import');
        children.skipNonCode();

        let specifiers = [];
        let source = null;

        if (children.isNode('ImportDefaultSpecifier')) {
            specifiers.push(children.passModuleSpecifier());
            children.skipNonCode();
            if (children.isToken('Punctuator', ',')) {
                children.moveNext();
                children.skipNonCode();
            }
        } else if (children.isNode('ImportNamespaceSpecifier')) {
            specifiers.push(children.passModuleSpecifier());
            children.skipNonCode();
        }

        if (children.isToken('Punctuator', '{')) {
            children.passToken('Punctuator', '{');
            children.skipNonCode();
            while (!children.isToken('Punctuator', '}')) {
                specifiers.push(children.passModuleSpecifier());
                children.skipNonCode();
                if (children.isToken('Punctuator', ',')) {
                    children.moveNext();
                    children.skipNonCode();
                }
            }
            children.passToken('Punctuator', '}');
            children.skipNonCode();
        }

        if (children.isToken('Identifier', 'from')) {
            children.passToken('Identifier', 'from');
            children.skipNonCode();
        }

        source = children.passNode('Literal');
        if (!children.isEnd) {
            children.skipNonCode();
            children.passToken('Punctuator', ';');
        }

        children.assertEnd();

        this._specifiers = specifiers;
        this._source = source;
    }

    get specifiers() {
        return this._specifiers;
    }

    get source() {
        return this._source;
    }
}
