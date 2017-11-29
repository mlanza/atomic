import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'iife',
  moduleName: '_',
  dest: 'dist/bundle.js',
  plugins: [json(), babel()]
}