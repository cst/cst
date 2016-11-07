import {parseAndGetProgram} from '../utils';
import BlockStatement from '../../src/elements/types/BlockStatement';
import Token from '../../src/elements/Token';
import Fragment from '../../src/elements/Fragment';
import {expect} from 'chai';

let sourceCode = `
if (x) x++;
if (x) x++; else x--;
if (x) x++; else if (y) y++;
while (x) x--;
for (;;) x++;
for (x in x) x++;
with (x) prop++;
switch (x) {
    case 1:
    case 2:
        x++;
        break;
    default:
        x--;
}
`;

let resultCode = `
if (x) {x++;}
if (x) {x++;} else {x--;}
if (x) {x++;} else if (y) {y++;}
while (x) {x--;}
for (;;) {x++;}
for (x in x) {x++;}
with (x) {prop++;}
switch (x) {
    case 1:
    case 2:{
        x++;
        break;}
    default:{
        x--;}
}
`;

let types = {
    IfStatement: ['consequent', 'alternate'],
    WhileStatement: ['body'],
    ForStatement: ['body'],
    ForInStatement: ['body'],
    DoWhileStatement: ['body'],
    WithStatement: ['body'],
    SwitchCase: ['consequent'],
};

let exceptions = {
    IfStatement: {alternate: 'IfStatement'},
};

describe('integrated/requireCurlyBraces', () => {
    it('should add curly braces to all supported statements', () => {
        let program = parseAndGetProgram(sourceCode, {strictMode: false});
        for (let typeName in types) {
            for (let node of program.selectNodesByType(typeName)) {
                for (let propName of types[typeName]) {
                    let propValue = node[propName];
                    if (propValue) {
                        let block = new BlockStatement([
                            Token.create('Punctuator', '{'),
                            Token.create('Punctuator', '}'),
                        ]);
                        if (Array.isArray(propValue)) {
                            let children = propValue;
                            if (children.length === 0) {
                                continue;
                            }

                            if (children.length === 1 && children.type === 'BlockStatement') {
                                continue;
                            }
                            let firstChild = children[0];
                            while (firstChild.previousSibling && firstChild.previousSibling.isNonCodeToken) {
                                firstChild = firstChild.previousSibling;
                            }

                            let lastChild = children[children.length - 1];
                            while (lastChild.nextSibling && lastChild.nextSibling.isNonCodeToken) {
                                lastChild = lastChild.nextSibling;
                            }

                            let body = node.getChildrenBetween(firstChild, lastChild);
                            node.replaceChildren(block, firstChild, lastChild);
                            block.insertChildBefore(new Fragment(body), block.lastChild);
                        } else {
                            let child = propValue;
                            if (child.type === 'BlockStatement') {
                                continue;
                            }

                            let exceptionType = exceptions[typeName] && exceptions[typeName][propName];
                            if (child.type === exceptionType) {
                                continue;
                            }

                            node.replaceChildren(block, child, child);
                            block.insertChildBefore(child, block.lastChild);
                        }
                    }
                }
            }
        }
        expect(program.getSourceCode()).to.equal(resultCode);
    });
});
