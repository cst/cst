import ModuleSpecifier from '../ModuleSpecifier';

// tests are in ExportNamedDeclaration

export default class ExportDefaultSpecifier extends ModuleSpecifier {
    constructor(childNodes) {
        super('ExportDefaultSpecifier', childNodes);
    }

    _acceptChildren(children) {
        let exported = children.passNode('Identifier');
        children.assertEnd();

        this.exported = exported;
    }
}
