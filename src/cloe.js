import * as _ from "./core";
import * as transducers from "./transducers";
import * as signals from "./signals";
import * as request from "./request";
import * as promise from "./core/types/promise";
import {_ as v} from "param.macro";

export default Object.assign(_.placeholder, _.impart(_, _.partly), {
  transducers: _.impart(transducers, _.partly),
  signals: _.impart(signals, _.partly),
  request: _.impart(request, _.partly),
  promise: _.impart(promise, _.partly)
});