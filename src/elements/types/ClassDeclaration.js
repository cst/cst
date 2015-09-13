import Statement from '../Statement';

export default class ClassDeclaration extends Statement {
    constructor(childNodes) {
        super('ClassDeclaration', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'class');
        children.skipNonCode();
        let id = children.passNode('Identifier');
        children.skipNonCode();
        let superClass = null;
        if (children.isToken('Keyword', 'extends')) {
            children.passToken('Keyword', 'extends');
            children.skipNonCode();
            superClass = children.passExpression();
            children.skipNonCode();
        }

        let body = children.passNode('ClassBody');
        children.assertEnd();

        this._id = id;
        this._superClass = superClass;
        this._body = body;
    }

    get id() {
        return this._id;
    }

    get superClass() {
        return this._superClass;
    }

    get body() {
        return this._body;
    }
}
