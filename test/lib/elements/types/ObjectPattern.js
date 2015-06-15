import {parseAndGetPattern} from '../../../utils';
import {expect} from 'chai';

describe('ObjectPattern', () => {
    it('should return correct type', () => {
        expect(parseAndGetPattern('{x}').type).to.equal('ObjectPattern');
    });

    it('should accept single key', () => {
        let pattern = parseAndGetPattern('{x}');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('x');
    });

    it('should accept single key with trailing comma', () => {
        let pattern = parseAndGetPattern('{x,}');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('x');
    });

    it('should accept single key with spaces', () => {
        let pattern = parseAndGetPattern('{ x }');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('x');
    });

    it('should accept single key with spaces and trailing comma', () => {
        let pattern = parseAndGetPattern('{ x , }');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('x');
    });

    it('should accept multiple keys', () => {
        let pattern = parseAndGetPattern('{x,y,z}');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('x');
        expect(pattern.properties[1].key.type).to.equal('Identifier');
        expect(pattern.properties[1].key.name).to.equal('y');
        expect(pattern.properties[1].value.type).to.equal('Identifier');
        expect(pattern.properties[1].value.name).to.equal('y');
        expect(pattern.properties[2].key.type).to.equal('Identifier');
        expect(pattern.properties[2].key.name).to.equal('z');
        expect(pattern.properties[2].value.type).to.equal('Identifier');
        expect(pattern.properties[2].value.name).to.equal('z');
    });

    it('should accept multiple keys with trailing comma', () => {
        let pattern = parseAndGetPattern('{x,y,z,}');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('x');
        expect(pattern.properties[1].key.type).to.equal('Identifier');
        expect(pattern.properties[1].key.name).to.equal('y');
        expect(pattern.properties[1].value.type).to.equal('Identifier');
        expect(pattern.properties[1].value.name).to.equal('y');
        expect(pattern.properties[2].key.type).to.equal('Identifier');
        expect(pattern.properties[2].key.name).to.equal('z');
        expect(pattern.properties[2].value.type).to.equal('Identifier');
        expect(pattern.properties[2].value.name).to.equal('z');
    });

    it('should accept multiple keys with spaces', () => {
        let pattern = parseAndGetPattern('{ x , y , z }');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('x');
        expect(pattern.properties[1].key.type).to.equal('Identifier');
        expect(pattern.properties[1].key.name).to.equal('y');
        expect(pattern.properties[1].value.type).to.equal('Identifier');
        expect(pattern.properties[1].value.name).to.equal('y');
        expect(pattern.properties[2].key.type).to.equal('Identifier');
        expect(pattern.properties[2].key.name).to.equal('z');
        expect(pattern.properties[2].value.type).to.equal('Identifier');
        expect(pattern.properties[2].value.name).to.equal('z');
    });

    it('should accept multiple keys with spaces and trailing comma', () => {
        let pattern = parseAndGetPattern('{ x , y , z , }');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('x');
        expect(pattern.properties[1].key.type).to.equal('Identifier');
        expect(pattern.properties[1].key.name).to.equal('y');
        expect(pattern.properties[1].value.type).to.equal('Identifier');
        expect(pattern.properties[1].value.name).to.equal('y');
        expect(pattern.properties[2].key.type).to.equal('Identifier');
        expect(pattern.properties[2].key.name).to.equal('z');
        expect(pattern.properties[2].value.type).to.equal('Identifier');
        expect(pattern.properties[2].value.name).to.equal('z');
    });

    it('should accept single key with value', () => {
        let pattern = parseAndGetPattern('{x:y}');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('y');
    });

    it('should accept single key with trailing comma', () => {
        let pattern = parseAndGetPattern('{x:y,}');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('y');
    });

    it('should accept single key with spaces', () => {
        let pattern = parseAndGetPattern('{ x : y }');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('y');
    });

    it('should accept single key with spaces and trailing comma', () => {
        let pattern = parseAndGetPattern('{ x : y , }');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('y');
    });

    it('should accept multiple keys with values', () => {
        let pattern = parseAndGetPattern('{x:y,y:z,z:w}');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('y');
        expect(pattern.properties[1].key.type).to.equal('Identifier');
        expect(pattern.properties[1].key.name).to.equal('y');
        expect(pattern.properties[1].value.type).to.equal('Identifier');
        expect(pattern.properties[1].value.name).to.equal('z');
        expect(pattern.properties[2].key.type).to.equal('Identifier');
        expect(pattern.properties[2].key.name).to.equal('z');
        expect(pattern.properties[2].value.type).to.equal('Identifier');
        expect(pattern.properties[2].value.name).to.equal('w');
    });

    it('should accept multiple keys with values and trailing comma', () => {
        let pattern = parseAndGetPattern('{x:y,y:z,z:w,}');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('y');
        expect(pattern.properties[1].key.type).to.equal('Identifier');
        expect(pattern.properties[1].key.name).to.equal('y');
        expect(pattern.properties[1].value.type).to.equal('Identifier');
        expect(pattern.properties[1].value.name).to.equal('z');
        expect(pattern.properties[2].key.type).to.equal('Identifier');
        expect(pattern.properties[2].key.name).to.equal('z');
        expect(pattern.properties[2].value.type).to.equal('Identifier');
        expect(pattern.properties[2].value.name).to.equal('w');
    });

    it('should accept multiple keys with values and spaces', () => {
        let pattern = parseAndGetPattern('{ x : y , y : z , z : w }');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('y');
        expect(pattern.properties[1].key.type).to.equal('Identifier');
        expect(pattern.properties[1].key.name).to.equal('y');
        expect(pattern.properties[1].value.type).to.equal('Identifier');
        expect(pattern.properties[1].value.name).to.equal('z');
        expect(pattern.properties[2].key.type).to.equal('Identifier');
        expect(pattern.properties[2].key.name).to.equal('z');
        expect(pattern.properties[2].value.type).to.equal('Identifier');
        expect(pattern.properties[2].value.name).to.equal('w');
    });

    it('should accept multiple keys with values and spaces and trailing comma', () => {
        let pattern = parseAndGetPattern('{ x : y , y : z , z : w , }');
        expect(pattern.properties[0].key.type).to.equal('Identifier');
        expect(pattern.properties[0].key.name).to.equal('x');
        expect(pattern.properties[0].value.type).to.equal('Identifier');
        expect(pattern.properties[0].value.name).to.equal('y');
        expect(pattern.properties[1].key.type).to.equal('Identifier');
        expect(pattern.properties[1].key.name).to.equal('y');
        expect(pattern.properties[1].value.type).to.equal('Identifier');
        expect(pattern.properties[1].value.name).to.equal('z');
        expect(pattern.properties[2].key.type).to.equal('Identifier');
        expect(pattern.properties[2].key.name).to.equal('z');
        expect(pattern.properties[2].value.type).to.equal('Identifier');
        expect(pattern.properties[2].value.name).to.equal('w');
    });
});
