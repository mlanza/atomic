# Command vs. query protocols

In JavaScript arrays and objects are mutable reference types.

The `core` (exported as `_`) provides a protocol for operating against them as if they were immutable, value types (i.e. persistent types).  This means its operations, rather than mutate subjects, return modified copies.  Persistent types (even faux ones) are the basis of simulations, which is effectively what functional programming is good at.  While persistent protocols and functions emulate commands, they're actually queries.

The `shell` (exported as `$`) is about actually doing things, modifying things.  Its protcols operate against reference types treating them as they actually are.  Thus, its operations are actually commands and do, indeed, produce the side effects required to get work done.

```js
const stooges = ["Moe", "Larry", "Shemp"];
const troupe = _.conj(stooges, "Corey"); //core op, a query
```
```js
const stooges = ["Moe", "Larry", "Shemp"];
$.conj(stooges, "Corey"); //shell op, a command
```

The first example is simulation.  The second, side-effecting reality.  See how, in the first, `conj` returns a result because it's a query and how, in the second, it doesn't because it's a command.

This demonstrates how reference types, like arrays, can, if desired, be handled as persistent types.  The choice is in the protocol, the functions–pure or impure–one uses to operate against a thing.  There are obvious performance implications surrounding the choice, but for the use cases common to many apps, not enough to be perceptible.

## Naming

Clojure likes to make the distinction between the pure and the impure by sometimes adding a bang to impure names.  Thus, `conj` is of the former, pure variety and `conj!` the impure variety.  JavaScript doesn't allow names ending with a bang.  The pure/impure distinction can generally be made by the module (`core`/`shell`) from which an operation exports.
