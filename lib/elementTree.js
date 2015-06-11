import elementIndex from './nodes/elementIndex';
import Token from './nodes/Token';

const visitorKeys = {
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
    /*  */ BreakStatement: ['label'],
    /*  */ CallExpression: ['callee', 'arguments'],
    /*  */ CatchClause: ['param', 'body'],
    /*--*/ ClassBody: ['body'],
    /*--*/ ClassDeclaration: ['id', 'superClass', 'body'],
    /*--*/ ClassExpression: ['id', 'superClass', 'body'],
    /*--*/ ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
    /*--*/ ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
    /*  */ ConditionalExpression: ['test', 'consequent', 'alternate'],
    /*  */ ContinueStatement: ['label'],
    /*  */ DebuggerStatement: [],
    /*--*/ DirectiveStatement: [],
    /*  */ DoWhileStatement: ['body', 'test'],
    /*  */ EmptyStatement: [],
    /*--*/ ExportAllDeclaration: ['source'],
    /*--*/ ExportDefaultDeclaration: ['declaration'],
    /*--*/ ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
    /*--*/ ExportSpecifier: ['exported', 'local'],
    /*  */ ExpressionStatement: ['expression'],
    /*  */ ForStatement: ['init', 'test', 'update', 'body'],
    /*  */ ForInStatement: ['left', 'right', 'body'],
    /*--*/ ForOfStatement: ['left', 'right', 'body'],
    /*  */ FunctionDeclaration: ['id', 'params', 'body'],
    /*  */ FunctionExpression: ['id', 'params', 'body'],
    /*--*/ GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
    /*  */ Identifier: [],
    /*  */ IfStatement: ['test', 'consequent', 'alternate'],
    /*--*/ ImportDeclaration: ['specifiers', 'source'],
    /*--*/ ImportDefaultSpecifier: ['local'],
    /*--*/ ImportNamespaceSpecifier: ['local'],
    /*--*/ ImportSpecifier: ['imported', 'local'],
    /*  */ Literal: [],
    /*  */ LabeledStatement: ['label', 'body'],
    /*  */ LogicalExpression: ['left', 'right'],
    /*  */ MemberExpression: ['object', 'property'],
    /*--*/ MetaProperty: ['meta', 'property'],
    /*--*/ MethodDefinition: ['key', 'value'],
    /*--*/ ModuleSpecifier: [],
    /*  */ NewExpression: ['callee', 'arguments'],
    /*  */ ObjectExpression: ['properties'],
    /*I */ ObjectPattern: ['properties'],
    /*  */ Program: ['body'],
    /*  */ Property: ['key', 'value'],
    /*--*/ RestElement: ['argument'],
    /*  */ ReturnStatement: ['argument'],
    /*  */ SequenceExpression: ['expressions'],
    /*--*/ SpreadElement: ['argument'],
    /*--*/ Super: [],
    /*  */ SwitchStatement: ['discriminant', 'cases'],
    /*  */ SwitchCase: ['test', 'consequent'],
    /*--*/ TaggedTemplateExpression: ['tag', 'quasi'],
    /*--*/ TemplateElement: [],
    /*--*/ TemplateLiteral: ['quasis', 'expressions'],
    /*  */ ThisExpression: [],
    /*  */ ThrowStatement: ['argument'],
    /*  */ TryStatement: ['block', 'handler', 'finalizer'],
    /*  */ UnaryExpression: ['argument'],
    /*  */ UpdateExpression: ['argument'],
    /*  */ VariableDeclaration: ['declarations'],
    /*  */ VariableDeclarator: ['id', 'init'],
    /*  */ WhileStatement: ['test', 'body'],
    /*--*/ WithStatement: ['object', 'body'],
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
    let childElementIndex = 0;
    let childElement = childElements[0];
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
                childElementIndex++;
                childElement = childElements[childElementIndex];
            }
        } else {
            children.push(new Token(token.type, token.value));
        }
        index++;
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
