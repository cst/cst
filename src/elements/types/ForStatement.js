import Statement from '../Statement';

export default class ForStatement extends Statement {
    constructor(childNodes) {
        super('ForStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'for');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let init = null;

        if (!children.isToken('Punctuator', ';')) {
            if (children.isNode('VariableDeclaration')) {
                init = children.currentElement;
                children.moveNext();
            } else {
                init = children.passExpression();
            }
            children.skipNonCode();
        }

        children.passToken('Punctuator', ';');
        children.skipNonCode();

        let test = null;
        if (!children.isToken('Punctuator', ';')) {
            test = children.passExpression();
            children.skipNonCode();
        }

        children.passToken('Punctuator', ';');
        children.skipNonCode();

        let update = null;
        if (!children.isToken('Punctuator', ')')) {
            update = children.passExpression();
            children.skipNonCode();
        }

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this.init = init;
        this.test = test;
        this.update = update;
        this.body = body;
    }
}
