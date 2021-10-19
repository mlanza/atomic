import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json  from '@rollup/plugin-json';

export default {
  input: ['src/tests.js'],
  output: {
    dir: 'public/assets',
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
      "promise": "Promise"
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
    "immutable",
    "hash",
    "promise",
    "fetch",
    "symbol",
    "weak-map",
    "set",
    "map",
    "qunit",
    "jquery",
    "dom",
    "atomic",
    "atomic/core",
    "atomic/immutables",
    "atomic/shell",
    "atomic/reactives",
    "atomic/transducers",
    "atomic/transients",
    "atomic/repos",
    "atomic/validates",
    "atomic/html",
    "atomic/svg",
    "atomic/dom"
  ]
};
