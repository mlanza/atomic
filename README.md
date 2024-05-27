# Atomic
Write [ClojureScript](https://clojurescript.org) in JavaScript without a transpiler.

Highlights:

* well suited for web apps
* deploy the code you write — [point-free pipelines and partial application](/placeholder-partial.md), no build required
* implements much of Clojure's standard library
* [functional core](src/core), [imperative shell](src/shell) w/ FRP
* [nil-punning](https://ericnormand.me/article/nil-punning) handles null in sensible ways


Atomic is [protocol oriented](src/core/protocols) to its very foundation.  Objects are treated as [abstract types](https://en.wikipedia.org/wiki/Abstract_data_type) per their behaviors, without regard to their concrete types.

[Protocols](https://clojure.org/reference/protocols) are the centerpiece of Clojure and, by extension, Atomic.  They offer a flavor of polymorphism that sets Clojure apart as a data-transforming juggernaut.  Clojure would not be Clojure without them!

Protocols also provide the only safe means of dynamically [extending natives and third-party types](https://en.wikipedia.org/wiki/Monkey_patch).  In short, [its first-class citizenship status](https://github.com/tc39/proposal-first-class-protocols) is long overdue.  Atomic fills the gaping hole.

Atomic is [functional first](functional-first.md).  Functions are preferred to methods.  This makes sense when abstractions are prefered to concretions.

Atomic has no [maps](https://clojuredocs.org/clojure.core/hash-map) or [vectors](https://clojuredocs.org/clojure.core/vector) though it once integrated them in via [Immutable.js](https://immutable-js.com).  It turns out it didn't need them.  Treating objects and arrays as value types worked so well the integration [was dropped](https://github.com/mlanza/atomic/commit/8e1787f6974df5bfbb53a371a261e09b5efee8ee).  It wasn't worth the cost of loading the library.  This bit of history is noted to demonstrate how, through protocols, third-party types can be easily conformed to any standardized api.

## Premise
Atomic was born out of the question:

> Why not do in JavaScript what ClojureScript does, but without the transpiler?

The ephiphany: since languages are just facilities plus syntax, if one can set aside syntax, having the right facilities eliminates build steps.

JavaScript does functional programming pretty dang well and continues to add proper facilities.

* [first-class protocols](https://github.com/tc39/proposal-first-class-protocols)
* [records & tuples](https://github.com/tc39/proposal-record-tuple)
* [partial application](https://github.com/tc39/proposal-partial-application)
* [pipeline operator](https://github.com/tc39/proposal-pipeline-operator)
* [temporal](https://github.com/tc39/proposal-temporal)

Atomic provides facilities to showcase how any language—even JavaScript!—[can adopt the Clojure mindset](adopting-the-clojure-mindset.md).

## Purity Through Protocol

Since JavaScript lacks [records and tuples](https://tc39.es/proposal-record-tuple/) and [temporals](https://github.com/tc39/proposal-temporal), purity was maintained through the discipline of writing pure functions.  Atomic makes this still easier.

It permits any type, even reference types like objects and arrays, to be optionally treated as value types.  Yet, again, protocols reduce mountains to mole hills.

## Getting Started

Build it from the command line:

```sh
npm install
npm run bundle
```

Copy the contents of `dist` to `libs` in a project then import from either `libs\atomic` or `libs\atomic_` depending on whether [placeholder partial](./placeholder-partial.md) is wanted.

Implementing a small app is a good first step for someone unfamiliar with building one around a state container.

## Modules

A typical app imports the trifecta—`core`, `shell`, and `dom`—as `_`, `$` and `dom` respectively.  These provide what's necessary for building a functional core, an imperative shell, and a user interface, everything an app needs.  These modules hint at a 3-part architecture—a core, shell, and ui.  Pragmatically, the shell will often also contain the ui, so 2 parts (a `core` and a `shell` module) will usually be good enough.

To facilitate [interactive development](./interactive-development.md) these modules can be readily loaded into the console.  The `_` doubles as a [placeholder for partial application](./placeholder-partial.md).

The state container keeps an app's [world state](https://docs.racket-lang.org/teachpack/2htdpuniverse.html).  In Atomic this is a cell.  It's mostly equivalent to a Clojure atom.  The only significant difference is it invokes its callback upon subscription the way an Rx [subject](https://rxjs.dev/guide/subject) does.

Since Elm had already sold FRP by the time CSP appeared in `core.async`, Atomic is based on reactives and state containers.  The [world state is addressable](./addressable-data.md) and can employ the Clojure methodology for surgically updating state.

In the absence of threading macros and pipeline syntax several functions exist (see these demonstrated in the example programs) to facilitate pipelines and composition:
* `chain` (a normal pipeline)
* `maybe` (a null-handling pipeline)
* `comp`
* `pipe`

## Vendoring As A Safety Net

Because Atomic has been used primarily by a small, internal audience, the change process hasn't been formalized to protect a wider audience.  [Vendoring it](https://stackoverflow.com/questions/26217488/what-is-vendoring) into a project permits safe use and alleviates the pressure of keeping up with change.

## Guidance for Writing Apps

Start by housing a world state made up of plain objects and arrays in a state container.  It'll likely have been created via an  `init` function or loaded from a data store.

Then write pure, [swappable](https://clojuredocs.org/clojure.core/swap!) functions which drive transitions based on anticipated user actions.  These will be used later to actuate side effects in the imperative shell/UI layer(s).

The essence of "easy to reason about" falls out of purity.  When the world state can be readily examined in the browser console after each and every transition identifying broken functions becomes a less onerous task.

Next, begin the imperative shell.  This is everything else including the UI.  Often this happens once the core is complete.  Not all apps have data, however, which is simple enough to visually digest from the browser console.  In such situations one may be unable to get by without the visuals a UI provides and the shell may need to be created earlier and develop in parallel.

This entire effort begins with [forethought](https://www.youtube.com/watch?v=f84n5oFoZBc), preliminary work, and perhaps a bit of notetaking.  Think first about the shape of the data, then the functions (and, potentially, commands/events) which transform it, and lastly how the UI looks and how it utilizes this.  For more complex apps, roughing out the UI in HTML/CSS will help guide the work.  Not everything needs working out, but having a sense of how things fit together and how the UI works before writing the first line of code helps avoid snafus.

If an app involves animation, ponder this aspect too.  How one renders elements which are animated is often different from how one renders those which aren't.  Fortunately, modern CSS can now do what once required libraries.

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

Atomic has been deployed to web apps/hosts, Deno, Supabase, SharePoint, Cloudflare, and Power Apps.

These examples model how one might write a program in Atomic:

* [Todo](https://github.com/mlanza/todo)
* [Treasure Quest](https://github.com/mlanza/treasure-quest)
* [Pickomino](https://github.com/mlanza/pickomino)

DOM events are oft handled using an `$.on` which is similar to [jQuery's](https://api.jquery.com/on).

While creating a [virtual dom](https://reactjs.org/docs/faq-internals.html) had been considered for inclusion in the library, state diffing is not always needed.  When needed, however, `$.hist` provides two frames (the present and the immediate past) of world state history for reconciling the UI.
