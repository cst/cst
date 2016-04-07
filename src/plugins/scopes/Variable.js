/* @flow */

import type Definition from './Definition';
import type Reference from './Reference';
import type Scope from './Scope';
import toArray from '../../utils/toArray';

export default class Variable {
    constructor({name, type, scope}: {name: string, type: string, scope: Scope}) {
        this.name = name;
        this.type = type;
        this.scope = scope;
        this._definitions = new Set();
        this._references = new Set();
    }

    name: string;
    type: string;
    scope: Scope;
    _references: Set<Reference>;
    _definitions: Set<Definition>;

    _addDefinition(definition: Definition) {
        definition.variable = this;
        this._definitions.add(definition);
    }

    _addReference(reference: Reference) {
        reference.variable = this;
        this._references.add(reference);
    }

    _removeDefinition(definition: Definition) {
        this._definitions.delete(definition);
    }

    _removeReference(reference: Reference) {
        this._references.delete(reference);
    }

    _transferReferences(variable: Variable) {
        for (let reference of this._references) {
            if (!reference.type) {
                this._references.delete(reference);
                variable._references.add(reference);
                reference.variable = variable;
            }
        }
    }

    getDefinitions(): Definition[] {
        return toArray(this._definitions);
    }

    getReferences(): Reference[] {
        return toArray(this._references);
    }
}
