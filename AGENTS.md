# AGENTS

What follows is a practical manifesto for building web apps with **Atomic** and the **functional core, imperative shell** pattern. Written for agents, useful to humans.

## 1. Charter

### 1.1 Roles

* **Director:** Provides direction, goals, examples, and standards. Reviews early and often.
* **Agent:** Acts as an expert developer to craft quality deliverables, ensuring implementations, refactors, and artifacts remain faithful to the philosophy and standards herein.

### 1.2 Core Objective

Build up from a pure simulation.

* Start with a configurable initial state dropped into an `$.atom`.
* Evolve state by swapping (via `$.swap`) **pure** update functions.
* Attach I/O only after the domain behaves correctly in simulation.

**You are doing REPL-driven development.** The agent must build a CLI around the atom in a dedicated module.  It aids agent or human interaction apart from a more robust GUI.  It provides a rich set of commands for the core domain and for the tool itself (via `--help`) using Cliffy.  It needs to pull and act on real data.  If it's not clear how to get that, ask the director.  Don't guess.

### 1.3 Authority & Boundaries

* Work inside a sandbox folder and its files (see **Workflow → File Sandbox**). Avoid changes outside it without explicit approval.
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
* **Use REPL-driven development.** Yes, one starts with simulation, but he's not meant to be blind.  Interacting with a working component facilitates forward motion.

### 2.2 Make It Work → Make It Right

* **Make it work:** Prioritize progress and correctness first. The agent may use any approach which yields working behavior, even in violation of the principles and standards set here. The goal is to get to working first.
* **Make it right:** Once working, baby-step the implementation toward full conformity with Atomic’s principles and the standards in this document before returning to the director.

### 2.3 Small Bets, Vertical First

* Deliver a **single, demonstrable end-to-end slice** early in the project—roughly one-third of the total scope.
* That slice must be **working software**, something visibly useful and representative of the final system’s core behavior.
* This first milestone serves as the checkpoint for alignment: product intent, process understanding, and architectural direction.
* The goal is not many slices, but one strong vertical path that proves the concept, validates communication, and establishes shared understanding before expanding further.
* This embodies the **Small Bets** philosophy: make small, reversible commitments that maximize learning while minimizing downstream rework.

**Supporting Ideas:**

* **Tracer Bullet Development** — Send a working round through the full stack early to confirm direction and expose errors in aim or understanding.
* **Vertical Slice Development** — Apply that tracer philosophy iteratively: deliver thin, complete slices that build confidence and coherence.
* **Small Bets Philosophy** — Make small, reversible commitments that yield maximal learning about both the system and the collaboration behind it.

### 2.4 Coding Standards

#### Language & Style

* JavaScript (no TypeScript). ES modules.
* 2-space indentation; K&R braces.
* Prefer tacit/point-free style.
* Prefer `const`; use `let` only where reassignment is inherent.
* **Do not use block-bodied arrow functions.** Use `function` or concise arrows only.

#### Functions over Methods (Atomic-first)

* Favor functions over methods.
* Where an applicable function exists in Atomic, use it. Atomic has a vast library of functions with close parity to Clojure's.
* JavaScript’s object-oriented style is not the model here—Atomic is. If you understand the Clojure way you already (mostly) understand the Atomic way.
* Functions and composition utilities from Atomic are preferred over native JavaScript object methods.
* When a new helper feels needed, first check Atomic; if absent, build it from Atomic primitives.

#### Purity & Data

* Core functions are **pure**. No I/O, time, or randomness.
* Signature shape: `(state, ...args) -> newState` or `(...args) -> (state) -> newState`.
* Treat objects/arrays as immutable by discipline.
* Configuration enters through curried or partially applied functions.
* A shell is built from signals/FRP. This is the way.
* [Make illegal states unrepresentable](https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/). Every `$.swap` abides this principle.

#### Composition & Pipelines

```js
const p = _.pipe(f1, f2, f3) // a typical forward-ordered composition
const o = _.opt(f1, f2, f3)  // a null short-circuiting, forward-ordered composition
const c = _.comp(f1, f2, f3) // a classic reverse-ordered composition
const r1 = _.chain(v, f1, f2, f3) // a typical pipeline
const r2 = _.maybe(v, f1, f2, f3) // a pipeline which short-circuits on null
const r3 = p(v), r4 = o(v), r5 = c(v)
```

These helpers make tacit/point-free style ergonomic in the absence of native pipeline syntax. `v` maps to a value, the `f`s to functions.

### 2.5 Tacit / Point-Free Commands

Configurable commands accept configuration now and state later. Keep `state` explicit to support uniform swapping.

```js
export function move(dir) {
  return function (state) {
    return state
  }
}
export function up(state) {
  return move('up')(state)
}
```

Currying is for reusability, not ceremony.

**Takeaways:**

* Prefer tacit style.
* Keep `state` explicit.
* Use currying for command families.

### 2.6 Implementing Types/Components

* Protocol names, semantics, and functions originate with the **director**.
* The **director** will usually provide one or more examples from which to model work.
* Identify protocols/concrete functions defining its API.
* Preserve contracted API (names, arity, return shape, errors) and behavior.
* Use `_.implement` to attach protocols.

### 2.7 Modeling Guidance

* Prefer to model the world in one state tree.
* Prefer identity checks for render equality.
* Keep commands small and intention-revealing.
* Make configuration explicit with curried forms.

### 2.8 Placeholder Partial

Atomic’s [placeholder partial](./docs/placeholder-partial.md) mechanism provides partial application—a feature not yet natively implemented in JavaScript. By wrapping its modules, Atomic allows `_` to serve as a placeholder for future parameters, enabling developers to prefill arguments without immediately executing a function. This forms the backbone of **tacit programming** within Atomic and is the chief mechanism for function composition throughout your code.

```js
import _ from "./libs/atomic_/core.js"
import $ from "./libs/atomic_/shell.js"
```

**⚠️ Do not use this on unwrapped functions.** For unwrapped ones, use arrows or `_.partial` or some other means of partial application. The trailing underscore (e.g. `atomic_`) signifies wrapped modules/functions.

## 3. Milestones To An MVP

Build **MVPs** through verifiable baby steps along this structured roadmap. It defines how to build up a component from a headless beginning.

### Milestone 1 — Start with Simulation

* Create initial state and constants (`init`, domain values).
* Author pure commands and stand up the atom & registry.
* The `init` and pure functional core go in `widget/core.js`, the imperative shell in `widget/main.js`.  The imperative shell in the headless stage will remain minimal.  It requires ports to interact with data even in early stages; just no DOM GUI, in early stages.
* The scriptable CLI in `widget/cli.js`.  This is the vital REPL which make it possible to drive and observe transitions.
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

```js
export function move(dir) {
  return function (state) {
    const [y, x] = state.worker
    const step = dir === 'up' ? [-1, 0] : dir === 'down' ? [1, 0] : [0, 0]
    return { ...state, worker: [y + step[0], x + step[1]] }
  }
}
```

#### Stand up the atom & registry

```js
import _ from './libs/atomic_/core.js'
import $ from './libs/atomic_/shell.js'
import * as w from './widget/core.js'
import { reg } from './libs/cmd.js'

const $state = $.atom(w.init())
reg({ $state, w })
```

#### Drive the simulation from the console

Temporary, hardcoded storylines are acceptable; log actions and outcomes. Ultimately, ensure anything you hardcode can be issued via the `widget/cli.js`.

```js
$.swap($state, w.move('up'))
$.swap($state, w.move('down'))
```

### Milestone 2 — Make It Act

If you're interested in powering up your component, implement the `IActor` protocol [described here](./docs/make-it-act.md).  This transforms it into a message-processing command bus.

It's entirely optional.

### Milestone 3 — Add a GUI

```js
import dom from './libs/atomic_/dom.js'
```

* The headless core is dressed with the DOM; prior to this the above import is not added to `widget/main.js`.
* Ensure one-way dataflow: simulation ↔ render via the atom; no backchannels.
* Retain simulation acceptance — the core remains runnable and verifiable without effects.

## 4. Workflow

This section explains the collaboration rhythm: when to act autonomously, when to pause, and how the agent and director synchronize understanding.

### 4.1 File Sandbox

A uniform working name (e.g., `widget`) and folder serve as the sandbox and provides structure. Within it, create at minimum:

* **Core:** pure domain logic (`core.js`).
* **Shell:** wiring, events, persistence, DOM (`main.js`).
* **CLI:** testing/verification harness (`cli.js`).
* **PRD:** product rationale and scratchpad (`prd.md`).
* **TODO:** incremental plan toward *Definition of Done* (`todo.md`).

You may add files as needed (≤ 10 total). You may update anything in the sandbox. Do **not** update outside the sandbox without explicit permission.

### 4.1.1 Optionality

When the director requests **optionality**, it will be in the **3–5 option** range. In such cases:

* Invent additional **code names**, one per option, each with its own sandbox folder.
* Implement each option as a **parallel experiment** that targets the same problem.
* **Vary** the experiments in interesting ways while preserving the director’s vision.
* **Drive all options** toward the **same Definition of Done** to enable apples-to-apples evaluation.
* Treat optionality like a **hackathon you want to win**. Create a `pitch.md` in each option folder explaining what sets it apart, why it deserves kudos, and the bold promises it makes—then deliver.

### 4.2 Agent Playbook

#### Method: move in baby steps

* Plan first. Break work into small increments.
* After each update, **confirm things work as expected** in the CLI tool.
* If something breaks, fix it or try another path if that one becomes a headache.

#### Steer work via the REPL

* Build and use a `widget/cli.js`.
* It’s the cornerstone of your work, used to verify incremental change.
* CLI must expose `--help`, map commands clearly, and be scriptable. Import Cliffy for this.
* If the data acquisition strategy is unclear, pause and ask.

#### PRD and TODO discipline

* Maintain `widget/prd.md` (rationale, notes, links).
* Maintain `widget/todo.md` with checkboxes per step.
* Treat these as kindness to future developers.

#### Checkpoints & Conformance

1. Get **working code**—any reliable method.
2. **Compare** each new function against Atomic equivalents.
3. **Refactor** to Atomic-first style in baby steps.
4. **Verify** simulation passes and invariants hold.
5. **Commit** (see repo policy).

### 4.3 Repo Commit Policy

* If branch identity is unclear, assume it’s `main`.
* Only the **director** may commit on the main branch.
* The **agent** may only work on branches which **are not the main branch**.
  * Commits serve as safe fallbacks.
  * Use discretion—avoid excessive commit noise.

### 4.4 Definition of Done

Before declaring **Done**:

* Review this spec, the PRD, and all director guidance.
* Only return **CLI-verified** work. The director will validate the same way.
* Never hand off a knowingly broken deliverable.
* Run a barrage of CLI tests covering all feasible commands.
* Record relevant tests in the PRD.

## 5. Appendix

* Atomic [README](./README.md)
* [Start with Simulation](./docs/start-with-simulation.md)
* [Interactive Development](./docs/interactive-development.md)
* [Functions First](./docs/functions-first.md)
* [Protocols for Dynamic Extension](./docs/protocols-for-dynamic-extension.md)
* Example apps: [Todo](https://github.com/mlanza/todo), [Sokoban](https://github.com/mlanza/sokoban), [Boulder Dash](https://github.com/mlanza/boulder-dash), [Treasure Quest](https://github.com/mlanza/treasure-quest)
