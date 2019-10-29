import babel from 'rollup-plugin-babel';
import json  from 'rollup-plugin-json';

export default {
  input: ['test/core.js'],
  output: {
    dir: 'dist/test',
    format: 'amd'
  },
  experimentalCodeSplitting: true,
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
  external: [
    "fetch",
    "atomic",
    "atomic/core",
    "atomic/immutables",
    "atomic/requests",
    "atomic/reactives",
    "atomic/transducers",
    "atomic/transients",
    "atomic/validates",
    "atomic/dom"
  ]
};