# Atomic
A wholemeal, Clojure-inspired approach for programming.  Treats native JavaScript data structures (e.g. Object, Array) by default as immutable data.  Includes persistent data structures via Immutable.js integration.

* protocols (introduces means of implementing interfaces)
* functional (supports pure function composition)
* reactive (FRP)
* transients
* dates
* transducers

Aims to provide a suitable core for web development and to avoid third-party dependencies as much as possible.

Aims to supplant type thinking with abstraction thinking.  Don't ask an object, "What's its type?" but rather "What's its behavior?  Its interface?"  Take reactives — streams (emit events) and signals (emit time-changing values).  Disregard the actual object types.  While a `Cell` is a kind of signal (nearly analagous to a Clojure atom) and a `Subject` a kind of stream, an observable can be constructed to behave as either.  Simply put: objects must be thought of by the roles they play.  Furthermore, functions (e.g. pure queries) can take types and return different types.  Thus, [abstractions](https://en.wikipedia.org/wiki/Abstract_data_type).  In this  protocols are the foundation.  They make it possible to integrate third-party types while maintaining a uniform functional api.

Aims to permit [pipelines](./pipelines.js) in non-transpiled code.  When [pipeline operators](https://github.com/tc39/proposal-pipeline-operator) and [partial application](https://github.com/tc39/proposal-partial-application) are eventually ratified into JavaScript this workaround will be deprecated.

Aims to be deno compatible.  Bare module use permits environment-based polyfills or substitutions.  An environment which defines a type can export it directly.  See how [`import-map.json`](./import-map.json) (deno) and [`boot.js`](./public/assets/boot.js) (modern browser) compare.