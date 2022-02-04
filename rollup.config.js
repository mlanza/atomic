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
    dir: 'public/assets/vendor/atomic',
    format: 'esm',
    interop: false
  },
  external: [],
  plugins: [
    resolve(),
    rollupImportMapPlugin({
      "imports": {
        "hash": "../hash.js",
        "immutable": "../immutable.js",
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
    dir: 'public/assets',
    format: 'esm',
    interop: false
  },
  plugins: [
    resolve(),
    rollupImportMapPlugin({
      "imports": {
        "hash": "./vendor/hash.js",
        "immutable": "./vendor/immutable.js",
        "atomic/core": "./vendor/atomic/core.js",
        "atomic/dom": "./vendor/atomic/dom.js",
        "atomic/html": "./vendor/atomic/html.js",
        "atomic/immutables": "./vendor/atomic/immutables.js",
        "atomic/reactives": "./vendor/atomic/reactives.js",
        "atomic/repos": "./vendor/atomic/repos.js",
        "atomic/shell": "./vendor/atomic/shell.js",
        "atomic/svg": "./vendor/atomic/svg.js",
        "atomic/transducers": "./vendor/atomic/transducers.js",
        "atomic/transients": "./vendor/atomic/transients.js",
        "atomic/validates": "./vendor/atomic/validates.js",
        "@atomic/core": "./vendor/@atomic/core.js",
        "@atomic/dom": "./vendor/@atomic/dom.js",
        "@atomic/html": "./vendor/@atomic/html.js",
        "@atomic/immutables": "./vendor/@atomic/immutables.js",
        "@atomic/reactives": "./vendor/@atomic/reactives.js",
        "@atomic/repos": "./vendor/@atomic/repos.js",
        "@atomic/shell": "./vendor/@atomic/shell.js",
        "@atomic/svg": "./vendor/@atomic/svg.js",
        "@atomic/transducers": "./vendor/@atomic/transducers.js",
        "@atomic/transients": "./vendor/@atomic/transients.js",
        "@atomic/validates": "./vendor/@atomic/validates.js"

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
