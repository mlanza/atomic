# Atomic
A wholemeal, Clojure-inspired approach for building up programs which treats JavaScript natives as immutables.

* protocols (added for use in JavaScript)
* functional (pure and composable)
* reactive (FRP)
* transients
* dates
* transducers

Provides pipelines for non-transpiled code.  See [`pipelines.js`](./pipelines.js).  When pipeline operators and partial application are adopted into JavaScript environments this workaround will be deprecated.

Bare modules are used to permit environment-based substitutions (e.g. browser AMD, browser ES6 modules, deno).  A target environment which natively supports a type can export it from the global namespace.  See  [`import-maps.json`](./import-map.json) for an example (used in deno).