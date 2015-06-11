import babel from 'babel-core';
import {parse} from 'esprima-fb';
import {buildTokenList, addWhitespaces, buildNodeTree} from './nodeTree';

export default class Parser {
    constructor() {

    }

    parse(code) {
        var tree = parse(code, {comment: true, tokens: true, range: true});
        var tokens = addWhitespaces(buildTokenList(tree.tokens, tree.comments), code);
        return buildNodeTree(tree, tokens);
    }

}
