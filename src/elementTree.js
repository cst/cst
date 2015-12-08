/* @flow */

import * as babylon from 'babylon';
import * as t from 'babel-types';

import type Program from './elements/types/Program';
import type Location from './elements/Element';

import visitorKeys from './visitorKeys';
import elementIndex from './elements/elementIndex';
import Token from './elements/Token';

export type BabylonToken = {
    type: string,
    value: string,
    start: number,
    end: number,
    loc?: Location,
    sourceCode: string
};

/**
 * Creates CST using AST and token list.
 *
 * @param {Object} ast
 * @param {Array} tokens
 * @returns {Program}
 */
export function buildElementTree(ast: Object, tokens: Array<BabylonToken>): Program {
    var firstToken = tokens[0];
    ast.start = firstToken.start;
    ast.end = tokens[tokens.length - 1].end;
    return ((buildElementTreeItem(ast, {
        tokens,
        token: firstToken,
        pos: 0
    }): any): Program);
}

type ElementTreeItemState = {
    tokens: Array<BabylonToken>,
    token: BabylonToken,
    pos: number
};

function babelKeysToESTree(node: Object) {
    if (t.isNumericLiteral(node) ||
        t.isStringLiteral(node)) {
        node.type = 'Literal';
        if (!node.raw) {
            node.raw = node.extra && node.extra.raw;
        }
    }

    if (t.isBooleanLiteral(node)) {
        node.type = 'Literal';
        node.raw = String(node.value);
    }

    if (t.isNullLiteral(node)) {
        node.type = 'Literal';
        node.raw = 'null';
        node.value = null;
    }

    if (t.isRegExpLiteral(node)) {
        node.type = 'Literal';
        node.raw = node.extra.raw;
        node.value = new RegExp(node.raw);
        node.regex = {
            pattern: node.pattern,
            flags: node.flags
        };
        delete node.extra;
        delete node.pattern;
        delete node.flags;
    }

    if (t.isObjectProperty(node)) {
        node.type = 'Property';
        node.kind = 'init';
    }

    if (t.isClassMethod(node) || t.isObjectMethod(node)) {
        node.value = {
            type: 'FunctionExpression',
            id: node.id,
            params: node.params,
            body: node.body,
            async: node.async,
            generator: node.generator,
            expression: node.expression,
            loc: {
                start: {
                    line: node.key.loc.start.line,
                    column: node.key.loc.end.column // a[() {]
                },
                end: node.body.loc.end
            }
        };

        // [asdf]() {
        node.value.range = [node.key.range[1], node.body.range[1]];

        if (node.returnType) {
            node.value.returnType = node.returnType;
        }

        if (node.typeParameters) {
            node.value.typeParameters = node.typeParameters;
        }

        if (t.isClassMethod(node)) {
            node.type = 'MethodDefinition';
        }

        if (t.isObjectMethod(node)) {
            node.type = 'Property';
            node.kind = 'init';
        }

        delete node.body;
        delete node.id;
        delete node.async;
        delete node.generator;
        delete node.expression;
        delete node.params;
        delete node.returnType;
        delete node.typeParameters;
    }
}

/**
 * @param {Object} ast
 * @param {{tokens: Array, token: Object, pos: Number}} state
 * @returns {Element}
 */
function buildElementTreeItem(ast: Object, state: ElementTreeItemState): ?Element {
    babelKeysToESTree(ast);

    let elementType = ast.type;
    let childProps = visitorKeys[elementType];

    if (!childProps) {
        throw new Error(`Cannot iterate using ${elementType}`);
    }

    // Babel uses AST-related ranges for cases, but actually they also include all the whitespaces till
    // the next case or till the end of the switch statement.
    if (elementType === 'SwitchStatement') {
        for (let i = 0; i < ast.cases.length; i++) {
            let switchCase = ast.cases[i];
            let nextCase = ast.cases[i + 1];
            if (nextCase) {
                switchCase.end = nextCase.start;
            } else {
                switchCase.end = ast.end - 1;
            }
        }
    }

    let childElements = [];
    for (let i = 0; i < childProps.length; i++) {
        let childAst = ast[childProps[i]];
        if (childAst) {
            if (Array.isArray(childAst)) {
                for (let j = 0; j < childAst.length; j++) {
                    if (childAst[j] !== null) {
                        childElements[childElements.length] = childAst[j];
                    }
                }
            } else {
                childElements[childElements.length] = childAst;
            }
        }
    }

    childElements.sort((ast1, ast2) => {
        return ast1.start < ast2.start ? -1 : (ast1.start > ast2.start ? 1 : 0);
    });

    let NodeClass = elementIndex[elementType];

    if (!NodeClass) {
        throw new Error(`Cannot create ${elementType} instance`);
    }

    let children = [];
    let childElementIndex = 0;
    let childElement = childElements[0];
    let end = ast.end;

    do {
        if (childElement && state.token.start === childElement.start) {
            if (state.token.end > childElement.end) {
                let EmptyNodeClass = elementIndex[childElement.type];
                if (!EmptyNodeClass) {
                    throw new Error(`Cannot create ${childElement.type} instance`);
                }

                children[children.length] = new EmptyNodeClass([]);
                childElement = childElements[++childElementIndex];
            } else {
                children[children.length] = buildElementTreeItem(childElement, state);
                childElement = childElements[++childElementIndex];

                if (!state.token ||
                    (state.token.start === end && (state.token.end !== end || elementType !== 'Program'))
                ) {
                    return new NodeClass(children);
                }
            }
        } else {
            let endOfAstReached = state.token.end === end;
            let addedTokenType = state.token.type;

            if (endOfAstReached && ast.type === 'Identifier' && addedTokenType === 'Keyword') {
                state.token.type = addedTokenType = 'Identifier';
            }

            children[children.length] = Token.createFromToken(state.token);

            state.pos++;
            state.token = state.tokens[state.pos];

            if (elementType === 'Program' && addedTokenType !== 'EOF') {
                continue;
            }

            if (endOfAstReached) {
                return new NodeClass(children);
            }
        }
    } while (state.token);
}

/**
 * Build single token list using code tokens, comments and whitespace.
 *
 * @param {Array} codeTokens
 * @param {String} code
 * @returns {Array}
 */
export function buildTokenList(codeTokens: Array<BabylonToken>, code: string): Array<BabylonToken> {
    let prevPos = 0;
    let result = [];

    for (var i = 0; i < codeTokens.length; i++) {
        let token = processToken(codeTokens[i], code);

        let pos = token.start;
        if (prevPos !== pos) {
            let value = code.substring(prevPos, pos);
            result[result.length] = {
                type: 'Whitespace',
                value,
                sourceCode: value,
                start: prevPos,
                end: pos
            };
        }
        result[result.length] = token;

        prevPos = token.end;
    }

    return result;
}

/**
 * Babylon token types.
 */
let tt = babylon.tokTypes;

/**
 * Transforms Babylon-style token to Esprima-style token.
 *
 * @param {Object} token
 * @param {String} source
 */
function processToken(token: Object, source: string): BabylonToken {
    var type = token.type;

    if (type === tt.name) {
        token.type = 'Identifier';
    } else if (type === tt.semi || type === tt.comma ||
        type === tt.parenL || type === tt.parenR ||
        type === tt.braceL || type === tt.braceR ||
        type === tt.slash || type === tt.dot ||
        type === tt.bracketL || type === tt.bracketR ||
        type === tt.ellipsis || type === tt.arrow ||
        type === tt.star || type === tt.incDec ||
        type === tt.colon || type === tt.question ||
        type === tt.backQuote ||
        type === tt.dollarBraceL || type === tt.at ||
        type === tt.logicalOR || type === tt.logicalAND ||
        type === tt.bitwiseOR || type === tt.bitwiseXOR ||
        type === tt.bitwiseAND || type === tt.equality ||
        type === tt.relational || type === tt.bitShift ||
        type === tt.plusMin || type === tt.modulo ||
        type === tt.exponent || type === tt.prefix ||
        type === tt.doubleColon ||
        type.isAssign) {
        token.type = 'Punctuator';
        if (!token.value) {
            token.sourceCode = token.value = type.label;
        }
    } else if (type === tt.template) {
        token.type = 'Template';
        if (!token.value) {
            token.sourceCode = token.value = type.label;
        }
    } else if (type === tt.jsxTagStart) {
        token.type = 'Punctuator';
        token.sourceCode = token.value = '<';
    } else if (type === tt.jsxTagEnd) {
        token.type = 'Punctuator';
        token.sourceCode = token.value = '>';
    } else if (type === tt.jsxName) {
        token.type = 'JSXIdentifier';
    } else if (type === tt.jsxText) {
        token.type = 'JSXText';
    } else if (type.keyword === 'null') {
        token.type = 'Null';
        token.value = null;
    } else if (type.keyword === 'false' || type.keyword === 'true') {
        token.type = 'Boolean';
        token.value = type.keyword === 'true';
    } else if (type.keyword) {
        token.type = 'Keyword';
    } else if (type === tt.num) {
        token.type = 'Numeric';
    } else if (type === tt.string) {
        token.type = 'String';
    } else if (type === tt.regexp) {
        token.type = 'RegularExpression';
        token.value = token.value.value;
    } else if (type === 'CommentLine') {
        token.sourceCode = '//' + token.value;
    } else if (type === 'CommentBlock') {
        token.sourceCode = '/*' + token.value + '*/';
    } else if (type === tt.eof) {
        token.type = 'EOF';
        token.sourceCode = token.value = '';
    }

    if (!('sourceCode' in token)) {
        token.sourceCode = source.slice(token.start, token.end);
    }

    return token;
}
