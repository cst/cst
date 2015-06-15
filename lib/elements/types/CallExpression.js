import Expression from '../Expression';
import ElementList from '../ElementList';

export default class CallExpression extends Expression {
    constructor(childNodes) {
        super('CallExpression', childNodes);
    }

    _acceptChildren(children) {
        let args = [];

        let callee = children.passExpression();
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
        this._arguments = new ElementList(args);
    }

    get arguments() {
        return this._arguments;
    }

    get callee() {
        return this._callee;
    }
}
