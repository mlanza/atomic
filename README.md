# Atomic
Write [ClojureScript](https://clojurescript.org) in JavaScript without a transpiler.

Highlights:

* well suited for web apps
* deploy the modules you write, not bundles, no build required
* [point-free pipelines and partial application](docs/placeholder-partial.md)
* use a familiar Clojure api (transducers included!) and [way of thinking](docs/adopting-the-clojure-mindset.md)
* functional core, imperative shell w/ FRP
* [nil-punning](https://ericnormand.me/article/nil-punning) handles null in sensible ways

Atomic is [functions first](docs/functions-first.md) as methods only limit [the places you'll go](https://en.wikipedia.org/wiki/Oh%2C_the_Places_You'll_Go!).

Atomic is built around [protocols](src/core/protocols).  Since [they're the centerpiece](https://clojure.org/reference/protocols) of Clojure, they are, by extension, Atomic too.  They provide the only safe means of [dynamically extending natives and third-party types](./docs/protocols-for-dynamic-extension.md).  They make [cross-realm operability](./docs/cross-realm-operability.md) possible.  They also, for the good of the functional paradigm, shift focus to thinking [abstractly about apis and behaviors](./docs/abstraction-thinking.md) over types.

Since JavaScript currently lacks compound value types such as [records, tuples](https://tc39.es/proposal-record-tuple/) and [temporals](https://github.com/tc39/proposal-temporal), reference types can be used instead.  Purity is instead maintained as a matter of discipline.  In Atomic reference types like objects, arrays and dates can be optionally, as a matter of protocol selection, [treated as value types](docs/mutables-for-immutables.md).

Atomic has structures comparable to Clojure's [maps](https://clojuredocs.org/clojure.core/hash-map) and [vectors](https://clojuredocs.org/clojure.core/vector) as well as seamless [Immutable.js](https://immutable-js.com) integration.  Since objects and arrays are cheap and usually perform well enough, they're to be preferred.

Plus, if the need arises, one can always drop in a replacement type later with almost no refactoring.  Yet again, protocols reduce mountains to mole hills!  This is why their [first-class status in the language](https://github.com/tc39/proposal-first-class-protocols) is so sorely overdue!

## Premise
Atomic was born out of the question:

> Why not do in JavaScript what ClojureScript does, but without the transpiler?

The ephiphany: since languages are just facilities plus syntax, if one sets aside syntax, having the right facilities can eliminate the build step.

Any language can do functional programming pretty dang well given the right facilities.  JavaScript is no exception.  The proper measure is getting them adopted into the language.

* [first-class protocols](https://github.com/tc39/proposal-first-class-protocols)
* [records & tuples](https://github.com/tc39/proposal-record-tuple)
* [partial application](https://github.com/tc39/proposal-partial-application)
* [pipeline operator](https://github.com/tc39/proposal-pipeline-operator)
* [temporal](https://github.com/tc39/proposal-temporal)

Until then, Atomic bridges the facilities gap to showcase [the Clojure way](docs/adopting-the-clojure-mindset.md)!

## Getting Started
Build it from the command line:

```sh
npm install
npm run bundle
```
> 💡**Recommendation**: Build the classic [Sokoban](https://en.wikipedia.org/wiki/Sokoban) game.  It's not overly challenging and it's more fun than writing a counter or a to-do app.  Don't copy [mine](https://github.com/mlanza/sokoban).  Follow the path being demonstrated, but choose your own graphics and make your own way.

Set up your project:

```sh
$ mkdir sokoban # for instance
$ cd sokoban
$ mkdir libs
$ touch index.html
$ touch sokoban.js
$ touch main.js
$ touch main.css
```
Copy the Atomic `dist` folder's contents to the `libs` folder.  [Vendoring it](https://stackoverflow.com/questions/26217488/what-is-vendoring) permits safe use and alleviates the pressure of keeping up with change.

Copy the following contents respectively to the 3 files you created:

```javascript
// ./sokoban.js - named for your domain, pure functions go here
import _ from "./libs/atomic_/core.js";
```

```javascript
// ./main.js - everything else goes here
import _ from "./libs/atomic_/core.js";
import $ from "./libs/atomic_/shell.js";
import dom from "./libs/atomic_/dom.js";
import * as s from "./sokoban.js";
import {reg} from "./libs/cmd.js";
```

```html
<!-- ./index.html  -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Sokoban</title>
    <script type="module" src="./main.js"></script>
    <link rel="stylesheet" href="./main.css">
  </head>
  <body>
  </body>
</html>
```

These initial files hint at a [FCIS](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell) architecture.  It has a core (`sokoban`) and shell (`main`) module of its own.  Pragmatically, `main` may eventually contain the GUI logic and utilize the `dom` import, but right now that's a long way off.

### Stand up the simulation
Your first task in `main` is to create a state container for your [world state](https://docs.racket-lang.org/teachpack/2htdpuniverse.html) and define its `init` state in your pure module.  It'll likely be a compound data structure (i.e., objects and arrays), but it could be anything.

The data structure I chose is roughly as follows, but model yours as you see fit.  There's not one right way of doing this.

```javascript
// ./sokoban.js
export const v = "void",
             b = "building",
             g = "ground",
             w = "water",
             x = "dest";

export function init(){
  return {
    worker: [6,4],
    crates: [[3,3],[3,4],[4,4],[3,6]],
    fixtures: [
      [v, b, b, b, b, v, v, v],
      [v, b, g, g, b, b, b, b],
      [v, b, g, g, b, g, g, b],
      [v, b, g, x, g, g, g, b],
      [b, b, g, x, x, g, g, b],
      [b, g, g, w, x, b, b, b],
      [b, g, g, g, g, g, b, v],
      [b, g, g, b, g, g, b, v],
      [b, b, b, b, g, g, b, v],
      [v, v, v, b, b, b, b, v]
    ]
  }
}
```
```javascript
// ./main.js
const $state = $.atom(s.init());

reg({$state, s}); //registry aids interactivity
```
Then begin fleshing out your `sokoban` core with domain logic, nothing but pure functions and using them to tell your app's story.  Everything else including the program machinery (atoms, signals, routers, queues, buffers, buses, etc.) and glue code goes into `main`.

Keep `main` trivially simple at first.  For a time this lone atom provides all the harness necessary to run the simulation.

The `reg` line in `main` is important.  Ensure you grasp how the registry is used to facilitate [interactive development](./docs/interactive-development.md) as that's central to everything.

To begin interacting with the app, you'll need to serve it:

```sh
$ static . # server of choice
```

Launch the app in the browser, remembering the `monitor` query parameter:

[http://127.0.0.1:8080/?monitor=*](http://127.0.0.1:8080/?monitor=*)

Finally, to bootstrap the command line in the browser, expose its Developer Tools, and from its console enter:

```sh
cmd()
```

Anticipate operating from your text editor and browser console.  This'll involve [writing faux commands](./docs/simulating-actuating.md), adding them to and exporting them from the `sokoban` core module, and routinely issuing swaps against your atom.

Plug `$.swap` with a pure, [swappable](https://clojuredocs.org/clojure.core/swap!) function, some command for driving state transitions based on anticipated user actions.  These commands can be issued via the browser console and/or the `main` module.  Waffle between both.  Use whichever you prefer.  The `main` module is useful for recording command sequences.

Don't worry about what goes into `main` in the early stage.  It's temporary at best.  Focus on fleshing out the core `sokoban` module.

The functions you write must at minimum receive the app state as an argument, but they'll oft be accompanied by other arguments to permit configurability.  The choice for whether or not a command is configurable is yours.  It's often unavoidable.

```javascript
// ./sokoban.js

//configurable
export function move(direction){
  return function(state){
    //algorithm for moving based on direction
  }
}

//nonconfigurable
export function up(state){
  //algorithm for moving up
}
export function down(state){
  //algorithm for moving down
}
```

```javascript
// ./main.js
$.swap($state, s.move("up")); //configured
$.swap($state, s.up); //nonconfigured counterpart/alternative

$.swap($state, s.move("down"));
$.swap($state, s.down);
```

The above separation of files illustrate well the pendulum of initial activity.  You write functions in `sokoban` only to execute them in `main` and/or from the console.  This enables your app to tell its story.  This is what it means to [start with simulation](docs/start-with-simulation.md).

Telling a story from the confines of an atom is what makes this approach a pleasure.  The value in learning to tease the pure from the impure is the resulting simulation is far easier to reason about, use, and maintain than the messy reality of imperative code.  It's hard to beat a model which reduces a program to a flip book, halts time, and permits any page and its subsequent to be readily examined and compared.

The domain module (the core) simulates what your program is about, the main module (the shell) actuates its effects.  The domain module, playing [Sokoban](https://github.com/mlanza/sokoban/blob/main/sokoban.js) or managing [To-dos](https://github.com/mlanza/todo/blob/main/todo.js), for example, is a library of pure functions.  The main module provides the plumbing necessary to make things happen.  It transforms effect into simulation and vice versa.  Commands flow in.  Events flow out.  The core directs, the shell orchestrates.

The first objective is to flesh out the core by writing the functions needed to express what the story is about, what the program does.  That and an atom is all you initially need.  It's only when that's mostly done, the shell gets its UI.

### Stand up the user interface

The guts of most programs can be fully realized from what is effectively the browser command line.  The UI, although it comes much later, will eventually be needed.  And hooking up both sides of the one-way data flow is how one graduates from simulation to reality.

The first sides of the data flow is handling outputs or rendering.  It involves subscribing to the simulation and rendering and/or patching to the DOM:
```javascript
$.sub($state, function(state){
  /* render and/or patch the DOM */
});
```

The second side of the data flow is handling inputs or responding.  It involves subscribing to the DOM and feeding the simulation.

```javascript
const el = dom.sel1("#sokoban"); //root element

//event delegation
$.on(el, "click", "button.up", (e) => $.swap($state, s.up));

$.on(document, "keydown", function(e){
  if (e.key === "ArrowUp") {
    e.preventDefault();
    $.swap($state, s.up);
  }
});
```

Use event delegation so that no matter how many elements get created or destroyed over the life of the app, the handlers need only be wired up once.  Or subscribe to events on elements which never get destroyed.

#### Handling outputs or rendering/patching

Start with the rendering logic and keep to issuing commands against the atom. Write a function which receives the app state and paints and interface onto the DOM.  It may initially be a single function.  It will likely eventually be decomposed into parts.

```javascript
$.sub($state, function(state){
  dom.html(el, /* element or fragment */);
});
```
More likely you'd have one or more view functions each returning either an element, potentially nested with other elements, or a document fragment.

```javascript
function board(state){
  return /* element or fragment */;
}

$.sub($state, function(state){
  dom.html(el, board(state));
});
```
I prefer point-free style and so would `_.map` transduce the subscribe:

```javascript
$.sub($state, _.map(board), dom.html(el, _));
```
In reality the practice of receiving and reacting directly to the latest state is too simplistic an approach.  That's because a live app is a flip book with lots of frames reeling through.  It would not typically make sense to render a view to the DOM and then replace the whole thing on the next frame.  That could perform well in trivial GUIs like the one found in a counter app, but not something more substantial.

More typically you'd create a history signal which takes an atom and, on every update, returns the current and prior frames.  It's callback is called immediately, before any change takes place and on every change to follow.  Since there's no prior history when it's first called, `prior` will initially be null.

This permits you to write rendering logic and patching logic.  That is, fully render the DOM or update only the parts which correspond to things in the model which have changed.

```javascript
const $hist = $.hist($state); //history signal

$.sub($hist, function([curr, prior]){
  if (prior == null) {
    //render everything
  } else {
    //patch changes by diffing curr and prior
  }
});
```
Implementing the render-everything path is usually straightforward.  What's less obvious is how to handle patching.

This involves comparing snapshots.  Based on how the data is structured, one can readily check that entire sections of the app are unchanged since any objects which have not changed will be shared by both snapshots.  That basically means, as a rule, the parts of the data model which haven't changed can be compared cheaply by identity in the current and prior frames.

In one approach you can model your app using a single history signal and gradually build up the conditional logic to handle all feasible scenarios.  You can also sometimes divide a GUI into sections and, correspondingly, split the atom into one or more signals each focused on just a part of the GUI.

There's no right way.  The choice for using a history signal and/or subdividing an atom into signals is yours.

During this stage, continue issuing commands directly against the atom.  Write your rendering and/or patching logic.  When you can issue any command and things are correctly displayed, you can move to the next stage.

#### Handling inputs or responding

The app can now be made to respond to actions the user takes against the DOM.  This may involve responding to DOM events directly or defining input signals.  Remember, whichever approach you use, everything gets wired up once.

Here input is received from DOM events:
```javascript
const el = dom.sel1("#sokoban"); //root app element

$.on(el, "keydown", function(e){
  e.preventDefault();
  switch(e.key) {
    case "ArrowUp":
      $.swap($state, s.up);
      break;
    case "ArrowDown":
      $.swap($state, s.down);
      break;
    case "ArrowLeft":
      $.swap($state, s.left);
      break;
    case "ArrowRight"
      $.swap($state, s.right);
      break;
  }
});

//assumes the app has an up button in the GUI
$.on(el, "click", "#up-button", function(e){
  e.preventDefault();
  $.swap($state, s.up);
});
```
> ℹ️ **Info**: The `on` function implementation is similar [to jQuery's](https://api.jquery.com/on/).  One difference, though the code doesn't demonstrate it because in practice I've rarely needed it, is the call returns a callback for unsubscribing.

Here input is received, instead, through signals:
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

The first example responds to events.  The second reifies those events into signals.  As the underpinnings of both are similar, it's just preference.  The second approach is composable, while the first is simpler.

During this stage, you wire up the app to react to user interactions.  Once completed, issuing commands against the atom becomes superfluous.

### Iterative refinement

An app begins as a tiny reactive core and one grafts layers onto it.  It can be kept simple or evolved toward increasing sophistication.

The initial commands are pure functions often attached to DOM events and swapped against an atom.  These commands, however, can be reified into messages, and [sent to an actor](./docs/make-it-act.md) playing the role of a command bus. The benefit of messages is they can be sent over the wire, and/or logged to auditable histories.  They allow middleware to be introduced.

Add a [journal](./src/core/types/journal) to facilitate undo/redo and step backwards and forwards in time.

It's as much as you want, or as little.

### Be ever minding your big picture

The entire effort is preceded and interleaved with [thought](https://www.youtube.com/watch?v=f84n5oFoZBc) and/or note-taking.  This depends largely on starting with a good data model, anticipating how the UI (and potentially its animations) will look and behave, and having some idea of the evolutionary steps planned for the app.

It may be useful to rough out the UI early on.  Thinking through things and clarifying the big picture for how they work and fit together will minimize potential downstream snafus.

I find walks do wonders for development.  They allow me to chew on what I'd been tackling in and learning from the app.  I've arrived at many superior approaches and alternatives, no keyboard in sight, after a rigorous mental spelunking.

## Atomic in Action

See these sample programs to learn more:

* [Todo](https://github.com/mlanza/todo)
* [Sokoban](https://github.com/mlanza/sokoban)
* [Boulder Dash](https://github.com/mlanza/boulder-dash)
* [Treasure Quest](https://github.com/mlanza/treasure-quest)
