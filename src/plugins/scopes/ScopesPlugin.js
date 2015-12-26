/* @flow */

import BasePlugin from '../BasePlugin';
import ScopesApi from './ScopesApi';
import type Program from '../../elements/types/Program';
import type Node from '../../elements/Node';

export default class ScopesPlugin extends BasePlugin {
    getPluginName(): string {
        return 'scopes';
    }

    getProgramApi(program: Program): ?Object {
        return new ScopesApi(program);
    }
}
