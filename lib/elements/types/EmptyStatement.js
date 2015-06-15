import Statement from '../Statement';

export default class EmptyStatement extends Statement {
    constructor(childNodes) {
        super('EmptyStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', ';');
        children.assertEnd();
    }
}
