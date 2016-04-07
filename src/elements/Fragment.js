/* @flow */

import Element from './Element';

export default class Fragment extends Element {
    constructor(children: Array<any>) {
        super('Fragment', children);
        this.isFragment = true;
    }
}
