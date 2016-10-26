import {parseAndGetProgram} from '../../utils';
import {expect} from 'chai';

describe('Parser', () => {
    it('should support hash bang', () => {
        let program = parseAndGetProgram('#!/usr/bin/env node\n/* hello */');
        expect(program.getFirstToken().type).to.equal('Hashbang');
        expect(program.getFirstToken().value).to.equal('/usr/bin/env node');
        expect(program.getFirstToken().getSourceCode()).to.equal('#!/usr/bin/env node');
    });

    it('should handle simple newlines', () => {
        expect(() => {
            parseAndGetProgram('function foo(){ return\n; }');
        }).to.not.throw();
    });

    // https://developer.apple.com/library/watchos/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/UIAutomation.html
    it('should support apple instrumentation directives', () => {
        let program = parseAndGetProgram('#import "1.js"\n#import "2.js"\n/* hello */', {
            languageExtensions: {
                appleInstrumentationDirectives: true,
            },
        });
        expect(program.childElements[0].type).to.equal('AppleInstrumentationDirective');
        expect(program.childElements[0].value).to.equal('import "1.js"');
        expect(program.childElements[1].type).to.equal('Whitespace');
        expect(program.childElements[1].value).to.equal('\n');
        expect(program.childElements[2].type).to.equal('AppleInstrumentationDirective');
        expect(program.childElements[2].value).to.equal('import "2.js"');
        expect(program.childElements[3].type).to.equal('Whitespace');
        expect(program.childElements[3].value).to.equal('\n');
        expect(program.childElements[4].type).to.equal('CommentBlock');
        expect(program.childElements[4].value).to.equal(' hello ');
    });

    // https://www.chromium.org/developers/web-development-style-guide
    it('should support grit directives', () => {
        let program = parseAndGetProgram('<include src="assert1.js">\n<include src="assert2.js">\n/* hello */', {
            languageExtensions: {
                gritDirectives: true,
            },
        });
        expect(program.childElements[0].type).to.equal('GritDirective');
        expect(program.childElements[0].value).to.equal('include src="assert1.js"');
        expect(program.childElements[1].type).to.equal('Whitespace');
        expect(program.childElements[1].value).to.equal('\n');
        expect(program.childElements[2].type).to.equal('GritDirective');
        expect(program.childElements[2].value).to.equal('include src="assert2.js"');
        expect(program.childElements[3].type).to.equal('Whitespace');
        expect(program.childElements[3].value).to.equal('\n');
        expect(program.childElements[4].type).to.equal('CommentBlock');
        expect(program.childElements[4].value).to.equal(' hello ');
    });

    // https://developer.apple.com/library/watchos/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/UIAutomation.html
    it('should support ios imports', () => {
        let program = parseAndGetProgram('#import "abc.js"\n#import abc.js\nvar a = 5;', {
            languageExtensions: {
                appleInstrumentationDirectives: true,
            },
        });

        expect(program.childElements[0].type).to.equal('AppleInstrumentationDirective');
        expect(program.childElements[0].value).to.equal('import "abc.js"');

        expect(program.childElements[1].type).to.equal('Whitespace');
        expect(program.childElements[1].value).to.equal('\n');

        expect(program.childElements[2].type).to.equal('AppleInstrumentationDirective');
        expect(program.childElements[2].value).to.equal('import abc.js');

        expect(program.childElements[3].type).to.equal('Whitespace');
        expect(program.childElements[3].value).to.equal('\n');

        expect(program.childElements[4].type).to.equal('VariableDeclaration');
    });
});
