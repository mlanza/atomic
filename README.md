# Atomic
A wholemeal, Clojure-inspired approach for programming.  Treats native JavaScript data structures (e.g. Object, Array) by default as immutable data.  Includes persistent data structures via Immutable.js integration.

* protocols (introduces means of implementing interfaces)
* functional (supports pure function composition)
* reactive (FRP)
* transducers
* transients

Provides a robust core for web development rich enough to meet typical use cases so that third-party integrations can be minimized.

Promotes a uniform functional api.  Arguments are explicitly passed to functions with most functions prefering an explicit `self` in the first position.  The use of `this` are largely eliminated.  All type properties are to be treated as private (no underscore prefix needed) and are exposed for REPL transparency and to aid in development/debugging.   Queries and commands are called using functions.

Supplants type thinking with abstraction thinking.  Don't ask an object, "What's your type?" but rather "What's your behavior?  Your interface?"  Take reactives — streams emit events and signals emit time-changing values.  Disregard the actual object types.  While a `Cell` is a kind of signal (nearly analagous to a Clojure atom) and a `Subject` a kind of stream, an observable can be constructed to behave as either.  Simply put: objects must be thought of by the roles they play.  Furthermore, functions (e.g. pure queries) can take types and return different types.  Thus, [abstractions](https://en.wikipedia.org/wiki/Abstract_data_type).  In this  protocols are the foundation.  They make it possible to integrate third-party types while maintaining a uniform api.

Permits [pipelines](./pipelines.js) in non-transpiled code.  When [pipeline operators](https://github.com/tc39/proposal-pipeline-operator) and [partial application](https://github.com/tc39/proposal-partial-application) are eventually ratified into JavaScript this workaround will be deprecated.

Permits types to be defined by the host or by the library.  Bare module imports allow polyfills and environmental variations of types, even native types, to be supplied.  See how [`import-map.json`](./import-map.json) (deno) and [`boot.js`](./public/assets/boot.js) (modern browser) compare.  This aids in module portability, use on the server (e.g. deno) and in the client (e.g. browser using Require.js and AMDs).