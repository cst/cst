/* @flow */

import type Identifier from '../../elements/types/Identifier';
import type Scope from './Scope';
import type Variable from './Variable';

export default class Definition {
    constructor({node, type, scope}: {node: Identifier, type: string, scope: Scope}) {
        this.node = node;
        this.type = type;
        this.scope = scope;
    }

    node: Identifier;
    variable: Variable;
    type: string;
    scope: Scope;
}

/**
 * Possible variable types.
 */
export const types = {
    LetVariable: 'LetVariable',
    Constant: 'Constant',
    Variable: 'Variable',
    Parameter: 'Parameter',
    SelfReference: 'SelfReference',
    CatchClauseError: 'CatchClauseError',
    ImportBinding: 'ImportBinding',
    ImplicitGlobal: 'ImplicitGlobal',
    BuiltIn: 'BuiltIn',
};

/**
 * Priorities in variable scopes.
 * For instance, `var x` hides `x` function argument and `x` argument hides global `x`.
 */
export const typeOrder = {
    LetVariable: 0,
    Constant: 0,
    Variable: 0,
    ImportBinding: 1,
    Parameter: 1,
    CatchClauseError: 1,
    SelfReference: 2,
    BuiltIn: 3,
    ImplicitGlobal: 3,
};
