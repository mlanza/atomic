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

**REPL-driven development.** The agent builds and maintains a CLI around the atom in a dedicated module.  This aids agent and/or human interaction apart from a more robust GUI.  It provides a rich set of commands related to the core domain and to the tool itself (via `--help`) using Cliffy.  For it to be useful, it needs data to act on.  If how to get it is unclear, ask the director.  Don't guess.

### 1.3 Authority & Boundaries

* Work inside a sandbox folder and its files (see **Workflow → Sandbox**). Avoid changes outside it without explicit approval.
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

### 2.4 Language & Style

* JavaScript (no TypeScript). ES modules.
* 2-space indentation; K&R braces.
* Prefer tacit/point-free style.
* Prefer `const`; use `let` only where reassignment is inherent.
* **Do not use block-bodied arrow functions.** Use `function` or concise arrows only.

### 2.5 Functions over Methods (Atomic-first)

* Favor functions over methods.
* Where an applicable function exists in Atomic, use it. Atomic has a vast library of functions with close parity to Clojure's.
* JavaScript’s object-oriented style is not the model here—Atomic is. If you understand the Clojure way you already (mostly) understand the Atomic way.
* Functions and composition utilities from Atomic are preferred over native JavaScript object methods.
* When a new helper feels needed, first check Atomic; if absent, build it from Atomic primitives.

### 2.6 Purity & Data

* Core functions are **pure**. No I/O, time, or randomness.
* Signature shape: `(state, ...args) -> newState` or `(...args) -> (state) -> newState`.
* Treat objects/arrays as immutable by discipline.
* A shell is built from signals and FRP.
* Configuration enters through curried or partially applied functions.

### 2.7 Make Illegal States Unrepresentable

*Inspired by Scott Wlaschin’s essay on [Designing with Types](https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/).*

This principle says: **design data so the impossible can’t happen.** You don’t defend against bad states at runtime—you model them out of existence.  This is the way.

**Core ideas:**

* **Model constraints directly.** Encode the rules of the domain in the structure itself. Use enums, nested objects, or tagged unions to make every variant explicit.
* **Guard by design, not by validation.** When something “can’t happen,” make it unconstructable in the first place.
* **Ensure every transition is lawful.** Each `$.swap` represents a valid state evolution. If a transition requires an external check, the model likely needs refinement.
* **Plan the state machine.** Since we have an `init` function and swappable commands, these define and preserve valid states. We’re modeling a state machine and its transitions—those transitions deserve deliberate design.
* **Validate only at the boundary.** Invalid commands can always arrive from the outside world. Validation belongs at the edge; inside the domain, trust holds. The model guards that trust.

In Atomic, this mindset turns data modeling into an act of defense: shape the world so that even your bugs must ask permission to exist.

### 2.8 Composition & Pipelines

```js
const p = _.pipe(f1, f2, f3) // a typical forward-ordered composition
const o = _.opt(f1, f2, f3)  // a null short-circuiting, forward-ordered composition
const c = _.comp(f1, f2, f3) // a classic reverse-ordered composition
const r1 = _.chain(v, f1, f2, f3) // a typical pipeline
const r2 = _.maybe(v, f1, f2, f3) // a pipeline which short-circuits on null
const r3 = p(v), r4 = o(v), r5 = c(v)
```

These helpers make tacit/point-free style ergonomic in the absence of native pipeline syntax. `v` maps to a value, the `f`s to functions.

### 2.9 Implementing Types/Components

* Protocol names, semantics, and functions originate with the **director**.
* The **director** will usually provide one or more examples from which to model work.
* Identify protocols/concrete functions defining its API.
* Preserve contracted API (names, arity, return shape, errors) and behavior.
* Use `_.implement` to attach protocols.

### 2.10 Placeholder Partial

Atomic’s [placeholder partial](./docs/placeholder-partial.md) mechanism provides partial application—a feature not yet natively implemented in JavaScript. By wrapping its modules, Atomic allows `_` to serve as a placeholder for future parameters, enabling developers to prefill arguments without immediately executing a function. This forms the backbone of **tacit programming** within Atomic and is the chief mechanism for function composition throughout your code.

```js
import _ from "./libs/atomic_/core.js"
import $ from "./libs/atomic_/shell.js"
```

**⚠️ Do not use this on unwrapped functions.** For unwrapped ones, use arrows or `_.partial` or some other means of partial application. The trailing underscore (e.g. `atomic_`) signifies wrapped modules/functions.

### 2.11 The Quarterback

Think of your work like football. You’re the quarterback—eyes up, reading the field, calling plays one at a time. Each command you run through the CLI, each function you refine, it’s a play that advances the ball a few yards.

No one expects a Hail Mary. We’re a ground-game team—disciplined, deliberate, and confident in short gains. Each successful swap, each pure function verified in the CLI, moves the chain. Over time, those yards become drives, and drives become touchdowns.

You own the field between huddles. Within your sandbox, autonomy is total. You decide the next play, call it, and execute. The CLI is your playbook and your voice on the line. The plan evolves one down at a time.

Only pause when it’s time to meet the coach on the sideline—checkpoint moments, reviews, or course corrections. That’s when we reset, replan, and head back out. Until then, keep the ball in motion. Small, verifiable gains are the surest way to stay in control of the game.

### 2.12 No TDD Here

Developers may notice what’s missing here—no unit tests, no test harness, no TDD mandate.
That absence is intentional.

Tests are valuable, but they also **petrify ideas**. They harden what’s still fluid. In the early stages of work, I'm exploring—poking, pivoting, learning what the system wants to become. Agents too. During this phase, certainty is scarce and flexibility is everything. Managing another layer of fixtures, mocks, and harnesses only slows discovery. It trades movement for ceremony.

I practice **Tracer Bullet Development**: firing working rounds through the stack to confirm aim, then adjusting. Each bullet teaches more than a hundred assertions written too soon. The REPL and CLI serve as our live feedback loops; they *are* our tests, only conversational and disposable.

Formal tests have their rightful place. They’re **safety nets**—guarantees to customers that shipped software can be trusted to meet its promises. Once the design stabilizes, once the idea is no longer in motion, tests become that covenant of reliability. Until then, they’re ballast.

So: no TDD here. Not because testing is unimportant, but because *freedom to pivot* is. We trade early rigidity for creative velocity, trusting that confidence and correctness will come later—when there’s finally something worth defending.

## 3. Stages To MVP

Build the **MVP** through verifiable baby steps. Although the order is often as follows, the Actor and GUI stages can come in either order.

### 3.1 Simulation

Atomic's tagline is [Start with Simulation](./docs/start-with-simulation.md) for a reason.  It's because all roads begin here, at a headless component.

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

### 3.2 Actor

Optionally, extend your functional core by implementing the `IActor` protocol [described here](./docs/make-it-act.md).  Promoting it into an actor enables it to receive and process messages like a command bus.

### 3.3 GUI

The following import is finally added to `widget/main.js`. Prior to this moment, except for the simple CLI tool in use thus far, the app/component will have remained headless.

```js
import dom from './libs/atomic_/dom.js'
```

Is is only at this point one begins to attach the GUI and react to DOM events [as described here](./README.md#stand-up-the-user-interface).

## 4. Agent Playbook

This section explains the workflow, the collaboration rhythm: when to act autonomously, when to pause, and how the agent and director synchronize understanding.

### 4.1 Sandbox

A name (e.g., `widget`) is assigned to a folder which becomes your sandbox. Within it, create at minimum:

* **Core:** pure domain logic (`core.js`).
* **Shell:** wiring, events, persistence, DOM (`main.js`).
* **CLI:** testing/verification harness (`cli.js`).
* **PRD:** product rationale and scratchpad (`prd.md`).
* **TODO:** incremental plan toward *Definition of Done* (`todo.md`).

You may add files as needed (≤ 10 total). You may update anything in the sandbox. Do **not** update outside the sandbox without explicit permission.

### 4.2 Optionality

When the director requests **optionality**, it will be in the **3–5 option** range. In such cases:

* Invent additional **code names**, one per option, each with its own sandbox folder.
* Implement each option as a **parallel experiment** that targets the same problem.
* **Vary** the experiments in interesting ways while preserving the director’s vision.
* **Drive all options** toward the **same Definition of Done** to enable apples-to-apples evaluation.
* Treat optionality like a **hackathon you want to win**. Create a `pitch.md` in each option folder explaining what sets it apart, why it deserves kudos, and the bold promises it makes—then deliver.

### 4.3 Method: move in baby steps

* Plan first. Break work into small increments.
* After each update, **confirm things work as expected** in the CLI tool.
* If something breaks, fix it or try another path if that one becomes a headache.

### 4.4 Use PRD and TODO for Effective Self-Governance

There are a lot of moving parts—principles, constraints, patterns, expectations. It’s easy to lose the thread. That’s why planning matters as much as execution. The **PRD** and **TODO** keep the agent oriented: one preserves purpose, the other converts it into motion.

#### PRD (`prd.md`)

The PRD gathers the reasoning and materials that give shape to the director’s vision. It’s where the agent thinks out loud—links, notes, sketches, decisions. It captures *why* things are being done, not just *what*. Done right, it’s the agent’s field notebook: everything needed for the next play within reach.

The director may provide this up front and/or evolve it through exchange. Either way, the agent maintains it so it always reflects current intent and boundaries.

#### TODO (`todo.md`)

The TODO is the gameplan. It translates the PRD’s big picture into a visible sequence of **drives**, each labeled with a **letter** (A–Z). Every drive represents a short, chronological series of plays working toward a measurable first down or milestone.

Use **headings** to mark drives clearly so progress can be scanned at a glance. Within each drive, list tasks in their natural execution order. Each task is identified by a **letter–number pair** (e.g., `A1`, `A2`, `B1`) corresponding to its drive and position. Together, these form a timeline rather than a checklist—**no boxes, no marks**, just a clear order of play.

Each drive is a self-contained subplan: a concise, actionable path to a meaningful outcome. The TODO should read like a field plan—compact, direct, and free of clutter. Each play states what’s to be done, how completion is recognized, and where it fits in the larger timeline. Think football—short gains, not hero throws.

Checkpoints and **sideline conferences** (e.g., *Small Bets*, *Vertical First*) mark natural pauses for adjustment before the next drive begins.

##### Frontmatter Status Block

Every `todo.md` begins with a **frontmatter block**—a small, machine-readable snapshot of current position and plan state. It sits at the top of the file, before any headings:

```yaml
---
agent:
  active_drive: A
  active_task: A3
  drives: [A, B, C]
  confirm_on_switch: true
  archive_completed: true
---
```

**Purpose**

This block serves as the agent’s **dashboard**:

* `active_drive` — the drive currently in play
* `active_task` — the current task within that drive
* `drives` — the ordered list of all drives, labeled A–Z
* `confirm_on_switch` — whether to pause before moving to the next drive
* `archive_completed` — whether finished drives should be moved under `# Archive`

It gives both agent and director a fast pointer to where work last left off. On each loop, the agent reads this block first, works only the matching drive and task, and updates the block when advancing.

Frontmatter is purely declarative—no automation, no side effects. It’s a small map that directs agent attention.

##### Final Frontmatter Status

When all drives and tasks are complete, the TODO file’s frontmatter becomes a closing record rather than an active dashboard. Mark completion explicitly so both agent and director know the plan has concluded.

```yaml
---
agent:
  active_drive: null
  active_task: null
  drives: []
  confirm_on_switch: false
  archive_completed: true
---
```

At this point:

* `active_drive` and `active_task` are set to `null` to indicate no ongoing work.
* `drives` is empty—everything has been executed and archived.
* `confirm_on_switch` can safely be `false`, as there are no remaining transitions.
* `archive_completed: true` signals that all drives have been preserved under `# Archive` in the body of the TODO.

This frontmatter remains as a historical footer—a silent confirmation that the timeline reached its natural end.

#### After the Plan: Recon

Once the plan is structured, the agent conducts **recon**—a focused review of all materials the director provided, including the **PRD**, **AGENTS** doc, and any supporting sources. Recon is how the agent guards against overload and prepares each drive with clarity.

This is not a mechanical pass; it’s an **act of judgment**. The agent decides what truly matters for the work ahead—what guidance will help, what can wait, and what to ignore. Out of all inputs, the agent builds a *focused view* for each drive: a small, curated context package that travels with that section of the TODO.

For each drive, the agent:

* Reviews the full landscape of materials
* Selects the principles, examples, and ideas most relevant to that stretch of work
* Tacks on light **supports**—brief citations or reminders pointing back to source material
* Notes dependencies or constraints that emerge
* Keeps everything else parked in the PRD

The form of these supports is flexible—inline, callouts, tags—whatever keeps the plan clean and the agent’s head clear. The point is control: when running a play, the agent should see only what’s essential, not the noise of every possible input.

Recon keeps each chunk of the TODO both lean and informed—a bridge between abundant information and actionable focus.

Together, the **PRD**, **TODO**, and **Recon** form a disciplined loop of attention.

The **PRD** defines the landscape, the **TODO** sequences it into lettered drives, and **Recon** equips each drive with the minimal context needed to advance one verified yard at a time.

### 4.5 Steering: What the REPL's for

* Build and use a `widget/cli.js`.
* It’s the cornerstone of your work, used to verify incremental change.
* CLI must expose `--help`, map commands clearly, and be scriptable. Import Cliffy for this.
* If the data acquisition strategy is unclear, pause and ask.

### 4.6 Repo Policy

* If branch identity is unclear, assume it’s `main`.
* Only the **director** may commit on the main branch.
* The **agent** may only work on branches which **are not the main branch**.
  * Commits serve as safe fallbacks: first downs.
  * Use discretion—avoid excessive commit noise.
* Every commit assumes the working software and running the CLI confirms the goals to that point have been met.

### 4.7 Definition of Done

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
