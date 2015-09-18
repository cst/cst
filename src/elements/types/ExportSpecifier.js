import ModuleSpecifier from '../ModuleSpecifier';

// tests are in ExportNamedDeclaration

export default class ExportSpecifier extends ModuleSpecifier {
    constructor(childNodes) {
        super('ExportSpecifier', childNodes);
    }

    _acceptChildren(children) {
        let local;
        let exported;

        if (children.isNode('Identifier')) {
            local = children.passNode();
            exported = local;
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
            exported = children.passNode('Identifier');
        }

        children.assertEnd();

        this._local = local;
        this._exported = exported;
    }

    get exported() {
        return this._exported;
    }
}
