import Expression from '../Expression';

var tokenTypes = {
    Boolean: true,
    RegularExpression: true,
    String: true,
    Null: true,
    Numeric: true
};

export default class Literal extends Expression {
    constructor(childNodes) {
        super('Literal', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken();
        if (!tokenTypes[children.currentNode.type]) {
            throw new Error(`Invalid literal token type ${children.currentNode.type}`);
        }
        children.moveNext();
        children.assertEnd();
    }
}
