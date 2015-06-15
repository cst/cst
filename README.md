# JavaScript CST implementation

### CST

CST means Concrete Syntax Tree. Unline AST (which is Abstract Syntax Tree), CST containst the whole information
from the JavaScript source file: whitespace, punctuators, comments.

This `CST` implementation is designed to be `100%` compatible with JS `AST` (https://github.com/estree/estree).

Let's see an example:

```js
x = 0;
if (x) x++;
```

CST for this example:

![](https://raw.githubusercontent.com/mdevils/cst/master/docs/cst-example.png)

* Blue text — CST Tokens.
* White text in blue blocks — CST Nodes (thir structure is equal to AST).
* Blue lines — CST Structure.
* Red lined — AST Links.

## Classes

### Element

`Element` is the base class for `Node` and `Token`.

Provides traversing properties:

* `childElements: Element[]`, `parentElement: Element|null`: child/parent traversing
* `nextSibling: Element|null`, `previousSibling: Element|null`: traversing between siblings
* `nextToken: Token|null`, `previousToken: Token|null`: traversing to next/previous token

Code-related properties:

* `sourceCode`: generates and return JavaScript code of the specified `Element`
* `sourceCodeLength`: returns JavaScript code length
* `isToken`, `isNode`, `isExpression`, `isStatement`, `isWhitespace`, `isComment`, `isPattern`, `isAssignable`:
  code entity flags.

Provides mutation methods:

* `appendChildren(newElements)`: appends children to the end of the `Element`
* `prependChildren(newElements)`: prepends children to the end of the `Element`
* `replaceChildren(newElements, referenceElement, replaceCount)`: replaces `replaceCount` elements starting with
  `referenceElement`
* `insertChildrenBefore(newElements, referenceElement)`: inserts children before `referenceElement`
* `insertChildrenAfter(newElements, referenceElement)`: inserts children after `referenceElement`

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

`Token` extends `Element. Tokens in the tree are the purpose of `CST`. By manipulating using only tokens,
we can change code formatting without any effect on the behaviour.

For Tokens property `isToken` always return `true`.
