import babel from 'rollup-plugin-babel';
import json  from 'rollup-plugin-json';

export default {
  input: ['test/core.js'],
  output: {
    dir: 'dist/test',
    format: 'amd',
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
  experimentalCodeSplitting: true,
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    json({
      include: 'node_modules/**',
      exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
      indent: '  '
    })
  ],
  external: [
    "fetch",
    "qunit",
    "atomic",
    "atomic/core",
    "atomic/immutables",
    "atomic/repos",
    "atomic/reactives",
    "atomic/transducers",
    "atomic/transients",
    "atomic/validates",
    "atomic/vectors",
    "atomic/dom"
  ]
};