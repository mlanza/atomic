# Command vs. Query Protocols

In JavaScript arrays and objects are mutable reference types.  But Atomic provides a protocol for operating against them as if they were immutable, value types.  The `core` module *predominantly* exposes pure operations.

It does have side-effecting operations too, because any moderately robust functional programming library relies on, just to build itself, a modest number of mutating operations.  So `core` includes the likes of `each` and `doto`.  But these operations are reexported from `shell` so that external consumers who call them can be notably more pronounced about their side effecting nature (e.g. `$.each`, `$.doto`).

Since `core` (exported as `_`) treats types, even reference types like objects and arrays, as immutable value types, its operations, rather than mutate the subject, return a modified copy.  That's the essence of what a persistent type is.  Persistent types (even faux ones) are the basis of simulations, which is effectively what functional programming is good at.  While pure, persistent protocols and functions can emulate commands, they're always only queries.

But the imperative `shell` (exported as `$`) is about actually doing things, modifying things.  Its operations, primarily commands, produce the side effects required to get work done.

```js
const stooges = ["Moe", "Larry", "Shemp"];
const troupe = _.conj(stooges, "Corey"); //core op, a query
```

```js
const stooges = ["Moe", "Larry", "Shemp"];
$.conj(stooges, "Corey"); //shell op, a command
```

The first example is simulation.  The second, side-effecting reality.  See how, in the first, `conj` returns a result because it's a query and how, in the second, it doesn't because it's a command.

This demonstrates how reference types, like arrays, can, if desired, be treated as value types.  The choice is in the protocol, the functions–pure or impure–one uses to operate against a thing.

## Naming

Clojure likes to make the distinction between the pure and the impure by sometimes adding a bang to impure names.  Thus, `conj` is of the former, pure variety and `conj!` the impure variety.  JavaScript doesn't allow names ending with a bang.  The pure/impure distinction can generally be made by the module (`core`/`shell`) from which an operation exports.
