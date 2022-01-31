import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import json  from '@rollup/plugin-json';
import jscc from 'rollup-plugin-jscc';

const _CROSSFRAME = process.argv.indexOf("--crossframe") == -1 ? 0 : 1;
console.log("crossframe", _CROSSFRAME);

const external = [
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
];

const globals = {
  "jquery": "jQuery",
  "qunit": "QUnit",
  "fetch": "fetch",
  "map": "Map",
  "set": "Set",
  "weak-map": "WeakMap",
  "symbol": "Symbol",
  "promise": "Promise"
};

export default [{
  input: [
    'src/core.js',
    'src/dom.js',
    'src/immutables.js',
    'src/shell.js',
    'src/reactives.js',
    'src/transducers.js',
    'src/transients.js',
    'src/repos.js',
    'src/validates.js',
    'src/html.js',
    'src/svg.js'
  ],
  output: {
    dir: 'public/assets/vendor/atomic',
    format: 'amd',
    interop: false,
    globals
  },
  external,
  plugins: [
    resolve(),
    jscc({
      values: {_CROSSFRAME},
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'inline'
    }),
    json()
  ]
},{
  input: ['src/tests.js'],
  output: {
    dir: 'public/assets',
    format: 'amd',
    interop: false,
    globals
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    json()
  ],
  external
}];
