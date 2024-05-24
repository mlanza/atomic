import * as _ from "./libs/atomic/core.js";

//Arrow functions are noisy and not point free.  Yuck!
_.chain(_.range(10),
  x => _.map(_.pipe(y => _.str("Number ", y), _.lowerCase), x),
  x => _.join(", ", x),
  _.log);
