[![Build Status](https://travis-ci.org/cst/cst.svg?branch=master)](https://travis-ci.org/cst/cst)

# JavaScript CST implementation

### CST

`CST` means Concrete Syntax Tree. Unlike an `AST` (Abstract Syntax Tree), a `CST` contains all the information
from the JavaScript source file: whitespace, punctuators, comments. This information is extremely useful for
code style checkers and other code linters. `CST` is also useful for cases when you need to apply modifications
to existing JavaScript files while preserving the initial file formatting.

This `CST` implementation is designed to be `100%` compatible with JS `AST` (https://github.com/estree/estree).

Main principles:

* CST contains all the information from a parsed file (including whitespace and comments).
* Compatible with AST (https://github.com/estree/estree).
* Requires tokens to modify CST structure.
* The tree is always valid (it protects itself against breaking changes).
* CST can be rendered to valid JS at any time.

Let's see an example:

```js
x = 0;
if (x) x++;
```

The CST for this example:

![](https://raw.githubusercontent.com/cst/cst/master/docs/cst-example.png)

* Blue text — CST Tokens.
* White text in blue blocks — CST Nodes (their structure is equal to an AST).
* Blue lines — CST Structure.
* Red lined — AST Links.

## Classes

### Element

`Element` is the base class for `Node` and `Token`.

Provides traversing properties:

* `childElements: Element[]`, `parentElement: Element|null`: child/parent traversing.
* `nextSibling: Element|null`, `previousSibling: Element|null`: traversing between siblings.
* `nextToken: Token|null`, `previousToken: Token|null`: traversing to next/previous token.
* `firstToken: Token|null`, `lastToken: Token|null`: traversing to first/last tokens (not only direct tokens).
* `firstChild: Token|null`, `lastChild: Token|null`: traversing to first/last direct child.

Code-related properties:

* `sourceCode`: generates and returns JavaScript code of the specified `Element`
* `sourceCodeLength`: returns JavaScript code length
* `isToken`, `isNode`, `isExpression`, `isStatement`, `isWhitespace`, `isComment`, `isPattern`, `isAssignable`,
  `isFragment`: code entity flags.

Provides mutation methods:

* `appendChild(element)`: appends child to the end of the `Element`
* `prependChild(element)`: prepends child to the end of the `Element`
* `insertChildBefore(element, referenceChild)`: inserts child before `referenceChild`
* `replaceChildren(element, firstChildRef, lastChildRef)`: replaces specified child interval (from `firstChildRef` to
  `lastChildRef`) with specified child.

Location properties:

* `range: [Number, Number]`: calculates and returns `Element` range.
* `loc: {start: {line: Number, column: Number}, end: {line: Number, column: Number}}`: calculates and returns
  `Element` location.

### Node

`Node` extends `Element`. The Nodes are the "AST part of a CST". If you drop everything but Nodes from a `CST`, you will
get a pure `AST` from the Node structure. So it is fair to say that Nodes provide the `AST` logic for a `CST`. Currently
only Nodes can contain children.

The Node property `isNode` always returns `true`.

### Token

`Token` extends `Element`. The purpose of a `CST` is to have tokens in the tree. By only manipulating tokens,
we can change code formatting without any effect on the behaviour.

The Token property `isToken` always returns `true`.
