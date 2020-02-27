var rollup = require("rollup");
var babel = require("rollup-plugin-babel");

rollup.rollup({
  entry: "src/main.js",
  plugins: [ babel() ]
}).then(function (bundle) {
  bundle.write({
    dest: "dist/bundle.js",
    format: "iife"
  });
});
