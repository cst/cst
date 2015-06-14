import Parser from '../lib/Parser';

export function parseAndGetProgram(code) {
    var parser = new Parser();
    return parser.parse(code);
}

export function parseAndGetStatement(code) {
    var parser = new Parser();
    var program = parser.parse(code);
    return program.body[0];
}

export function parseAndGetExpression(code) {
    var parser = new Parser();
    var program = parser.parse('(' + code + ')');
    return program.body[0].expression;
}

export function parseAndGetPattern(code) {
    var parser = new Parser();
    var program = parser.parse(`(${code}) = 1`);
    return program.body[0].expression.left;
}

export function parseAndGetObjectProperty(code) {
    var parser = new Parser();
    var program = parser.parse(`({${code}})`);
    return program.body[0].expression.properties[0];
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

export function parseAndGetStatementInVariableDeclarator(code) {
    var parser = new Parser();
    var program = parser.parse(`var ${code};`);
    return program.body[0].declarations[0];
}
