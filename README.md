# Atomic
Write [ClojureScript](https://clojurescript.org) in JavaScript without a transpiler.

Highlights:

* well suited for web apps
* deploy the modules you write, not bundles, no build required
* [point-free pipelines and partial application](docs/placeholder-partial.md)
* use a familiar Clojure api and [way of thinking](docs/adopting-the-clojure-mindset.md)
* functional core, imperative shell w/ FRP
* [nil-punning](https://ericnormand.me/article/nil-punning) handles null in sensible ways

Atomic is [protocol oriented](src/core/protocols) to its very foundation.  Since [protocols](https://clojure.org/reference/protocols) are the centerpiece of Clojure, they are, by extension, Atomic too.  They provide the only safe means of [dynamically extending natives and third-party types](./docs/protocols-for-dynamic-extension.md).  They make [cross-realm operability](./docs/cross-realm-operability.md) possible.  Plus, it's better to think [abstractly about apis and behaviors](https://en.wikipedia.org/wiki/Abstract_data_type), giving them greater attention than types.

Atomic is [functional first](docs/functional-first.md).  This makes sense given that functions, not methods, are first class.  Why choose a paradigm which limits [the places you'll go](https://en.wikipedia.org/wiki/Oh%2C_the_Places_You'll_Go!).

Atomic has no [maps](https://clojuredocs.org/clojure.core/hash-map) or [vectors](https://clojuredocs.org/clojure.core/vector) though it once integrated them via [Immutable.js](https://immutable-js.com).  It turns out it didn't need them.  Treating objects and arrays as value types worked so well the integration [was dropped](https://github.com/mlanza/atomic/commit/8e1787f6974df5bfbb53a371a261e09b5efee8ee).  It wasn't worth the cost of loading the library.  This bit of history is noted to chalk up another one for protocols.  They so seamlessly blend third-party types into a desired api, they all but disappear.

Since JavaScript lacks a complete set of value types (e.g. [records, tuples](https://tc39.es/proposal-record-tuple/) and [temporals](https://github.com/tc39/proposal-temporal)), purity becomes a matter of discipline, or protocol.  Atomic permits even reference types, like objects and arrays, to be optionally, as a matter of protocol selection, [treated as value types](./docs/command-query-protocols.md).

Yet, again, protocols reduce mountains to mole hills. In short, [their first-class citizenship status](https://github.com/tc39/proposal-first-class-protocols) is long overdue.

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

Atomic showcases [the Clojure way](docs/adopting-the-clojure-mindset.md) in build-free JavaScript.

## Getting Started
Build it from the command line:

```sh
npm install
npm run bundle
```

Set up your project:

```sh
$ mkdir sokoban # for instance
$ cd sokoban
$ mkdir libs
$ touch index.html
$ touch sokoban.js
$ touch main.js
```

Copy the Atomic `dist` folder's contents to the `libs` folder.  [Vendoring it](https://stackoverflow.com/questions/26217488/what-is-vendoring) permits safe use and alleviates the pressure of keeping up with change.

Copy the following contents to the respective 3 files you just created:

```javascript
// ./sokoban.js - named for your domain, pure functions go here
import _ from "./atomic_/core.js";
```

```javascript
// ./main.js - everything else goes here
import _ from "./atomic_/core.js";
import $ from "./atomic_/shell.js";
import {reg} from "./cmd.js";
import * as s from "./sokoban.js";
```

```html
<!-- ./index.html  -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Sokoban</title>
    <link rel="stylesheet" href="style.css">
    <script type="module" src="./main.js"></script>
  </head>
  <body>
  </body>
</html>
```

This set of files hints at an architecture.  Your [FCIS program](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell) begins with a core (`sokoban`) and shell (`main`) module of its own.  Pragmatically, `main` may eventually contain the UI logic (and import `dom`), but it could also be implemented as a headless component to permit a separate `ui` module.  Right now, the UI concern is a long way off.

### Stand up the simulation
Your first task, in `main`, is to create a state container for your [world state](https://docs.racket-lang.org/teachpack/2htdpuniverse.html) and define its `init` state in your pure module.  It'll likely be some amalgam of objects and arrays but, depending on the app, it could be anything.

```javascript
// ./sokoban.js
function init(){
  /* depends on what your app is about */
}
```
```javascript
// ./main.js
const $state = $.atom(s.init());

reg({$state}); //register container to aid in interactive development
```
Then begin fleshing out your core with domain logic, nothing but pure functions and using them to tell your app's story.  Everything else including the program machinery (atoms, signals, routers, queues, buffers, buses, etc.) and glue code goes into `app`.

Keep `main` trivially simple, at first.  For a time it'll provide little more than the harness necessary to run the simulation.  Then, to begin interacting with it, you'll want to serve it:

```sh
$ static . # server of choice
```

Bring it up in the browser:

[http://127.0.0.1:8080/?monitor=*](http://127.0.0.1:8080/?monitor=*)

Remember to add the `monitor` query param to aid monitoring from the console.  Expose your browser's developer tools.  From its console enter:

```sh
cmd()
```

This loads the globals needed to facilitate [interactive development](./docs/interactive-development.md).  You'll be operating from your text editor and browser console for the unforeseeable future.

This'll mean writing the following line over and over:

```javascript
$.swap($state, /* TODO */);
```

Plug `$.swap` with a pure, [swappable](https://clojuredocs.org/clojure.core/swap!) function.  The functions you supply drive transitions based on anticipated user actions.  They can be authored/issued via the browser console and/or the code.

For a while, you'll be writing and issuing pure functions to tell some version of a story your app tells.  This is what it means to [start with simulation](docs/start-with-simulation.md).

This makes functional programming a pleasure.  The essence of "easy to reason about" falls out of the focus on purity.  It's hard to beat a model which reduces a program to a flip book, halts time, and permits any page and its subsequent to be readily examined or compared.  There's immeasurable good in learning to tease the pure out of the impure, of embracing the boundary between simulation and messy reality.

The domain module (the core) simulates what your program is about, the main module (the shell) actuates its effects.  The domain module, playing [Sokoban](https://github.com/mlanza/sokoban) or managing [To-dos](https://doesideas.com/programming/todo/), for example, is a library of pure functions.  The main module, having little to do the domain, provides the plumbing necessary to make things happen.  It transforms effect into simulation and vice versa.  Commands flow in.  Events flow out.  The core directs, the shell orchestrates.

The first objective is to flesh out the core by writing the functions needed to express what the story is about, what the program does.  A state container, all by itself, provides sufficient machinery to get you there.

It's only when the core is somewhat complete, the shell is finally connected to a UI.

### Stand up the user interface

The guts of most programs can be fully realized from what is effectively the browser command line.  The UI, although it comes much later, will eventually be needed.  And hooking up both sides of the one-way data flow is how one graduates from simulation to reality.

Subscribe to the simulation and project to the DOM:
```javascript
$.sub($state, function(state){
  /* render the UI and replace or patch the DOM */
});

```

Subscribe to the DOM and feed the simulation:
```javascript
const el = dom.sel1("#sokoban"); //your root element

//prefer event delegation to subscribing to elements directly
$.on(el, "click", "button.up", (e) => $.swap($state, s.up));

$.on(document, "keydown", function(e){
  if (e.key === "ArrowUp") {
    e.preventDefault();
    $.swap($state, s.up);
  }
});

```

Define intermediary signals if you like:
```javascript
function which(key){
  return _.filter(_.pipe(_.get(_, "key"), _.eq(_, key)));
}

const $keys = $.chan(document, "keydown");

//create desired signals...
const $up = $.pipe($keys, which("ArrowUp"));
const $down = $.pipe($keys, which("ArrowDown"));
const $left = $.pipe($keys, which("ArrowLeft"));
const $right = $.pipe($keys, which("ArrowRight"));

//...and subscribe to them.
$.sub($up, (e) => $.swap($state, s.up));
$.sub($down, (e) => $.swap($state, s.down));
$.sub($left, (e) => $.swap($state, s.left));
$.sub($right, (e) => $.swap($state, s.right));

//alternately, more concisely, do both at once:
$.sub($keys, which("ArrowUp"), (e) => $.swap($state, s.up));
$.sub($keys, which("ArrowDown"), (e) => $.swap($state, s.down));
$.sub($keys, which("ArrowLeft"), (e) => $.swap($state, s.left));
$.sub($keys, which("ArrowRight"), (e) => $.swap($state, s.right));
```

While creating a [virtual dom](https://reactjs.org/docs/faq-internals.html) had been considered for inclusion in the library, state diffing is not always needed.  When needed, compare snapshots instead.

```javascript
const $hist = $.hist($state);

$.sub($hist, function([curr, prior]){
  /* diff your snapshots */
});

```
Having access to two frames makes identifying what changed fairly simple.  Based on how the data is structured, one can readily check that entire sections of the app are unchanged since data representations are persistent.

That basically means, as a rule, the parts of the data model which haven't changed can be compared cheaply by identity in the current and prior frames.  That's because the original objects, if unchanged, will have been reused in the newer snapshot.

The `prior` snapshot will be `null` in the very first rendering.  That's useful for knowing when to render the full UI or, most of the time, patch it.

Alternately, one can abstract this further.

```javascript
// pull some list of favorites into its own signal
const $favs = $.map(_.get(_, "favorites"), $state);
```
As desired, split your app into separate signals.  Since these signals automatically perform the identity comparison, they won't fire unless there's been a change.

There's no templating language.  Everything is programmatic composition.  In this example, `ul` and `li` and `favorites` are all partially-applied functions:

```javascript
const ul = dom.tag("ul"),
      li = dom.tag("li");

const favorites =
  ul({id: "favorites", class: "fancy"},
    _.map(li, _)); //composed

const target = dom.sel("#favs", el);

$.sub($favs, function(favs){
  dom.html(target, favorites(favs));
});

//a tacit, transduced alternative:
$.sub($favs, _.map(favorites), dom.html(target, _));
```

But as composing functions can be hard to grasp and harder to debug, when you're not used to it, you can always fall back on functions.

```javascript
function favorites(favs){
  debugger
  return ul(_.map(li, favs));
}

```
```html
<div id="favs">
  <!-- `dom.html` overwrites everything or patching not always required -->
  <ul>
    <li>Columbo</li>
    <li>Prison Break</li>
    <li>Suits</li>
    <li>The Good Doctor</li>
    <li>The Gilded Age</li>
  </ul>
</div>
```

Compose views which read structured data:

```javascript
const suit = {
  fname: "Harvey",
  lname: "Specter",
  salary: 725000,
  dob: new Date(1972, 0, 22),
  address: ["333 Bay Street", "New York, NY  10001"]
}

const {address, div} = dom.tags(["address", "div"]);

const mailingLabel =
  address(
    div(
      _.comp(_.upperCase, _.get(_, "fname")), " ",
      _.comp(_.upperCase, _.get(_, "lname"))),
    _.map(div, _.get(_, "address")));

dom.append(envelop,
  stamp(),
  returnLabel(),
  mailingLabel(suit));
```
```html
<address>
  <div>HARVEY SPECTER</div>
  <div>333 Bay Street</div>
  <div>New York, NY  10001</div>
</address>
```

### Progressively enhance

While imperative shell of an app has humble beginnings, one can gradually grafts layers of sophistication onto its reactive core.  Keep 'em simple or evolve 'em.

For example, add [journal](./src/core/types/journal) to facilitate undo/redo and stepping forward and backward along a timeline.

Initially, commands are just pure functions and events just native DOM events, but these can be reified into JSON-serializable objects to faciliate being sent over the wire, or recorded in auditable histories.  The core can then be wrapped with a command bus api and facilitate a host of middleware features.

It's as much as you want, or as little.

### Be ever minding your big picture

The entire effort is preceded and interleaved with [thought](https://www.youtube.com/watch?v=f84n5oFoZBc) and/or note-taking.  This depends largely on starting with a good data model, anticipating how the UI (and potentially its animations) will look and behave, and having some idea of the evolutionary steps planned for the app.

It may be useful to rough out the UI early on.  Thinking through things — ideally, during lunchtime walks! — and clarifying the big picture for how they work and fit together will minimize potential downstream snafus.

## Atomic in Action

See these sample programs to learn more:

* [Todo](https://github.com/mlanza/todo)
* [Sokoban](https://github.com/mlanza/sokoban)
* [Treasure Quest](https://github.com/mlanza/treasure-quest)
* [Pickomino](https://github.com/mlanza/pickomino)
