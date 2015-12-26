/* @flow */

import type Program from '../elements/types/Program';

export default class BasePlugin {
    getPluginName(): string {
        return 'basePlugin';
    }

    getProgramApi(program: Program): ?Object {}
}
