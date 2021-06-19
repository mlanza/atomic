import {implement, IReduce} from "atomic/core";
import {ISubscribe} from "./protocols/isubscribe/instance.js";

function reduce(self, xf, init){
  return ISubscribe.sub(init, xf(self, ?));
}

export const ireduce = implement(IReduce, {reduce});