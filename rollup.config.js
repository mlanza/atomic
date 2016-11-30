import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'iife',
  moduleName: '_',
  plugins: [ json(), babel() ],
  dest: 'dist/bundle.js'
};
