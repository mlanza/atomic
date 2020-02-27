import {append, isFunction, overload} from 'atomic/core';
import {IConstrainable} from "./instance";
import {_ as v} from "param.macro";

function constraints2(self, f){
  return IConstrainable.constraints(self, isFunction(f) ? f(IConstrainable.constraints(self)) : f);
}

export const constraints = overload(null, IConstrainable.constraints, constraints2);

export function constrain(self, constraint){
  return constraints(self, append(v, constraint));
}