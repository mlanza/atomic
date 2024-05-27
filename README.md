# Atomic
Write [ClojureScript](https://clojurescript.org) in JavaScript without a transpiler.

Highlights:

* well suited for web apps
* deploy the code you write — point free, composed, pipelines, no build required
* implements much Clojure's standard library
* [functional core](src/core), [imperative shell](src/shell) w/ FRP
* [nil-punning](https://ericnormand.me/article/nil-punning) handles null in sensible ways
* tacit style via [placeholder partial](/placeholder-partial.md)

Atomic is [protocol oriented](src/core/protocols) to its very foundation.  Objects are treated as [abstract types](https://en.wikipedia.org/wiki/Abstract_data_type) per their behaviors irrespective of their concrete types.  This flavor of polymorphism is what makes Clojure so good at transforming data.

JavaScript has no means of safely [extending natives and third-party types](https://en.wikipedia.org/wiki/Monkey_patch).  [Protocols](https://clojure.org/reference/protocols), which are the most apt solution to this problem, have [yet to be adopted](https://github.com/tc39/proposal-first-class-protocols) into the language.

Atomic is [functional first](functional-first.md).  Functions are preferred to methods.  This makes sense given how protocols treat things as abstractions.

Atomic has no [maps](https://clojuredocs.org/clojure.core/hash-map) or [vectors](https://clojuredocs.org/clojure.core/vector) but used objects and arrays as faux [records and tuples](https://tc39.es/proposal-record-tuple/) since before these new types were even proposed.  It had previously integrated them via [Immutable.js](https://immutable-js.com) but, in practice, using objects and arrays as persistents worked well enough it wasn't worth the cost of another library.  Its integration [was dropped](https://github.com/mlanza/atomic/commit/8e1787f6974df5bfbb53a371a261e09b5efee8ee).  This bit of history serves to demonstrate how protocols can seamlessly integrate disparate types into a consistent api.  Concrete types, even third-party ones, can be regarded as abstract things, by their apis.

## Premise
Atomic was born from an experiment answering:

> Why not do ClojureScript directly in JavaScript and eliminate the transpiler?

The ephiphany: since languages are just facilities plus syntax, if one can set aside syntax, the right facilities can eliminate build steps.

JavaScript does functional programming pretty dang well and continues to add proper facilities.

* [first-class protocols](https://github.com/tc39/proposal-first-class-protocols)
* [records & tuples](https://github.com/tc39/proposal-record-tuple) (including sets and typed records & tuples!)
* [partial application](https://github.com/tc39/proposal-partial-application)
* [pipeline operator](https://github.com/tc39/proposal-pipeline-operator)
* [temporal](https://github.com/tc39/proposal-temporal)

Of all of the above, first-class protocols is the most critical one which, for some odd reason, has failed to gain community support.  Developers it seems are failing to experience and realize the tremendous value add only protocols provide.  They're the centerpiece of Clojure and, by extension, Atomic.  Clojure would not be Clojure without them!

Atomic provides the necessary facilities and showcases how even plain JavaScript can adopt the Clojure mindset!

## Purity Through Protocol

Since JavaScript lacks certain value types (i.e. [records and tuples](https://tc39.es/proposal-record-tuple/) and [temporals](https://github.com/tc39/proposal-temporal)), purity has historically been gained through discipline.  Atomic makes this still easier.

It permits reference types to be optionally treated as immutable value types.  It provides mutable and/or immutable protocols for interacting with natives so arrays can double as [tuples](https://tc39.es/proposal-record-tuple/) and objects as [records](https://tc39.es/proposal-record-tuple/).  Yet, again, protocols reduce mountains to mole hills.

## Getting Started

Build it from the command line:

```sh
npm install
npm run bundle
```

Copy the contents of `dist` to `libs` in a project then import from either `libs\atomic` or `libs\atomic_` depending on whether [placeholder partial](./placeholder-partial.md) is wanted.

Implementing a small app is a good first step for someone unfamiliar with the herein described approach.

## Modules

The `core` module is the basis for the functional core, `shell` for the imperative shell and `dom` for the UI.  Elm sold FRP, so by the time CSP appeared in `core.async` that ship had already sailed.  `shell` is based on reactives.

Its state container, the bucket which houses an app's big bang [world state](https://docs.racket-lang.org/teachpack/2htdpuniverse.html), is the `cell`.  It's mostly equivalent to a Clojure atom.  The main exception is it invokes the callback upon subscription the way an Rx [subject](https://rxjs.dev/guide/subject) does.  This is well suited to the developing of user interfaces.  And like [xstream](https://staltz.com/why-we-built-xstream.html) it doesn't rely on many operators, providing a simple but sufficient platform for FRP.

The typical UI imports the trifecta—`core`, `shell`, and `dom`—as `_`, `$` and `dom` respectively.  The `_` doubles as a partial application placeholder when using [placeholder partial](./placeholder-partial.md).  To facilitate interactive development these assignments can be readily imported by entering [`cmd()`](./dist/cmd.js) from a browser console where Atomic is loaded.

Since many of its core functions are taken directly from Clojure one can often use its documentation.  Here are a handful of its bread and butter functions:
* [`swap`](https://clojuredocs.org/clojure.core/swap!)
* [`get`](https://clojuredocs.org/clojure.core/get)
* [`update`](https://clojuredocs.org/clojure.core/update)
* [`updateIn`](https://clojuredocs.org/clojure.core/update-in)
* [`assoc`](https://clojuredocs.org/clojure.core/assoc)
* [`assocIn`](https://clojuredocs.org/clojure.core/assoc-in)

The beauty of these functions (kudos to Hickey!) is how easy they make it to surgically replace the state held in a state container without mutating it.

In the absence of threading macros and pipeline syntax several functions exist (see these demonstrated in the example programs) to facilitate pipelines and composition:
* `chain` (a normal pipeline)
* `maybe` (a null-handling pipeline)
* `comp`
* `pipe`

## Vendoring As A Safety Net

The author's philosophy is to sparingly add libraries, to keep projects lean.  [Dependencies breed](https://tonsky.me/blog/disenchantment/).  The ever-changing landscape of modern libraries (Vue, React, Angular, Svelte, etc.) brim with excellent ideas, yet the author continually ships working software without them.

Rather, and only when a deficit is felt, are the ideas, not the dependencies, grafted in.  This prevents fast-moving vendors from dictating schedules and alleviates the pressure of falling out of step with the latest release.

Because Atomic has been used primarily by a small, internal audience, the change process hasn't been formalized to protect a wider audience.  The author [vendors it](https://stackoverflow.com/questions/26217488/what-is-vendoring) into his projects to eliminate the pressure of keeping up with releases.  This permits safe use.

## Guidance for Writing Apps

Start with a functional core whose data structure representing the world state, though it is made up of objects and arrays, is held as immutable and not mutated.  That state will have been birthed from an  `init` function and wrapped in an atom.

Then write [swappable](https://clojuredocs.org/clojure.core/swap!) functions which drive state transitions based on anticipated user actions.  These will be pure.  The impure ones will be implemented later in the imperative shell or UI layer.

The essence of "easy to reason about" falls out of purity.  When the world state can be readily examined in the browser console after each and every transition identifying broken functions becomes a much less onerous task.

Next, begin the imperative shell.  This is everything else including the UI.  Often this happens once the core is complete.  Not all apps have data, however, which is simple enough to visually digest from the browser console.  In such situations one may be unable to get by without the visuals a UI provides and the shell may need to be created earlier and develop in parallel.

This entire effort begins with [forethought](https://www.youtube.com/watch?v=f84n5oFoZBc), preliminary work, and perhaps a bit of notetaking.  Think first about the shape of the data, then the functions (and, potentially, commands/events) which transform it, and lastly how the UI looks and how it utilizes this.  For more complex apps, roughing out the UI in HTML/CSS will help guide the work.  Not everything needs working out, but having a sense of how things fit together and how the UI works before writing the first line of code will help avoid snafus.

If an app involves animation, as a turn-based board game would, ponder this aspect too.  How one renders elements which are animated is often different from how one renders those which aren't.  Fortunately, CSS is now capable of driving most animations without the help of additional libraries.

## Progressive Enhancement

One begins routinely with a functional core, then headless shell and gradually develops toward the level of sophistication one wants, grafting on one layer at a time.

The `journal` type can be added to provide undo/redo and permit stepping forward and backward along a timeline.

Add a layer to process change via commands and events, in its simplest form, both represented as plain old JavaScript objects.  Commands (yin) belong in the impure world (imperative shell), and events (yang) the pure world (functional core).

Events are folded into the world state as a reduction.  And both events and commands can be sent over the wire or captured in logs.  When captured, they provide a complete and auditable history, one which can be readily examined from the browser console.

## A Tale of Two Worlds

Rather than one, the developer writes two programs, edits two files, straddles two worlds.  To get why this is done, first understand what the pure world actually is: simulation.

The functional core is where the domain logic goes and the imperative shell where the glue code or program architecture (routers, queues, buffers, buses, etc.) goes.  The core simulates what your program is actually about (managing to-dos) and the shell provides the machinery (all the types and operations which, from a user's perspective, have nothing to do with managing to-dos) necessary to transform these simulations into realities.

The shell transforms effect into simulation and vice versa.  Commands flow in.  Events flow out.  The core provides the direction, the shell the orchestration.

The benefit of starting with simulations is they're free of messy unpredictability, are easy to write tests against, and can be fully controlled.  Putting it another way, they're like flipbooks where time can be stopped and any page and its subsequent examined.  This model is easier to reason about, develop, troubleshoot, and fix than the imperative model alone.

## Atomic in Action

Atomic has been used for developing and deploying to typical web hosts, Deno, Supabase, SharePoint, Cloudflare, and Power Apps and various production apps for years.

These examples model how one might write a program in Atomic:

* [Todo](https://github.com/mlanza/todo)
* [Treasure Quest](https://github.com/mlanza/treasure-quest)
* [Pickomino](https://github.com/mlanza/pickomino)

DOM events are oft handled using an `$.on` which is similar to [jQuery's](https://api.jquery.com/on).

While creating a [virtual dom](https://reactjs.org/docs/faq-internals.html) had been considered for inclusion in the library, state diffing is not always needed.  When needed, however, `$.hist` provides two frames (the present and the immediate past) of world state history for reconciling the UI.
