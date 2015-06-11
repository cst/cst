export default class NodeList {
    constructor(nodes) {
        this._nodes = nodes;
    }

    get length() {
        return this._nodes.length;
    }

    get(index) {
        return this._nodes[index];
    }

    forEach(callback, context) {
        this._nodes.forEach(callback, context);
    }

    map(callback, context) {
        return this._nodes.map(callback, context);
    }

    reduce(callback, initialObj) {
        return this._nodes.reduce(callback, initialObj);
    }
}
