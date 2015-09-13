import Expression from '../Expression';

export default class CallExpression extends Expression {
    constructor(childNodes) {
        super('CallExpression', childNodes);
    }

    _acceptChildren(children) {
        let args = [];

        let callee = children.passExpressionOrSuper();
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        if (!children.isToken('Punctuator', ')')) {
            args.push(children.passExpression());
            children.skipNonCode();
            while (!children.isToken('Punctuator', ')')) {
                children.passToken('Punctuator', ',');
                children.skipNonCode();
                args.push(children.passExpression());
                children.skipNonCode();
            }
        }
        children.passToken('Punctuator', ')');
        children.assertEnd();

        this._callee = callee;
        this._arguments = args;
    }

    get arguments() {
        return this._arguments.concat();
    }

    get callee() {
        return this._callee;
    }
}
