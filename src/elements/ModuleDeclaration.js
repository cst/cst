/* @flow */

import Statement from './Statement';

/**
 * A module import or export declaration
 * @class
 * @name ModuleDeclaration
 */
export default class ModuleDeclaration extends Statement {
    constructor(type, children) {
        super(type, children);
        this.isModuleDeclaration = true;
    }
}
