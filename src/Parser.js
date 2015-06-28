import {parse} from 'babel-core';

import {buildTokenList, buildElementTree} from './elementTree';

export default class Parser {
    constructor() {
        this._strictModeEnabled = true;
    }

    isStrictModeEnabled() {
        return this._strictModeEnabled;
    }

    enableStrictMode() {
        this._strictModeEnabled = true;
    }

    disableStrictMode() {
        this._strictModeEnabled = false;
    }

    parse(code) {
        let ast = this._parseAst(code);
        let tokens = this._processTokens(ast, code);
        return buildElementTree(ast, tokens);
    }

    _parseAst(code) {
        let comments = [];
        let tokens = [];
        let opts = {
            onToken: tokens,
            onComment: comments,
            strictMode: this._strictModeEnabled
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
