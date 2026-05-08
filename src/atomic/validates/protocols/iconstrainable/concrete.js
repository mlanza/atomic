import * as _ from "atomic/core";
import {IConstrainable} from "./instance.js";

function constraints2(self, f){
  return IConstrainable.constraints(self, _.isFunction(f) ? f(IConstrainable.constraints(self)) : f);
}

export const constraints = _.overload(null, IConstrainable.constraints, constraints2);

export function constrain(self, constraint){
  return constraints(self, _.append(?, constraint));
}
