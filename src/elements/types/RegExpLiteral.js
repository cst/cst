import Expression from '../Expression';

export default class RegExpLiteral extends Expression {
    constructor(childNodes) {
        super('RegExpLiteral', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken('RegularExpression');
        let pattern = children.currentElement.value.pattern;
        let flags = children.currentElement.value.flags;
        let extra = {
            rawValue: undefined,
            raw: children.currentElement.getSourceCode(),
        };

        children.moveNext();
        children.assertEnd();

        this.extra = extra;
        this.pattern = pattern;
        this.flags = flags;
    }
}
