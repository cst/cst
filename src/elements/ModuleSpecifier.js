/* @flow */

import Node from './Node';

/**
 * A specific in an import or export declaration
 * @class
 * @name ModuleSpecifier
 */
export default class ModuleSpecifier extends Node {
    constructor(type, children) {
        super(type, children);
        this.isModuleSpecifier = true;
    }

    local: Object;
}
