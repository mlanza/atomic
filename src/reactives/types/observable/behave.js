import {does, nullary, once, mapa, noop, implement, IReduce, IMergeable} from "atomic/core";
import {ISubscribe} from "../../protocols/isubscribe.js";
import {IPublish} from "../../protocols/ipublish.js";
import {observable} from "./construct.js";

function sub(self, observer){
  return once(self.subscribed(observer) || noop); //return unsubscribe fn
}

function reduce(self, xf, init){
  return ISubscribe.sub(init, xf(self, ?));
}

function merge(self, other){
  return observable(function(observer){
    const handle = IPublish.pub(observer, ?);
    return nullary(does(ISubscribe.sub(self, handle), ISubscribe.sub(other, handle)));
  });
}

export const behaveAsObservable = does(
  implement(IMergeable, {merge}),
  implement(IReduce, {reduce}),
  implement(ISubscribe, {sub}));