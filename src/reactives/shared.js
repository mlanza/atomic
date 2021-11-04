import {implement, does, IMergable, IReducible} from "atomic/core";
import {observable} from "./types/observable/construct.js"
import * as p from "./protocols/concrete.js";

function merge(self, other){
  return observable(function(observer){
    const handle = p.pub(observer, ?);
    return does(p.sub(self, handle), p.sub(other, handle));
  });
}

function reduce(self, f, init){
  return p.sub(init, f(self, ?));
}

export const mergable = implement(IMergable, {merge});
export const reducible = implement(IReducible, {reduce});
