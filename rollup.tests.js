import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json  from '@rollup/plugin-json';

export default {
  input: ['src/tests.js'],
  output: {
    dir: 'public/tests',
    format: 'amd',
    interop: false,
    globals: {
      "jquery": "jQuery",
      "qunit": "QUnit",
      "fetch": "fetch",
      "map": "Map",
      "set": "Set",
      "weak-map": "WeakMap",
      "symbol": "Symbol",
      "promise": "Promise",
      "immutable": "Immutable"
    }
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    json()
  ],
  external: [
    "fetch",
    "qunit",
    "dom",
    "atomic",
    "atomic/core",
    "atomic/immutables",
    "atomic/repos",
    "atomic/reactives",
    "atomic/transducers",
    "atomic/transients",
    "atomic/validates",
    "atomic/html",
    "atomic/svg",
    "atomic/dom"
  ]
};
