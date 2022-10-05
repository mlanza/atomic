import _ from "./lib/atomic_/core.js";

//The `atomic_` shadow libraries (note the trailing underscore) imbue functions with partial applicability giving point-free style.
_.chain(_.range(10),
  _.map(_.pipe(_.str("Number ", _), _.lowerCase), _),
  _.join(", ", _),
  _.log);

//Ideal but JavaScript, minus a build step, has no threading macro for chaining functions together:
//range(10)
//  |> map(pipe(str("Number ", ?), lowerCase), ?),
//  |> join(", ", ?),
//  |> log;
