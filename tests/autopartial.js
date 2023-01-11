import _ from "./lib/atomic_/core.js";  //shadow modules have a trailing underscore...

//...and exist to export functions imbued with partial applicability.  I call this technique autopartial.  It affords point-free style without a build step.

_.chain(_.range(10), //`chain` facilitates threading
  _.map(_.pipe(_.str("Number ", _), _.lowerCase), _),
  _.join(", ", _),
  _.log);

//The following is ideal but requires pipe operators and partial application syntax which do not yet exist without a build step:
//_.range(10)
//  |> _.map(_.pipe(_.str("Number ", ?), _.lowerCase), ?),
//  |> _.join(", ", ?),
//  |> _.log;
