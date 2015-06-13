import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('LabeledStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('lbl: {}').type).to.equal('LabeledStatement');
    });

    it('should accept loop statement', () => {
        var statement = parseAndGetStatement('lbl: while(true);');
        expect(statement.type).to.equal('LabeledStatement');
        expect(statement.label.name).to.equal('lbl');
        expect(statement.body.type).to.equal('WhileStatement');
    });

    it('should accept whitespaces', () => {
        var statement = parseAndGetStatement('lbl : while(true);');
        expect(statement.type).to.equal('LabeledStatement');
        expect(statement.label.name).to.equal('lbl');
        expect(statement.body.type).to.equal('WhileStatement');
    });
});
