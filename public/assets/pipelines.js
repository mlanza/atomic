import {log, lowerCase, map, mapa, thread, join, pipe, str, range} from "./vendor/atomic/core.js";
import _ from "./vendor/@atomic/core.js";

/* WANTED: point-free style, esp. with pipelined operations (e.g. threading macro) */

//This is ideal but not supported in JavaScript without a build step.
//range(10)
//  |> map(pipe(str("Number ", ?), lowerCase), ?),
//  |> join(", ", ?),
//  |> log;

//Arrow functions help, but are noisy and not point-free.
thread(range(10),
  x => map(pipe(y => str("Number ", y), lowerCase), x),
  x => join(", ", x),
  log);

//See how `boot.js` imbues typical functions with partial application so the following just works.
_.thread(_.range(10),
  _.map(_.pipe(_.str("Number ", _), _.lowerCase), _),
  _.join(", ", _),
  _.log);
