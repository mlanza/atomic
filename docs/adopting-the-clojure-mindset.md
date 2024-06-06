# Adopting The Clojure Mindset

Most languages have reference types and value types, mutables and immutables.  JavaScript is no different, but has gaps in its value types (e.g. [records and tuples](https://github.com/tc39/proposal-record-tuple) and [temporals](https://github.com/tc39/proposal-temporal)).

And while functional programming does better when a robust set of value types are present, it's not seriously hindered when they're not.  It can treat reference types as value types.

Briefly, recall that command-query separation wants query functions to return a value but not command functions.  The stark absence of a return value calls it out as a command.

```js
const obj = {title: "Lt.", lname: "Columbo"};
const shows = ["Columbo", "The Good Doctor"];
```

|Action|Pure World (`core`) |Impure World (`shell`)|
|-|-|-|
|Read property|`_.get(obj, "lname")`|N/A|
|Write property|`_.assoc(obj, "lname", "Specter")` | `$.assoc(obj, "lname", "Specter")`|
|Add element|`_.conj(shows, "Suits")` | `$.conj(shows, "Suits)` |

The above demonstrates a couple important ideas.

Some operations are natively queries.  Queries remain queries whether they're used in the pure or impure part of a program.  So `get` is always a read operation, or a query. There is no mutable counterpart.  It's simply not needed.

Furthermore, associativity (e.g. `assoc`) is a concept which involves adding/changing a property on some target.  Since any command (e.g. side effect) can be simulated, `assoc` can be implemented as either an impure/mutable operation or as a pure/immutable operation.  The `assoc` protocol exists in both the pure (`_`) and impure (`$`) worlds.  To be clear, there's immutable `assoc`, and mutable `assoc`, two distinctly different protocols sharing a common name.

Commands can be simulated by writing a function which returns a replacement for the subject.  That is, a simulated `assoc` takes a subject and the key and value it wants to associate to it but, without touching the actual subject, returns a new object which is the aggregate of the original and the association(s) applied against it.

```js
//basis for immutable `assoc` protocol
function assoc(self, key, value){ //query/simulated
  const replacement = {...self};
  replacement[key] = value;
  return replacement; //return value
}

const $harvey = $.atom({lname: "Specter"});
$.swap($harvey, _.assoc(_, "fname", "Harvey"));
const fname = _.chain($harvey, _.deref, _.get(_, "fname")); // "Harvey"
```

These are simulated or faux commands, because they are pure and don't acutally mutate anything.  The `assoc` is pure, the `swap` impure.  This approach allows immutability and mutability to be teased apart.  It affords a specific strategy for controlling state change.

An ordinary command is impure actually changes the subject.  In accordance with command-query separation, it has no return value.

```js
//basis for mutable `assoc` protocol
function assoc(self, key, value){ //command/actuated
  self[key] = value;
  //no return value;
}

const harvey = {lname: "Specter"};
$.assoc(harvey, "fname", "Harvey");
const fname = harvey.fname; // "Harvey"
```

Immutable `assoc` is a query, mutable `assoc` a command.  The one emulates change.  The other actuates it.  Thus, `_`s signal emulation, `$`s actuation.

Immutable `assoc` is tailor-made for truly persistent types, like records.  But even without them, it can be implemented against plain objects.

The same applies to `conj` or any other command one imagines.  Change against any type can be simulated.  All simulation requires is an atom.  The atom contains the state and [`swap`](https://clojuredocs.org/clojure.core/swap!)s updates against it using simulated commands.

What this effectively means is the above table can, as desired, be fully realized so that any mutable operation can be simulated, which is to say written as a reductive operation.  What this reaveals is all programs are, at their very centers, [reductions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

That's the cornerstone of how Clojure models state change.  And where Clojure actually has a robust set of persistent types, JavaScript doesn't.  So Atomic uses reference types and pure protocols/functions to emulate persistent types.  In practice, this proves performant enough to be of little concern.

## To What End?

The point of discussing the two worlds, the pure and the impure, is to delinate the difference and to clearly demonstrate how side effects can be simulated before actuated.

The value of handling state in this manner is hard to understand in the small.  But there's an immense value proposition in learning to tease apart the pure and impure parts only to reconnect them.

While the end result, simulated change becoming actual change achieves the same result as before, it would be short sighted to assert the extra layer adds complexity.  This separation makes a program significantly easier to understand, develop, test and maintain than when the parts were intertwined.  It provides a useful lens for seeing what a program logically is and what it does.

