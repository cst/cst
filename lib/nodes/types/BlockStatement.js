import Statement from '../Statement';
import ElementList from '../ElementList';

export default class BlockStatement extends Statement {
    constructor(childNodes) {
        super('BlockStatement', childNodes);
    }

    _acceptChildren(children) {
        var body = [];
        children.assertToken('Punctuator', '{');
        children.moveNext();
        children.skipNonCode();
        while (!children.isToken('Punctuator', '}')) {
            children.assertStatement();
            body.push(children.currentElement);
            children.moveNext();
            children.skipNonCode();
        }
        children.moveNext();
        children.assertEnd();
        this._body = new ElementList(body);
    }

    get body() {
        return this._body;
    }
}
