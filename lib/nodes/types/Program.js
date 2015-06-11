import Statement from '../Statement';
import NodeList from '../NodeList';

export default class Program extends Statement {
    constructor(childNodes) {
        super('Program', childNodes);
    }

    _acceptChildren(children) {
        var body = [];
        children.skipNonCode();
        while (!children.isEnd) {
            children.assertStatement();
            body.push(children.currentNode);
            children.moveNext();
            children.skipNonCode();
        }
        children.assertEnd();
        this._body = new NodeList(body);
    }

    get body() {
        return this._body;
    }
}
