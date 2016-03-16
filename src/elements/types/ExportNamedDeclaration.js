import ModuleDeclaration from '../ModuleDeclaration';

export default class ExportNamedDeclaration extends ModuleDeclaration {
    constructor(childNodes) {
        super('ExportNamedDeclaration', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'export');
        children.skipNonCode();

        let declaration = null;
        let specifiers = [];
        let source = null;

        if (children.isNode('VariableDeclaration') ||
            children.isNode('FunctionDeclaration') ||
            children.isNode('ClassDeclaration')) {
            declaration = children.passStatement();
        } else {
            // es2015 exports
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
            } else {
                // es2016 export from
                specifiers.push(children.passModuleSpecifier());
            }
            children.skipNonCode();

            if (children.isToken('Identifier', 'from')) {
                children.passToken('Identifier', 'from');
                children.skipNonCode();
                source = children.passNode('StringLiteral');
                if (!children.isEnd) {
                    children.skipNonCode();
                    children.passToken('Punctuator', ';');
                }
            } else if (!children.isEnd) {
                children.passToken('Punctuator', ';');
            }
        }

        children.assertEnd();

        this._declaration = declaration;
        this._specifiers = specifiers;
        this._source = source;
    }

    get declaration() {
        return this._declaration;
    }

    get specifiers() {
        return this._specifiers;
    }

    get source() {
        return this._source;
    }
}
