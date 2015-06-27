import {parse} from 'babel-jscs';
import {buildTokenList, buildElementTree} from './elementTree';

export default class Parser {
    constructor() {

    }

    parse(code, mode) {
        var tree = this._parseAst(code, mode);
        var tokens = this._processTokens(tree, code);
        return buildElementTree(tree, tokens);
    }

    _parseAst(code, mode) {
        return parse(code, mode);
    }

    _processTokens(tree, code) {
        return buildTokenList(tree.tokens, tree.comments, code);
    }

}
