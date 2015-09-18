import ModuleDeclaration from '../ModuleDeclaration';

export default class ExportDefaultDeclaration extends ModuleDeclaration {
    constructor(childNodes) {
        super('ExportDefaultDeclaration', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'export');
        children.skipNonCode();
        children.passToken('Keyword', 'default');
        children.skipNonCode();

        let declaration;
        if (children.currentElement.type === 'FunctionDeclaration' ||
            children.currentElement.type === 'ClassDeclaration') {
            declaration = children.passStatement();
        } else {
            declaration = children.passExpression();
        }

        if (!children.isEnd) {
            children.skipNonCode();
            children.passToken('Punctuator', ';');
        }
        children.assertEnd();

        this._declaration = declaration;
    }

    get declaration() {
        return this._declaration;
    }
}
