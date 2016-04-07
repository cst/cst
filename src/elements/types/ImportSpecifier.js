import ModuleSpecifier from '../ModuleSpecifier';

// tests are in ImportDeclaration

export default class ImportSpecifier extends ModuleSpecifier {
    constructor(childNodes) {
        super('ImportSpecifier', childNodes);
    }

    _acceptChildren(children) {
        let local;
        let imported = children.passNode('Identifier');

        if (!children.isEnd) {
            children.skipNonCode();
            children.passToken('Identifier', 'as');
            children.skipNonCode();
            local = children.passNode('Identifier');
        } else {
            local = imported;
        }

        children.assertEnd();

        this.local = local;
        this.imported = imported;
    }
}
