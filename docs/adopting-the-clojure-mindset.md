# Adopting The Clojure Mindset

Most languages have reference types and value types, mutables and immutables.  JavaScript is no different, but has gaps in its value types (e.g. [records and tuples](https://github.com/tc39/proposal-record-tuple) and [temporals](https://github.com/tc39/proposal-temporal)).

And while functional programming does better when a robust set of value types are present, it's not seriously hindered when they're not.  It can treat reference types as value types.  That said, although Atomic provides several types of maps, sets, etc., it will usually suffice to use plain old objects and arrays and to consider alternatives only when performance becomes a concern.

Briefly, recall how [command-query separation](./command-query-separation.md) expects queries to return a value, but not commands.  The stark absence of a return value from a function identifies it as a command.

```js
const obj = {title: "Lt.", lname: "Columbo"};
const shows = ["Columbo", "The Good Doctor"];
```

|Action|Pure World (`core`) |Impure World (`shell`)|
|-|-|-|
|Read property|`_.get(obj, "lname")`|`_.get(obj, "lname")`|
|Write property|`_.assoc(obj, "lname", "Specter")` | `$.assoc(obj, "lname", "Specter")`|
|Add element|`_.conj(shows, "Suits")` | `$.conj(shows, "Suits)` |

The above demonstrates a couple important ideas.

Some operations, like `get`, are naturally queries, and can be used in either the pure or impure part of a program without causing harm.  Because queries are safe they move freely to both spaces.  But because naturally impure, mutable operations, like `$.assoc` can cause harm, they can't.  Rather one must write a safe, simulated version of the command (`_.assoc`) or, rather, reduce it to a query for this to happen.

Consider what `$.assoc` is about.  It is an operation which adds a property/value pair to some entity/object by mutating it.  The `_.assoc` version simulates that effect.  Thus, `$.assoc` has a side effect while `_.assoc` does not.  The actuating/simulating command divide is visibly demonstrated in the module from which it's imported—`shell` as `$` and `core` as `_`.

In each module there is an identically named `IAssociative` protocol presenting an `assoc` operation.  The module of its origin, not the name, defines its identity and purpose.  The one module actuates effects, the other simulates them.

Recall per [command-query separation](./command-query-separation.md) commands ordinarily return nothing.  This is useful.  Because in one instance you write an operation which takes a subject and its operands, actuates some effect against the subject and returns nothing.  In the other you write an operation which takes a subject and its operands and returns a replacement subject, the subject as it would exist had the side effects been applied directly to it.  A command's natural lack of a return value makes this possible.

In both instances `assoc` has the veneer of a command—that is, an operation which changes an object in some way.  The one actually does and the other provides an updated copy of the original so as to maintain purity.  This distinction is everything.

Its divide revolves around atoms.  Some data structure is held in an atom, so that its contents can be swapped.  The divide made possible by simulated commands and atoms allows a program to separate the pure from the impure.  It relegates the mutation away from the object snapshot held in an atom and to the atom itself.

The atom's contents are cleanly replaced so the object(s) it holds is never actually mutated.  Only the atom's bucket is mutated.  Its contents are swapped, one image for another.

The impure, messy world has no atom and applies effects directly against subjects:
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

The *purer* world relies on an atom to dramatically constrain the how and where of mutation:
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

I say "purer" because although the mutation has not been eliminated it has been neatly managed.  Purity has been introduced and confined to the atom.

The `$.assoc` function is a command.  It actuates.

The `_.assoc` function is a query.  It simulates.  It is a special kind of query, what I call a simulated command, a faux command, or a persistent command.  The *persistent* correlates to persistent types which are types designed around and optimized for simulated effect.

Thus, `assoc` is a command which was ported from the impure realm to the pure and, thus, spans both.  The same with `conj` and countless other commands.

All simulation requires is an atom and a protocol which models effects with simulated commands.  The atom keeps the state and uses them to [`swap`](https://clojuredocs.org/clojure.core/swap!) updates against it.

This reveals how any mutable operation can be simulated, which is to say written as a reductive operation.  It further reveals how all programs are, at their very centers, [reductions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)—that is, some initial value (held by an atom) and a potentially indefinite series of operations (simulated commands swapped against the atom) for advancing the user story.

That cornerstone for how Clojure models state change is what Atomic adopted.  JavaScript, unlike Clojure, does not have a robust set of persistent types.  So Atomic uses reference types and simulated commands to the same end.  In practice, this proves performant enough to be of little concern.

## To What End?

There's an immense value proposition in learning to tease the pure out of the impure.  While the result of simulating (in the atom) before actuating (reflecting change in the environment, data stores and/or interface) is a program doing essentially the same things but with another layer, it would be short sighted to conclude it only adds complexity.

The added layer almost always pays for itself.  It provides a useful boundary between where effects are actuated and the more important logical domain, making it far easier to understand, test and maintain the latter.
