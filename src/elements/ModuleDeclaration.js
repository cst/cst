/* @flow */

import Statement from './Statement';

/**
 * A module import or export declaration
 * @class
 * @name ModuleDeclaration
 */
export default class ModuleDeclaration extends Statement {
    get isModuleDeclaration(): boolean {
        return true;
    }
}
