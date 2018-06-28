import babel from 'rollup-plugin-babel';
import json  from 'rollup-plugin-json';

export default {
  input: 'src/cloe.js',
  output: {
    file: 'dist/cloe.js',
    format: 'iife',
    name: "Cloe",
    globals: {
      "immutable": "Immutable",
      "promise": "Promise"
    }
  },
  external: ["immutable", "promise"],
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