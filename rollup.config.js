import {babel} from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import json  from '@rollup/plugin-json';
import jscc from 'rollup-plugin-jscc';
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";
import { rollupImportMapPlugin } from "rollup-plugin-import-map";

const _CROSSREALM = process.argv.indexOf("--crossrealm") == -1 ? 0 : 1;
const _EXPERIMENTAL = process.argv.indexOf("--experimental") == -1 ? 0 : 1;
const _RELEASE = process.argv.indexOf("--release") == -1 ? 0 : 1;

console.log("options", {_CROSSREALM, _EXPERIMENTAL, _RELEASE});

export default [{
    input: ['src/cmd.js'],
    output: {
      dir: 'dist',
      format: 'esm',
      interop: "esModule"
    },
    external: [
      './atomic_/core.js',
      './atomic_/shell.js',
      './atomic_/dom.js',
      './atomic_/validates.js',
      './atomic_/immutables.js'
    ],
    plugins: [jscc({
      values: {_EXPERIMENTAL},
    })]
  }, {
    input: ['src/tests.js'],
    output: {
      dir: 'tests',
      format: 'esm',
      interop: "esModule"
    },
    external: [
      "./test.js",
      "../dist/cmd.js",
      '../dist/atomic_/core.js',
      '../dist/atomic_/shell.js',
      '../dist/atomic_/dom.js',
      '../dist/atomic_/validates.js',
      '../dist/atomic_/immutables.js'
    ],
    plugins: [jscc({
      values: {_EXPERIMENTAL},
    })]
  }, {
  input: [
    'src/atomic/core.js',
    'src/atomic/shell.js',
    'src/atomic/dom.js',
    _EXPERIMENTAL ? 'src/atomic/validates.js' : null,
    'src/atomic/immutables.js'
  ].filter(x => x),
  output: {
    dir: 'dist/atomic',
    format: 'esm',
    interop: "esModule"
  },
  external: ["immutable", "../immutable.js"],
  plugins: [
    resolve(),
    rollupImportMapPlugin({
      "imports": {
       // "immutable": "../immutable.js",
        "atomic/core": "./core.js",
        "atomic/shell": "./shell.js",
        "atomic/dom": "./dom.js",
        "atomic/validates": "./validates.js",
        "atomic/immutables": "./immutables.js"
      }
    }),
    jscc({
      values: {_CROSSREALM, _EXPERIMENTAL},
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: [
        ["@babel/preset-modules"]
      ],
      plugins: [
        "@babel/plugin-proposal-partial-application"
      ]
    }),
    json(),
    terser({
      compress: _RELEASE,
      mangle: false,
      format: {
        indent_level: 2,
        comments: false,
        beautify: true
      }
    }),
    replace({
      'import * as T from "immutable"': 'import * as T from "../immutable.js"',
      'import { Map, List, Set, OrderedMap, OrderedSet } from "immutable"': 'import { Map, List, Set, OrderedMap, OrderedSet } from "../immutable.js"',
      'export { List, OrderedMap, OrderedSet } from "immutable"': 'export { List, OrderedMap, OrderedSet } from "../immutable.js"',
      'import * as T from "./immutable.js"': 'import * as T from "../immutable.js"',
      delimiters: ['', ''],
      preventAssignment: true
    })
  ]
}];
