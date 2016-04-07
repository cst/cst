import Expression from '../Expression';
import getFunctionParams from './utils/getFunctionParams';

export default class ArrowFunctionExpression extends Expression {
    constructor(childNodes) {
        super('ArrowFunctionExpression', childNodes);
        this.id = null;
        this.generator = false;
        this.isFunction = true;
    }

    _acceptChildren(children) {
        let params = [];
        let async = false;

        if (children.isToken('Identifier', 'async')) {
            async = true;
            children.passToken('Identifier', 'async');
            children.skipNonCode();
        }

        if (children.isToken('Punctuator', '(')) {
            params = getFunctionParams(children);
            children.skipNonCode();
        } else if (children.currentElement.isPattern) {
            params.push(children.currentElement);
            children.moveNext();
            children.skipNonCode();
        }

        children.passToken('Punctuator', '=>');
        children.skipNonCode();

        let expression = !children.currentElement.isStatement;

        let body;
        if (expression) {
            body = children.passExpression();
        } else {
            body = children.passStatement();
        }

        children.assertEnd();

        this.async = async;
        this.params = params;
        this.body = body;
        this.expression = expression;
    }
}
