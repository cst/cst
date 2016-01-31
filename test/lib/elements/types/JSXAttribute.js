import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

// also JSXSpreadAttribute
describe('JSXAttribute', () => {
    it('allow self closing tag containing an attribute with no value', () => {
        const expression = parseAndGetExpression('< a b / >');
        expect(expression.openingElement.attributes.length).to.equal(1);
        expect(expression.openingElement.attributes[0].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[0].name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].name.name).to.equal('b');
        expect(expression.openingElement.attributes[0].value).to.equal(null);
    });

    it('allow self closing tag containing an attribute with a StringLiteral', () => {
        const expression = parseAndGetExpression('< a b = "3" / >');
        expect(expression.openingElement.attributes.length).to.equal(1);
        expect(expression.openingElement.attributes[0].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[0].name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].name.name).to.equal('b');
        expect(expression.openingElement.attributes[0].value.type).to.equal('StringLiteral');
        expect(expression.openingElement.attributes[0].value.value).to.equal('3');
        expect(expression.openingElement.attributes[0].value.raw).to.equal('"3"');
    });

    it('allow self closing tag containing an namespaced attribute with a StringLiteral', () => {
        const expression = parseAndGetExpression('< a b:c = "3" / >');
        expect(expression.openingElement.attributes.length).to.equal(1);
        expect(expression.openingElement.attributes[0].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[0].name.type).to.equal('JSXNamespacedName');
        expect(expression.openingElement.attributes[0].name.namespace.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].name.namespace.name).to.equal('b');
        expect(expression.openingElement.attributes[0].name.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].name.name.name).to.equal('c');
        expect(expression.openingElement.attributes[0].value.type).to.equal('StringLiteral');
        expect(expression.openingElement.attributes[0].value.value).to.equal('3');
        expect(expression.openingElement.attributes[0].value.raw).to.equal('"3"');
    });

    it('allow self closing tag containing an attribute with a JSXElement', () => {
        const expression = parseAndGetExpression('< a b = < c / > / >');
        expect(expression.openingElement.attributes.length).to.equal(1);
        expect(expression.openingElement.attributes[0].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[0].name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].name.name).to.equal('b');
        expect(expression.openingElement.attributes[0].value.type).to.equal('JSXElement');
        expect(expression.openingElement.attributes[0].value.openingElement.type).to.equal('JSXOpeningElement');
        expect(expression.openingElement.attributes[0].value.openingElement.name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].value.openingElement.name.name).to.equal('c');
        expect(expression.openingElement.attributes[0].value.openingElement.attributes.length).to.equal(0);
        expect(expression.openingElement.attributes[0].value.openingElement.selfClosing).to.equal(true);
        expect(expression.openingElement.attributes[0].value.closingElement).to.equal(null);
        expect(expression.openingElement.attributes[0].value.children.length).to.equal(0);
    });

    it('allow self closing tag containing an attribute with a JSXExpressionContainer', () => {
        const expression = parseAndGetExpression('< a b = {a} / >');
        expect(expression.openingElement.attributes.length).to.equal(1);
        expect(expression.openingElement.attributes[0].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[0].name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].name.name).to.equal('b');
        expect(expression.openingElement.attributes[0].value.type).to.equal('JSXExpressionContainer');
        expect(expression.openingElement.attributes[0].value.expression.type).to.equal('Identifier');
        expect(expression.openingElement.attributes[0].value.expression.name).to.equal('a');
    });

    it('allow self closing tag containing an JSXSpreadAttribute', () => {
        const expression = parseAndGetExpression('< a { ... b } / >');
        expect(expression.openingElement.attributes.length).to.equal(1);
        expect(expression.openingElement.attributes[0].type).to.equal('JSXSpreadAttribute');
        expect(expression.openingElement.attributes[0].argument.type).to.equal('Identifier');
        expect(expression.openingElement.attributes[0].argument.name).to.equal('b');
    });

    it('allow multiple attributes', () => {
        const expression = parseAndGetExpression('<input type="text" id="input" />');
        expect(expression.openingElement.attributes.length).to.equal(2);
        expect(expression.openingElement.attributes[0].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[0].name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].name.name).to.equal('type');
        expect(expression.openingElement.attributes[1].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[1].name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[1].name.name).to.equal('id');
    });

    it('allow multiple mixed attributes', () => {
        const expression = parseAndGetExpression('<input type="text" {...props} id="input" />');
        expect(expression.openingElement.attributes.length).to.equal(3);
        expect(expression.openingElement.attributes[0].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[0].name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[0].name.name).to.equal('type');
        expect(expression.openingElement.attributes[1].type).to.equal('JSXSpreadAttribute');
        expect(expression.openingElement.attributes[1].argument.type).to.equal('Identifier');
        expect(expression.openingElement.attributes[1].argument.name).to.equal('props');
        expect(expression.openingElement.attributes[2].type).to.equal('JSXAttribute');
        expect(expression.openingElement.attributes[2].name.type).to.equal('JSXIdentifier');
        expect(expression.openingElement.attributes[2].name.name).to.equal('id');
    });
});
