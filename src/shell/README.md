# Command vs. Query Protocols

In JavaScript arrays and objects are mutable reference types.  But Atomic provides a protocol for operating against them as if they were immutable, value types.  The `core` module *predominantly* exposes pure operations.  It does have some side-effecting operations too, because in order to define what the module exports these mutating operations are useful.  Thus, `core` does have some seemingly out-of-place operations (e.g. `_.each`, `_.doto`, `_.implement`).  To clarify their purpose as side-effecting operations they are also exported from `shell` (e.g. `$.each`, `$.doto`).  Your programs should access them via `$` to call out their side-effecting nature.

Since `core` (exported as `_`) treats types, even reference types like objects and arrays, as immutable value types, its operations, rather than mutate the subject, return a modified copy.  That's the essence of what a persistent type is.  And persistent types (even faux ones) are the basis of any simulation one wishes to run inside a functional core.  While protocols and functions can emulate commands, they're always only queries.

But the imperative `shell` (exported as `$`) is about actually doing things, modifying things.  Its operations, primarily commands, produce the side effects a program requires to get work done.

```js
const stooges = ["Moe", "Larry", "Shemp"];
const troupe = _.conj(stooges, "Corey"); //core op, a query
```

```js
const stooges = ["Moe", "Larry", "Shemp"];
$.conj(stooges, "Corey"); //shell op, a command
```

The first example is simulation.  The second, side-effecting reality.  See how, in the first, `conj` returns a result because it's a query and how, in the second, it doesn't because it's a command?

What should be dawning on you is that even non-persistent types, like arrays, can be treated as such.  The choice is in the protocol, the functions–pure or impure–one uses to operate against a thing.

## Naming

Clojure likes to make the distinction between the pure and the impure by sometimes adding a bang to impure names.  Thus, `conj` is of the former, pure variety and `conj!` the impure variety.  JavaScript doesn't allow names ending with a bang.  The pure/impure distinction can generally be made by the module (`core`/`shell`) from which an operation exports.
