import Node from './Node';

/**
 * A specific in an import or export declaration
 * @class
 * @name ModuleSpecifier
 */
export default class ModuleSpecifier extends Node {
    get local() {
        return this._local;
    }

    get isModuleSpecifier() {
        return true;
    }
}
