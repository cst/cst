import Node from '../Node';
import ElementList from '../ElementList';
import getFunctionParams from './utils/getFunctionParams';

const getterAndSetter = {
    get: true,
    set: true
};

export default class Property extends Node {
    constructor(childNodes) {
        super('Property', childNodes);
    }

    _acceptChildren(children) {
        let key;
        let value;
        let shorthand = false;
        let method = false;
        let kind;
        let methodParams = [];

        if (children.isToken('Identifier', getterAndSetter)) {
            kind = children.currentElement.value;
            children.passToken();
            children.skipNonCode();

            key = children.passNode();
            children.skipNonCode();

            children.passToken('Punctuator', '(');
            children.skipNonCode();

            if (kind === 'set') {
                methodParams = [children.passPattern()];
                children.skipNonCode();
            }

            children.passToken('Punctuator', ')');
            children.skipNonCode();
            value = children.passNode('FunctionExpression');
        } else {
            kind = 'init';
            if (children.currentElement.type !== 'Literal') {
                children.assertNode('Identifier');
            }

            key = children.passNode();

            if (children.isEnd) {
                shorthand = true;
                value = key;
            } else {
                children.skipNonCode();
                if (children.isToken('Punctuator', '(')) {
                    method = true;
                    methodParams = getFunctionParams(children);
                    children.skipNonCode();
                    value = children.passNode('FunctionExpression');
                } else {
                    children.passToken('Punctuator', ':');
                    children.skipNonCode();
                    value = children.passExpression();
                }
            }
        }

        children.assertEnd();

        this._kind = kind;
        this._key = key;
        this._value = value;
        this._shorthand = shorthand;
        this._method = method;
        this._methodParams = new ElementList(methodParams);
    }

    get key() {
        return this._key;
    }

    get value() {
        return this._value;
    }

    get kind() {
        return this._kind;
    }

    get shorthand() {
        return this._shorthand;
    }

    get method() {
        return this._method;
    }

    /**
     * Warning: this property exists in Property due to esprima implementation of properties.
     * Should be removed once we find better parser.
     * @deprecated
     * @returns {Pattern[]}
     */
    get methodParams() {
        return this._methodParams;
    }
}
