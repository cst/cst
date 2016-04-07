import ModuleSpecifier from '../ModuleSpecifier';

// tests are in ExportNamedDeclaration

export default class ExportNamespaceSpecifier extends ModuleSpecifier {
    constructor(childNodes) {
        super('ExportNamespaceSpecifier', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', '*');
        children.skipNonCode();
        children.passToken('Identifier', 'as');
        children.skipNonCode();
        let exported = children.passNode('Identifier');
        children.assertEnd();

        this.exported = exported;
    }
}
