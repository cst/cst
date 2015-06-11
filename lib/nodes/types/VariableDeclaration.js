import Statement from '../Statement';

export default class VariableDeclaration extends Statement {
    constructor(childNodes) {
        super('VariableDeclaration', childNodes);
    }

    _acceptChildren(children) {

    }
}
