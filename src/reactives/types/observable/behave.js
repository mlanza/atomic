import {does, implement, IReduce} from "atomic/core";
import {ISubscribe} from "../../protocols/isubscribe.js";

function sub(self, observer){
  return self.subscribed(observer); //return unsubscribe fn
}

function reduce(self, xf, init){
  return ISubscribe.sub(init, xf(self, ?));
}

export const behaveAsObservable = does(
  implement(IReduce, {reduce}),
  implement(ISubscribe, {sub}));