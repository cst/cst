/* @flow */

import Node from './Node';

/**
 * A specific in an import or export declaration
 * @class
 * @name ModuleSpecifier
 */
export default class ModuleSpecifier extends Node {
    get local(): Object {
        return this._local;
    }

    _local: Object;

    get isModuleSpecifier(): boolean {
        return true;
    }
}
