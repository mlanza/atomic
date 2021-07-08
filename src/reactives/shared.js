import {implement, does, IMergable, IReduce} from "atomic/core";
import {observable} from "./types/observable/construct.js"
import * as p from "./protocols/concrete.js";

function merge(self, other){
  return observable(function(observer){
    const handle = p.pub(observer, ?);
    return does(p.sub(self, handle), p.sub(other, handle));
  });
}

function reduce(self, xf, init){
  return p.sub(init, xf(self, ?));
}

export const imergable = implement(IMergable, {merge});
export const ireduce = implement(IReduce, {reduce});
