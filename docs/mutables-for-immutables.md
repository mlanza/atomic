# Mutables for immutables

Most languages have reference types and value type—the former mutable, the latter immutable.  JavaScript lacks native immutables.

Value types:
* `Boolean`
* `String`
* `Number`
* `Float`

Reference types, some with a value type counterpart:
* `Object` → `Composite`[^1]
* `Array` → `Composite`[^1]
* `Date` → `Temporal`[^1]
* `Error`
* `Map`
* `WeakMap`

Atomic offers value types of its own:
* `HashMap`
* `HashSet`
* `SerialMap`
* `SerialSet`
* `PartMap`
* `PartSet`
* etc.

Although functional programming does better when a robust set of value types is present, it's not seriously hindered when they're not.  Where gaps exist, one can choose to treat reference types as value types by writing and using *pure* faux commands and atoms.

Notice in the following examples the subject is not a special value type, but a plain object.

This is how `assoc` would be used in an imperative program, one that actually mutates:
```js
const person = {rank: "Lieutenant"};
$.assoc(person, "lname", "Columbo"); //commands actuate
```

However, since Atomic programs normally [start with simuation](./start-with-simulation.md) (e.g., use an atom), it uses reference types but choose not to mutate them:

```js
const $person = $.atom({rank: "Lieutenant"});
$.swap($person, _.assoc(_, "lname", "Columbo")); //faux commands simulate
```

Since `assoc` exists as part of a protocol, it knows how to `assoc` given an object or another implemented type in either [simulating or actuating](./simulating-actuating.md) contexts (`_.assoc` or `$.assoc`).  Both are offered as a matter of completeness and to illustrate how a concept—in this case, associating—can be employed in either.

This example also shows how objects and arrays can be freely used to model the domains stored in atoms. They’re, after all, the easiest and most economical mutables to create. Until language specifiers specify and ratify value type counterparts, one must write functionally appropriate code—such as faux commands—that treats our ordinary mutables *as if* they’re immutable.

[^1]: Language specifiers are proposing new value types to fill language gaps.  See ~~[records and tuples](https://github.com/tc39/proposal-record-tuple),~~ [composites](https://github.com/tc39/proposal-composites) and [temporals](https://github.com/tc39/proposal-temporal).
