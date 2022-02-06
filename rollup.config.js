import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import json  from '@rollup/plugin-json';
import jscc from 'rollup-plugin-jscc';
import { rollupImportMapPlugin } from "rollup-plugin-import-map";

const _CROSSFRAME = process.argv.indexOf("--crossframe") == -1 ? 0 : 1;
console.log("crossframe", _CROSSFRAME);

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
    dir: 'dist/atomic',
    format: 'esm',
    interop: false
  },
  external: [],
  plugins: [
    resolve(),
    rollupImportMapPlugin({
      "imports": {
        "hash": "./immutables/hash.js",
        "immutable": "./immutables/immutable.js",
        "atomic/core": "./core.js",
        "atomic/dom": "./dom.js",
        "atomic/html": "./html.js",
        "atomic/immutables": "./immutables.js",
        "atomic/reactives": "./reactives.js",
        "atomic/repos": "./repos.js",
        "atomic/shell": "./shell.js",
        "atomic/svg": "./svg.js",
        "atomic/transducers": "./transducers.js",
        "atomic/transients": "./transients.js",
        "atomic/validates": "./validates.js"
      }
    }),
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
    file: 'tests/main.js',
    format: 'esm',
    interop: false
  },
  plugins: [
    resolve(),
    rollupImportMapPlugin({
      "imports": {
        "hash": "./lib/atomic/immutables/hash.js",
        "immutable": "./lib/atomic/immutables/immutable.js",
        "atomic/core": "./lib/atomic/core.js",
        "atomic/dom": "./lib/atomic/dom.js",
        "atomic/html": "./lib/atomic/html.js",
        "atomic/immutables": "./lib/atomic/immutables.js",
        "atomic/reactives": "./lib/atomic/reactives.js",
        "atomic/repos": "./lib/atomic/repos.js",
        "atomic/shell": "./lib/atomic/shell.js",
        "atomic/svg": "./lib/atomic/svg.js",
        "atomic/transducers": "./lib/atomic/transducers.js",
        "atomic/transients": "./lib/atomic/transients.js",
        "atomic/validates": "./lib/atomic/validates.js",
        "@atomic/core": "./lib/@atomic/core.js",
        "@atomic/dom": "./lib/@atomic/dom.js",
        "@atomic/html": "./lib/@atomic/html.js",
        "@atomic/immutables": "./lib/@atomic/immutables.js",
        "@atomic/reactives": "./lib/@atomic/reactives.js",
        "@atomic/repos": "./lib/@atomic/repos.js",
        "@atomic/shell": "./lib/@atomic/shell.js",
        "@atomic/svg": "./lib/@atomic/svg.js",
        "@atomic/transducers": "./lib/@atomic/transducers.js",
        "@atomic/transients": "./lib/@atomic/transients.js",
        "@atomic/validates": "./lib/@atomic/validates.js"
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
