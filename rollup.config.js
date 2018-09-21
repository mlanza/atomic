import babel from 'rollup-plugin-babel';
import json  from 'rollup-plugin-json';

export default {
  input: [
    'src/core.js',
    'src/dom.js',
    'src/immutables.js',
    'src/reactives.js',
    'src/transducers.js',
    'src/requests.js',
    'src/index.js'
  ],
  output: {
    dir: 'dist/cloe',
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
  external: [
    "immutable",
    "promise",
    "fetch",
    "symbol",
    "weak-map",
    "set",
    "map",
    "qunit",
    "jquery",
    "cloe",
    "cloe/core",
    "cloe/immutables",
    "cloe/reactives",
    "cloe/transducers",
    "cloe/requests",
    "cloe/dom"
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    json({
      include: 'node_modules/**',
      exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
      indent: '  '
    })
  ]
};