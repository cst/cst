/* @flow */
import type Element from '../../elements/Element';
import Node from '../../elements/Node';
import Program from '../../elements/types/Program';
import BlockStatement from '../../elements/types/BlockStatement';
import Identifier from '../../elements/types/Identifier';
import Scope from './Scope';
import AssignmentPattern from '../../elements/types/AssignmentPattern';
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
import MethodDefinition from '../../elements/types/MethodDefinition';
import ImportDefaultSpecifier from '../../elements/types/ImportDefaultSpecifier';
import ImportNamespaceSpecifier from '../../elements/types/ImportNamespaceSpecifier';
import ImportSpecifier from '../../elements/types/ImportSpecifier';
import ThisExpression from '../../elements/types/ThisExpression';
import CatchClause from '../../elements/types/CatchClause';
import LabeledStatement from '../../elements/types/LabeledStatement';
import BreakStatement from '../../elements/types/BreakStatement';
import ContinueStatement from '../../elements/types/ContinueStatement';
import ClassExpression from '../../elements/types/ClassExpression';
import ClassDeclaration from '../../elements/types/ClassDeclaration';
import JSXIdentifier from '../../elements/types/JSXIdentifier';
import JSXAttribute from '../../elements/types/JSXAttribute';
import JSXElement from '../../elements/types/JSXElement';
import JSXMemberExpression from '../../elements/types/JSXMemberExpression';
import JSXNamespacedName from '../../elements/types/JSXNamespacedName';
import {types} from './Definition';

const scopedBlocks = {
    'ForStatement': true,
    'ForInStatement': true,
    'ForOfStatement': true,
    'SwitchStatement': true,
    'CatchClause': true
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

        if (node instanceof JSXIdentifier) {
            return this._addJSXIdentifier(node);
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
        this._scopesMap.set(node, new Scope({
            node,
            parentScope: this._getParentScopeFor(node),
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
                parentElement.type === 'CatchClause' ||
                parentElement.type === 'ArrowFunctionExpression' ||
                parentElement.type === 'FunctionExpression' ||
                parentElement.type === 'FunctionDeclaration'
            )
        ) {
            return;
        }
        this._scopesMap.set(node, new Scope({
            node,
            parentScope: this._getScopeFor(parentElement)
        }));
    }

    _addJSXIdentifier(node: JSXIdentifier) {
        let name = node.name;
        let scope = this._getScopeFor(node);
        let parentElement = node.parentElement;
        if (scope && parentElement) {
            if (parentElement instanceof JSXAttribute) {
                if (node === parentElement.name) {
                    return;
                }
            }
            if (parentElement instanceof JSXMemberExpression) {
                if (node === parentElement.property) {
                    return;
                }
            }
            if (parentElement instanceof JSXNamespacedName) {
                if (node === parentElement.name) {
                    return;
                }
            }
            scope._addReference({node, name, read: true, write: false});
        }
    }

    _addIdentifier(node: Identifier) {
        let scope = this._getScopeFor(node);
        let parentElement = node.parentElement;

        if (scope && parentElement) {
            let name = node.name;
            if (parentElement instanceof Property && parentElement.parentElement) {
                if (node === parentElement.key && !parentElement.shorthand) {
                    if (parentElement.computed) {
                        scope._addReference({node, name, read: true, write: false});
                    }
                    return;
                }
            }
            let topLevelPattern = node;
            while (topLevelPattern.parentElement) {
                if (topLevelPattern.parentElement instanceof Property) {
                    if (topLevelPattern.parentElement.parentElement.isPattern) {
                        topLevelPattern = topLevelPattern.parentElement.parentElement;
                        continue;
                    }
                }
                if (topLevelPattern.parentElement instanceof AssignmentPattern) {
                    if (topLevelPattern === topLevelPattern.parentElement.right) {
                        break;
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
                        if (topLevelPattern instanceof AssignmentPattern) {
                            scope._addReference({node, name, read: false, write: true});
                        }
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
                if (container instanceof CatchClause) {
                    if (container.param === topLevelPattern) {
                        scope._addDefinition({node, name, type: types.CatchClauseError});
                        return;
                    }
                }
                if (container instanceof AssignmentExpression) {
                    if (container.left === topLevelPattern) {
                        scope._addReference({node, name, read: container.operator !== '=', write: true});
                        return;
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
                    if (node === container.key && !container.computed && !container.shorthand) {
                        return;
                    }
                }
                if (container instanceof MethodDefinition) {
                    if (node === container.key && !container.computed) {
                        return;
                    }
                }
                if (container instanceof ImportDefaultSpecifier) {
                    scope._addDefinition({node, name, type: types.ImportBinding});
                    return;
                }
                if (container instanceof ImportNamespaceSpecifier) {
                    scope._addDefinition({node, name, type: types.ImportBinding});
                    return;
                }
                if (container instanceof ImportSpecifier) {
                    if (container.local === node) {
                        scope._addDefinition({node, name, type: types.ImportBinding});
                    }
                    return;
                }
                if (container instanceof ClassExpression) {
                    if (container.id === node) {
                        return;
                    }
                }
                if (container instanceof ClassDeclaration) {
                    if (container.id === node) {
                        let parentScope = this._getParentScopeFor(container);
                        if (parentScope) {
                            parentScope._addDefinition({node, name, type: types.LetVariable});
                            parentScope._addReference({
                                node: node,
                                name: node.name,
                                read: false,
                                write: true
                            });
                            return;
                        }
                    }
                }
                if (container instanceof FunctionDeclaration) {
                    if (node === container.id) {
                        let parentScope = this._getParentScopeFor(container);
                        if (parentScope) {
                            parentScope._addDefinition({
                                node: node,
                                name: node.name,
                                type: types.LetVariable
                            });
                            parentScope._addReference({
                                node: node,
                                name: node.name,
                                read: false,
                                write: true
                            });
                        }
                        return;
                    }
                }
                if (container instanceof FunctionExpression) {
                    if (node === container.id) {
                        scope._addDefinition({
                            node: node,
                            name: node.name,
                            type: types.LetVariable
                        });
                        scope._addReference({
                            node: node,
                            name: node.name,
                            read: false,
                            write: true
                        });
                        return;
                    }
                }
                if (container instanceof LabeledStatement) {
                    if (node === container.label) {
                        return;
                    }
                }
                if (container instanceof BreakStatement || container instanceof ContinueStatement) {
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
