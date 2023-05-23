import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import json  from '@rollup/plugin-json';
import jscc from 'rollup-plugin-jscc';
import { rollupImportMapPlugin } from "rollup-plugin-import-map";

const _CROSSREALM = process.argv.indexOf("--crossrealm") == -1 ? 0 : 1;
console.log("crossrealm", _CROSSREALM);

export default [{
  input: [
    'src/core.js',
    'src/dom.js',
    'src/immutables.js',
    'src/shell.js',
    'src/reactives.js',
    'src/transducers.js',
    'src/transients.js',
    'src/validates.js',
    'src/html.js',
    'src/svg.js'
  ],
  output: {
    dir: 'dist/atomic',
    format: 'esm',
    interop: false
  },
  external: [],
  plugins: [
    resolve(),
    rollupImportMapPlugin({
      "imports": {
        "immutable": "../immutable.js",
        "atomic/core": "./core.js",
        "atomic/dom": "./dom.js",
        "atomic/html": "./html.js",
        "atomic/immutables": "./immutables.js",
        "atomic/reactives": "./reactives.js",
        "atomic/shell": "./shell.js",
        "atomic/svg": "./svg.js",
        "atomic/transducers": "./transducers.js",
        "atomic/transients": "./transients.js",
        "atomic/validates": "./validates.js"
      }
    }),
    jscc({
      values: {_CROSSREALM},
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
    file: 'tests/main.js',
    format: 'esm',
    interop: false
  },
  plugins: [
    resolve(),
    rollupImportMapPlugin({
      "imports": {
        "atomic_/core": "./lib/atomic_/core.js",
        "atomic_/dom": "./lib/atomic_/dom.js",
        "atomic_/html": "./lib/atomic_/html.js",
        "atomic_/immutables": "./lib/atomic_/immutables.js",
        "atomic_/reactives": "./lib/atomic_/reactives.js",
        "atomic_/shell": "./lib/atomic_/shell.js",
        "atomic_/svg": "./lib/atomic_/svg.js",
        "atomic_/transducers": "./lib/atomic_/transducers.js",
        "atomic_/transients": "./lib/atomic_/transients.js",
        "atomic_/validates": "./lib/atomic_/validates.js"
      }
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    json()
  ],
  external: []
}];
