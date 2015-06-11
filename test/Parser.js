import {expect} from 'chai';
import Parser from '../lib/Parser';

describe('Parser', () => {
    it('should work', () => {
        var parser = new Parser();
        console.log(parser.parse('x = (x) => (132);\n').code);
    });
});
