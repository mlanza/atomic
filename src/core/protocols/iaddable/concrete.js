import {IAddable} from "./instance.js";
import {IInverse} from "../iinverse/instance.js";
import {compare} from "../icomparable/concrete.js";
import {reducing} from "../ireducible/concrete.js";
import {constantly, overload, identity} from "../../core.js";

export function directed(start, step) {
  return compare(IAddable.add(start, step), start);
}

export function steps(Type, pred){
  return function(start, end, step){
    if (start == null && end == null) {
      return new Type();
    }
    if (start != null && !pred(start)) {
      throw Error(Type.name + " passed invalid start value.");
    }
    if (end != null && !pred(end)) {
      throw Error(Type.name + " passed invalid end value.");
    }
    if (start == null && end != null) {
      throw Error(Type.name + " cannot get started without a beginning.");
    }
    const direction = directed(start, step);
    if (direction === 0) {
      throw Error(Type.name + " lacks direction.");
    }
    return new Type(start, end, step, direction);
  }
}

function subtract2(self, n){
  return IAddable.add(self, IInverse.inverse(n));
}

export const subtract = overload(constantly(0), identity, subtract2, reducing(subtract2));
export const add = overload(constantly(0), identity, IAddable.add, reducing(IAddable.add));
export const inc = overload(constantly(+1), IAddable.add(?, +1));
export const dec = overload(constantly(-1), IAddable.add(?, -1));
