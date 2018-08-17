import babel from 'rollup-plugin-babel';
import json  from 'rollup-plugin-json';

export default {
  input: 'test/cloe.js',
  output: {
    file: 'dist/tests.js',
    format: 'amd',
    name: "_",
    globals: {
      "cloe": "Cloe"
    }
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    json({
      include: 'node_modules/**',
      exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
      indent: '  '
    })
  ],
  external: ["cloe"]
};