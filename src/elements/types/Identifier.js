import Expression from '../Expression';

export default class Identifier extends Expression {
    constructor(childNodes) {
        super('Identifier', childNodes);
        this.isPattern = true;
        this.isAssignable = true;
    }

    _acceptChildren(children) {
        let name = children.passToken('Identifier').value;
        children.assertEnd();
        this.name = name;
    }
}
