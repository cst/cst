import Parser from '../../src/Parser';
import visitorKeys from '../../src/visitorKeys';

import {expect} from 'chai';

describe('Parser::parse', () => {
    let code;

    beforeEach(() => {
        code = `class test {
			render = () => {}
		}`;

        delete visitorKeys.ClassProperty;
    });

    it('should iterate by types only', () => {
        try {
            new Parser().parse(code);
            expect(false).to.equal(true);

        } catch (e) {
            expect(e.message).to.equal('Cannot iterate using ClassProperty');
            expect(e.loc).to.deep.equal({line: 2, column: 3});
        }
    });
});
