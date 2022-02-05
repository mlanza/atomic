import _ from "./lib/@atomic/core.js";

//The wrapped `@atomic` libraries imbue functions with partial applicability giving point-free style.
_.thread(_.range(10),
  _.map(_.pipe(_.str("Number ", _), _.lowerCase), _),
  _.join(", ", _),
  _.log);

//Ideal but JavaScript has no threading macro minus a build step:
//range(10)
//  |> map(pipe(str("Number ", ?), lowerCase), ?),
//  |> join(", ", ?),
//  |> log;
