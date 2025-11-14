# AGENTS

What follows is a practical manifesto for building web apps with **Atomic** and the **functional core, imperative shell** pattern. Written for agents, useful to humans.

## 1. Charter

### 1.1 Roles

* **Director:** Provides direction, goals, examples, and standards. Reviews early and often.
* **Agent:** You are an expert, REPL-driven developer who crafts quality deliverables, ensuring implementations, refactors, and artifacts remain faithful to the philosophy and standards herein.

### 1.2 Core Objective

Build up from a pure simulation.

* Start with a configurable initial state dropped into an `$.atom`.
* Evolve state by swapping (via `$.swap`) **pure** update functions.
* Attach I/O only after the domain behaves correctly in simulation.

#### REPL-driven development

The agent [builds and maintains a CLI](./agents/cli.md) around the atom in [a dedicated module](./agents/sandboxing.md).  This aids agent and/or human interaction apart from a more robust GUI.  It provides a rich set of commands related to the core domain and to the tool itself (via `--help`) using Cliffy.

> 📢 For it to be useful, it needs data to act on.  If how to get the data is unclear, ask the director.  Don't guess and/or invent mock data.

### 1.3 Authority & Boundaries

* Work inside a [sandbox folder](./agents/sandboxing.md) and its files. Avoid changes outside it without explicit approval.
* Autonomy is high *inside* the sandbox, gated by small, verifiable increments and checkpoints.

## 2. Principles

### 2.1 Foundation

* **Functional Core, Imperative Shell (FCIS).** The domain is pure: data + pure functions. The shell is effects: DOM, events, storage, network, timers.
* **Start with Simulation.** Seed initial data with `init` into an atom (`$.atom`) and evolve it solely by swapping pure commands (`$.swap`). Get the inner core working and verified in simulation before even thinking about UI. That is the premise.
* **Data First.** Prefer plain objects/arrays as value-like data; maintain purity by discipline.
* **Functions over Methods.** While JS is object oriented and everything has methods, prefer Atomic functions.
* **Pipelines & Composition.** Small functions, composed. Use Atomic’s helpers to emulate pipelines.
* **Swap, Don’t Mutate.** State lives in an atom. Transitions happen by swapping pure commands.
* **One-Way Dataflow.** Simulation → render; DOM/events → simulation. No backchannels.
* **Interactivity as a Tool.** The CLI and console are how you *see* and *steer* the world. Write enough to `console.log` that you can guide development confidently.
* **Keep a CLI to facilitate sight.** Starting with a headless component need not mean blindness.  Building and maintain a CLI tool is the primary means to making your work interactive and observable.

### 2.2 Make It Work → Make It Right

* **Make it work:** Prioritize progress and correctness first. The agent may use any approach which yields working behavior, even in violation of the principles and standards set here. The goal is to get to working first.
* **Make it right:** Once working, baby-step the implementation toward full conformity with Atomic’s principles and the standards in this document before returning to the director.

### 2.3 Language & Style

* JavaScript (no TypeScript). ES modules.
* 2-space indentation; K&R braces.
* Prefer tacit/point-free style.
* Prefer `const`; use `let` only where reassignment is inherent.
* **Do not use block-bodied arrow functions.** Use `function` or concise arrows only.

### 2.4 Functions over Methods (Atomic-first)

* Favor functions over methods.
* Where an applicable function exists in Atomic, use it. Atomic has a vast library of functions with close parity to Clojure's.
* JavaScript’s object-oriented style is not the model here—Atomic is. If you understand the Clojure way you already (mostly) understand the Atomic way.
* Functions and composition utilities from Atomic are preferred over native JavaScript object methods.
* When a new helper feels needed, first check Atomic; if absent, build it from Atomic primitives.

### 2.5 Purity & Data

* Core functions are **pure**. No I/O, time, or randomness.
* Signature shape: `(state, ...args) -> newState` or `(...args) -> (state) -> newState`.
* Treat objects/arrays as immutable by discipline.
* A shell is built from signals and FRP.
* Configuration enters through curried or partially applied functions.

### 2.6 Make Illegal States Unrepresentable

*Inspired by Scott Wlaschin’s essay on [Designing with Types](https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/).*

This principle says: **design data so the impossible can’t happen.** You don’t defend against bad states at runtime—you model them out of existence.  **This is the way, the imperative behind all functions which transform state.**

**Core ideas:**

* **Model constraints directly.** Encode the rules of the domain in the structure itself. Use enums, nested objects, or tagged unions to make every variant explicit.
* **Guard by design, not by validation.** When something “can’t happen,” make it unconstructable in the first place.
* **Ensure every transition is lawful.** Each `$.swap` represents a valid state evolution. If a transition requires an external check, the model likely needs refinement.
* **Plan the state machine.** Since we have an `init` function and swappable commands, these define and preserve valid states. We’re modeling a state machine and its transitions—those transitions deserve deliberate design.
* **Validate only at the boundary.** Invalid commands can always arrive from the outside world. Validation belongs at the edge; inside the domain, trust holds. The model guards that trust.

In Atomic, this mindset turns data modeling into an act of defense: shape the world so that even your bugs must ask permission to exist.

### 2.7 Composition & Pipelines

```js
const p = _.pipe(f1, f2, f3) // a typical forward-ordered composition
const o = _.opt(f1, f2, f3)  // a null short-circuiting, forward-ordered composition
const c = _.comp(f1, f2, f3) // a classic reverse-ordered composition
const r1 = _.chain(v, f1, f2, f3) // a typical pipeline
const r2 = _.maybe(v, f1, f2, f3) // a pipeline which short-circuits on null
const r3 = p(v), r4 = o(v), r5 = c(v)
```

These helpers make tacit/point-free style ergonomic in the absence of native pipeline syntax. `v` maps to a value, the `f`s to functions.

#### Placeholder Partial

Atomic’s [placeholder partial](./docs/placeholder-partial.md) mechanism provides partial application—a feature not yet natively implemented in JavaScript. By wrapping its modules, Atomic allows `_` to serve as a placeholder for future parameters, enabling developers to prefill arguments without immediately executing a function. Partial application is the backbone of **tacit programming**.  Within Atomic this hack is the chief mechanism for function composition and partial application.

```js
import _ from "./libs/atomic_/core.js"
import $ from "./libs/atomic_/shell.js"
```

**⚠️ Do not use this on unwrapped functions.** For unwrapped ones, use arrows or `_.partial` or some other means of partial application. The trailing underscore (e.g. `atomic_`) signifies wrapped modules/functions.

### 2.8 Implementing Types/Components

* Protocol names, semantics, and functions originate with the **director**.
* The **director** will usually provide one or more examples from which to model work.
* Identify protocols/concrete functions defining its API.
* Preserve contracted API (names, arity, return shape, errors) and behavior.
* Use `_.implement` to attach protocols.

## 3. Delivering the MVP

Build the **MVP** through verifiable baby steps.

Atomic's tagline is [Start with Simulation](./docs/start-with-simulation.md) for a reason.  It's because all roads begin here, at a headless component.

* Create initial state and constants (`init`, domain values).
* Author pure commands and stand up the atom & registry.
* The `init` and pure functional core go in a `core.js`, the imperative shell in a `main.js`.  The imperative shell in the headless stage will remain minimal.  It requires ports to interact with data even in early stages; just no DOM GUI, in early stages.
* The scriptable `cli.js` is [the vital tool](./agents/cli.md) which make it possible to drive and observe transitions, more imporant than [tests](./agents/testing.md) at this point.
* Verify invariants without I/O, time, or randomness; log sufficiently to see and steer.

#### Define domain constants & initial state

```js
export const v = 'void', b = 'building', g = 'ground', w = 'water', x = 'dest'

export function init() {
  return {
    worker: [6, 4],
    crates: [[3, 3], [3, 4], [4, 4], [3, 6]],
    fixtures: []
  }
}
```

#### Author pure commands

Configurable commands accept configuration now and state later. Keep `state` explicit to support uniform swapping.

```js
export function move(dir) {
  return function (state) {
    const [y, x] = state.worker
    const step = dir === 'up' ? [-1, 0] : dir === 'down' ? [1, 0] : [0, 0]
    return { ...state, worker: [y + step[0], x + step[1]] }
  }
}

export function up(state) {
  return move('up')(state);
}
```

Currying is for reusability, not ceremony.

**Takeaways:**

* Prefer tacit style.
* Keep `state` explicit.
* Use currying for command families.

#### Stand up the atom & registry

```js
import _ from './libs/atomic_/core.js'
import $ from './libs/atomic_/shell.js'
import * as s from './sokoban/core.js'
import { reg } from './libs/cmd.js'

const $state = $.atom(s.init())
reg({ $state, s })
```

#### Drive the simulation from the console

Temporary, hardcoded storylines are acceptable; log actions and outcomes. Ultimately, ensure anything you hardcode can be issued [via the command line](./agents/cli.md).

```js
$.swap($state, w.move('up'))
$.swap($state, w.move('down'))
```

#### There is no spoon (er, DOM)

The GUI [will be added in the future](./README.md#stand-up-the-user-interface), once the core is solid.  Until then, except for [the CLI](./agents/cli.md) in use during development, the app/component remains headless.

The following import does not yet belong:

```js
import dom from './libs/atomic_/dom.js'
```

## 4. Agent Playbook

This section explains the workflow, the collaboration rhythm: when to act autonomously, when to pause, and how the agent and director synchronize understanding.

### 4.1 Steering: Why the CLI exists

[The CLI](../agents/cli.md) is the cornerstone of your work, used to verify change incrementally.

* Build and use a `cli.js`.
* CLI must expose `--help`, map commands clearly, and be scriptable. Import Cliffy for this.
* If the data acquisition strategy is unclear, pause and ask.

### 4.2 Repo Policy

* If branch identity is unclear, assume it’s `main`.
* Only the **director** may commit on the main branch.
* The **agent** may only work on branches which **are not the main branch**.
  * Commits serve as safe fallbacks: first downs.
  * Use discretion—avoid excessive commit noise.
* Every commit assumes the working software and running the CLI confirms the goals to that point have been met.

### 4.3 Definition of Done

Before declaring **Done**:

* Review this spec, the PRD, and all director guidance and compare your work to it.  Your deliverable quality depends on how well it conforms to this baseline.
* Never hand off a knowingly broken deliverable.
* Only return **CLI-verified** work.  If the CLI cannot be used to confirm the goals have been met, you're not done.
* In fact, provide the director with a list of command line operations for confirming the work.  You will have run them yourself, first.  The director will validate the same way.

Your collaboration with the **director** always culminates here. Check your work before returning it.

## 5. Appendix

* Atomic [README](./README.md)
* [Start with Simulation](./docs/start-with-simulation.md)
* [Interactive Development](./docs/interactive-development.md)
* [Functions First](./docs/functions-first.md)
* [Protocols for Dynamic Extension](./docs/protocols-for-dynamic-extension.md)
* Example apps: [Todo](https://github.com/mlanza/todo), [Sokoban](https://github.com/mlanza/sokoban), [Boulder Dash](https://github.com/mlanza/boulder-dash), [Treasure Quest](https://github.com/mlanza/treasure-quest)
