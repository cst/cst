import Statement from '../Statement';
import ElementList from '../ElementList';

export default class Program extends Statement {
    constructor(childNodes) {
        super('Program', childNodes);
    }

    _acceptChildren(children) {
        children.skipNonCode();

        let body = [];
        while (!children.isEnd) {
            body.push(children.passStatement());
            children.skipNonCode();
        }

        children.assertEnd();

        this._body = new ElementList(body);
    }

    get body() {
        return this._body;
    }
}
