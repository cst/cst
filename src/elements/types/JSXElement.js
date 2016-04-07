import Expression from '../Expression';

export default class JSXElement extends Expression {
    constructor(childNodes) {
        super('JSXElement', childNodes);
    }

    _acceptChildren(children) {
        let closingElement = null;
        let childrenProperty = [];

        let openingElement = children.passNode('JSXOpeningElement');
        if (!openingElement.selfClosing) {
            children.skipNonCode();
            while (!children.isNode('JSXClosingElement')) {
                childrenProperty.push(children.passOneOfNode(['JSXText', 'JSXExpressionContainer', 'JSXElement']));
            }
            children.skipNonCode();
            if (children.isNode('JSXClosingElement')) {
                closingElement = children.passNode('JSXClosingElement');
            }
        }
        children.assertEnd();

        this.children = childrenProperty;
        this.closingElement = closingElement;
        this.openingElement = openingElement;
    }
}
