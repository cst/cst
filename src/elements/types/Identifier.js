import Expression from '../Expression';

export default class Identifier extends Expression {
    constructor(childNodes) {
        super('Identifier', childNodes);
        this.isPattern = true;
        this.isAssignable = true;
    }

    _acceptChildren(children) {
        let name;

        children.assertToken();

        // @see https://github.com/babel/babylon/issues/18
        switch (children.currentElement.type) {
            case 'Identifier':
                name = children.currentElement.value;
                break;
            case 'Boolean':
            case 'Null':
                name = children.currentElement._sourceCode;
                break;
            default:
                children.assertToken('Identifier');
        }
        children.passToken();

        children.assertEnd();
        this.name = name;
    }
}
