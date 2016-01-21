/* @flow */
import type Variable from './Variable';
import type Reference from './Reference';
import type Definition from './Definition';
import type Element from '../../elements/Element';
import Token from '../../elements/Token';
import Node from '../../elements/Node';
import Program from '../../elements/types/Program';
import BlockStatement from '../../elements/types/BlockStatement';
import Identifier from '../../elements/types/Identifier';
import Scope from './Scope';
import type {ReferenceInfo, DefinitionInfo, ScopeInfo} from './Scope';
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
import Super from '../../elements/types/Super';
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
        this.acquire(this._program);
    }

    _program: Program;
    _programScope: Scope;
    _scopesMap: Map<Element, Scope>;

    _addElement(element: Element) {
        if (element instanceof Node) {
            let nodes = buildNodeList((element: Node));
            for (let i = 0; i < nodes.length; i++) {
                this._addNode(nodes[i]);
            }
        }
        this._updateTokenIfNecessary(element);
    }

    _removeElement(element: Element) {
        if (element instanceof Node) {
            let nodes = buildNodeList((element: Node));
            for (let i = 0; i < nodes.length; i++) {
                this._removeNode(nodes[i]);
            }
        }
        this._updateTokenIfNecessary(element);
    }

    _updateTokenIfNecessary(element: Element) {
        if (element instanceof Token) {
            let parentElement = element.parentElement;
            if (parentElement) {
                if (element.type === 'Identifier') {
                    this._removeElement(parentElement);
                    this._addElement(parentElement);
                    return;
                }
                if (
                    element.type === 'Punctuator' &&
                    element.value === ':' &&
                    parentElement instanceof Property
                ) {
                    this._removeElement(parentElement);
                    this._addElement(parentElement);
                    return;
                }
            }
        }
    }

    _addNode(node: Node): void {
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

        if (node instanceof ClassDeclaration) {
            return this._addClassDeclaration(node);
        }

        if (node instanceof ClassExpression) {
            return this._addClassExpression(node);
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

        if (node instanceof Super) {
            return this._addSuper(node);
        }

        if (node instanceof Identifier) {
            return this._addIdentifier(node);
        }

        if (node instanceof JSXIdentifier) {
            return this._addJSXIdentifier(node);
        }
    }

    _addProgram(node: Program) {
        this._programScope = this._addScope({
            node,
            parentScope: undefined,
            isFunctionScope: true,
            isProgramScope: true
        });
    }

    _addClassExpression(node: ClassExpression) {
        this._addScope({
            node,
            parentScope: this._getParentScopeFor(node),
            isClassScope: true
        });
    }

    _addClassDeclaration(node: ClassDeclaration) {
        this._addScope({
            node,
            parentScope: this._getParentScopeFor(node),
            isClassScope: true
        });
    }

    _addFunctionExpression(node: FunctionExpression) {
        this._addScope({
            node,
            parentScope: this._getParentScopeFor(node),
            isFunctionScope: true
        });
    }

    _addFunctionDeclaration(node: FunctionDeclaration) {
        this._addScope({
            node,
            parentScope: this._getParentScopeFor(node),
            isFunctionScope: true
        });
    }

    _addArrowFunctionExpression(node: ArrowFunctionExpression) {
        this._addScope({
            node,
            parentScope: this._getParentScopeFor(node),
            isFunctionScope: true,
            isArrowFunctionScope: true
        });
    }

    _addScopedBlock(node: Node) {
        this._addScope({
            node,
            parentScope: this._getParentScopeFor(node)
        });
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
        this._addScope({
            node,
            parentScope: this._getScopeFor(parentElement)
        });
    }

    _removeBlockStatement(node: BlockStatement) {
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

        let scope = this._scopesMap.get(node);
        if (scope) {
            scope.destroy();
            this._scopesMap.delete(node);
        }
    }

    _addJSXIdentifier(node: JSXIdentifier) {
        let name = node.name;
        let scope = this._getScopeFor(node);
        let parentElement = node.parentElement;

        if (!scope || !parentElement) {
            return;
        }

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

        this._addReferenceToScope(scope, {node, name, read: true, write: false});
    }

    _addIdentifier(node: Identifier) {
        let scope = this._getScopeFor(node);
        let parentElement = node.parentElement;

        if (!scope || !parentElement) {
            return;
        }

        let name = node.name;
        if (parentElement instanceof Property && parentElement.parentElement) {
            if (node === parentElement.key && !parentElement.shorthand) {
                if (parentElement.computed) {
                    this._addReferenceToScope(scope, {node, name, read: true, write: false});
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
        if (!container) {
            return;
        }

        if (
            container instanceof FunctionExpression ||
            container instanceof FunctionDeclaration ||
            container instanceof ArrowFunctionExpression
        ) {
            if (container.params.indexOf(topLevelPattern) !== -1) {
                this._addDefinitionToScope(scope, {node, name, type: types.Parameter});
                if (topLevelPattern instanceof AssignmentPattern) {
                    this._addReferenceToScope(scope, {node, name, read: false, write: true, type: types.Parameter});
                }
                return;
            }
        }
        if (container instanceof VariableDeclarator) {
            if (container.id === topLevelPattern) {
                let type = types.Variable;
                let variableDeclaration = container.parentElement;
                if (variableDeclaration && variableDeclaration instanceof VariableDeclaration) {
                    if (variableDeclaration.kind === 'let') {
                        type = types.LetVariable;
                    }
                    if (variableDeclaration.kind === 'const') {
                        type = types.Constant;
                    }
                    this._addDefinitionToScope(scope, {node, name, type});
                    let write = container.init ||
                        variableDeclaration.parentElement instanceof ForOfStatement ||
                        variableDeclaration.parentElement instanceof ForInStatement;
                    if (write) {
                        this._addReferenceToScope(scope, {node, name, read: false, write: true, type});
                    }
                }
                return;
            }
        }
        if (container instanceof CatchClause) {
            if (container.param === topLevelPattern) {
                this._addDefinitionToScope(scope, {node, name, type: types.CatchClauseError});
                return;
            }
        }
        if (container instanceof AssignmentExpression) {
            if (container.left === topLevelPattern) {
                this._addReferenceToScope(scope, {node, name, read: container.operator !== '=', write: true});
                return;
            }
        }
        if (container instanceof UpdateExpression) {
            if (container.argument === topLevelPattern) {
                this._addReferenceToScope(scope, {node, name, read: true, write: true});
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
            this._addDefinitionToScope(scope, {node, name, type: types.ImportBinding});
            return;
        }
        if (container instanceof ImportNamespaceSpecifier) {
            this._addDefinitionToScope(scope, {node, name, type: types.ImportBinding});
            return;
        }
        if (container instanceof ImportSpecifier) {
            if (container.local === node) {
                this._addDefinitionToScope(scope, {node, name, type: types.ImportBinding});
            }
            return;
        }
        if (container instanceof ClassExpression) {
            if (container.id === node) {
                this._addDefinitionToScope(scope, {node, name, type: types.SelfReference});
                this._addReferenceToScope(scope, {
                    node: node,
                    name: node.name,
                    read: false,
                    write: true,
                    type: types.SelfReference
                });
                return;
            }
        }
        if (container instanceof ClassDeclaration) {
            if (container.id === node) {
                let parentScope = this._getParentScopeFor(container);
                if (parentScope) {
                    this._addDefinitionToScope(parentScope, {node, name, type: types.LetVariable});
                    this._addReferenceToScope(parentScope, {
                        node: node,
                        name: node.name,
                        read: false,
                        write: true,
                        type: types.LetVariable
                    });
                    return;
                }
            }
        }
        if (container instanceof FunctionDeclaration) {
            if (node === container.id) {
                let parentScope = this._getParentScopeFor(container);
                if (parentScope) {
                    this._addDefinitionToScope(parentScope, {
                        node: node,
                        name: node.name,
                        type: types.LetVariable
                    });
                    this._addReferenceToScope(parentScope, {
                        node: node,
                        name: node.name,
                        read: false,
                        write: true,
                        type: types.LetVariable
                    });
                }
                return;
            }
        }
        if (container instanceof FunctionExpression) {
            if (node === container.id) {
                this._addDefinitionToScope(scope, {
                    node: node,
                    name: node.name,
                    type: types.SelfReference
                });
                this._addReferenceToScope(scope, {
                    node: node,
                    name: node.name,
                    read: false,
                    write: true,
                    type: types.SelfReference
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
        this._addReferenceToScope(scope, {node, name, read: true, write: false});
    }

    _addThisExpression(node: ThisExpression) {
        let scope = this._getScopeFor(node);
        if (scope) {
            this._addReferenceToScope(scope, {node, name: 'this', read: true, write: false});
        }
    }

    _addSuper(node: Super) {
        let scope = this._getScopeFor(node);
        if (scope) {
            this._addReferenceToScope(scope, {node, name: 'super', read: true, write: false});
        }
    }

    _removeNode(node: Node) {
        if (
            node instanceof FunctionExpression ||
            node instanceof FunctionDeclaration ||
            node instanceof ArrowFunctionExpression ||
            node instanceof ClassDeclaration ||
            node instanceof ClassExpression ||
            node.type in scopedBlocks
        ) {
            let scope = this._scopesMap.get(node);
            if (scope) {
                scope.destroy();
                this._scopesMap.delete(node);
            }
        }

        if (node instanceof BlockStatement) {
            return this._removeBlockStatement(node);
        }

        if (
            node instanceof ThisExpression ||
            node instanceof Super ||
            node instanceof Identifier ||
            node instanceof JSXIdentifier
        ) {
            let reference = this._programScope._programReferences.get(node);
            if (reference) {
                reference._scope._removeReference(reference);
            }
            let definition = this._programScope._programDefinitions.get(node);
            if (definition) {
                definition._scope._removeDefinition(definition);
            }
        }
    }

    _addReferenceToScope(scope: Scope, referenceInfo: ReferenceInfo) {
        let reference = this._programScope._programReferences.get(referenceInfo.node);
        if (!reference) {
            scope._addReference(referenceInfo);
        }
    }

    _addDefinitionToScope(scope: Scope, definitionInfo: DefinitionInfo) {
        let definition = this._programScope._programDefinitions.get(definitionInfo.node);
        if (!definition) {
            scope._addDefinition(definitionInfo);
        }
    }

    _addScope(scopeInfo: ScopeInfo): Scope {
        let scope = this._scopesMap.get(scopeInfo.node);
        if (!scope) {
            scope = new Scope(scopeInfo);
            this._scopesMap.set(scopeInfo.node, scope);
        }
        return scope;
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

    acquire(element: Node): ?Scope {
        return this._scopesMap.get(element);
    }

    findReference(node: Node): ?Reference {
        return this._programScope._programReferences.get(node);
    }

    findDefinition(node: Node): ?Definition {
        return this._programScope._programDefinitions.get(node);
    }

    findVariable(node: Node): ?Variable {
        let reference = this._programScope._programReferences.get(node);
        if (reference) {
            return reference._variable;
        }
        let definition = this._programScope._programDefinitions.get(node);
        if (definition) {
            return definition._variable;
        }
    }
}

function buildNodeList(parentNode: Node): Node[] {
    let result: Node[] = [parentNode];
    let nodesToProcess: Node[] = [parentNode];
    while (nodesToProcess.length > 0) {
        let node = nodesToProcess.shift();
        let childElements = node.childElements;
        for (let i = 0; i < childElements.length; i++) {
            let element = childElements[i];
            if (element instanceof Node) {
                result.push(element);
                nodesToProcess.push(element);
            }
        }
    }
    return result;
}
