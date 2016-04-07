import Node from '../Node';

export default class SwitchCase extends Node {
    constructor(childNodes) {
        super('SwitchCase', childNodes);
    }

    _acceptChildren(children) {
        let test = null;

        if (children.isToken('Keyword', 'case')) {
            children.passToken();
            children.skipNonCode();

            test = children.passExpression();
            children.skipNonCode();
        } else {
            children.passToken('Keyword', 'default');
            children.skipNonCode();
        }

        children.passToken('Punctuator', ':');
        children.skipNonCode();

        let consequent = [];

        while (!children.isEnd) {
            consequent.push(children.passStatement());
            children.skipNonCode();
        }

        children.assertEnd();

        this.test = test;
        this.consequent = consequent;
    }
}
