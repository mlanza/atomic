# Make It Act

Every component in **Atomic** begins as a **simulation** — an atom holding state and a few pure functions that update it.
You call those functions directly and watch state ripple through signals. That’s enough to build an entire app.

But at some point, you may want your components to *speak* in messages rather than function calls — to act.

## From Function Calls to Messages

Early on, you might write:

```js
$.swap($game, g.concede)
```

A direct call. Simple, but opaque — the intent and the transition are fused.

You can shift to a message-based form:

```js
$.swap($game, _.act(_, {type: "concede"}))
```

It looks the same on the surface, but this time you’re **sending a command** into the component.
The command describes what should happen; the actor decides what *does* happen.
The result is still a new object replacing the old one in your atom.

## The IActor Protocol

An actor is a component that can receive and process messages.
It’s defined by the `IActor` protocol:

| Method                              | Description                                                                                                                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`act(self, command)`**            | Receives a command — an intention to change something. It may be accepted or rejected. Accepted commands produce one or more **events**, which are immediately applied.                            |
| **`actuate(self, event)`**          | Receives an event — a fact about what happened — and folds it into state, yielding the next actor.                                                                                                 |
| **`actuate(self, event, reducer)`** | Overload: the third argument is a reducing function that applies the event to the current state and returns the new state. Implementers switch on the event’s `type` and delegate to this version. |
| **`events(self)`**                  | Returns all known events.                                                                                                                                                                          |
| **`undone(self, event)`**           | Optionally reports whether an event can be reversed.                                                                                                                                              |

`actuate` is **pure**. It must never generate new messages.
Event messages are meant to be safely replayable; any indeterminate work or decision-making belongs inside `act`.

Because of the overload, existing domain functions remain useful.
That earlier `concede` function still runs — it just becomes the reducer that applies a `conceded` event to the current state.

## Message Types

All messages share a simple shape:

```js
{ type: "concede", details: { ... } }
```

We use **active voice** for commands and **past tense** for events.
Usually, it’s as easy as adding a “d”:

| Kind        | Example              | Meaning                           |
| ----------- | -------------------- | --------------------------------- |
| **Command** | `{type: "concede"}`  | A request to end the game.        |
| **Event**   | `{type: "conceded"}` | A record that the game has ended. |

### Command

A **command** is an intention. It expresses what should happen, but not what did happen.
Commands can be rejected if they violate a rule or the current state.

### Event

An **event** is a fact. It tells what *actually* happened after a command was accepted.
Events are immutable and replayable. Fold them through `actuate` to rebuild state from scratch.

## A Component’s Inner Flow

Inside an actor, every change follows the same simple path:

```
command → act → events → actuate → next actor
```

* `act` decides what events to generate and actuate.
* `actuate` applies each event (purely) to the state.
* The resulting actor — updated state, events logged — replaces the old one in your atom.

That’s the entire simulation loop.

## Expanding the Model: Effects

Once you’re comfortable with **commands** and **events**, you can add a third kind of message: **effects**.

An **effect** is an outbound request — something your component wants the outside world to do.  Thus, a command, but for an indeterminate actor.

It’s still just a message, but it’s aimed beyond the component’s boundary.

### Why start without them

Most of the time, you don’t need effects.
The shell can simply **observe state changes** and react.

If a game’s status changes to `"conceded"`, the UI or another process can notice and respond.
That’s the **implicit model** — a simpler way to start.  Graduating to the **explicit model** is optional.

### Modeling effects explicitly

If you need a record or queue of outbound work, the actor can accumulate effects internally.
You can inspect them with `glance()` and clear them with `drain()`:

| Method             | Purpose                                      |
| ------------------ | -------------------------------------------- |
| **`glance(self)`** | View staged effects awaiting routing.        |
| **`drain(self)`**  | Return the actor with those effects cleared. |

This lets the shell — or perhaps some **mediator** — monitor the actor, pick up its messages, and route them elsewhere.

## Dependency Inversion

Actors model **intent** with commands; confirmed changes are **events**.
`act` decides which events to produce; `actuate` applies them, purely.

It's still just a reduction:

```
command → act → events → actuate → next actor
```

At creation (`init`), you can **inject services** alongside state — this is where inversion shows up. The actor defines *what* should happen, not *how*.

You swap the service, not the logic.

In the earlier stages, `init` returned a plain JavaScript object. That was fine when the atom only needed a little data to begin simulating, but `init` is not a rule. It’s an idea: every atom needs an initial seed. What you plant there can be bare data or a richer type with its own contracted interface.

Thus `init` naturally gives way to more deliberate factories — constructors that assemble services, wrap data, and return something that knows how to act.

### A Common API, Two Dice

Both dice share a `roll` interface and fix sides at construction. One is seeded and deterministic; the other uses real randomness.

```js
// dice.js
export function pseudoRandomDie(seed, sides = 6) {
  let s = seed >>> 0
  function next() { s = (1664525 * s + 1013904223) >>> 0; return s }
  return { roll() { return (next() % sides) + 1 } }
}

export function randomDie(sides = 6) {
  return { roll() { return (Math.random() * sides | 0) + 1 } }
}
```

### Using the Service Inside `act`

The actor doesn’t know which die it has — only that it can `roll`. On `"roll"`, it generates a `"rolled"` event with `details`, then actuates it.

```js
// game/core.js

//`init` promoted to a factory function
export function pig(services = {}) {
  return new Pig({ ..., services });
}

function act(self, command) {
  if (command.type === 'roll') {
    const rolled = self.services.die.roll()
    const event = { type: 'rolled', details: { rolled } }
    return actuate(self, event);
  }
  // ...
  return self;
}

$.doto(Pig,
  // .. implements protocols
  _.implement(_.IActor, {act, actuate}));
```

### Seeding the Atom

At startup, you choose whether [Pig](https://en.wikipedia.org/wiki/Pig_(dice_game)) simulates chance or actually employs it.

```js
// main.js
const die = randomDie(); // or pseudoRandomDie(42)
const $pig = $.atom(pig({ die })); //init

$.swap($pig, _.act(_, { type: 'roll' }));
```

That’s dependency inversion in miniature — the actor stays pure and declarative; you decide whether the world is chaotic or predetermined.

## Handling Errors

This model is a hybrid, mostly pure, but there's no `Either` monad for accommodating errors.  Instead, I took a simpler route: I **throw errors** from within `act`. It’s less pure, but it’s pragmatic.

I use these throws to uphold rules and reject invalid requests. They act as guardrails, signaling that the command shouldn’t proceed. From there, the **shell** catches them — treating each as though it were just another effect.

If you wanted to push through to total purity, it wouldn’t take much. You could surface those failures as data instead of exceptions — registering them through the same `effects` API (`glance`, `drain`) and letting a handler route or record them as structured problems.

As always in software, there’s freedom in the tradeoff. You can handle rejection as data or as control flow. For now, I lean toward throwing — a small concession to impurity in service of keeping things simple.

## Summary

You began with a simple atom you swapped functions against. Now you’re swapping **messages**.

At first, there are only two: **commands** (intentions) and **events** (facts). That’s enough to build a fully simulated, replayable world.

Later, you can implement **effects** — outbound messages for the world — using an implicit (simpler) or explicit (staged and drained) model. You can even inject impure handlers to interpret those effects directly.

Everything still happens *inside* the atom. The component remains a simulation — you just taught it how to **act**.
