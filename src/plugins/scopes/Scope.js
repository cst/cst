/* @flow */

import type Node from '../../elements/Node';
import Reference from './Reference';
import Variable from './Variable';
import {default as Definition, types, typeOrder} from './Definition';
import toArray from '../../utils/toArray';

export default class Scope {
    constructor(scopeInfo: ScopeInfo) {
        let {node, parentScope, isProgramScope, isFunctionScope, isClassScope, isArrowFunctionScope} = scopeInfo;

        this.node = node;
        this.parentScope = parentScope;
        if (parentScope) {
            parentScope.childScopes.push(this);
            this._depth = parentScope._depth + 1;
        } else {
            this._depth = 0;
        }
        this.childScopes = [];
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
    node: Node;
    _depth: number;
    parentScope: ?Scope;
    childScopes: Scope[];
    _variables: Map<string, Variable[]>;
    _references: Map<string, Reference[]>;

    _programReferences: Map<Node, Reference>;
    _programDefinitions: Map<Node, Definition>;

    _addVariable(variable: Variable) {
        let variables = this._variables.get(variable.name);
        if (variables) {
            variables.push(variable);
            variables.sort((variable1: Variable, variable2: Variable) => {
                let typeOrder1 = typeOrder[variable1.type];
                let typeOrder2 = typeOrder[variable2.type];
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

    _addDefinition(definitionInfo: DefinitionInfo) {
        let {node, name, type} = definitionInfo;
        if (type === types.Variable) {
            if (!this._isFunctionScope && this.parentScope) {
                this.parentScope._addDefinition(definitionInfo);
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
        let variable = definition.variable;

        variable._removeDefinition(definition);

        if (
            variable._definitions.size === 0 &&
            (
                variable.type === 'LetVariable' ||
                variable.type === 'Constant' ||
                variable.type === 'Variable' ||
                variable.type === 'Parameter' ||
                variable.type === 'SelfReference' ||
                variable.type === 'CatchClauseError' ||
                variable.type === 'ImportBinding'
            )
        ) {
            removeVariable(variable);
        }

        let programScope = this._getProgramScope();
        if (programScope) {
            programScope._programDefinitions.delete(definition.node);
        }
    }

    _adjustReferencesOnVariableAdd(variable: Variable) {
        let depth = variable.scope._depth;
        let references = this._references.get(variable.name);
        if (references) {
            for (let reference of references) {
                let refVar = reference.variable;
                let varDepth = refVar.scope._depth;
                if (varDepth === depth) {
                    if (typeOrder[variable.type] < typeOrder[refVar.type]) {
                        refVar._transferReferences(variable);
                        removeVariableIfRequired(refVar);
                    }
                } else if (varDepth < depth) {
                    refVar._references.delete(reference);
                    variable._addReference(reference);
                    reference.variable = variable;
                    removeVariableIfRequired(refVar);
                }
            }
        }

        for (let childScope of this.childScopes) {
            childScope._adjustReferencesOnVariableAdd(variable);
        }
    }

    _addReference(referenceInfo: ReferenceInfo) {
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
                if (reference.type) {
                    for (let variable of variables) {
                        if (variable.type === reference.type) {
                            variable._addReference(reference);
                            return;
                        }
                    }
                } else {
                    variables[0]._addReference(reference);
                    return;
                }
            }
            if (!currentScope.parentScope) {
                let globalVariable = new Variable({
                    name, type: types.ImplicitGlobal, scope: currentScope,
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
                        name, type: types.BuiltIn, scope: currentScope,
                    });
                    builtInVariable._addReference(reference);
                    currentScope._addVariable(builtInVariable);
                    return;
                }
                currentScope = currentScope.parentScope;
            }
        } while (true);
    }

    _removeReference(reference: Reference) {
        let variable = reference.variable;
        let name = variable.name;
        let references = this._references.get(name);
        if (references) {
            let index = references.indexOf(reference);
            if (index !== -1) {
                references.splice(index, 1);
            }
        }
        variable._removeReference(reference);
        if (
            variable._references.size === 0 &&
            (
                variable.type === 'ImplicitGlobal' ||
                variable.type === 'BuiltIn'
            )
        ) {
            removeVariable(variable);
        }

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

    getVariables(): Variable[] {
        return [].concat(...toArray(this._variables.values()));
    }

    getReferences(): Reference[] {
        return [].concat(...toArray(this._references.values()));
    }

    destroy() {
        let parentScope = this.parentScope;
        if (parentScope) {
            let scopeIndex = parentScope.childScopes.indexOf(this);
            if (scopeIndex !== -1) {
                parentScope.childScopes.splice(scopeIndex, 1);
            }
        }
        this.getReferences().forEach(this._removeReference, this);
    }
}

function removeVariableIfRequired(variable: Variable) {
    if (variable._references.size === 0 && variable._definitions.size === 0) {
        let variables = variable.scope._variables.get(variable.name);
        if (variables) {
            let index = variables.indexOf(variable);

            if (index !== -1) {
                variables.splice(index, 1);
            }

            if (variables.length === 0) {
                variable.scope._variables.delete(variable.name);
            }
        }
    }
}

function removeVariable(variable: Variable) {
    let scope = variable.scope;
    let variables = scope._variables.get(variable.name);

    if (variables) {
        let index = variables.indexOf(variable);
        if (index !== -1) {
            variables.splice(index, 1);
            if (variables.length === 0) {
                scope._variables.delete(variable.name);
            }
            for (let reference of variable._references) {
                reference.scope._assignReference(reference, variable.name);
            }
        }
    }
}

export type ReferenceInfo = {
    node: Node,
    name: string,
    read: boolean,
    write: boolean,
    type?: string
};

export type DefinitionInfo = {
    node: Node,
    name: string,
    type: string
};

export type ScopeInfo = {
    node: Node,
    parentScope: ?Scope,
    isProgramScope?: boolean,
    isFunctionScope?: boolean,
    isClassScope?: boolean,
    isArrowFunctionScope?: boolean
};
