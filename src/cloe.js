import * as _ from "./core";
import * as transducers from "./transducers";
import * as signals from "./signals";
import * as request from "./request";
import * as promise from "./core/types/promise";
import {_ as v} from "param.macro";

export default Object.assign(_.placeholder, _.impart(_), {
  transducers: _.impart(transducers),
  signals: _.impart(signals),
  request: _.impart(request, _.excludes(['request', 'loadUrl'], v)),
  promise: _.impart(promise)
});