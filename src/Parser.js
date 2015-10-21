import {parse} from 'babylon';

import {buildTokenList, buildElementTree} from './elementTree';

/**
 * @typedef {Object} CSTParserOptions
 * @property {String} sourceType Type of parsed code: "module" or "script".
 * @property {Boolean} strictMode
 * @property {Boolean} allowHashBang
 * @property {CSTParserExperimentalFeatureOptions} experimentalFeatures
 * @property {CSTParserLanguageExtensionsOptions} languageExtensions
 */

/**
 * @typedef {Object} CSTParserLanguageExtensionsOptions
 * @property {Boolean} jsx
 * @property {Boolean} flow
 */

/**
 * @typedef {Object} CSTParserExperimentalFeatureOptions
 * @property {Boolean} 'es7.asyncFunctions'
 * @property {Boolean} 'es7.classProperties'
 * @property {Boolean} 'es7.comprehensions'
 * @property {Boolean} 'es7.decorators'
 * @property {Boolean} 'es7.doExpressions'
 * @property {Boolean} 'es7.exponentiationOperator'
 * @property {Boolean} 'es7.exportExtensions'
 * @property {Boolean} 'es7.functionBind'
 * @property {Boolean} 'es7.objectRestSpread'
 * @property {Boolean} 'es7.trailingFunctionCommas'
 */

/**
 * CST Parser.
 */
export default class Parser {
    /**
     * @param {CSTParserOptions} options
     */
    constructor(options) {
        this._options = {
            sourceType: 'module',
            strictMode: true,
            allowHashBang: true,
            experimentalFeatures: {
                'es7.asyncFunctions': true,
                'es7.classProperties': true,
                'es7.comprehensions': true,
                'es7.decorators': true,
                'es7.doExpressions': true,
                'es7.exponentiationOperator': true,
                'es7.exportExtensions': true,
                'es7.functionBind': true,
                'es7.objectRestSpread': true,
                'es7.trailingFunctionCommas': true
            },
            languageExtensions: {
                jsx: true,
                flow: true
            }
        };

        if (options) {
            this.setOptions(options);
        }
    }

    /**
     * @returns {CSTParserOptions}
     */
    getOptions() {
        return this._options;
    }

    /**
     * @param {CSTParserOptions} options
     */
    setOptions(options) {
        this._options = Object.assign(
            {},
            this._options,
            options,
            {
                experimentalFeatures: Object.assign(
                    {},
                    this._options.experimentalFeatures,
                    options.experimentalFeatures
                ),
                languageExtensions: Object.assign(
                    {},
                    this._options.languageExtensions,
                    options.languageExtensions
                )
            }
        );
    }

    parse(code) {
        let ast = this._parseAst(code);
        let tokens = this._processTokens(ast, code);
        return buildElementTree(ast, tokens);
    }

    _parseAst(code) {
        var options = this._options;
        var experimentalFeatures = options.experimentalFeatures;
        var languageExtensions = options.languageExtensions;
        let ast = parse(code, {
            sourceType: options.sourceType,
            strictMode: options.strictMode,
            ecmaVersion: Infinity,
            allowHashBang: options.allowHashBang,
            features: experimentalFeatures,
            plugins: {
                jsx: languageExtensions.jsx,
                flow: languageExtensions.flow
            }
        });
        let program = ast.program;
        program.tokens = ast.tokens;
        return program;
    }

    _processTokens(ast, code) {
        return buildTokenList(ast.tokens, code);
    }
}
