import Parser from '../src/Parser';

export function parseAndGetProgram(code, options) {
    var parser = new Parser();
    if (options && options.disableStrictMode) {
        parser.disableStrictMode();
    }
    return parser.parse(code);
}

export function parseAndGetStatement(code, options) {
    var parser = new Parser();
    if (options && options.disableStrictMode) {
        parser.disableStrictMode();
    }
    var program = parser.parse(code);
    return program.body[0];
}

export function parseAndGetExpression(code, options) {
    var parser = new Parser();
    if (options && options.disableStrictMode) {
        parser.disableStrictMode();
    }
    var program = parser.parse('(' + code + ')');
    return program.body[0].expression;
}

export function parseAndGetPattern(code) {
    var parser = new Parser();
    var program = parser.parse(`(${code} = 1)`);
    return program.body[0].expression.left;
}

export function parseAndGetObjectProperty(code) {
    var parser = new Parser();
    var program = parser.parse(`({${code}})`);
    return program.body[0].expression.properties[0];
}

export function parseAndGetClassMember(code) {
    var parser = new Parser();
    var program = parser.parse(`(class{${code}})`);
    return program.body[0].expression.body.body[0];
}

export function parseAndGetStatementInLoop(code, loopLabel) {
    var parser = new Parser();
    if (loopLabel) {
        let program = parser.parse(`${loopLabel}: while(true){${code}}`);
        return program.body[0].body.body.body[0];
    } else {
        let program = parser.parse(`while(true){${code}}`);
        return program.body[0].body.body[0];
    }
}

export function parseAndGetStatementInFunction(code) {
    var parser = new Parser();
    var program = parser.parse(`function _name(){${code}}`);
    return program.body[0].body.body[0];
}

export function parseAndGetExpressionInGenerator(code) {
    var parser = new Parser();
    var program = parser.parse(`function * _name(){(${code});}`);
    return program.body[0].body.body[0].expression;
}

export function parseAndGetStatementInVariableDeclarator(code) {
    var parser = new Parser();
    var program = parser.parse(`var ${code};`);
    return program.body[0].declarations[0];
}

export function assertChildren(element, children) {
    if (element.childCount !== children.length) {
        throw new Error('Invalid child count');
    }
    let childElements = element.childElements;
    for (let i = 0; i < childElements.length; i++) {
        if (childElements[i] !== children[i]) {
            throw new Error(
                'Invalid children\n' +
                'Actual: "' + element.sourceCode + '"\n' +
                'Expected: "' + children.map(c => c.sourceCode).join('') + '"'
            );
        }
    }
}

export function validateStructure(element) {
    let childElements = element.childElements;
    if (childElements.length !== element.childCount) {
        throw new Error('Inconsistend child count');
    }
    for (let i = 0; i < childElements.length; i++) {
        let child = childElements[i];
        if (child.parentElement !== element) {
            throw new Error('Inconsistent parent');
        }
        if (i === 0 && child !== element.firstChild) {
            throw new Error('Inconsistent first child');
        }
        if (i === childElements.length - 1 && child !== element.lastChild) {
            throw new Error('Inconsistent last child');
        }
        if (child.previousSibling !== (childElements[i - 1] || null)) {
            throw new Error('Inconsistent previous sibling');
        }
        if (child.nextSibling !== (childElements[i + 1] || null)) {
            throw new Error('Inconsistent next sibling');
        }
        let firstToken;
        let lastToken;
        let currentChild = child;
        while (currentChild && !currentChild.isToken) {
            currentChild = currentChild.childElements[0];
        }
        firstToken = currentChild || null;

        if (child.firstToken !== firstToken) {
            throw new Error('Inconsistent first token');
        }

        currentChild = child;
        while (currentChild && !currentChild.isToken) {
            currentChild = currentChild.childElements[currentChild.childElements.length - 1];
        }
        lastToken = currentChild || null;

        if (child.lastToken !== lastToken) {
            throw new Error('Inconsistent last token');
        }

        validateStructure(child);
    }
}
