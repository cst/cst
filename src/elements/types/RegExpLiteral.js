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
            raw: children.currentElement.sourceCode
        };

        children.moveNext();
        children.assertEnd();

        this._extra = extra;
        this._pattern = pattern;
        this._flags = flags;
    }

    get extra() {
        return this._extra;
    }

    get pattern() {
        return this._pattern;
    }

    get flags() {
        return this._flags;
    }
}
