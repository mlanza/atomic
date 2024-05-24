import _ from "./libs/atomic_/core.js";  //shadow modules (note the trailing underscore)...

//...exist to export functions imbued with partial applicability (i.e. autopartial).  It avails the point-free style without a build step.

_.chain(_.range(10), //`chain` facilitates threading
  _.map(_.pipe(_.str("Number ", _), _.lowerCase), _),
  _.join(", ", _),
  _.log);

//This is ideal but impossible without a build step since pipeline operators and partial application syntax have not yet landed in JS proper:
//_.range(10)
//  |> _.map(_.pipe(_.str("Number ", ?), _.lowerCase), ?)
//  |> _.join(", ", ?)
//  |> _.log;
