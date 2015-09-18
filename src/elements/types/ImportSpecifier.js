import ModuleSpecifier from '../ModuleSpecifier';

// tests are in ImportDeclaration

export default class ImportSpecifier extends ModuleSpecifier {
    constructor(childNodes) {
        super('ImportSpecifier', childNodes);
    }

    _acceptChildren(children) {
        let local;
        let imported;

        if (children.isNode('Identifier')) {
            local = children.passNode();
            imported = local;
        } else {
            local = children.passToken();
            if (!local.name && local.value) {
                local.name = local.value;
            }
        }

        children.skipNonCode();

        if (!children.isEnd) {
            children.passToken('Identifier', 'as');
            children.skipNonCode();
            imported = children.passNode('Identifier');
        }

        children.assertEnd();

        this._local = local;
        this._imported = imported;
    }

    get imported() {
        return this._imported;
    }
}
