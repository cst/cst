import {parse} from 'babel-jscs';
import {buildTokenList, buildElementTree} from './elementTree';

export default class Parser {
    constructor() {

    }

    parse(code) {
        var tree = this._parseAst(code);
        var tokens = this._processTokens(tree, code);
        return buildElementTree(tree, tokens);
    }

    _parseAst(code) {
        return parse(code, {comment: true, tokens: true, range: true});
    }

    _processTokens(tree, code) {
        return buildTokenList(tree.tokens, tree.comments, code);
    }

}
