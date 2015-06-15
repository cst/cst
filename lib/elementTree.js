import elementIndex from './nodes/elementIndex';
import Token from './nodes/Token';

const visitorKeys = {
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
    /*I */ Program: ['body'],
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
};

export function buildElementTree(ast, tokens) {
    ast.range = tokens.length > 0 ?
        [tokens[0].range[0], tokens[tokens.length - 1].range[1]] : [0, 0];
    return buildElementTreeItem(ast, tokens, 0, tokens.length);
}

function buildElementTreeItem(ast, tokens, start, end) {
    let childProps = visitorKeys[ast.type];

    if (!childProps) {
        throw new Error(`Cannot iterate using ${ast.type}`);
    }

    // FIXME: Esprima incorrectly calculates ranges for methods and properties.
    // When you have `{set x(value) {}}`, range of function is from `{` to `}`, but should be from `(value` to `}`.
    if (ast.type === 'Property' && (ast.kind === 'get' || ast.kind === 'set' || ast.method)) {
        for (let i = start; i < end; i++) {
            if (ast.key.range[0] === tokens[i].range[0]) {
                i++;
                for (; i < end; i++) {
                    let token = tokens[i];
                    if (token.type === 'Punctuator' && token.value === '(') {
                        ast.value.range[0] = token.range[0];
                    }
                }
                break;
            }
        }
    }

    let childElements = [];
    for (let childProp of childProps) {
        let childAst = ast[childProp];
        if (childAst) {
            if (Array.isArray(childAst)) {
                childElements = childElements.concat(childAst.filter(Boolean));
            } else {
                childElements.push(childAst);
            }
        }
    }
    let children = [];
    let index = start;
    let childElementIndex = -1;
    let childElement = getNextChildElement();
    let elementStartTokenIndex;
    while (index < end) {
        let token = tokens[index];
        if (childElement && token.range[0] >= childElement.range[0]) {
            if (childElement.range[0] === token.range[0]) {
                elementStartTokenIndex = index;
            }
            if (childElement.range[1] === token.range[1]) {
                if (childElement.type === 'Identifier' && token.type === 'Keyword') {
                    token.type = 'Identifier';
                }

                children.push(buildElementTreeItem(childElement, tokens, elementStartTokenIndex, index + 1));
                childElement = getNextChildElement();
            }
        } else {
            children.push(new Token(token.type, token.value));
        }
        index++;
    }

    function getNextChildElement() {
        childElementIndex++;

        if (childElementIndex >= childElements.length) {
            return null;
        }

        childElement = childElements[childElementIndex];

        if (!childElement) {
            return getNextChildElement();
        }

        if (childElement.range[1] <= ast.range[0] || childElement.range[0] >= ast.range[1]) {
            return getNextChildElement();
        }

        return childElement;
    }

    let TokenClass = elementIndex[ast.type];

    if (!TokenClass) {
        throw new Error(`Cannot create ${ast.type} instance`);
    }

    return new TokenClass(children);
}

export function buildTokenList(codeTokens, commentTokens) {
    let result = [];
    let codeQueue = codeTokens;
    let commentQueue = commentTokens;
    while (codeQueue.length > 0 || commentQueue.length > 0) {
        if (codeQueue.length > 0 && (!commentQueue.length || commentQueue[0].range[0] > codeQueue[0].range[0])) {
            result.push(codeQueue.shift());
        } else {
            let commentToken = commentQueue.shift();
            commentToken.isComment = true;
            result.push(commentToken);
        }
    }
    return result;
}

export function addWhitespaces(tokens, source) {
    let result = [];
    let prevPos = 0;

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let rangeStart = token.range[0];
        if (rangeStart !== prevPos) {
            result.push({
                type: 'Whitespace',
                value: source.substring(prevPos, rangeStart),
                range: [prevPos, rangeStart]
            });
        }
        result.push(token);
        prevPos = token.range[1];
    }
    if (prevPos !== source.length) {
        result.push({
            type: 'Whitespace',
            value: source.substring(prevPos, source.length),
            range: [prevPos, source.length]
        });
    }
    return result;
}
