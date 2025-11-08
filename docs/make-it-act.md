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
{ type: "commit", details: { ... } }
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

An **effect** is an outbound request — something your component wants the outside world to do.

It’s still just a message, but it’s aimed beyond the component’s boundary.

### Why start without them

Most of the time, you don’t need effects.
External systems can simply **observe state changes** and react.

If a game’s status changes to `"conceded"`, the UI or another process can notice and respond.
That’s the **implicit model** — a simpler way to start.  You may never graduate to the **explicit model**.

### When to add them

If you need a record or queue of outbound work, the actor can accumulate effects internally.
You can inspect them with `glance()` and clear them with `drain()`:

| Method             | Purpose                                      |
| ------------------ | -------------------------------------------- |
| **`glance(self)`** | View staged effects awaiting routing.        |
| **`drain(self)`**  | Return the actor with those effects cleared. |

This lets a **mediator** (or shell) look at the actor, pick up those messages, and route them elsewhere.

Effects are **commands** meant for consumption by *external* components.

## Dependency Injection and Purity

Whether an actor performs work or only describes it depends on what you inject into it.

During **dependency injection**, you decide whether it behaves as a **pure** or **impure** component.

* A **pure actor** only simulates side effects. It stages them as data but never performs IO.
  For example, you might inject a service that uses a **seeded pseudo-random number generator** — still deterministic, still pure.
* An **impure actor** may interpret those effects directly — say, by using the **standard random number generator**, introducing nondeterminism.

This is **dependency inversion** in action: the high-level component remains pure in design, while injected dependencies determine how (and whether) side effects are realized.

## The Implementer’s Responsibility

If you’re implementing `IActor`, you define two gates:

* **`act`** — accepts commands, validates them, and generates and actuates events (and potentially effects).
* **`actuate`** — applies events to state, deterministically and with no new messages.

Your component’s story is told entirely through those gates:
commands propose change; events confirm it.

## Summary

You began with a simple atom you swapped functions against.
Now you’re swapping **messages**.

At first, there are only two:
**commands** (intentions) and **events** (facts).
That’s enough to build a fully simulated, replayable world.

Later, you can add **effects** — outbound messages for the world —
and choose between implicit (simpler) or explicit (staged and drained) models.
You can even inject impure handlers to interpret those effects directly.

Everything still happens *inside* the atom.
The component remains a simulation —
it just learned how to **act**.
