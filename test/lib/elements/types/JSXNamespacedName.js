import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('JSXNamespacedName', () => {
    it('allows JSXNamespacedName', () => {
        const expression = parseAndGetExpression('< a : b >< / a : b >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXNamespacedName');
        expect(expression.openingElement.name.namespace.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.namespace.name).to.equal('a');
        expect(expression.openingElement.name.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name.name).to.equal('b');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(false);
        expect(expression.closingElement.type).to.equal('JSXClosingElement');
        expect(expression.closingElement.name.type).to.equal('JSXNamespacedName');
        expect(expression.closingElement.name.namespace.type).to.equal('JSXIdentifier');
        expect(expression.closingElement.name.namespace.name).to.equal('a');
        expect(expression.closingElement.name.name.type).to.equal('JSXIdentifier');
        expect(expression.closingElement.name.name.name).to.equal('b');
        expect(expression.children.length).to.equal(0);
    });

    it('allows self closing JSXNamespacedName', () => {
        const expression = parseAndGetExpression('< a : b / >');
        expect(expression.type).to.equal('JSXElement');
        expect(expression.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.name.type).to.equal('JSXNamespacedName');
        expect(expression.openingElement.name.namespace.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.namespace.name).to.equal('a');
        expect(expression.openingElement.name.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.name.name.name).to.equal('b');
        expect(expression.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.selfClosing).to.equal(true);
        expect(expression.closingElement).to.equal(null);
        expect(expression.children.length).to.equal(0);
    });
});
