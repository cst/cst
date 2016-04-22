/* @flow */

import type Definition from './Definition';
import type Reference from './Reference';
import type Scope from './Scope';
import toArray from '../../utils/toArray';
import Set from 'core-js/library/fn/set';

export default class Variable {
    constructor({name, type, scope}: {name: string, type: string, scope: Scope}) {
        this._name = name;
        this._type = type;
        this._scope = scope;
        this._definitions = new Set();
        this._references = new Set();
    }

    _name: string;
    _scope: Scope;
    _type: string;
    _references: Set<Reference>;
    _definitions: Set<Definition>;

    _addDefinition(definition: Definition) {
        definition._variable = this;
        this._definitions.add(definition);
    }

    _addReference(reference: Reference) {
        reference._variable = this;
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
            if (!reference._type) {
                this._references.delete(reference);
                variable._references.add(reference);
                reference._variable = variable;
            }
        }
    }

    get name(): string {
        return this._name;
    }

    get type(): string {
        return this._type;
    }

    get definitions(): Definition[] {
        return toArray(this._definitions);
    }

    get references(): Reference[] {
        return toArray(this._references);
    }
}
