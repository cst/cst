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
    HashIndex,
    ArrayIndex
} from './elements/indexElements';

let tests = [];

function test(testName, cases) {
    if (Array.isArray(cases)) {
        cases = cases.reduce((obj, [caseName, caseCallback]) => {
            obj[caseName] = caseCallback;
            return obj;
        }, {});
    }
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

    let structureTypes = {
        'NO INDEX, Array children': ArrayChildren,
        'NO INDEX, List children': ListChildren,
        'NO INDEX, List children, non recursive': ListChildrenNonRecursive,
        'NO INDEX, List children, closure recursive': ListChildrenRecursiveClosure,
        'INDEX, using sets': SetIndex,
        'INDEX, using hashes': HashIndex,
        'INDEX, using arrays': ArrayIndex
    };

    let [, counts] = buildElementTree(ListChildren, depth, childrenCount);

    test('Building structure', Object.keys(structureTypes).map(function(typeName) {
        let StructureType = structureTypes[typeName];
        return [typeName, function() {
            buildElementTree(StructureType, depth, childrenCount);
        }];
    }));

    test('Searching by type', Object.keys(structureTypes).map(function(typeName) {
        let [structure] = buildElementTree(structureTypes[typeName], depth, childrenCount);
        var callback = function callback() {
            for (let type of availableTypes) {
                let count = structure.select(type).length;
                if (counts[type] !== count) {
                    console.log(type + ' ' + count + ' vs ' + counts[type]);
                }
            }
        };
        return [typeName, callback];
    }));

    test('Removing, then readding', Object.keys(structureTypes).map(function(typeName) {
        let [structure] = buildElementTree(structureTypes[typeName], depth, childrenCount);
        let callback = function callback() {
            for (let type of availableTypes) {
                let nodes = structure.select(type);
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    if (node !== structure) {
                        let parent = node._parent;
                        parent.removeChild(node);
                        parent.appendChild(node);
                    }
                }
            }
        };
        return [typeName, callback];
    }));
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
                elements.slice(i * childrenCount, (i + 1) * childrenCount),
                parentElements.length === 1
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
