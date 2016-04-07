/* @flow */

import {parse} from 'babylon';

import type {BabylonToken} from './elementTree';
import type Program from './elements/types/Program';
import type Token from './elements/Token';
import {buildTokenList, buildElementTree} from './elementTree';
import type BasePlugin from './plugins/BasePlugin';

/**
 * @typedef {Object} CSTParserOptions
 * @property {String} sourceType Type of parsed code: "module" or "script".
 * @property {Boolean} allowReturnOutsideFunction
 * @property {Boolean} allowImportExportEverywhere
 * @property {Boolean} allowSuperOutsideMethod
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
 * @property {Boolean} 'flow'
 * @property {Boolean} 'jsx'
 * @property {Boolean} 'asyncFunctions'
 * @property {Boolean} 'asyncGenerators'
 * @property {Boolean} 'classConstructorCall'
 * @property {Boolean} 'classProperties'
 * @property {Boolean} 'decorators'
 * @property {Boolean} 'doExpressions'
 * @property {Boolean} 'exponentiationOperator'
 * @property {Boolean} 'exportExtensions'
 * @property {Boolean} 'functionBind'
 * @property {Boolean} 'objectRestSpread'
 * @property {Boolean} 'trailingFunctionCommas
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
    languageExtensions: Object,
    experimentalFeatures: Object,
    strictMode: ?boolean,
    plugins: BasePlugin[]
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
            experimentalFeatures: {
                'flow': true,
                'jsx': true,
                'asyncFunctions': true,
                'asyncGenerators': true,
                'classConstructorCall': true,
                'classProperties': true,
                'decorators': true,
                'doExpressions': true,
                'exponentiationOperator': true,
                'exportExtensions': true,
                'functionBind': true,
                'objectRestSpread': true,
                'trailingFunctionCommas': true
            },
            languageExtensions: {
                jsx: true,
                flow: true
            },
            plugins: []
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

    parse(code: string): Program {
        let ast = this._parseAst(code);
        let tokens = this._processTokens(ast, code);
        let program = buildElementTree(ast, tokens);
        let programPlugins = {};
        let plugins = this._options.plugins;
        for (let plugin of plugins) {
            let api = plugin.createApiForProgram(program);
            if (api) {
                var pluginName = plugin.getPluginName();
                if (pluginName in programPlugins) {
                    throw new Error(`Plugin "${pluginName}" was already registered.`);
                } else {
                    programPlugins[pluginName] = api;
                }
            }
        }

        program._acceptPlugins(programPlugins);

        return program;
    }

    _parseAst(code: string): Program {
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
            allowImportExportEverywhere: options.allowImportExportEverywhere,
            allowReturnOutsideFunction: options.allowReturnOutsideFunction,
            allowSuperOutsideMethod: options.allowSuperOutsideMethod,
            plugins: [
                ...Object.keys(options.experimentalFeatures),
                ...Object.keys(options.languageExtensions)
            ]
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

        if (code.substr(0, 2) === '#!') {
            program.tokens[0].type = 'Hashbang';
        }

        return program;
    }

    _processTokens(ast: Object, code: string): Array<BabylonToken> {
        return buildTokenList(ast.tokens, code);
    }
}
