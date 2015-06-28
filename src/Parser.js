import {parse} from 'babel-core';

import {buildTokenList, buildElementTree} from './elementTree';

export default class Parser {
    constructor() {

    }

    parse(code, mode) {
        let ast = this._parseAst(code, mode);
        let tokens = this._processTokens(ast, code);
        return buildElementTree(ast, tokens);
    }

    _parseAst(code, mode) {
        let comments = [];
        let tokens = [];
        let opts = {
            onToken: tokens,
            onComment: comments,
            strictMode: !mode || mode === 'strict'
        };
        let ast = parse(code, opts);
        tokens.pop();
        ast.tokens = tokens;
        ast.comments = comments;
        return ast;
    }

    _processTokens(ast, code) {
        return buildTokenList(ast.tokens, ast.comments, code);
    }
}
