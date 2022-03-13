import * as _ from "./lib/atomic/core.js";

//Arrow functions help, but are noisy and not point-free.
_.chain(_.range(10),
  x => _.map(_.pipe(y => _.str("Number ", y), _.lowerCase), x),
  x => _.join(", ", x),
  _.log);
