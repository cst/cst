import Node from '../Node';

export default class TemplateElement extends Node {
    constructor(childNodes) {
        super('TemplateElement', childNodes);
    }

    _acceptChildren(children) {
        let templateToken = children.passToken('Template');

        let tail = false;
        let value = {
            cooked: templateToken.value,
            raw: templateToken.getSourceCode(),
        };

        children.assertEnd();

        this.tail = tail;
        this.value = value;
    }
}
