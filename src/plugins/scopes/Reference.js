/* @flow */

import type Identifier from '../../elements/types/Identifier';
import type Scope from './Scope';
import type Variable from './Variable';

export default class Reference {
    constructor({node, scope, read, write}: {
        node: Identifier,
        scope: Scope,
        read: boolean,
        write: boolean
    }) {
        this._node = node;
        this._scope = scope;
        this._read = read;
        this._write = write;
    }

    _node: Identifier;
    _scope: Scope;
    _variable: Variable;
    _read: boolean;
    _write: boolean;

    get node(): Identifier {
        return this._node;
    }

    get scope(): Scope {
        return this._scope;
    }

    get variable(): Variable {
        return this._variable;
    }

    get isRead(): boolean {
        return this._read;
    }

    get isWrite(): boolean {
        return this._write;
    }

    get isReadOnly(): boolean {
        return this._read && !this._write;
    }

    get isWriteOnly(): boolean {
        return !this._read && this._write;
    }

    get isReadWrite(): boolean {
        return this._read && this._write;
    }
}
