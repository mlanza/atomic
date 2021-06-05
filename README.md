# Atomic
A wholemeal, Clojure-inspired approach for programming.  Treats native JavaScript data structures (e.g. Object, Array) by default as immutable data.  Includes persistent data structures via Immutable.js integration.

* protocols (introduces means of implementing interfaces)
* functional (supports pure function composition)
* reactive (FRP)
* transients
* dates
* transducers

Aims to provide a suitable core for web development and to avoid third-party dependencies as much as possible.

Aims to provide a consistent, functional api which abides standard protocols where possible.  Thus, an api layer is provided for any integrated vendor types.

Aims to permit pipelines in non-transpiled code.  See [`pipelines.js`](./pipelines.js).  When [pipeline operators](https://github.com/tc39/proposal-pipeline-operator) and [partial application](https://github.com/tc39/proposal-partial-application) are eventually ratified into JavaScript this workaround will be deprecated.

Aims to be deno compatible.  Bare module use permits environment-based polyfills or substitutions.  An environment which defines a type can export it directly.  See how [`import-map.json`](./import-map.json) (deno) and [`boot.js`](./public/assets/boot.js) (modern browser) compare.