# Simulating and actuating

The following table demonstrates a couple important ideas.

Some operations, like `get`, are naturally queries, and can be used in either the pure or impure part of a program without causing harm.  Because queries are safe they move freely to both spaces.

However, because naturally impure, mutable operations like `$.assoc` can cause harm, they can't.  Rather safe, simulated version of the command (thus, `_.assoc`) must be written.  This is almost always desirable because of the principle of simulating before actuating.  That is, the core of every program [begins as a simulation](./start-with-simulation.md).

```js
const obj = {title: "Lt.", lname: "Columbo"};
const shows = ["Columbo", "The Good Doctor"];
```

|Action|Pure World|Impure World|
|-|-|-|
|Read property|`_.get(obj, "lname")`|`_.get(obj, "lname")`|
|Write property|`_.assoc(obj, "lname", "Specter")` | `$.assoc(obj, "lname", "Specter")`|
|Add element|`_.conj(shows, "Suits")` | `$.conj(shows, "Suits)` |

Consider that associating (`assoc`) is about adding a property/value pair to some entity/object.  It can be either actuated or simulated.  Thus, `$.assoc` is impure and has side effects while `_.assoc` is pure and does not.

The actuating/simulating divide is determined by the import.  `shell` imports as `$`.  This is primarily where impure functions are kept.  `core` imports as `_`.  This is primarily where pure functions are kept.

In each module there is an identically named `IAssociative` protocol presenting an `assoc` operation.  The module of origin, not the name, defines its identity and purpose.  The one module actuates effects, the other only simulates them.  Thus, although sharing a common protocol name and functions, the one dispenses *commands*, the other *queries*.

Recall how [command-query separation](./command-query-separation.md) expects commands to return nothing.  This is useful.  Because in one instance you write an operation which takes a subject and its operands, actuates some effect against the subject and returns nothing.  In the other you write an operation which takes a subject and its operands and returns a replacement subject, the subject as it would exist had the side effects been applied directly to it.  A command's natural lack of a return value makes this possible.

In both instances `assoc` has the veneer of a side-effecting operation or command.  The impure one actually changes its subject and the pure one provides an updated copy of it.  This command division applies not only to legitimate value types and persistent types but [also to reference types like objects and arrays](./mutables-for-immutables.md).

Understanding the reason and purpose in using a simulated command instead of an actual command is vital.  The atom is the divide between simulating and actuating.  Some data structure is held in it, so its contents can be swapped, one image for another.  In this way, the inside of the atom is a pure, functional core.  The atom itself and the environment in which it operates is an impure, imperative shell.

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

The pure world exists inside atoms:
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

The `$.assoc` function is a command.  It actuates.

The `_.assoc` function is a query.  It simulates.  It is a *faux command* or *simulated command* or just *command*—simulation understood—intended for use with an atom.

Thus, the `assoc` command was ported from the impure realm into the pure and, thus, spans both.  The same with `conj` and countless other "commands."

Here effects are actuated directly:
```js
import $ from "./libs/atomic_/shell.js";
const stooges = ["Moe", "Larry", "Shemp"];
$.conj(stooges, "Corey"); //commands actuate
```

Here effects are [simulated first](./start-with-simulation.md):

```js
import _ from "./libs/atomic_/core.js";
const $stooges = $.atom(["Moe", "Larry", "Shemp"]);
$.swap($stooges, _.conj(_, "Corey")); //queries simulate
```

To actuate the effects, the program would also subscribe to and react to updates made in the atom.  Thus, anything which is simulated will also be actuated somehow.   One convenient way is sending these updates to the log.

```js
$.sub($stooges, $.log);
```

This is the equivalent of:

```js
$.sub($stooges, console.log.bind(console));
```

A typical app would render these updates to a GUI in the DOM.

The parallel snippets shown above might lead one to believe an `_.assoc` in the simulating part of the app would correlate to an `$.assoc` in the actuating part.  That's feasible, but not obligatory.  The snippets demonstrate, rather, how actual commands can be converted to faux commands and vice versa.  Nothing more.

What's being simulated inside the atom is what the user is doing.  What's being actuated outside it is the GUI.  Whenever simulation is added to an app, actuation follows.  Though they work together, they are different responsibilities.

## Naming

Clojure likes to make the distinction between the pure and the impure by sometimes adding a bang to impure names.  Thus, `conj` is of the former, pure variety and `conj!` the impure variety.  JavaScript doesn't allow names ending with a bang.  The distinction is made by the module, so `_.conj` and `$.conj` for `conj` and `conj!`.
