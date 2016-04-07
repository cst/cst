/* @flow */

import type Identifier from '../../elements/types/Identifier';
import type Scope from './Scope';
import type Variable from './Variable';

export default class Reference {
    constructor({node, scope, read, write, type}: {
        node: Identifier,
        scope: Scope,
        read: boolean,
        write: boolean,
        type?: string
    }) {
        this.node = node;
        this.scope = scope;
        this.read = read;
        this.write = write;
        this.type = type;
    }

    node: Identifier;
    scope: Scope;
    variable: Variable;
    read: boolean;
    write: boolean;
    type: ?string;

    isRead(): boolean {
        return this.read;
    }

    isWrite(): boolean {
        return this.write;
    }

    isReadOnly(): boolean {
        return this.read && !this.write;
    }

    isWriteOnly(): boolean {
        return !this.read && this.write;
    }

    isReadWrite(): boolean {
        return this.read && this.write;
    }
}
