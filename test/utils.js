import Parser from '../lib/Parser';

export function parseAndGetStatement(code) {
    var parser = new Parser();
    var program = parser.parse(code);
    return program.body[0];
}

export function parseAndGetExpression(code) {
    var parser = new Parser();
    var program = parser.parse(code);
    return program.body.get(0).expression;
}
