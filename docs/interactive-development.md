# Interactive Development

Interactive development makes programming a pleasure.  Atomic wants to aid interactivity.

In any browser where the Atomic `cmd` module is loaded, enter `cmd()` into the console, to access your commands and components.  Having imported `reg` from the `cmd` module into your modules, one may have used it to expose various commands and components/signals, beyond the standard library Atomic provides itself (`_`, `$`, and `dom`).  Entering `cmd()` exposes into the browser console what modules usually keep private.

To expose changes happening against signals, append `monitor` to the query string of your web app.

* `?monitor=*` to monitor everything
* `?monitor=$state,$data` to monitor select signals
* `?nomonitor=$state,$data` to monitor everything but certain signals

Components are headless, stateful objects which provide input and/or output ports.  These ports permit issuing commands and subscribing to events as well as wiring components together.  A developer can gradually build up an app while directly and regularly interacting with it before all the right UI affordances are in place.  Alternately, he can use this facility to monitor, debug, and/or extend an app.

This suits the Atomic philosophy.

Start with a pure, functional core and simulate what the app does.  Then, wrap the core with an interactive shell, making it into a useful, side-effect producing component.  From a turtles-all-the-way-down perspective, programs can be single components or component hierarchies.  Then comes the UI.

In this way, apps emerge from cores, shells, and UIs.  Normally, it's not possible to develop these areas one after the other.  One may begin with a functional core and, soon enough, add a shell and/or UI.  They are developed one after the other but also, to some extent, in parallel.

In practice, the shell and UI are usually combined into a single module and not necessarily worth the separation.  The separation becomes worthwhile when your component warrants the sophistication of a command bus api, and the extensibility of adding things like decorators and handlers.
