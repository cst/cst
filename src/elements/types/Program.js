/* @flow */

import type Token from '../Token';
import type Node from '../Node';
import type Element from '../Element';
import type ElementAssert from '../ElementAssert';
import type BasePlugin from '../../plugins/BasePlugin';
import Statement from '../Statement';
import Traverse from '../../Traverse';

export default class Program extends Statement {
    constructor(childNodes: Array<any>) {
        super('Program', childNodes);

        this._isProgram = true;
        this._traverse = new Traverse();
        this._traverse.addElements(childNodes);
        this._eventListeners = {};
    }

    _eventListeners: {[key: string]: Function[]};
    _traverse: Traverse;
    _body: Array<any>;
    _isProgram: boolean;
    plugins: {[key: string]: BasePlugin};

    _acceptPlugins(plugins: {[key: string]: BasePlugin}) {
        this.plugins = plugins;
    }

    _acceptChildren(children: ElementAssert) {
        if (children.isToken('Hashbang')) {
            children.passToken('Hashbang');
        }

        children.skipNonCode();

        let directives = [];
        while (children.isNode('Directive')) {
            directives.push(children.passNode());
            children.skipNonCode();
        }

        let body = [];
        while (children.isStatement()) {
            body.push(children.passStatement());
            children.skipNonCode();
        }

        children.passToken('EOF');
        children.assertEnd();

        this.body = body;
        this.directives = directives;
    }

    /**
     * Returns node list with specified type from the tree.
     *
     * @param {String} type
     * @returns {Node[]}
     */
    selectNodesByType(type: string): Array<Node> {
        return this._traverse.selectNodesByType(type);
    }

    /**
     * Returns tokens list with specified type from the tree.
     *
     * @param {String} type
     * @returns {Token[]}
     */
    selectTokensByType(type: string): Array<Token> {
        return this._traverse.selectTokensByType(type);
    }

    _addElementsToProgram(elements: Array<Element>) {
        this._traverse.addElements(elements);
        this._emit('elements-add', elements);
    }

    _removeElementsFromProgram(elements: Array<Element>) {
        this._traverse.removeElements(elements);
        this._emit('elements-remove', elements);
    }

    on(eventName: string, callback: Function) {
        if (this._eventListeners[eventName]) {
            this._eventListeners[eventName].push(callback);
        } else {
            this._eventListeners[eventName] = [callback];
        }
    }

    off(eventName: string, callback: Function) {
        if (this._eventListeners[eventName]) {
            this._eventListeners[eventName] = this._eventListeners[eventName].filter((handler) => {
                return callback !== handler;
            });
        }
    }

    _emit(eventName: string, data: any) {
        var handlers = this._eventListeners[eventName];
        if (handlers) {
            for (let i = 0; i < handlers.length; i++) {
                handlers[i](data);
            }
        }
    }
};
