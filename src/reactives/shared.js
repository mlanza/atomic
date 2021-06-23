import {implement, does, IMergeable, IReduce} from "atomic/core";
import {observable} from "./types/observable/construct.js"
import {ISubscribe} from "./protocols/isubscribe/instance.js";
import {IPublish} from "./protocols/ipublish/instance.js";

function merge(self, other){
  return observable(function(observer){
    const handle = IPublish.pub(observer, ?);
    return does(ISubscribe.sub(self, handle), ISubscribe.sub(other, handle));
  });
}

function reduce(self, xf, init){
  return ISubscribe.sub(init, xf(self, ?));
}

export const imergeable = implement(IMergeable, {merge});
export const ireduce = implement(IReduce, {reduce});