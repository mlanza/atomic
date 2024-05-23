import * as _ from "atomic/core";
import {pub} from "../ipublish/concrete.js";
import {ISubscribe} from "./instance.js";

function sub3(source, xf, sink){
  return ISubscribe.transducing(source, xf, sink);
}

function subN(source){
  const sink = arguments[arguments.length - 1],
        xfs = _.slice(arguments, 1, arguments.length - 1);
  return ISubscribe.transducing(source, _.comp(...xfs), sink);
}

export const sub = _.overload(null, null, ISubscribe.sub, sub3, subN);
