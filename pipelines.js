import {log, lowerCase, map, mapa, just, join, pipe, str, range} from "./public/assets/atomic/core.js";
import * as core from "./public/assets/atomic/core.js";

/* WANTED: ledgible pipelines */

//ideal but requires transpiling due to lack of actual JavaScript features
/*
range(10)
  |> map(pipe(str("Number ", ?), lowerCase), ?),
  |> join(", ", ?),
  |> log;
*/

//with arrow functions in modern environments, adds noise
just(range(10),
  x => map(pipe(y => str("Count ", y), lowerCase), x),
  x => join(", ", x),
  log);

//how to provide universal partial application to a standard library
const clone = Object.assign({}, core); //ES6 module object is incompatible with `impart` thus transform to plain object first
const _ = Object.assign(clone.placeholder, clone.impart(clone, clone.partly)); //inject into placeholder since both wish to share `_` as namespace.

//dropping arrow functions reduces noise; impart provides universal partial application; awaiting true partial application syntax in JavaScript
_.just(_.range(10),
  _.map(_.pipe(_.str("Number ", _), _.lowerCase), _),
  _.join(", ", _),
  _.log);

//deno run --import-map=import-map.json --allow-all pipelines.js