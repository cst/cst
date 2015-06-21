import Benchmark from 'benchmark';
import chalk from 'chalk';
import elementIndex from '../../lib/elements/elementIndex';
import {readFileSync} from 'fs';
import Parser from '../../lib/Parser';

import {
    ArrayChildren,
    ListChildren,
    ListChildrenNonRecursive,
    ListChildrenRecursiveClosure
} from './elements/noIndexElements';

import {
    SetIndex,
    HashIndex
} from './elements/indexElements';

let tests = [];

function test(testName, cases) {
    tests.push([testName, cases]);
}

let availableTypes = Object.keys(elementIndex);

(() => {
    const code = readFileSync(__dirname + '/../../node_modules/esprima-fb/esprima.js', 'utf8');
    let parser = new Parser();
    test('CST building costs', {
        'Parse (esprima)': function() {
            parser._parseAst(code);
        },
        'Parse, fix tokens': function() {
            parser._processTokens(parser._parseAst(code), code);
        },
        'Parse, fix tokens, build CST': function() {
            parser.parse(code);
        }
    });
})();

(() => {
    const childrenCount = 3;
    const depth = 7;
    let [arrayTree, counts] = buildElementTree(ArrayChildren, depth, childrenCount);
    let [listTree] = buildElementTree(ListChildren, depth, childrenCount);
    let [listNonRecursiveTree] = buildElementTree(ListChildrenNonRecursive, depth, childrenCount);
    let [listRecursiveClosureTree] = buildElementTree(ListChildrenRecursiveClosure, depth, childrenCount);
    let [setIndexTree] = buildElementTree(SetIndex, depth, childrenCount);
    let [hashIndexTree] = buildElementTree(HashIndex, depth, childrenCount);
    test('Searching by type', {
        'NO INDEX, Array children': function() {
            for (let type of availableTypes) {
                let count = arrayTree.select(type).length;
                if (counts[type] !== count) {
                    console.log(type + ' ' + count + ' vs ' + counts[type]);
                }
            }
        },
        'NO INDEX, List children': function() {
            for (let type of availableTypes) {
                let count = listTree.select(type).length;
                if (counts[type] !== count) {
                    console.log(type + ' ' + count + ' vs ' + counts[type]);
                }
            }
        },
        'NO INDEX, List children, non recursive': function() {
            for (let type of availableTypes) {
                let count = listNonRecursiveTree.select(type).length;
                if (counts[type] !== count) {
                    console.log(type + ' ' + count + ' vs ' + counts[type]);
                }
            }
        },
        'NO INDEX, List children, closure recursive': function() {
            for (let type of availableTypes) {
                let count = listRecursiveClosureTree.select(type).length;
                if (counts[type] !== count) {
                    console.log(type + ' ' + count + ' vs ' + counts[type]);
                }
            }
        },
        'INDEX, using sets': function() {
            for (let type of availableTypes) {
                let count = setIndexTree.select(type).length;
                if (counts[type] !== count) {
                    console.log(type + ' ' + count + ' vs ' + counts[type]);
                }
            }
        },
        'INDEX, using hashes': function() {
            for (let type of availableTypes) {
                let count = hashIndexTree.select(type).length;
                if (counts[type] !== count) {
                    console.log(type + ' ' + count + ' vs ' + counts[type]);
                    throw new Error(';');
                }
            }
        }
    });
})();

function buildElementTree(ElementClass, depth, childrenCount) {
    let elements = new Array(Math.pow(childrenCount, depth));
    let counts = {};
    for (let i = 0; i < elements.length; i++) {
        let type = availableTypes[i % availableTypes.length];
        counts[type] = counts[type] || 0;
        counts[type]++;
        elements[i] = new ElementClass(type, []);
    }

    while (elements.length > 1) {
        let parentElements = new Array(elements.length / 3);
        for (let i = 0; i < parentElements.length; i++) {
            let type = availableTypes[i % availableTypes.length];
            counts[type] = counts[type] || 0;
            counts[type]++;
            parentElements[i] = new ElementClass(
                type,
                elements.slice(i * childrenCount, (i + 1) * childrenCount)
            );
        }
        elements = parentElements;
    }

    return [elements[0], counts];
}

runTests();

function keepRunning() {
    let test = tests.shift();
    if (test) {
        let [testName, cases] = test;
        let suite = new Benchmark.Suite();
        Object.keys(cases).forEach(function(caseName) {
            suite.add(caseName, cases[caseName]);
        });
        suite.on('cycle', function(event) {
            console.log('   - ' + chalk.blue(String(event.target)));
        });
        suite.on('complete', function() {
            console.log('  Fastest is ' + chalk.bold(this.filter('fastest').pluck('name')) + '\n');
            keepRunning();
        });
        suite.on('error', function(event) {
            console.log(event.target.error);
        });

        console.log(chalk.green(testName));
        suite.run({async: true});
    }
}

function runTests() {
    keepRunning();
}
