# Atomic
Write [ClojureScript](https://clojurescript.org) in JavaScript without a transpiler.

Highlights:

* well suited for web apps
* use [functional core, imperative shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell)
* deploy the code you write — point free, composed, pipelines, no build required
* [nil-punning](https://ericnormand.me/article/nil-punning) handles null in sensible ways,
* [core](src/core) (much of the Clojure standard lib)
* [protocols](src/core/protocols) at the foundation
* [reactives](src/reactives) (FRP)

Atomic is protocol oriented.  Objects are seen as as [abstract types](https://en.wikipedia.org/wiki/Abstract_data_type) exhibiting certain behaviors irrespective of their concrete types.  This kind of polymorphism is largely what makes Clojure so good at transforming data.

Atomic is [functional first](functional-first.md).  Functions are preferred to methods.  This makes sense given how protocols view types as abstractions.

Atomic has no maps or vectors but uses objects and arrays in the same capacity.  It had previously integrated these types via  [Immutable.js](https://immutable-js.com) but, in practice, objects and arrays filled the gap well enough it wasn't worth the cost of loading a library to occassionally use maps and vectors.  Its integration [was dropped](https://github.com/mlanza/atomic/commit/8e1787f6974df5bfbb53a371a261e09b5efee8ee).

Still, Atomic makes integrating third-party types into its consistent, familiar api seamless via protocols as was demonstrated.

Don't care for [point programming](tests/autopartial-less.js)?  [Autopartial](tests/autopartial.js) delivers [point-free programming](https://en.wikipedia.org/wiki/Tacit_programming) without a build step up until [pipeline operators](https://github.com/tc39/proposal-pipeline-operator) and [partial application](https://github.com/tc39/proposal-partial-application) reach stage maturity.

## Premise
JavaScript does functional programming pretty dang well.  It may not do it as well languages with native FP facilities but libraries fill the gap just fine.

Initially, Atomic was born from an experiment answering:

> Why not do ClojureScript directly in JavaScript and eliminate the transpiler?

Here's the ephiphany: since languages are just facilities plus syntax, if one can set aside syntax, the right facilities make transpilation superfluous.

## Purity Through Discipline

Historically, since JavaScript has lacked certain value types purity is gained through discipline.  A function receiving mutable arguments must, as a rule, not mutate them.  *So in Atomic objects and arrays and dates are held as immutables and not mutated*.

JavaScript is filling this gap, however, with [records and tuples](https://tc39.es/proposal-record-tuple/) and [temporals](https://github.com/tc39/proposal-temporal).  When this happens Atomic will restore objects, arrays and dates to their reference type status.

## Getting Started

Build it from the command line:

```sh
npm install
npm run bundle
```

Copy the contents of `dist` to `lib` in a project then import from either `lib\atomic` or `lib\atomic_` depending on whether [autopartial](./tests/autopartial.js) is wanted.

Implementing a small app is a good first step for someone unfamiliar with the herein described approach.

## Modules

The `core` module provides what's needed in most general situations.  If a UI is needed, reach for the `reactives` and `dom` modules, where the former provides FRP and the latter tools for use in the, ahem, DOM.

Elm sold FRP.  So by the time CSP appeared in `core.async` that ship had already sailed.

The atom equivalent and the type which houses an app's big bang [world state](https://docs.racket-lang.org/teachpack/2htdpuniverse.html) is `cell`.  From it observables/signals are derived.  It's only significant difference from an atom is how, like a [subject](https://rxjs.dev/guide/subject), in addition to on change, it invokes its callback on subscribe as well.  This seemed to make sense in most UIs it was used to build.

Like [xstream](https://staltz.com/why-we-built-xstream.html) it doesn't rely on many operators.  And implementation experience has seen how hot observables are usually easier to handle correctly than cold ones.  These notions have, thus, been baked into the defaults.

The holy trinity of modules—`core`, `reactives`, and `dom`—are imported as `_`, `$` and `dom`.  The `_` also doubles as a partial application placeholder when using autopartial.  To facilitate interactive development these assignments can be readily imported by entering [`cmd()`](./dist/cmd.js) from a browser console where Atomic is loaded.

Since many of its core functions are taken directly from Clojure one can often use its documentation.  Here are a handful of its bread and butter functions:
* [`swap`](https://clojuredocs.org/clojure.core/swap!)
* [`get`](https://clojuredocs.org/clojure.core/get)
* [`update`](https://clojuredocs.org/clojure.core/update)
* [`updateIn`](https://clojuredocs.org/clojure.core/update-in)
* [`assoc`](https://clojuredocs.org/clojure.core/assoc)
* [`assocIn`](https://clojuredocs.org/clojure.core/assoc-in)

The beauty of these functions (kudos to Hickey!) is how they allow one to surgically update a state object held in a cell (atom) without actually mutating anything.

In the absence of threading macros, several key functions exist (see these demonstrated in the example programs) to facilitate pipelines and composition:
* `chain` (a normal pipeline)
* `maybe` (a null-handling pipeline)
* `comp`
* `pipe`

## Changes

Changes are not presently handled in a manner guaranteeing safety to an open source audience.  This is because, historically, being a private library, there has been none.  Proper measures can be installed when and if that changes.  For now, safety can be had by forking and maintaining your own version.

Pull requests which fix defects will be evaluated for acceptance.

## Guidance for Writing Apps

Start with a functional core whose data structure representing the world state, though it is made up of objects and arrays, is held as immutable and not mutated.  That state will have been birthed from an  `init` function and wrapped in an atom.

Then write [swappable](https://clojuredocs.org/clojure.core/swap!) functions which drive state transitions based on anticipated user actions.  These will be pure.  The impure ones will be implemented later in the imperative shell or UI layer.

The essence of "easy to reason about" falls out of purity.  When the world state can be readily examined in the browser console after each and every transition identifying broken functions becomes a much less onerous task.

Next, begin the imperative shell.  This is everything else including the UI.  Often this happens once the core is complete.  Not all apps have data, however, which is simple enough to visually digest from the browser console.  In such situations one may be unable to get by without the visuals a UI provides and the shell may need to be created earlier and develop in parallel.

This entire effort begins with [forethought](https://www.youtube.com/watch?v=f84n5oFoZBc), preliminary work, and perhaps a bit of notetaking.  Think first about the shape of the data, then the functions (and, potentially, commands/events) which transform it, and lastly how the UI looks and how it utilizes this.  For more complex apps, roughing out the UI in HTML/CSS will help guide the work.  Not everything needs working out, but having a sense of how things fit together and how the UI works before writing the first line of code will help avoid snafus.

If an app involves animation, as a turn-based board game would, ponder this aspect too.  How one renders elements which are animated is often different from how one renders those which aren't.  Fortunately, CSS is now capable of driving most animations without the help of additional libraries.

Sparingly add libraries.  Keep projects lean.  [Dependencies breed](https://tonsky.me/blog/disenchantment/).  The ever-changing landscape of modern libraries (Vue, React, Angular, Svelte, etc.) brims with excellent ideas, yet the author has continually met customer requirements without necessitating any of them.

Rather, and only when the deficit is truly felt, graft in the idea, not the dependency.  It permits the local team and not the vendor team to dictate the schedule.  It also alleviates the pressure of falling out of step with the latest release.

## Progressive Enhancement

One begins routinely with a simple core and shell and potentially layers in other useful concepts.

The `journal` type can be added to provide undo/redo and permit stepping forward and backward along a timeline.

Add a layer to process change via commands and events, in its simplest form, both represented as plain old JavaScript objects.  Commands (yin) belong in the impure world (imperative shell), and events (yang) the pure world (functional core).

Events are folded into the world state via a master reduction.  And both events and commands can be readily sent over the wire or captured in logs.  When captured, they provide a complete and auditable history, one which can be readily examined from the browser console.

## A Tale of Two Worlds

Rather than one, the developer writes two programs, edits two files, straddles two worlds.  To get why this is done, first understand what the pure world actually is: simulation.

The functional core is where the domain logic goes and the imperative shell where the glue code or program architecture (routers, queues, buffers, buses, etc.) goes.  The core simulates what your program is actually about (managing to-dos) and the shell provides the machinery (all the types and operations which, from a user's perspective, have nothing to do with managing to-dos) necessary to transform these simulations into realities.

The shell transforms effect into simulation and vice versa.  Commands flow in.  Events flow out.  The core provides the direction, the shell the orchestration.

The benefit of starting with simulations is they're free of messy unpredictability, are easy to write tests against, and can be fully controlled.  Putting it another way, they're like flipbooks where time can be stopped and any page and its subsequent examined.  This model is easier to reason about, develop, troubleshoot, and fix than the imperative model alone.

## Atomic in Action

Atomic has been used for developing and deploying (to typical web hosts, Deno, SharePoint, Cloudflare, and Power Apps) a variety of production apps reliably for years and has recently been used to create digital card and board games.

These examples epitomize the above guidance:

* [Todo](https://github.com/mlanza/todo)
* [Treasure Quest](https://github.com/mlanza/treasure-quest)
* [Pickomino](https://github.com/mlanza/pickomino)

DOM events are oft handled using an `$.on` which is similar to [jQuery's](https://api.jquery.com/on).

While creating and diffing a [virtual dom](https://reactjs.org/docs/faq-internals.html) had been considered for inclusion in the library, experience has seen these approaches fare well without it.  In some apps `$.hist` provides two frames (the present and the immediate past) of world state history which can be diffed if convenient.  In practice, for simple UIs, this extra effort is superfluous.

## Contingent Improvements

Applying the Clojure mindset directly in JavaScript is possible with the right facilities.  Atomic provides them, but would do still better with the following primitives.  As these ECMAScript proposals reach stage maturity, portions of this library will be rewritten.

* [records & tuples](https://github.com/tc39/proposal-record-tuple) (including sets and typed records & tuples!)
* [first-class protocols](https://github.com/tc39/proposal-first-class-protocols)
* [partial application](https://github.com/tc39/proposal-partial-application)
* [pipeline operator](https://github.com/tc39/proposal-pipeline-operator)
* [temporal](https://github.com/tc39/proposal-temporal)

The protocol implementations will remain indefinitely as they are the core of the library.
