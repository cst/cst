import elementIndex from './elements/elementIndex';
import Token from './elements/Token';

const visitorKeys = {
    /* jscs: disable */
    // -- Implement later
    // I  Implemented
    // T  Tested
    /*IT*/ AssignmentExpression: ['left', 'right'],
    /*--*/ AssignmentPattern: ['left', 'right'], // see https://github.com/estree/estree/issues/3
    /*IT*/ ArrayExpression: ['elements'],
    /*IT*/ ArrayPattern: ['elements'],
    /*IT*/ ArrowFunctionExpression: ['params', 'body'],
    /*--*/ AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
    /*IT*/ BlockStatement: ['body'],
    /*IT*/ BinaryExpression: ['left', 'right'],
    /*IT*/ BreakStatement: ['label'],
    /*IT*/ CallExpression: ['callee', 'arguments'],
    /*IT*/ CatchClause: ['param', 'body'], // FIXME: Esprima-fb allows expressions in catch clause.
    /*--*/ ClassBody: ['body'],
    /*--*/ ClassDeclaration: ['id', 'superClass', 'body'],
    /*--*/ ClassExpression: ['id', 'superClass', 'body'],
    /*--*/ ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
    /*--*/ ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
    /*IT*/ ConditionalExpression: ['test', 'consequent', 'alternate'],
    /*IT*/ ContinueStatement: ['label'],
    /*IT*/ DebuggerStatement: [],
    /*--*/ DirectiveStatement: [],
    /*IT*/ DoWhileStatement: ['body', 'test'],
    /*IT*/ EmptyStatement: [],
    /*--*/ ExportAllDeclaration: ['source'],
    /*--*/ ExportDefaultDeclaration: ['declaration'],
    /*--*/ ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
    /*--*/ ExportSpecifier: ['exported', 'local'],
    /*IT*/ ExpressionStatement: ['expression'],
    /*IT*/ ForStatement: ['init', 'test', 'update', 'body'],
    /*IT*/ ForInStatement: ['left', 'right', 'body'],
    /*--*/ ForOfStatement: ['left', 'right', 'body'],
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
    /*--*/ MethodDefinition: ['key', 'value'],
    /*--*/ ModuleSpecifier: [],
    /*IT*/ NewExpression: ['callee', 'arguments'],
    /*IT*/ ObjectExpression: ['properties'],
    /*IT*/ ObjectPattern: ['properties'],
    /*IT*/ Program: ['body'],
    /*IT*/ Property: ['key', 'value'], // FIXME: Esprima improperly calculates ranges
    /*--*/ RestElement: ['argument'],
    /*IT*/ ReturnStatement: ['argument'],
    /*IT*/ SequenceExpression: ['expressions'],
    /*--*/ SpreadElement: ['argument'],
    /*--*/ Super: [],
    /*IT*/ SwitchStatement: ['discriminant', 'cases'],
    /*IT*/ SwitchCase: ['test', 'consequent'],
    /*--*/ TaggedTemplateExpression: ['tag', 'quasi'],
    /*--*/ TemplateElement: [],
    /*--*/ TemplateLiteral: ['quasis', 'expressions'],
    /*IT*/ ThisExpression: [],
    /*IT*/ ThrowStatement: ['argument'],
    /*IT*/ TryStatement: ['block', 'handlers' /* esprima has handerS, not handler */, 'finalizer'], // https://github.com/estree/estree/blob/master/spec.md#trystatement
    /*IT*/ UnaryExpression: ['argument'],
    /*IT*/ UpdateExpression: ['argument'],
    /*IT*/ VariableDeclaration: ['declarations'],
    /*IT*/ VariableDeclarator: ['id', 'init'],
    /*IT*/ WhileStatement: ['test', 'body'],
    /*IT*/ WithStatement: ['object', 'body'],
    /*--*/ YieldExpression: ['argument'],
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
 * @param {Object} ast
 * @param {Array} tokens
 * @returns {Program}
 */
export function buildElementTree(ast, tokens) {
    if (tokens.length > 0) {
        var firstToken = tokens[0];
        ast.range = [firstToken.range[0], tokens[tokens.length - 1].range[1]];
        return buildElementTreeItem(ast, {
            tokens,
            token: firstToken,
            pos: 0
        });
    } else {
        return new elementIndex.Program([]);
    }
}

/**
 * @param {Object} ast
 * @param {{tokens: Array, token: Object, pos: Number}} state
 * @returns {Element}
 */
function buildElementTreeItem(ast, state) {
    let childProps = visitorKeys[ast.type];

    if (!childProps) {
        throw new Error(`Cannot iterate using ${ast.type}`);
    }

    // FIXME: Esprima incorrectly calculates ranges for methods and properties.
    // When you have `set x(value) {}`, range of function is from `{` to `}`, but should be from `(value` to `}`.
    if (ast.type === 'Property' && (ast.kind === 'get' || ast.kind === 'set' || ast.method)) {
        for (let i = state.pos; i < state.tokens.length; i++) {
            if (ast.key.range[0] === state.tokens[i].range[0]) {
                i++;
                for (; i < state.tokens.length; i++) {
                    let token = state.tokens[i];
                    if (token.type === 'Punctuator' && token.value === '(') {
                        ast.value.range[0] = token.range[0];
                        break;
                    }
                }
                break;
            }
        }
    }

    // FIXME: Esprima uses AST-related ranges for cases, but actually they also include all the whitespaces till
    // the next case or till the end of the switch statement.
    if (ast.type === 'SwitchStatement') {
        for (let i = 0; i < ast.cases.length; i++) {
            let switchCase = ast.cases[i];
            let nextCase = ast.cases[i + 1];
            if (nextCase) {
                switchCase.range[1] = nextCase.range[0];
            } else {
                switchCase.range[1] = ast.range[1] - 1;
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

    let NodeClass = elementIndex[ast.type];

    if (!NodeClass) {
        throw new Error(`Cannot create ${ast.type} instance`);
    }

    let children = [];
    let childElementIndex = 0;
    let childElement = childElements[0];
    let end = ast.range[1];
    do {
        if (childElement && state.token.range[0] === childElement.range[0]) {
            children[children.length] = buildElementTreeItem(childElement, state);
            childElement = childElements[++childElementIndex];

            if (!state.token || state.token.range[0] === end) {
                return new NodeClass(children);
            }
        } else {
            var endOfAstReached = state.token.range[1] === end;

            if (endOfAstReached && ast.type === 'Identifier' && state.token.type === 'Keyword') {
                state.token.type = 'Identifier';
            }

            children[children.length] = new Token(state.token.type, state.token.value);

            state.pos++;
            state.token = state.tokens[state.pos];

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
 * @param {Array} commentTokens
 * @param {String} code
 * @returns {Array}
 */
export function buildTokenList(codeTokens, commentTokens, code) {
    let commentToken = commentTokens[0];
    let commentPtr = 0;

    let codeToken = codeTokens[0];
    let codePtr = 0;

    let token;
    let prevPos = 0;

    let result = [];

    while (true) {
        if (codeToken) {
            if (commentToken && codeToken.range[0] > commentToken.range[0]) {
                token = commentToken;
                commentToken = commentTokens[++commentPtr];
            } else {
                token = codeToken;
                codeToken = codeTokens[++codePtr];
            }
        } else {
            if (commentToken) {
                token = commentToken;
                commentToken = commentTokens[++commentPtr];
            } else {
                if (prevPos !== code.length) {
                    result[result.length] = {
                        type: 'Whitespace',
                        value: code.substring(prevPos, code.length),
                        range: [prevPos, code.length]
                    };
                }
                break;
            }
        }
        let pos = token.range[0];
        if (prevPos !== pos) {
            result[result.length] = {
                type: 'Whitespace',
                value: code.substring(prevPos, pos),
                range: [prevPos, pos]
            };
        }
        result[result.length] = token;
        prevPos = token.range[1];
    }

    return result;
}
