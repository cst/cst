/* @flow */
import type Element from '../../elements/Element';
import Node from '../../elements/Node';
import Program from '../../elements/types/Program';
import BlockStatement from '../../elements/types/BlockStatement';
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
import ThisExpression from '../../elements/types/ThisExpression';
import {types} from './Definition';

const scopedBlocks = {
    'ForStatement': true,
    'ForInStatement': true,
    'ForOfStatement': true,
    'SwitchStatement': true
};

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
        if (node instanceof Program) {
            return this._addProgram(node);
        }

        if (node instanceof FunctionExpression) {
            return this._addFunctionExpression(node);
        }

        if (node instanceof FunctionDeclaration) {
            return this._addFunctionDeclaration(node);
        }

        if (node instanceof ArrowFunctionExpression) {
            return this._addArrowFunctionExpression(node);
        }

        if (node.type in scopedBlocks) {
            return this._addScopedBlock(node);
        }

        if (node instanceof BlockStatement) {
            return this._addBlockStatement(node);
        }

        if (node instanceof ThisExpression) {
            return this._addThisExpression(node);
        }

        if (node instanceof Identifier) {
            return this._addIdentifier(node);
        }
    }

    _addProgram(node: Program) {
        this._scopesMap.set(node, new Scope({
            node,
            parentScope: undefined,
            isFunctionScope: true
        }));
    }

    _addFunctionExpression(node: FunctionExpression) {
        this._scopesMap.set(node, new Scope({
            node,
            parentScope: this._getParentScopeFor(node),
            isFunctionScope: true
        }));
    }

    _addFunctionDeclaration(node: FunctionDeclaration) {
        let parentScope = this._getParentScopeFor(node);
        this._scopesMap.set(node, new Scope({
            node,
            parentScope,
            isFunctionScope: true
        }));
    }

    _addArrowFunctionExpression(node: ArrowFunctionExpression) {
        this._scopesMap.set(node, new Scope({
            node,
            parentScope: this._getParentScopeFor(node),
            isFunctionScope: true,
            isArrowFunctionScope: true
        }));
    }

    _addScopedBlock(node: Node) {
        this._scopesMap.set(node, new Scope({
            node,
            parentScope: this._getParentScopeFor(node)
        }));
    }

    _addBlockStatement(node: BlockStatement) {
        let parentElement = node.parentElement;
        if (
            parentElement &&
            (
                parentElement.type === 'ForStatement' ||
                parentElement.type === 'ForInStatement' ||
                parentElement.type === 'ForOfStatement' ||
                parentElement.type === 'CatchClause'
            )
        ) {
            return;
        }
        this._scopesMap.set(node, new Scope({
            node,
            parentScope: this._getScopeFor(parentElement)
        }));
    }

    _addIdentifier(node: Identifier) {
        let scope = this._getScopeFor(node);
        let parentElement = node.parentElement;

        if (scope && parentElement) {
            if (parentElement instanceof Property) {
                if (parentElement.parentElement) {
                    if (node === parentElement.key && !parentElement.shorthand) {
                        if (parentElement.computed) {
                            scope._addReference({node, name, read: true, write: false});
                        }
                        return;
                    }
                }
            }
            let name = node.name;
            let topLevelPattern = node;
            while (topLevelPattern.parentElement) {
                if (topLevelPattern.parentElement instanceof Property) {
                    if (topLevelPattern.parentElement.parentElement.isPattern) {
                        topLevelPattern = topLevelPattern.parentElement.parentElement;
                        continue;
                    }
                }
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
                        let write = container.init ||
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
                        return;
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
                if (container instanceof FunctionDeclaration) {
                    if (node === container.id) {
                        let parentScope = this._getParentScopeFor(container);
                        if (parentScope) {
                            parentScope._addDefinition({
                                node: node,
                                name: node.name,
                                type: types.Variable
                            });
                            parentScope._addReference({
                                node: node,
                                name: node.name,
                                read: false,
                                write: true
                            });
                        }
                    }
                    return;
                }
                scope._addReference({node, name, read: true, write: false});
            }
        }
    }

    _addThisExpression(node: ThisExpression) {
        let scope = this._getScopeFor(node);
        if (scope) {
            scope._addReference({node, name: 'this', read: true, write: false});
        }
    }

    _removeNode(node: Node) {

    }

    _getParentScopeFor(element: Element): ?Scope {
        return this._getScopeFor(element.parentElement);
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
