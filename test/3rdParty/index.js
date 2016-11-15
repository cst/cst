import forEach from 'lodash.foreach';
import get from 'lodash.get';
import { multiple as getFixtures } from 'babel-helper-fixtures';
import { parseAndGetProgram } from '../utils';
import xfail from './xfail.json';

function runTest(task) {
    const code = task.actual.code;
    const throws = task.options.throws;
    try {
        parseAndGetProgram(code);
    } catch (err) {
        if (throws) {
            return;
        }
        throw err;
    }

    if (throws) {
        throw new Error(`Expected error message: ${throws}`);
    }
}

function createTest(name, testSuite, task) {
    const shouldXFail = get(xfail, [name, testSuite.title, task.title]);
    const testName = `:: ${task.title}`;
    if (shouldXFail === 'skip') {
        // this test actually hangs the test suite!
        return it.skip(testName);
    }
    it(testName, function() {
        if (shouldXFail) {
            try {
                return runTest(task);
            } catch (e) {
                this.skip();
            }
            throw Error('This test should fail!');
        }

        runTest(task);
    });
}

function createTests(fixtures) {
    forEach(fixtures, function(suites, name) {
        describe(`:: ${name}`, function() {
            forEach(suites, function(testSuite) {
                describe(`:: ${testSuite.title}`, function() {
                    forEach(testSuite.tests, function(task) {
                        createTest(name, testSuite, task);
                    });
                });
            });
        });
    });
}

describe('babylon fixture tests', function() {
    const fixtures = (function() {
        try {
            return getFixtures(__dirname + '/babylon/test/fixtures');
        } catch (e) {
            if (e.code !== 'ENOENT') {
                throw e;
            }
        }
    })();

    if (fixtures) {
        createTests(fixtures);
    } else {
        it.skip('No babylon fixtures available');
    }
});
