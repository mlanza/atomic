import * as _ from "atomic/core";
import {pub} from "../../protocols/ipublish/concrete.js";
import {ISubscribe} from "./instance.js";

function sub3(source, xf, sink){
  return ISubscribe.transducing(source, xf, sink); //TODO import transducing logic directly
}

function subN(source){
  const sink = arguments[arguments.length - 1],
        xfs = _.slice(arguments, 1, arguments.length - 1);
  return sub3(source, _.comp(...xfs), sink);
}

export const sub = _.overload(null, null, ISubscribe.sub, sub3, subN);
export const unsub = _.overload(null, null, ISubscribe.unsub);
export const subscribed = ISubscribe.subscribed;
