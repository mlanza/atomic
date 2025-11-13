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
  input: [
    'src/core.js',
    'src/shell.js',
    'src/dom.js',
    'src/immutables.js'
  ],
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
