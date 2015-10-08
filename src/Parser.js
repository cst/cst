import {parse} from 'babylon';

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
        let opts = {
            sourceType: 'module',
            features: {
                'es7.asyncFunctions': true,
                'es7.classProperties': true,
                'es7.comprehensions': true,
                'es7.decorators': true,
                'es7.exponentiationOperator': true,
                'es7.exportExtensions': true,
                'es7.functionBind': true,
                'es7.objectRestSpread': true,
                'es7.trailingFunctionCommas': true,
            },
            plugins: {jsx: true, flow: true},
            strictMode: this._strictModeEnabled
        };
        let ast = parse(code, opts);
        let program = ast.program;
        program.tokens = ast.tokens;
        return program;
    }

    _processTokens(ast, code) {
        return buildTokenList(ast.tokens, code);
    }
}
