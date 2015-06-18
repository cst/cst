import Element from './Element';

export default class Fragment extends Element {
    constructor(children) {
        super('Fragment', children);
    }

    isFragment() {
        return true;
    }
}
