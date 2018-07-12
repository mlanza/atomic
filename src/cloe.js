import * as _ from "./core";
import * as transducers from "./transducers";
import * as signals from "./signals";
import * as request from "./request";
import {_ as v} from "param.macro";

export default Object.assign(_.placeholder, _.impart(_), {
  transducers: _.impart(transducers),
  signals: _.impart(signals),
  request: _.impart(request)
});