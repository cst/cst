import ModuleSpecifier from '../ModuleSpecifier';

export default class ImportDefaultSpecifier extends ModuleSpecifier {
    constructor(childNodes) {
        super('ImportDefaultSpecifier', childNodes);
    }

    _acceptChildren(children) {
        let local = children.passNode('Identifier');
        children.assertEnd();

        this._local = local;
    }
}
