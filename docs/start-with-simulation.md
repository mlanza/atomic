# Start with simulation
The `core` library provides primarily pure functions which can be used to develop a pure, functional core which exists separately from its imperative shell.  This separation is what Atomic is about.

A program begins as a simulation.  While that may sound intimidating to anyone but a functional programmer, it's actually not.  Starting this way is, in fact, the pleasure of the functional paradigm.

## Model the data representation
Conceptualize what the program's about.  What does it do?  What's its reason for being?  This step involves modeling its data.

Consider a trivial program: tic tac toe.  "X" goes first.  How might that be modeled?

Its simplest form might look something like this:
```js
const ttt = {
  rows: [[null, null, null], [null, null, null], [null, null, null]]
}
```

But that's a little too rudimentary.  Bear in mind also how the game will be presented.  This version will include the player names.  It will also involve 5 rounds.  The winner, the best of 5.  Given these requirements, the initial model won't suffice.

It might now look like this:
```js
const ttt = {
  players: [],
  round: 0,
  up: "X",
  rows: [[null, null, null], [null, null, null], [null, null, null]],
  outcomes: [
    {winner: null},
    {winner: null},
    {winner: null},
    {winner: null},
    {winner: null}
  ]
}
```

This is just one possibility.  There are many ways to model this.  And that's largely what writing programs is about, deciding how to represent the story being told.

## Activate the simulation with a state container
But a functional program is not going to do well with its state assigned to a constant.  While the functional core is pure, it needs a harness in which the simulation can run.  It provides a means of transitioning from one state to the next.

In Atomic, that means is provided by a state container: an atom.  The only real difference from Clojure's implementation is it invokes its callback upon subscription the way an Rx [subject](https://rxjs.dev/guide/subject) does, but the traditional behavior is possible by overriding the `primingSub` option.  The state held in atoms is [addressable](./addressable-data.md) and can employ the Clojure methodology for surgically updating it.

The initial program would look more like this:

```js

function init(){
  return {
    players: [],
    round: 0,
    up: "X",
    rows: [[null, null, null], [null, null, null], [null, null, null]],
    outcomes: [
      {winner: null},
      {winner: null},
      {winner: null},
      {winner: null},
      {winner: null}
    ]
  }
}

const $ttt = $.atom(init());

```

This is, in fact, where Atomic got its name.  It arose from every app's humble beginning of a bit of state being plunked into a state container.  This atom is the core ⚛️ of every program/component.

## Seed the simulation using a function
In this version `init` seeds the initial state.  Why the function?  Why not just drop the initial state into the atom?

That could work.  But since most programs are configurable, whether they're launched from the command line (and receive options) or a browser (and receive query params), better to start with a consistent pattern.

Right now, `init` receives no arguments. But what if the number of rounds could be specified.  `init` becomes `init(rounds)`.

The point of using the function is consistency.  The creation of something from nothing begins with a big bang.  Let that be a function.

## Model the simulation's transitions
Having moved the game into an atom now makes it possible to `swap` state updates, one step at a time.

At this stage, given the starting data, what seems to be the first logical step?  The players need specified.

```js
function join(name){
  return function(state){
    const revised = {...state};
    revised.players.push(name);
    return revised;
  }
}

$.swap($ttt, join("Tom"));
$.swap($ttt, join("Jerry"));
```

This provides a simplistic view of what's necessary to keep things moving forward.  Obviously, to do things correctly, it would be necessary to determine when the full complement of players is reached.

```js
function canJoin(state){
  return state.players.length < 2;
}
```
## Why start with simulation?
### It's pure
All the functions being written at this stage are pure.  They take in arguments and return results.  Nothing is mutated.  Rather, they copy the original state before mutating the copy and returning its replacement.

These commands (e.g. `join`) are actually queries, or "[simulated commands](./adopting-the-clojure-mindset.md)" because they're designed to be swapped against a state container.

```js
function winner(state){ // "X", "O", or null (neither)
  ...
}

function outcome(state){ // "undetermined", "win", or "draw"
  ...
}

function tallyResult(state){
  ...
}

function nextRoundOrConclude(state){
  ...
}

function mark([col, row]){
  return function(state){
    const {up, rows} = state;
    const proposed = {...state,
      up: up == "X" ? "O" : "X",
      rows: _.assocIn(rows, [row, col], up)
    };
    return outcome(proposed) == "undetermined" ? proposed : _.chain(proposed, tallyResult, nextRoundOrConclude);
  }
}

$.swap($ttt, mark([1, 1]));
```

### It's verifiable
Because the functions are pure, the logical core is pure.  This provides the best possible situation for writing unit tests.  Pure algorithms are readily verifiable.

Take a look.

Simulations require a harness...

```js
const $ttt = $.atom(init());
```

...and actions to move a story forward:

```js
$.swap($ttt, join("Tom"));
$.swap($ttt, join("Jerry"));
$.swap($ttt, mark([1, 1]));
```

This approach was touted as functional, but running things inside a state container means it's actually imperative!  And while correct, the program, at this stage, requires a minimal amount of plumbing for getting things done.

To highlight just how thin the imperative layer is, look at how the story so far could be extracted:

```js
const ttt =
  _.chain(
    init(),
    join("Tom"),
    join("Jerry"),
    mark([1, 1]));
```

With the container eliminated, the story so far can be consolidated into a single, final frame.  The move from a harness to a pure algorithm is but a tiny leap.

It reveals how simple it is to marshall a story between the impure and pure worlds, to eliminate the flow of time when desired.  It's the untimeliness of side effects, after all, that unnecessarily complicate things, and when that can be controlled or altogether eliminated, good things can happen.

Here, modeling the story as pages, demonstrate how suitably analogous functional programs are to flip books.  It should be apparent how having access to moment-in-time snapshots facilitates writing unit tests.

```js
const pg0 = init();
const pg1 = _.chain(pg0, join("Tom"));
const pg2 = _.chain(pg1, join("Jerry"));
const pg3 = _.chain(pg2, mark([1, 1]));
```

### It's transparent
The result of every discrete operation can be monitored:

```js
$.sub($ttt, $.log); //subscribe to and log changes
```

When anything goes wrong, when the resulting snapshot of the state doesn't add up, when it stops looking as one expects, one can more quickly identify the blame.  That's because each snapshot captures a complete moment in time.

### It's easier to identify and fix faulty logic
When a bad snapshot emerges, there's a precise operation/step to account for it.  "This frame looks fine, but the next one doesn't."

Furthermore, when a complete record of snapshots have been captured, a developer can take the last good snapshot and interactively debug/reapply the faux command which brought it to the bad state.

```js
const frames = []; // capture snapshots?
$.sub($ttt, function(snapshot){
  frames.push(snapshot); // easy peasy.
});
```
This approach reduces programs, those being developed and those already in the wild, to flip books making developing and debugging them easier.  All the developer must primarily understand is how to read and compare snapshots.

### It's headless
It's possible to develop a functional core and have a simulated game arrive at a final state apart from a proper user interface.  Because of its transparency, the browser console offers a rudimentary command-line interface.  [Interacting with it](./interactive-development.md) is as simple as reading state snapshots and issuing commands against the state container.

When it comes to getting a program up and running, this conveniently permits the messy, imperative parts, like the user interface, be deferred.  With just a little imagination, one stands up a logical v1 core and simulates a program lifecycle all from a basic, headless shell.
