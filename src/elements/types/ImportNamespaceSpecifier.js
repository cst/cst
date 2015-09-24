import ModuleSpecifier from '../ModuleSpecifier';

export default class ImportNamespaceSpecifier extends ModuleSpecifier {
    constructor(childNodes) {
        super('ImportNamespaceSpecifier', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', '*');
        children.skipNonCode();
        children.passToken('Identifier', 'as');
        children.skipNonCode();
        let local = children.passNode('Identifier');
        children.assertEnd();

        this._local = local;
    }
}
