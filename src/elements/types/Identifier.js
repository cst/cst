import Expression from '../Expression';

export default class Identifier extends Expression {
    constructor(childNodes) {
        super('Identifier', childNodes);
        this.isPattern = true;
        this.isAssignable = true;
    }

    _acceptChildren(children) {
        let name;

        if (children.isToken('Identifier')) {
            name = children.passToken('Identifier').value;

        // TODO: temporary fix,
        // until https://github.com/babel/babylon/issues/18 is resolved
        } else {
            name = children.passToken('Boolean').value;
        }

        children.assertEnd();
        this.name = name;
    }
}
