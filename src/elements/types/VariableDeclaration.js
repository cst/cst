import Statement from '../Statement';

let validKinds = {
    var: true,
    let: true,
    const: true,
};

export default class VariableDeclaration extends Statement {

    // TODO: Can only have 1 declarator inside for ... in.

    constructor(childNodes) {
        super('VariableDeclaration', childNodes);
    }

    _acceptChildren(children) {
        let kind = children.passToken('Keyword', validKinds).value;
        children.skipNonCode();

        let declarations = [];

        declarations.push(children.passNode('VariableDeclarator'));
        children.skipNonCode();

        while (children.isToken('Punctuator', ',')) {
            children.passToken();
            children.skipNonCode();
            declarations.push(children.passNode('VariableDeclarator'));
            children.skipNonCode();
        }

        children.skipSemicolon();
        children.assertEnd();

        this.kind = kind;
        this.declarations = declarations;
    }
}
