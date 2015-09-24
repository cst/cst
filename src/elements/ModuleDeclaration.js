import Statement from './Statement';

/**
 * A module import or export declaration
 * @class
 * @name ModuleDeclaration
 */
export default class ModuleDeclaration extends Statement {
    isModuleDeclaration() {
        return true;
    }
}
