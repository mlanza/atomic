import {babel} from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import json  from '@rollup/plugin-json';
import jscc from 'rollup-plugin-jscc';
import { terser } from "rollup-plugin-terser";
import { rollupImportMapPlugin } from "rollup-plugin-import-map";
console.log("b",babel)
const _CROSSREALM = process.argv.indexOf("--crossrealm") == -1 ? 0 : 1;
const _EXPERIMENTAL = process.argv.indexOf("--experimental") == -1 ? 0 : 1;
const _RELEASE = process.argv.indexOf("--release") == -1 ? 0 : 1;

console.log("options", {_CROSSREALM, _EXPERIMENTAL, _RELEASE});

export default [{
  input: [
    'src/core.js',
    'src/dom.js',
    'src/shell.js',
    'src/reactives.js',
    'src/transients.js',
    'src/validates.js'
  ],
  output: {
    dir: 'dist/atomic',
    format: 'esm',
    interop: "esModule"
  },
  external: [],
  plugins: [
    resolve(),
    rollupImportMapPlugin({
      "imports": {
        "atomic/core": "./core.js",
        "atomic/dom": "./dom.js",
        "atomic/reactives": "./reactives.js",
        "atomic/shell": "./shell.js",
        "atomic/transients": "./transients.js",
        "atomic/validates": "./validates.js"
      }
    }),
    jscc({
      values: {_CROSSREALM, _EXPERIMENTAL},
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'inline'
    }),
    json(),
    _RELEASE ? terser() : null
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
        "atomic_/reactives": "./lib/atomic_/reactives.js",
        "atomic_/shell": "./lib/atomic_/shell.js",
        "atomic_/transients": "./lib/atomic_/transients.js",
        "atomic_/validates": "./lib/atomic_/validates.js"
      }
    }),
    jscc({
      values: {_CROSSREALM, _EXPERIMENTAL},
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    json()
  ],
  external: []
}];
