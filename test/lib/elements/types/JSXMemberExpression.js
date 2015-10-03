import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('JSXMemberExpression', () => {
    it('allows JSXMemberExpression', () => {
        const expression = parseAndGetExpression('< a . b >< / a . b >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXMemberExpression');
        expect(expression.openingElement.name.object.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.object.name).to.equal('a');
        expect(expression.openingElement.name.property.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.property.name).to.equal('b');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(false);
        expect(expression.closingElement.type).to.equal('JSXClosingElement');
        expect(expression.closingElement.name.type).to.equal('JSXMemberExpression');
        expect(expression.closingElement.name.object.type).to.equal('JSXIdentifier');
        expect(expression.closingElement.name.object.name).to.equal('a');
        expect(expression.closingElement.name.property.type).to.equal('JSXIdentifier');
        expect(expression.closingElement.name.property.name).to.equal('b');
        expect(expression.children.length).to.equal(0);
    });

    it('allows nested JSXMemberExpression', () => {
        const expression = parseAndGetExpression('< a . b . c >< / a . b . c >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXMemberExpression');
        expect(expression.openingElement.name.object.type).to.equal('JSXMemberExpression');
        expect(expression.openingElement.name.object.object.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.object.object.name).to.equal('a');
        expect(expression.openingElement.name.object.property.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.object.property.name).to.equal('b');
        expect(expression.openingElement.name.property.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.property.name).to.equal('c');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(false);
        expect(expression.closingElement.type).to.equal('JSXClosingElement');
        expect(expression.closingElement.name.type).to.equal('JSXMemberExpression');
        expect(expression.closingElement.name.object.type).to.equal('JSXMemberExpression');
        expect(expression.closingElement.name.object.object.type).to.equal('JSXIdentifier');
        expect(expression.closingElement.name.object.object.name).to.equal('a');
        expect(expression.closingElement.name.object.property.type).to.equal('JSXIdentifier');
        expect(expression.closingElement.name.object.property.name).to.equal('b');
        expect(expression.closingElement.name.property.type).to.equal('JSXIdentifier');
        expect(expression.closingElement.name.property.name).to.equal('c');
        expect(expression.children.length).to.equal(0);
    });

    it('allows self closing JSXMemberExpression', () => {
        const expression = parseAndGetExpression('< a . b / >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXMemberExpression');
        expect(expression.openingElement.name.object.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.object.name).to.equal('a');
        expect(expression.openingElement.name.property.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.property.name).to.equal('b');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(true);
        expect(expression.closingElement).to.equal(null);
        expect(expression.children.length).to.equal(0);
    });

    it('allows self closing nested JSXMemberExpression', () => {
        const expression = parseAndGetExpression('< a . b . c / >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXMemberExpression');
        expect(expression.openingElement.name.object.type).to.equal('JSXMemberExpression');
        expect(expression.openingElement.name.object.object.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.object.object.name).to.equal('a');
        expect(expression.openingElement.name.object.property.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.object.property.name).to.equal('b');
        expect(expression.openingElement.name.property.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.property.name).to.equal('c');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(true);
        expect(expression.closingElement).to.equal(null);
        expect(expression.children.length).to.equal(0);
    });
});
