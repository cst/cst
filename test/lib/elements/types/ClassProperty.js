import {expect} from 'chai';

import {parseAndGetClassMember} from '../../../utils';

describe('ClassProperty', () => {
    it('accepts property', () => {
        let member = parseAndGetClassMember('x = 1');
        expect(member.key.type).to.equal('Identifier');
        expect(member.key.name).to.equal('x');
        expect(member.value.type).to.equal('NumericLiteral');
        expect(member.value.value).to.equal(1);
        expect(member.static).to.equal(false);
        expect(member.computed).to.equal(false);
    });

    it('accepts static property', () => {
        let member = parseAndGetClassMember('static x = 1');
        expect(member.static).to.equal(true);
    });

    it('accepts undefined property', () => {
        let member = parseAndGetClassMember('x');
        expect(member.value).to.equal(null);
    });
});
