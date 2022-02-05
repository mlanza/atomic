# Atomic
A wholemeal, Clojure-inspired approach for programming.  Treats native JavaScript data structures (e.g. Object, Array) by default as immutable data.  Includes persistent data structures via Immutable.js integration.

* functional (supports pure function composition)
* [protocols](src/core/protocols) (interfaces can be added to third-party types)
* [reactives](src/reactives) (FRP)
* [transducers](src/transducers)
* [transients](src/transients)

Provides a robust core for web development rich enough to meet typical use cases so that third-party integrations can be minimized.

Promotes a uniform functional api.  Functions drive all queries and commands.  Arguments are explicitly passed to functions with most functions preferring an explicit `self` in the first position.  The use of `this` is largely eliminated.  All properties (set usually once during construction) are treated as privates (no underscore prefix needed) and aid in REPL-driven development.

Supplants concretion thinking with abstraction thinking.  Don't ask an object, "What's your type?" but rather "What's your behavior?  Your interface?"  Take reactives — streams emit events and signals emit time-changing values.  Disregard the actual object types.  While a `Cell` is a kind of signal (nearly analagous to a Clojure atom) and a `Subject` a kind of stream, an observable can be constructed to behave as either.  Simply put: objects must be thought of by the roles they play.  Furthermore, functions (e.g. pure queries) can take types and return different types.  Thus, [abstractions](https://en.wikipedia.org/wiki/Abstract_data_type).  In this protocols are the foundation.  They make it possible to integrate third-party types while maintaining a uniform api.

Offers [point-free programming](https://en.wikipedia.org/wiki/Tacit_programming) without a build step.  This is demonstrated in [autopartial](./tests/autopartial.js) and [autopartial-less](./tests/autopartial-less.js).  When [pipeline operators](https://github.com/tc39/proposal-pipeline-operator) and [partial application](https://github.com/tc39/proposal-partial-application) are eventually ratified into JavaScript this kludge can be deprecated.
