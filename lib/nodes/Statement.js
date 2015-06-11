import Node from './node';

export default class Statement extends Node {
    get isStatement() {
        return true;
    }
}
