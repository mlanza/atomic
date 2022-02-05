import {log, lowerCase, map, mapa, thread, join, pipe, str, range} from "./lib/atomic/core.js";
import _ from "./lib/@atomic/core.js";

/* WANTED: point-free style, esp. with pipelined operations (e.g. threading macro) */

//This is ideal but not supported in JavaScript without a build step.
//range(10)
//  |> map(pipe(str("Number ", ?), lowerCase), ?),
//  |> join(", ", ?),
//  |> log;

//Arrow functions help, but are noisy and not point-free.
_.thread(_.range(10),
  x => _.map(_.pipe(y => _.str("Number ", y), _.lowerCase), x),
  x => _.join(", ", x),
  _.log);

//The wrapped `@atomic` libraries imbue functions with partial applicability giving point-free style.
_.thread(_.range(10),
  _.map(_.pipe(_.str("Number ", _), _.lowerCase), _),
  _.join(", ", _),
  _.log);
