import elementIndex from './elements/elementIndex';
import Token from './elements/Token';
import {acorn} from 'babel-core';

const visitorKeys = {
    /* jscs: disable */
    // -- Implement later
    // I  Implemented
    // T  Tested
    /*IT*/ AssignmentExpression: ['left', 'right'],
    /*--*/ AssignmentPattern: ['left', 'right'],
    /*IT*/ ArrayExpression: ['elements'],
    /*IT*/ ArrayPattern: ['elements'],
    /*IT*/ ArrowFunctionExpression: ['params', 'body'],
    /*--*/ AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
    /*IT*/ BlockStatement: ['body'],
    /*IT*/ BinaryExpression: ['left', 'right'],
    /*IT*/ BreakStatement: ['label'],
    /*IT*/ CallExpression: ['callee', 'arguments'],
    /*IT*/ CatchClause: ['param', 'body'],
    /*IT*/ ClassBody: ['body'],
    /*IT*/ ClassDeclaration: ['id', 'superClass', 'body'],
    /*IT*/ ClassExpression: ['id', 'superClass', 'body'],
    /*--*/ ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
    /*--*/ ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
    /*IT*/ ConditionalExpression: ['test', 'consequent', 'alternate'],
    /*IT*/ ContinueStatement: ['label'],
    /*IT*/ DebuggerStatement: [],
    /*IT*/ DoWhileStatement: ['body', 'test'],
    /*IT*/ EmptyStatement: [],
    /*--*/ ExportAllDeclaration: ['source'],
    /*--*/ ExportDefaultDeclaration: ['declaration'],
    /*--*/ ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
    /*--*/ ExportSpecifier: ['exported', 'local'],
    /*IT*/ ExpressionStatement: ['expression'],
    /*IT*/ ForStatement: ['init', 'test', 'update', 'body'],
    /*IT*/ ForInStatement: ['left', 'right', 'body'],
    /*IT*/ ForOfStatement: ['left', 'right', 'body'],
    /*IT*/ FunctionDeclaration: ['id', 'params', 'body'],
    /*IT*/ FunctionExpression: ['id', 'params', 'body'],
    /*--*/ GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
    /*IT*/ Identifier: [],
    /*IT*/ IfStatement: ['test', 'consequent', 'alternate'],
    /*--*/ ImportDeclaration: ['specifiers', 'source'],
    /*--*/ ImportDefaultSpecifier: ['local'],
    /*--*/ ImportNamespaceSpecifier: ['local'],
    /*--*/ ImportSpecifier: ['imported', 'local'],
    /*IT*/ LabeledStatement: ['label', 'body'],
    /*IT*/ Literal: [],
    /*IT*/ LogicalExpression: ['left', 'right'],
    /*IT*/ MemberExpression: ['object', 'property'],
    /*--*/ MetaProperty: ['meta', 'property'],
    /*IT*/ MethodDefinition: ['key', 'value'],
    /*--*/ ModuleSpecifier: [],
    /*IT*/ NewExpression: ['callee', 'arguments'],
    /*IT*/ ObjectExpression: ['properties'],
    /*IT*/ ObjectPattern: ['properties'],
    /*IT*/ Program: ['body'],
    /*IT*/ Property: ['key', 'value'],
    /*IT*/ RestElement: ['argument'],
    /*IT*/ ReturnStatement: ['argument'],
    /*IT*/ SequenceExpression: ['expressions'],
    /*IT*/ SpreadElement: ['argument'],
    /*IT*/ Super: [],
    /*IT*/ SwitchStatement: ['discriminant', 'cases'],
    /*IT*/ SwitchCase: ['test', 'consequent'],
    /*--*/ TaggedTemplateExpression: ['tag', 'quasi'],
    /*--*/ TemplateElement: [],
    /*--*/ TemplateLiteral: ['quasis', 'expressions'],
    /*IT*/ ThisExpression: [],
    /*IT*/ ThrowStatement: ['argument'],
    /*IT*/ TryStatement: ['block', 'handler', 'finalizer'],
    /*IT*/ UnaryExpression: ['argument'],
    /*IT*/ UpdateExpression: ['argument'],
    /*IT*/ VariableDeclaration: ['declarations'],
    /*IT*/ VariableDeclarator: ['id', 'init'],
    /*IT*/ WhileStatement: ['test', 'body'],
    /*IT*/ WithStatement: ['object', 'body'],
    /*IT*/ YieldExpression: ['argument'],
    /*--*/ JSXIdentifier: [],
    /*--*/ JSXNamespacedName: ['namespace', 'name'],
    /*--*/ JSXMemberExpression: ['object', 'property'],
    /*--*/ JSXEmptyExpression: [],
    /*--*/ JSXExpressionContainer: ['expression'],
    /*--*/ JSXElement: ['openingElement', 'closingElement', 'children'],
    /*--*/ JSXClosingElement: ['name'],
    /*--*/ JSXOpeningElement: ['name', 'attributes'],
    /*--*/ JSXAttribute: ['name', 'value'],
    /*--*/ JSXSpreadAttribute: ['argument'],
    /*--*/ JSXText: []
    /* jscs: enable */
};

/**
 * Creates CST using AST and token list.
 *
 * @param {Object} ast
 * @param {Array} tokens
 * @returns {Program}
 */
export function buildElementTree(ast, tokens) {
    var firstToken = tokens[0];
    ast.start = firstToken.start;
    ast.end = tokens[tokens.length - 1].end;
    return buildElementTreeItem(ast, {
        tokens,
        token: firstToken,
        pos: 0
    });
}

/**
 * @param {Object} ast
 * @param {{tokens: Array, token: Object, pos: Number}} state
 * @returns {Element}
 */
function buildElementTreeItem(ast, state) {
    var elementType = ast.type;
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
            children[children.length] = buildElementTreeItem(childElement, state);
            childElement = childElements[++childElementIndex];

            if (!state.token ||
                (state.token.start === end && (state.token.end !== end || elementType !== 'Program'))
            ) {
                return new NodeClass(children);
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
export function buildTokenList(codeTokens, code) {
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
 * Acorn token types.
 */
let tt = acorn.tokTypes;

/**
 * Transforms Acorn-style token to Esprima-style token.
 *
 * @param {Object} token
 * @param {String} source
 */
function processToken(token, source) {
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
        type === tt.template || type === tt.backQuote ||
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
