import babel from 'rollup-plugin-babel';
import json  from 'rollup-plugin-json';

export default {
  input: 'src/cloe.js',
  output: {
    file: 'dist/cloe.js',
    format: 'amd',
    name: "Cloe",
    globals: {
      "jquery": "jQuery",
      "qunit": "QUnit",
      "fetch": "fetch",
      "weak-map": "WeakMap",
      "symbol": "Symbol",
      "promise": "Promise",
      "immutable": "Immutable"
    }
  },
  external: ["immutable", "promise", "fetch", "symbol", "weak-map"],
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