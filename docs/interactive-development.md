# Interactive Development
Interactive development makes programming a pleasure.  Atomic thrives on interactivity.

In a browser having loaded an Atomic app where the `cmd` module is loaded, go to its console and enter `cmd()` to upgrade it to a more proper command line interface (CLI).

## Activating the command line interface
An HTML page can be transformed into a CLI with a little help from the Atomic registry.

A CLI-friendly HTML page loads a `main.js` module like the following.  It imports the `_`, `$`, and `dom` standard libs.  It imports its core logic (e.g., `t`) for the app.  It imports `reg` (short for register) from the command (`cmd`) module.  It seeds an atom with data.

```js
// ./main.js
import _ from "./libs/atomic_/core.js";
import $ from "./libs/atomic_/shell.js";
import dom from "./libs/atomic_/dom.js";
import * as t from "./todo.js";
import {reg} from "./libs/cmd.js";

const $state = $.atom(t.init());
reg({$state, t});
```
Calling `reg` registers objects by name in the registry.  Here `$state` and `t` are registered, the first an atom, the second a namespace.  This does nothing noticeable until `cmd()` is entered at the console.

First, it subscribes to any atoms/signals it was given so changes can be reported to the log.  This depends on the page being given a query string:

* `?monitor=*` to monitor everything
* `?monitor=$state,$data` to monitor select signals
* `?nomonitor=$state,$data` to monitor everything but certain signals

Second, it exposes the registered names globally.  For example, the above `reg` line copies `$state` and `t` vars to its registry.  Invoking `cmd()` copies those vars from the registry to the `window` object:
```js
window['$state'] = registry.$state;
window['t'] = registry.t;
```
This is so, from an activated console, one can interact with the app to read and/or manipulate its state.  As `cmd` registers `_`, `$`, and `dom` by default these commonly-used namespaces will always be available.

This makes an app into a proper CLI.  Become accustomed to issuing `cmd()` being the first thing you do.

## Start small, iteratively refine
Components are headless, stateful objects with input and/or output ports.  These ports permit issuing commands and subscribing to events as well as wiring components together.  A developer can gradually build up an app while directly and regularly interacting with it all before the right UI affordances are in place.  Or he can monitor, debug, and extend an existing app.

This suits the Atomic philosophy.

Start with a pure, functional core and simulate what the app does.  Then, wrap the core with an interactive shell, making it into a useful, side-effect producing component.  From a turtles-all-the-way-down perspective, programs can be single components or component hierarchies.  Then comes the UI.

In this way, apps emerge from cores, shells, and UIs.  Normally, it's not possible to develop these areas one after the other.  One may begin with a functional core and, soon enough, add a shell and/or UI.  They are developed one after the other but also, to some extent, in parallel.

In practice, the shell and UI are usually combined into a single module and not necessarily worth the separation.  The separation becomes worthwhile when your component warrants the sophistication of a command bus api, and the extensibility of adding things like decorators and handlers.
