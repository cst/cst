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
        // let is not always a keyword. See:
        // https://github.com/babel/babel/issues/6719
        // https://github.com/babel/babel/pull/9375
        let kind;
        if (children.currentElement.value === 'let') {
            kind = children.passToken('Identifier', validKinds).value;
        } else {
            kind = children.passToken('Keyword', validKinds).value;
        }
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
