import Statement from '../Statement';

export default class SwitchStatement extends Statement {
    constructor(childNodes) {
        super('SwitchStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'switch');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let discriminant = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        children.passToken('Punctuator', '{');
        children.skipNonCode();

        let cases = [];
        while (!children.isToken('Punctuator', '}')) {
            cases.push(children.passNode('SwitchCase'));
            children.skipNonCode();
        }

        children.passToken('Punctuator', '}');
        children.assertEnd();

        this.discriminant = discriminant;
        this.cases = cases;
    }
}
