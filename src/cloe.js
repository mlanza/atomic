import * as _ from "./core";
import * as transducers from "./transducers";
import * as signals from "./signals";
import {_ as v} from "param.macro";

//convenience for executing partially-applied functions without macros.
const impart = _.overload(
  null, 
  _.mapSomeVals(v, _.partly, _.isFunction), 
  _.mapSomeVals(v, v, _.partly, _.isFunction));

export default Object.assign(impart(_.placeholder, _), {
  transducers: impart(transducers),
  signals: impart(signals)
});