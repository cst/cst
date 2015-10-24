import {parse} from 'babylon';

import {buildTokenList, buildElementTree} from './elementTree';

/**
 * @typedef {Object} CSTParserOptions
 * @property {String} sourceType Type of parsed code: "module" or "script".
 * @property {Boolean} strictMode
 * @property {Boolean} allowHashBang
 * @property {Number} ecmaVersion
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

const DIRECTIVE_APPLE_INSTRUMENTATION = {
    type: 'AppleInstrumentationDirective',
    regexp: /^#([^\n]+)/gm
};

const DIRECTIVE_GRIT = {
    type: 'GritDirective',
    regexp: /^\s*<(\/?\s*(?:if|include)(?!\w)[^]*?)>/gim
};

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
            ecmaVersion: Infinity,
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
     * @param {CSTParserOptions} newOptions
     */
    setOptions(newOptions) {
        var currentOptions = this._options;
        var currentExperimentalFeatures = currentOptions.experimentalFeatures;
        var currentLanguageExtensions = currentOptions.languageExtensions;
        var newExperimentalFeatures = newOptions.experimentalFeatures;
        var newLanguageExtensions = newOptions.languageExtensions;
        this._options = {
            ...currentOptions,
            ...newOptions,
            experimentalFeatures: {
                ...currentExperimentalFeatures,
                ...newExperimentalFeatures
            },
            languageExtensions: {
                ...currentLanguageExtensions,
                ...newLanguageExtensions
            }
        };
    }

    parse(code) {
        let ast = this._parseAst(code);
        let tokens = this._processTokens(ast, code);
        return buildElementTree(ast, tokens);
    }

    _parseAst(code) {
        let options = this._options;
        let languageExtensions = options.languageExtensions;
        let directiveInstances = {};
        let hasDirectives = false;
        let directiveTypes = [];

        if (languageExtensions.appleInstrumentationDirectives) {
            directiveTypes.push(DIRECTIVE_APPLE_INSTRUMENTATION);
        }

        if (languageExtensions.gritDirectives) {
            directiveTypes.push(DIRECTIVE_GRIT);
        }

        for (let directive of directiveTypes) {
            code = code.replace(directive.regexp, function(str, value, pos) {
                hasDirectives = true;
                directiveInstances[pos] = {
                    type: directive.type, value
                };

                // Cut 4 characters to save correct line/column info for surrounding code
                return '/*' + str.slice(4) + '*/';
            });
        }

        let ast = parse(code, {
            sourceType: options.sourceType,
            strictMode: options.strictMode,
            ecmaVersion: options.ecmaVersion,
            allowHashBang: options.allowHashBang,
            features: options.experimentalFeatures,
            plugins: {
                jsx: languageExtensions.jsx,
                flow: languageExtensions.flow
            }
        });

        let program = ast.program;
        program.tokens = ast.tokens;

        if (hasDirectives) {
            for (let token of program.tokens) {
                let directiveInstance = directiveInstances[token.start];
                if (directiveInstances[token.start]) {
                    token.type = directiveInstance.type;
                    token.value = directiveInstance.value;
                }
            }
        }

        if (options.allowHashBang) {
            if (code.substr(0, 2) === '#!') {
                program.tokens[0].type = 'Hashbang';
            }
        }

        return program;
    }

    _processTokens(ast, code) {
        return buildTokenList(ast.tokens, code);
    }
}
