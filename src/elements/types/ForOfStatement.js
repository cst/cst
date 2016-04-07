import Statement from '../Statement';

export default class ForOfStatement extends Statement {
    constructor(childNodes) {
        super('ForOfStatement', childNodes);
        this.each = false;
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'for');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let left;
        if (children.isNode('VariableDeclaration')) {
            left = children.currentElement;
            children.moveNext();
        } else {
            left = children.passAssignable();
        }
        children.skipNonCode();

        children.passToken('Identifier', 'of');
        children.skipNonCode();

        let right = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this.left = left;
        this.right = right;
        this.body = body;
    }
}
