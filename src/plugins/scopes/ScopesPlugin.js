/* @flow */

import BasePlugin from '../BasePlugin';
import ScopesApi from './ScopesApi';
import type Program from '../../elements/types/Program';

export default class ScopesPlugin extends BasePlugin {
    getPluginName(): string {
        return 'scopes';
    }

    createApiForProgram(program: Program): ?Object {
        return new ScopesApi(program);
    }
}
