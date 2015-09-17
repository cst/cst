import {parseAndGetStatement} from '../../../utils';
import Token from '../../../../src/elements/Token';
import {expect} from 'chai';

describe('TryStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('try{;}finally{;}').type).to.equal('TryStatement');
    });

    it('should accept statements', () => {
        var statement = parseAndGetStatement('try { x; } finally { y; }');
        expect(statement.block.body[0].expression.name).to.equal('x');
        expect(statement.finalizer.body[0].expression.name).to.equal('y');
    });

    it('should accept catch statement', () => {
        var statement = parseAndGetStatement('try { x; } catch ( e ) { y; } finally { z; }');
        expect(statement.block.body[0].expression.name).to.equal('x');
        expect(statement.handler.param.name).to.equal('e');
        expect(statement.handler.body.body[0].expression.name).to.equal('y');
        expect(statement.finalizer.body[0].expression.name).to.equal('z');
    });

    it('should not accept trailing whitespace', () => {
        var statement = parseAndGetStatement('try { x; } catch ( e ) { y; } finally { z; }');
        expect(() => {
            statement.appendChild(new Token('Whitespace', '   '));
        }).to.throw('Expected end of node list but "Whitespace" found');
    });
});
