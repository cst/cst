/* @flow */

import {parse} from 'babylon';

import type {BabylonToken} from './elementTree';
import type Program from './elements/types/Program';
import type Token from './elements/Token';
import {buildTokenList, buildElementTree} from './elementTree';

/**
 * @typedef {Object} CSTParserOptions
 * @property {String} sourceType Type of parsed code: "module" or "script".
 * @property {Boolean} allowReturnOutsideFunction
 * @property {Boolean} allowImportExportEverywhere
 * @property {Boolean} allowSuperOutsideMethod
 * @property {CSTParserLanguageExtensionsOptions} languageExtensions
 */

// https://developer.apple.com/library/watchos/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/UIAutomation.html
const DIRECTIVE_APPLE_INSTRUMENTATION = {
    type: 'AppleInstrumentationDirective',
    regexp: /^#([^\n]+)/gm
};

// https://www.chromium.org/developers/web-development-style-guide
const DIRECTIVE_GRIT = {
    type: 'GritDirective',
    regexp: /^\s*<(\/?\s*(?:if|include)(?!\w)[^]*?)>/gim
};

// checking for the options passed to the babel parse method
export type CSTParserOptions = {
  sourceType: 'script' | 'module',
  allowReturnOutsideFunction: boolean,
  allowImportExportEverywhere: boolean,
  allowSuperOutsideMethod: boolean,
  languageExtensions: Array<string>,
  strictMode: ?boolean
};

/**
 * CST Parser.
 */
export default class Parser {
    /**
     * @param {CSTParserOptions} options
     */
    constructor(options?: CSTParserOptions) {
        this._options = {
            sourceType: 'module',
            strictMode: true,
            allowImportExportEverywhere: false,
            allowReturnOutsideFunction: true,
            allowSuperOutsideMethod: true,
            languageExtensions: [
                'flow',
                'jsx',
                'asyncFunctions',
                'asyncGenerators',
                'classConstructorCall',
                'classProperties',
                'decorators',
                'doExpressions',
                'exponentiationOperator',
                'exportExtensions',
                'functionBind',
                'functionSent',
                'objectRestSpread',
                'trailingFunctionCommas'
            ]
        };

        if (options) {
            this.setOptions(options);
        }
    }

    _options: CSTParserOptions;

    /**
     * @returns {CSTParserOptions}
     */
    getOptions(): CSTParserOptions {
        return this._options;
    }

    /**
     * @param {CSTParserOptions} newOptions
     */
    setOptions(newOptions: CSTParserOptions) {
        var currentOptions = this._options;
        var currentLanguageExtensions = currentOptions.languageExtensions;
        var newLanguageExtensions = newOptions.languageExtensions;
        this._options = {
            ...currentOptions,
            ...newOptions,
            languageExtensions: currentLanguageExtensions.concat(newLanguageExtensions)
        };
    }

    parse(code: string): Program {
        let ast = this._parseAst(code);
        let tokens = this._processTokens(ast, code);
        return buildElementTree(ast, tokens);
    }

    _parseAst(code: string): Program {
        let options = this._options;
        let languageExtensions = options.languageExtensions;
        let directiveInstances = {};
        let hasDirectives = false;
        let directiveTypes = [];

        if (languageExtensions.indexOf('appleInstrumentationDirectives') >= 0) {
            directiveTypes.push(DIRECTIVE_APPLE_INSTRUMENTATION);
        }

        if (languageExtensions.indexOf('gritDirectives') >= 0) {
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
            plugins: languageExtensions
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

    _processTokens(ast: Object, code: string): Array<BabylonToken> {
        return buildTokenList(ast.tokens, code);
    }
}
