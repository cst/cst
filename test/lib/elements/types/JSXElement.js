import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

// also tests JSXOpeningElement and JSXClosingElement
describe('JSXElement', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('<a/>').type).to.equal('JSXElement');
    });

    it('allow self closing tag', () => {
        const expression = parseAndGetExpression('< a / >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name).to.equal('a');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(true);
        expect(expression.closingElement).to.equal(null);
        expect(expression.children.length).to.equal(0);
    });

    it('allow self closing tag containing an attribute without a value', () => {
        const expression = parseAndGetExpression('< a b / >');
        expect(expression.openingElement.attributes.length).to.equal(1);
        expect(expression.openingElement.attributes[0].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[0].name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].name.name).to.equal('b');
        expect(expression.openingElement.attributes[0].value).to.equal(null);
    });

    it('allow opening and closing tag', () => {
        const expression = parseAndGetExpression('< a >< / a >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name).to.equal('a');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(false);
        expect(expression.closingElement.type).to.equal('JSXClosingElement');
        expect(expression.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name).to.equal('a');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.children.length).to.equal(0);
    });

    it('allow opening and closing tag with JSXEmptyExpression', () => {
        const expression = parseAndGetExpression('< a >{}< / a >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name).to.equal('a');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(false);
        expect(expression.closingElement.type).to.equal('JSXClosingElement');
        expect(expression.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name).to.equal('a');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.children.length).to.equal(1);
        expect(expression.children[0].type).to.equal('JSXExpressionContainer');
        expect(expression.children[0].expression.type).to.equal('JSXEmptyExpression');
    });

    it('allow opening and closing tag with literal', () => {
        const expression = parseAndGetExpression('< a >asdf< / a >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name).to.equal('a');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(false);
        expect(expression.closingElement.type).to.equal('JSXClosingElement');
        expect(expression.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name).to.equal('a');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.children.length).to.equal(1);
        expect(expression.children[0].type).to.equal('JSXText');
        expect(expression.children[0].value).to.equal('asdf');

        // check the token is JSXIdentifier
        expect(expression.openingElement.childElements[2].type).to.equal('JSXIdentifier');
        // check the token is JSXText
        expect(expression.children[0].childElements[0].type).to.equal('JSXText');
    });

    it('allow opening and closing tag with children', () => {
        const expression = parseAndGetExpression('< a >{"a"}< / a >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name).to.equal('a');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(false);
        expect(expression.closingElement.type).to.equal('JSXClosingElement');
        expect(expression.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name).to.equal('a');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.children.length).to.equal(1);
        expect(expression.children[0].type).to.equal('JSXExpressionContainer');
        expect(expression.children[0].expression.type).to.equal('StringLiteral');
        expect(expression.children[0].expression.value).to.equal('a');
        expect(expression.children[0].expression.raw).to.equal('"a"');
    });
});
