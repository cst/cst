/* @flow */
import type Program from '../../elements/types/Program';
import type Element from '../../elements/Element';
import Node from '../../elements/Node';
import Identifier from '../../elements/types/Identifier';
import Scope from './Scope';
import FunctionExpression from '../../elements/types/FunctionExpression';
import FunctionDeclaration from '../../elements/types/FunctionDeclaration';
import ArrowFunctionExpression from '../../elements/types/ArrowFunctionExpression';
import VariableDeclarator from '../../elements/types/VariableDeclarator';
import VariableDeclaration from '../../elements/types/VariableDeclaration';
import AssignmentExpression from '../../elements/types/AssignmentExpression';
import UpdateExpression from '../../elements/types/UpdateExpression';
import ForOfStatement from '../../elements/types/ForOfStatement';
import ForInStatement from '../../elements/types/ForInStatement';
import MemberExpression from '../../elements/types/MemberExpression';
import Property from '../../elements/types/Property';
import ImportDefaultSpecifier from '../../elements/types/ImportDefaultSpecifier';
import {types} from './Definition';

export default class ScopesApi {
    constructor(program: Program) {
        program.on('elements-add', (elements: Element[]) => {
            elements.map(this._addElement, this);
        });
        program.on('elements-remove', (elements: Element[]) => {
            elements.map(this._removeElement, this);
        });
        this._scopesMap = new Map();
        this._program = program;
        this._addElement(program);
    }

    _program: Program;
    _scopesMap: Map<Element, Scope>;

    _addElement(element: Element) {
        if (element instanceof Node) {
            let nodes = buildNodeList((element: Node));
            for (let i = 0; i < nodes.length; i++) {
                this._addNode(nodes[i]);
            }
        }
    }

    _removeElement(element: Element) {
        if (element instanceof Node) {
            let nodes = buildNodeList((element: Node));
            for (let i = 0; i < nodes.length; i++) {
                this._removeNode(nodes[i]);
            }
        }
    }

    _addNode(node: Node) {
        if (node.type === 'Program') {
            this._scopesMap.set(node, new Scope({
                node,
                parentScope: undefined,
                isFunctionScope: true
            }));
            return;
        }

        let parentElement = node.parentElement;
        let parentScope = this._getScopeFor(parentElement);

        if (!parentScope || !parentElement) {
            return;
        }

        switch (node.type) {
            case 'FunctionExpression':
                this._scopesMap.set(node, new Scope({
                    node,
                    parentScope,
                    isFunctionScope: true
                }));
                return;
            case 'FunctionDeclaration':
                let functionId = node.id;
                if (functionId instanceof Identifier) {
                    parentScope._addDefinition({
                        node: functionId,
                        name: functionId.name,
                        type: types.Variable
                    });
                    parentScope._addReference({
                        node: functionId,
                        name: functionId.name,
                        read: false,
                        write: true
                    });
                }
                this._scopesMap.set(node, new Scope({
                    node,
                    parentScope,
                    isFunctionScope: true
                }));
                return;
            case 'ArrowFunctionExpression':
                this._scopesMap.set(node, new Scope({
                    node,
                    parentScope,
                    isFunctionScope: true,
                    isArrowFunctionScope: true
                }));
                return;
            case 'ForStatement':
            case 'ForInStatement':
            case 'ForOfStatement':
            case 'SwitchStatement':
                this._scopesMap.set(node, new Scope({
                    node,
                    parentScope
                }));
                return;
            case 'BlockStatement':
                if (
                    parentElement &&
                    (
                        parentElement.type === 'ForStatement' ||
                        parentElement.type === 'ForInStatement' ||
                        parentElement.type === 'CatchClause'
                    )
                ) {
                    return;
                }
                this._scopesMap.set(node, new Scope({
                    node,
                    parentScope
                }));
                return;
        }

        let scope = this._getScopeFor(node);

        if (scope && node instanceof Identifier) {
            let name = node.name;
            let topLevelPattern = node;
            while (topLevelPattern.parentElement) {
                if (!topLevelPattern.parentElement.isPattern) {
                    break;
                }
                topLevelPattern = topLevelPattern.parentElement;
            }
            let container = topLevelPattern.parentElement;
            if (container) {
                if (
                    container instanceof FunctionExpression ||
                    container instanceof FunctionDeclaration ||
                    container instanceof ArrowFunctionExpression
                ) {
                    if (container.params.indexOf(topLevelPattern) !== -1) {
                        scope._addDefinition({node, name, type: types.Parameter});
                        return;
                    }
                }
                if (container instanceof VariableDeclarator) {
                    let type = types.Variable;
                    let variableDeclaration = container.parentElement;
                    if (variableDeclaration && variableDeclaration instanceof VariableDeclaration) {
                        if (variableDeclaration.kind === 'let') {
                            type = types.LetVariable;
                        }
                        if (variableDeclaration.kind === 'const') {
                            type = types.Constant;
                        }
                        scope._addDefinition({node, name, type});
                        let write = container.expression.init ||
                            variableDeclaration.parentElement instanceof ForOfStatement ||
                            variableDeclaration.parentElement instanceof ForInStatement;
                        if (write) {
                            scope._addReference({node, name, read: false, write: true});
                        }
                    }
                    return;
                }
                if (container instanceof AssignmentExpression) {
                    if (container.left === topLevelPattern) {
                        scope._addReference({node, name, read: container.operator !== '=', write: true});
                    }
                }
                if (container instanceof UpdateExpression) {
                    if (container.argument === topLevelPattern) {
                        scope._addReference({node, name, read: true, write: true});
                    }
                }
                if (container instanceof MemberExpression) {
                    if (node === container.property && !container.computed) {
                        return;
                    }
                }
                if (container instanceof Property) {
                    if (node === container.key && !container.computed) {
                        return;
                    }
                }
                scope._addReference({node, name, read: true, write: false});
            }
        }
    }

    _removeNode(node: Node) {

    }

    _getScopeFor(element: ?Element): ?Scope {
        while (element) {
            let scope = this._scopesMap.get(element);
            if (scope) {
                return scope;
            }
            element = element.parentElement;
        }
        return null;
    }

    acquire(element: Element): ?Scope {
        return this._scopesMap.get(element);
    }
}

function buildNodeList(parentNode: Node): Node[] {
    let result: Node[] = [parentNode];
    let nodesToProcess: Node[] = [parentNode];
    while (nodesToProcess.length > 0) {
        let node = nodesToProcess.shift();
        let childElements = node.childElements;
        for (let element of childElements) {
            if (element instanceof Node) {
                result.push(element);
                nodesToProcess.push(element);
            }
        }
    }
    return result;
}
