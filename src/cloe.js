import * as _ from "./core";
import * as transducers from "./transducers";
import * as signals from "./signals";
import * as request from "./request";
import {_ as v} from "param.macro";

function isNotConstructor(text){
  return !/^[A-Z]./.test(text.name);
}

//convenience for executing partially-applied functions without macros.
const impart = _.mapSomeVals(v, _.partly, _.and(_.isFunction, isNotConstructor));

export default Object.assign(_.placeholder, impart(_), {
  transducers: impart(transducers),
  signals: impart(signals),
  request: impart(request)
});