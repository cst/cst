/* @flow */

import type Node from '../../elements/Node';
import Reference from './Reference';
import Variable from './Variable';
import {default as Definition, types, typeOrder} from './Definition';
import toArray from '../../utils/toArray';

export default class Scope {
    constructor({node, parentScope, isProgramScope, isFunctionScope, isClassScope, isArrowFunctionScope}: {
        node: Node,
        parentScope: ?Scope,
        isProgramScope?: boolean,
        isFunctionScope?: boolean,
        isClassScope?: boolean,
        isArrowFunctionScope?: boolean
    }) {
        this._node = node;
        this._parentScope = parentScope;
        if (parentScope) {
            parentScope._childScopes.push(this);
            this._depth = parentScope._depth + 1;
        } else {
            this._depth = 0;
        }
        this._childScopes = [];
        this._variables = new Map();
        this._references = new Map();
        this._isProgramScope = Boolean(isProgramScope);
        this._isFunctionScope = Boolean(isFunctionScope);
        this._isClassScope = Boolean(isClassScope);
        this._isArrowFunctionScope = Boolean(isArrowFunctionScope);

        if (isProgramScope) {
            this._programReferences = new Map();
            this._programDefinitions = new Map();
        }
    }

    _isProgramScope: boolean;
    _isFunctionScope: boolean;
    _isClassScope: boolean;
    _isArrowFunctionScope: boolean;
    _node: Node;
    _depth: number;
    _parentScope: ?Scope;
    _childScopes: Scope[];
    _variables: Map<string, Variable[]>;
    _references: Map<string, Reference[]>;

    _programReferences: Map<Node, Reference>;
    _programDefinitions: Map<Node, Definition>;

    _addVariable(variable: Variable) {
        let variables = this._variables.get(variable.name);
        if (variables) {
            variables.push(variable);
            variables.sort((variable1: Variable, variable2: Variable) => {
                let typeOrder1 = typeOrder[variable1._type];
                let typeOrder2 = typeOrder[variable2._type];
                if (typeOrder1 > typeOrder2) {
                    return 1;
                }
                if (typeOrder1 < typeOrder2) {
                    return -1;
                }
                return 0;
            });
        } else {
            this._variables.set(variable.name, [variable]);
        }
    }

    _addDefinition(definitionInfo: {node: Node, name: string, type: string}) {
        let {node, name, type} = definitionInfo;
        if (type === types.Variable) {
            if (!this._isFunctionScope && this._parentScope) {
                this._parentScope._addDefinition(definitionInfo);
                return;
            }
        }

        let variables = this._variables.get(name) || [];
        let variable: ?Variable;
        for (let item of variables) {
            if (item.type === type) {
                variable = item;
                break;
            }
        }

        if (!variable) {
            variable = new Variable({name, type, scope: this});
            this._adjustReferencesOnVariableAdd(variable);
            this._addVariable(variable);
        }

        let definition = new Definition({node, type, scope: this});

        variable._addDefinition(definition);

        let programScope = this._getProgramScope();
        if (programScope) {
            programScope._programDefinitions.set(node, definition);
        }
    }

    _removeDefinition(definition: Definition) {
        let programScope = this._getProgramScope();
        if (programScope) {
            programScope._programDefinitions.delete(definition.node);
        }
    }

    _adjustReferencesOnVariableAdd(variable: Variable) {
        let depth = variable._scope._depth;
        let references = this._references.get(variable.name);
        if (references) {
            for (let reference of references) {
                let refVar = reference._variable;
                let varDepth = refVar._scope._depth;
                if (varDepth === depth) {
                    if (typeOrder[variable.type] < typeOrder[refVar.type]) {
                        refVar._transferReferences(variable);
                        removeVariableIfRequired(refVar);
                    }
                } else if (varDepth < depth) {
                    refVar._references.delete(reference);
                    variable._addReference(reference);
                    reference._variable = variable;
                    removeVariableIfRequired(refVar);
                }
            }
        }

        for (let childScope of this._childScopes) {
            childScope._adjustReferencesOnVariableAdd(variable);
        }
    }

    _addReference(referenceInfo: {node: Node, name: string, read: boolean, write: boolean, type?: string}) {
        let {name} = referenceInfo;
        let reference = new Reference({scope: this, ...referenceInfo});
        this._assignReference(reference, name);
        let references = this._references.get(name);
        if (references) {
            references.push(reference);
        } else {
            this._references.set(name, [reference]);
        }

        let programScope = this._getProgramScope();
        if (programScope) {
            programScope._programReferences.set(reference.node, reference);
        }
    }

    _assignReference(reference: Reference, name: string) {
        let currentScope = this;
        do {
            let variables = currentScope._variables.get(name);
            if (variables) {
                if (reference._type) {
                    for (let variable of variables) {
                        if (variable._type === reference._type) {
                            variable._addReference(reference);
                            return;
                        }
                    }
                } else {
                    variables[0]._addReference(reference);
                    return;
                }
            }
            if (!currentScope._parentScope) {
                let globalVariable = new Variable({
                    name, type: types.ImplicitGlobal, scope: currentScope
                });
                globalVariable._addReference(reference);
                currentScope._addVariable(globalVariable);
                return;
            } else {
                if (
                    (
                        (name === 'arguments' || name === 'this') &&
                        currentScope._isFunctionScope &&
                        !currentScope._isArrowFunctionScope &&
                        !currentScope._isProgramScope
                    ) ||
                    (
                        name === 'super' && currentScope._isClassScope
                    )
                ) {
                    let builtInVariable = new Variable({
                        name, type: types.BuiltIn, scope: currentScope
                    });
                    builtInVariable._addReference(reference);
                    currentScope._addVariable(builtInVariable);
                    return;
                }
                currentScope = currentScope._parentScope;
            }
        } while (true);
    }

    _removeReference(reference: Reference) {
        let variable = reference._variable;
        let name = variable.name;
        let references = this._references.get(name);
        if (references) {
            let index = references.indexOf(reference);
            if (index !== -1) {
                references.splice(index, 1);
            }
        }
        variable._removeReference(reference);

        let programScope = this._getProgramScope();
        if (programScope) {
            programScope._programReferences.delete(reference.node);
        }
    }

    _getProgramScope(): ?Scope {
        let scope = this;
        while (scope && !scope._isProgramScope) {
            scope = scope.parentScope;
        }
        return scope;
    }

    get node(): Node {
        return this._node;
    }

    get parentScope(): ?Scope {
        return this._parentScope;
    }

    get variables(): Variable[] {
        return [].concat.apply([], toArray(this._variables.values()));
    }

    get references(): Reference[] {
        return [].concat.apply([], toArray(this._references.values()));
    }

    destroy() {
        let parentScope = this._parentScope;
        if (parentScope) {
            let scopeIndex = parentScope._childScopes.indexOf(this);
            if (scopeIndex !== -1) {
                parentScope._childScopes.splice(scopeIndex, 1);
            }
        }
        this.references.forEach(this._removeReference);
    }

    get childScopes(): Scope[] {
        return this._childScopes;
    }
}

function removeVariableIfRequired(variable: Variable) {
    if (variable._references.size === 0 && variable._definitions.size === 0) {
        let variables = variable._scope._variables.get(variable._name);
        if (variables) {
            let index = variables.indexOf(variable);
            if (index !== -1) {
                variables.splice(index, 1);
            }
        }
    }
}
