import ModuleDeclaration from '../ModuleDeclaration';

export default class ExportAllDeclaration extends ModuleDeclaration {
    constructor(childNodes) {
        super('ExportAllDeclaration', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'export');
        children.skipNonCode();
        children.passToken('Punctuator', '*');
        children.skipNonCode();
        children.passToken('Identifier', 'from');
        children.skipNonCode();
        let source = children.passNode('Literal');
        if (!children.isEnd) {
            children.skipNonCode();
            children.passToken('Punctuator', ';');
        }
        children.assertEnd();

        this._source = source;
    }

    get source() {
        return this._source;
    }
}
