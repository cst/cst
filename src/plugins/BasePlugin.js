/* @flow */

import type Program from '../elements/types/Program';

/**
 * Plugin abstract class.
 * Every plugin should implement this interface.
 * All plugins inside cst package should extend this class.
 */
export default class BasePlugin {
    /**
     * Returns plugin name.
     * Plugin's API will be accessible using `program.plugins.<pluginName>`.
     */
    get pluginName(): string {
        return 'basePlugin';
    }

    /**
     * Returns plugin API.
     * Plugin's API will be accessible using `program.plugins.<pluginName>`.
     */
    getProgramApi(program: Program): ?Object {}
}
