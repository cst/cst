[![Build Status](https://travis-ci.org/mdevils/cst.svg?branch=master)](https://travis-ci.org/mdevils/cst)

# JavaScript CST implementation

### CST

`CST` means Concrete Syntax Tree. Unlike `AST` (which is Abstract Syntax Tree), `CST` contains the whole information
from the JavaScript source file: whitespace, punctuators, comments. This information is extremely useful for
code style checkers and other code linters. `CST` is also useful for cases, when you need to apply modifications
to existing JavaScript files and preserve initial file formatting.

This `CST` implementation is designed to be `100%` compatible with JS `AST` (https://github.com/estree/estree).

Main principles:

* CST contains all the information from parsed file (including whitespace and comments).
* Compatible with AST (https://github.com/estree/estree).
* Requires tokens to modify CST structure.
* The tree is always valid (it protects itself against breaking changes).
* CST can be rendered to valid JS at any time.

Let's see an example:

```js
x = 0;
if (x) x++;
```

CST for this example:

![](https://raw.githubusercontent.com/mdevils/cst/master/docs/cst-example.png)

* Blue text — CST Tokens.
* White text in blue blocks — CST Nodes (their structure is equal to AST).
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

* `sourceCode`: generates and return JavaScript code of the specified `Element`
* `sourceCodeLength`: returns JavaScript code length
* `isToken`, `isNode`, `isExpression`, `isStatement`, `isWhitespace`, `isComment`, `isPattern`, `isAssignable`,
  `isFragment`: code entity flags.

Provides mutation methods:

* `appendChild(child)`: appends child to the end of the `Element`
* `prependChild(child)`: prepends child to the end of the `Element`
* `insertChildBefore(child, referenceChild)`: inserts child before `referenceChild`
* `replaceChildren(child, firstChildRef, lastChildRef)`: replaces specified child interval (from `firstChildRef` to
  `lastChildRef`) with specified child.

Location properties:

* `range: [Number, Number]`: calculates and returns `Element` range.
* `loc: {start: {line: Number, column: Number}, end: {line: Number, column: Number}}`: calculates and returns
  `Element` location.

### Node

`Node` extends `Element`. Nodes are "AST part of CST". If you drop everything but Nodes from this `CST`, you will
get pure `AST` from the Node structure. So it is fair to say that Nodes provide `AST` logic for `CST`. Right now
only Nodes can contain children.

For Nodes property `isNode` always return `true`.

### Token

`Token` extends `Element`. Tokens in the tree are the purpose of `CST`. By manipulating using only tokens,
we can change code formatting without any effect on the behaviour.

For Tokens property `isToken` always return `true`.
