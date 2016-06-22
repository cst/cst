import Node from '../Node';

export default class ObjectProperty extends Node {
    constructor(childNodes) {
        super('ObjectProperty', childNodes);
    }

    _acceptChildren(children) {
        let key;
        let value;
        let shorthand = false;
        let computed = false;

        // Hack :/
        // See https://github.com/babel/babylon/issues/49
        if (
            children._elements.length === 2 &&
            children._elements[1].type === 'AssignmentPattern'
        ) {
            children.currentElement.getSourceCode = () => '';
        }

        computed = children.isToken('Punctuator', '[');
        key = readKey(children);

        if (children.isNode('AssignmentPattern')) {
            value = children.passNode();
        } else if (children.isEnd && key.type === 'Identifier') {
            shorthand = true;
            value = key;
        } else {
            children.skipNonCode();
            if (children.isNode('FunctionExpression')) {
                value = children.passNode('FunctionExpression');
            } else {
                children.passToken('Punctuator', ':');
                children.skipNonCode();
                if (children.currentElement.isPattern) {
                    value = children.passPattern();
                } else {
                    value = children.passExpression();
                }
            }
        }

        children.assertEnd();

        this.key = key;
        this.value = value;
        this.shorthand = shorthand;
        this.computed = computed;
    }
}

function readKey(children) {
    if (
        children.isNode('StringLiteral') ||
        children.isNode('NumericLiteral') ||
        children.isNode('Identifier')
    ) {
        return children.passNode();
    } else {
        children.passToken('Punctuator', '[');
        children.skipNonCode();
        let result = children.passExpression();
        children.skipNonCode();
        children.passToken('Punctuator', ']');
        return result;
    }
}
