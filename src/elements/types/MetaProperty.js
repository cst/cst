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

        this.meta = meta;
        this.property = property;
    }
}
