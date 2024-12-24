# Mutables for immutables

Most languages have reference types, value types, and persistent types.  These broadly fall into mutables (reference types) and immutables (value types, persistent types).  JavaScript is no different.

Value types:
* `Boolean`
* `String`
* `Number`
* `Float`

Reference types, some having a persistent types counterpart:
* `Object` → `Record`[^1]
* `Array` → `Tuple`[^1]
* `Date` → `Temporal`[^1]
* `Error`
* `Map`
* `WeakMap`

Atomic has a few persistent types of its own:
* `HashMap`
* `HashSet`
* `SerialMap`
* `SerialSet`
* `PartMap`
* `PartSet`
* etc.

Although functional programming does better when a robust set of persistent types is present, it's not seriously hindered when they're not.  One can optionally treat reference types as persistent types by writing and using *pure* faux commands and atoms.  This means you can use objects and arrays as much or as little as you like.

Notice in the following examples the subject is a plain object, not a special persistent type.

This is how `assoc` would be used in an imperative program:
```js
const person = {rank: "Lieutenant"};
$.assoc(person, "lname", "Columbo"); //commands actuate
```

However, since Atomic programs normally [start with a simuation](./start-with-simulation.md) (e.g., use an atom), this demonstrates more typical use:

```js
const $person = $.atom({rank: "Lieutenant"});
$.swap($person, _.assoc(_, "lname", "Columbo")); //faux commands simulate
```

Since `assoc` exists as part of a protocol, it knows how to `assoc` given an object or another implemented type in either [simulating or actuating](./simulating-actuating.md) contexts (`_.assoc` or `$.assoc`).  Both are offered as a matter of completeness and to illustrate how a concept—in this case, associating—can be employed in either.

The example further demonstrates how objects and/or arrays can be freely used to model the domains held in atoms.  They are, after all, the cheapest and easiest mutables to create.  One need only reach for true persistent types when performance becomes a concern.

The eventual plan appears to be to introduce immutable counterparts for object and arrays—that is, records and tuples.  But this example demonstrates that, even while these structures are lacking from the language, functionally appropriate code (e.g., faux commands) can be written to treat objects and arrays as if they were immutables.  The benefit, of course, in using true persistents like records and tuples, will presumably be their better performance.

[^1]: A T39 proposal and not yet fully adopted into the language.  See [records and tuples](https://github.com/tc39/proposal-record-tuple) and [temporals](https://github.com/tc39/proposal-temporal).
