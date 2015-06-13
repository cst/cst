import Parser from '../lib/Parser';

export function parseAndGetStatementInFunction(code) {
    var parser = new Parser();
    var program = parser.parse(`function _name(){${code}}`);
    return program.body[0].body.body[0];
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

export function parseAndGetStatement(code) {
    var parser = new Parser();
    var program = parser.parse(code);
    return program.body[0];
}

export function parseAndGetExpression(code) {
    var parser = new Parser();
    var program = parser.parse(code);
    return program.body[0].expression;
}
