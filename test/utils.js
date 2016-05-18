/* @flow */

import type {CSTParserOptions} from '../src/Parser';
import type Element from '../src/elements/Element';
import type Program from '../src/elements/types/Program';
import Parser from '../src/Parser';

export function parseAndGetProgram(code: string, options: CSTParserOptions): Program {
    var parser = new Parser(options);
    return parser.parse(code);
}

export function parseAndGetStatement(code: string, options: CSTParserOptions): Object {
    var parser = new Parser(options);
    var program = parser.parse(code);
    return program.body[0];
}

export function parseAndGetExpression(code: string, options: CSTParserOptions): Object {
    var parser = new Parser(options);
    var program = parser.parse('(' + code + ')');
    return program.body[0].expression;
}

export function parseAndGetBindExpression(code: string, options: CSTParserOptions): Object {
    return parseAndGetProgram(code, options).selectNodesByType('BindExpression')[0];
}

export function parseAndGetExpressionInFunction(code: string, options: CSTParserOptions): Object {
    var parser = new Parser(options);
    var program = parser.parse(`(function(){( ${code} )})`);
    return program.body[0].expression.body.body[0].expression;
}

export function parseAndGetPattern(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`(${code} = 1)`);
    return program.body[0].expression.left;
}

export function parseAndGetObjectProperty(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`({${code}})`);
    return program.body[0].expression.properties[0];
}

export function parseAndGetClassMember(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`(class{${code}})`);
    return program.body[0].expression.body.body[0];
}

export function parseAndGetObjectKey(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`({${code}: 1})`);
    return program.body[0].expression.properties[0].key;
}

export function parseAndGetSuper(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`(class{ constructor() { ${code} }})`);
    return program.body[0].expression.body.body[0].body.body[0].expression;
}

export function parseAndGetStatementInLoop(code: string, loopLabel: string): Object {
    var parser = new Parser();
    if (loopLabel) {
        let program = parser.parse(`${loopLabel}: while(true){${code}}`);
        return program.body[0].body.body.body[0];
    } else {
        let program = parser.parse(`while(true){${code}}`);
        return program.body[0].body.body[0];
    }
}

export function parseAndGetStatementInFunction(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`function _name(){${code}}`);
    return program.body[0].body.body[0];
}

export function parseAndGetBlockStatementInFunction(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`function _name(){${code}}`);
    return program.body[0].body;
}

export function parseAndGetStatementInFunctionParams(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`function _name(${code}){}`);
    return program.body[0].params;
}

export function parseAndGetExpressionInGenerator(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`function * _name(){(${code});}`);
    return program.body[0].body.body[0].expression;
}

export function parseAndGetExpressionInAsyncFunction(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`async function _name(){(${code});}`);
    return program.body[0].body.body[0].expression;
}

export function parseAndGetStatementInVariableDeclarator(code: string): Object {
    var parser = new Parser();
    var program = parser.parse(`var ${code};`);
    return program.body[0].declarations[0];
}

export function assertChildren(element: Element, children: Array<Element>): void {
    let childElements = element.childElements;
    for (let i = 0; i < childElements.length; i++) {
        if (childElements[i] !== children[i]) {
            throw new Error(
                'Invalid children\n' +
                'Actual: "' + element.getSourceCode() + '"\n' +
                'Expected: "' + children.map(c => c.getSourceCode()).join('') + '"'
            );
        }
    }
}

export function validateStructure(element: Element): void {
    let childElements = element.childElements;
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

        if (child.getFirstToken() !== firstToken) {
            throw new Error('Inconsistent first token');
        }

        currentChild = child;
        while (currentChild && !currentChild.isToken) {
            currentChild = currentChild.childElements[currentChild.childElements.length - 1];
        }
        lastToken = currentChild || null;

        if (child.getLastToken() !== lastToken) {
            throw new Error('Inconsistent last token');
        }

        validateStructure(child);
    }
}
