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

Atomic has structures comparable to Clojure's [maps](https://clojuredocs.org/clojure.core/hash-map) and [vectors](https://clojuredocs.org/clojure.core/vector) as well as seamless [Immutable.js](https://immutable-js.com) integration.  Protocols make data type substitution less of a feat.  So when a more suitable type is found or created it can be dropped in with little to no refactoring.

Since JavaScript lacks a complete set of value types (e.g. [records, tuples](https://tc39.es/proposal-record-tuple/) and [temporals](https://github.com/tc39/proposal-temporal)), purity becomes a matter of discipline, or protocol.  Atomic permits even reference types, like objects and arrays, to be optionally, as a matter of protocol selection, [treated as value types](./docs/command-query-protocols.md).  In many cases, natives perform well enough to not warrant loading the immutables library.  For heavier lifts, load it and drop a persistent into your constructors.  You're done!

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
> 💡**Recommendation**: Build the classic [Sokoban](https://en.wikipedia.org/wiki/Sokoban) game.  See [mine](https://github.com/mlanza/sokoban).  It's not overly challenging and it's certainly more fun than a counter or a to-do app.  Don't copy mine.  Follow the path being demonstrated, but choose your own graphics and implement in a way which makes sense to you.

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

This set of files hints at an architecture.  Your [FCIS program](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell) begins with a core (`sokoban`) and shell (`main`) module of its own.  Pragmatically, `main` may eventually contain the GUI logic and utilize the `dom` import, but right now that's a long way off.

### Stand up the simulation
Your first task, in `main`, is to create a state container for your [world state](https://docs.racket-lang.org/teachpack/2htdpuniverse.html) and define its `init` state in your pure module.  It'll likely be a compound data structure (of objects and arrays), but it could be anything.

The data structure I chose looks roughly like the following, but model yours in whatever way makes sense to you.

```javascript
// ./sokoban.js
function init(){
  const _ = "void",
        b = "building",
        g = "ground",
        w = "water"
        x = "dest";
  return {
    worker: [6,4],
    crates: [[3,3],[3,4],[4,4],[3,6]],
    fixtures: [
      [_, b, b, b, b, _, _, _],
      [_, b, g, g, b, b, b, b],
      [_, b, g, g, b, g, g, b],
      [_, b, g, x, g, g, g, b],
      [b, b, g, x, x, g, g, b],
      [b, g, g, w, x, b, b, b],
      [b, g, g, g, g, g, b, _],
      [b, g, g, b, g, g, b, _],
      [b, b, b, b, g, g, b, _],
      [_, _, _, b, b, b, b, _]
    ]
  }
}
```
```javascript
// ./main.js
const $state = $.atom(s.init());

reg({$state, s}); //registry aids interactivity
```
Then begin fleshing out your core with domain logic, nothing but pure functions and using them to tell your app's story.  Everything else including the program machinery (atoms, signals, routers, queues, buffers, buses, etc.) and glue code goes into `main`.

Keep `main` trivially simple, at first.  For a time it'll provide little more than the harness necessary to run the simulation.

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

Anticipate operating from your text editor and browser console for the unforeseeable future.  This'll involve writing commands (pure functions), adding them to and exporting them from the core module (e.g., `sokoban`), and routinely issuing swaps against your atom.

Plug `$.swap` with a pure, [swappable](https://clojuredocs.org/clojure.core/swap!) function, some command for driving state transitions based on anticipated user actions.  These commands can be issued via the browser console and/or the `main` module.  Waffle between both.  Use whichever you prefer.  The `main` module is useful for recording command sequences.

Don't worry about what goes into `main` in the early stage.  It's temporary at best.  Fleshing out the core module is the initial focus.

The functions you write must at minimum receive the app state as an argument, but they'll oft be accompanied by other arguments to permit configurability.  The choice for whether or not a command is configurable is yours.  In many instances it's unavoidable.

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
The above separation of files illustrate well the pendulum of initial activity.  You write functions in `sokoban` only to execute them in `main` and/or from the console.  This facilitates your telling some version of a story your app tells.  This is what it means to [start with simulation](docs/start-with-simulation.md).

This makes functional programming a pleasure.  The essence of "easy to reason about" falls out of the focus on purity.  It's hard to beat a model which reduces a program to a flip book, halts time, and permits any page and its subsequent to be readily examined or compared.  There's immeasurable good in learning to tease the pure out of the impure, of embracing the boundary between simulation and messy reality.

The domain module (the core) simulates what your program is about, the main module (the shell) actuates its effects.  The domain module, playing [Sokoban](https://github.com/mlanza/sokoban/blob/main/sokoban.js) or managing [To-dos](https://github.com/mlanza/todo/blob/main/todo.js), for example, is a library of pure functions.  The main module, having little to do the domain, provides the plumbing necessary to make things happen.  It transforms effect into simulation and vice versa.  Commands flow in.  Events flow out.  The core directs, the shell orchestrates.

The first objective is to flesh out the core by writing the functions needed to express what the story is about, what the program does.  A state container, all by itself, provides sufficient machinery to get you there.

It's only when the core is somewhat complete, the shell is finally connected to a UI.

### Stand up the user interface

The guts of most programs can be fully realized from what is effectively the browser command line.  The UI, although it comes much later, will eventually be needed.  And hooking up both sides of the one-way data flow is how one graduates from simulation to reality.

The first sides of the data flow is handling outputs or rendering.  It involves subscribing to the simulation and rendering and/or patching to the DOM:
```javascript
$.sub($state, function(state){
  /* render and/or patch the DOM */
});

```
The second side of the data flow is handling inputs or responding.  It involves subscribing to the DOM and feeding the simulation:
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
You can implement them one at a time.

#### Handling outputs or rendering/patching

Start with the rendering logic and keep to issuing commands against the atom. Start by writing a function which receive the app state and use it to paint the app onto the DOM.  Initially, it can be a single function although you will probably want to decompose it into parts eventually.

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
You could alternately use an intermediary transducer and compose the subscription:

```javascript
$.sub($state, _.map(board), dom.html(el, _));
```
In reality the practice of receiving and reacting directly to the latest state is too simplistic an approach.  That's because a live app is a flip book with lots of frames reeling through.  It would typically not make sense to render a view to the DOM and then replace the whole thing on the next frame.  That could perform well enough for trivial GUIs like the one found in a counter app, but not something more substantial.

More typically you'd create (via `hist`) and utilize a history signal.  It takes your atom and, on every update, returns the current and prior frames.  Opon first subscribing it invokes the callback immediately.  Since there's no prior history at this point, `prior` is null.

This permits you to write rendering logic and patching logic.  That is, fully render the DOM or update only the parts which correspond to things in the model which have changed.

```javascript
const $hist = $.hist($state);

$.sub($hist, function([curr, prior]){
  if (prior == null) {
    //render everything
  } else {
    //patch changes by diffing curr and prior
  }
});
```
Implementing the rendering everything path is usually straightforward.  What's less obvious is how to handle the patching logic.

That involves comparing snapshots.  Based on how the data is structured, one can readily check that entire sections of the app are unchanged since any objects which have not changed will be shared by both snapshots.  That basically means, as a rule, the parts of the data model which haven't changed can be compared cheaply by identity in the current and prior frames.

Now even this model is simplistic because it uses a single history signal.  And what can sometimes be done is to divide the GUI into sections. This would, in turn, entail creating one or more signals which focus on parts of the data model (e.g. app state).  Then, transforming those signals into history signals.

There's no "right way."  The choice to subdivide an atom into signals or signals into still further signals is yours.  Initially, you can probably get away with using the simplest possible data flow, an atom and a single history signal.

During this stage, continue issuing commands directly against the atom.  Write your rendering logic followed by your patching logic.  When you can issue any command and things are correctly displayed, you can move to the next stage.

#### Handling inputs or responding

The app can now be made to respond to actions the user takes against the DOM.  This may involve listening to events in the DOM and/or defining input signals.  I usually start with the first because it's simpler.

Whichever approach you use, everything gets wired up once.  The app may create and destroy tons of elements in its lifetime, but no new receivers get connected.  This is because of event delegation.

Here inputs are received as DOM events:

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
> ℹ️ **Info**: The `on` function implementation is similar [to jQuery's](https://api.jquery.com/on/) which also uses event delegation.  One difference, though the code doesn't demonstrate it, is calling it returns a callback for unsubscribing from the events.  I rarely used it in practice.

Here inputs are received instead as signals:
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

The first example responds to events.  The second reifies those events into signals.  As the underpinnings of both are similar, it's just preference.  The second approach is composable, while the first is not.

During this stage, you wire up the app to react to user interactions.  Once you're done you no longer have to issue commands against the atom, although you still could if you wanted!

### Iterative refinement

While an app has a humble beginning as little more than a reactive core, one gradually grafts layers onto it.  So it can be kept simple or evolved toward increasing sophistication.

For example, add [journal](./src/core/types/journal) to facilitate undo/redo and stepping forward and backward along a timeline.

Initially, commands are just pure functions and events just native DOM events, but these can be reified into JSON-serializable objects to faciliate being sent over the wire, or recorded in auditable histories.  The core can then be wrapped with a command bus api and facilitate a host of middleware features.

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
