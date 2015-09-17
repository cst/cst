import Expression from '../Expression';

export default class MetaProperty extends Expression {
    constructor(childNodes) {
        super('MetaProperty', childNodes);
    }

    _acceptChildren(children) {
        let meta = children.passNode('Identifier');
        children.skipNonCode();
        children.passToken('Punctuator', '.');
        children.skipNonCode();
        let property = children.passNode('Identifier');
        children.assertEnd();

        this._meta = meta;
        this._property = property;
    }

    get meta() {
        return this._meta;
    }

    get property() {
        return this._property;
    }
}
