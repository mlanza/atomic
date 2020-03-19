import {ISteppable} from "./instance";
import {IInverse} from "../iinverse/instance";
import {compare} from "../icomparable/concrete";
import {reducing} from "../ireduce/concrete";
import {overload} from "../../core";

export const step = ISteppable.step;

export function directed(start, step) {
  return compare(ISteppable.step(step, start), start);;
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

function add2(self, n){
  return ISteppable.step(n, self);
}

export const add = overload(null, null, add2, reducing(add2));

function subtract2(self, n){
  return ISteppable.step(IInverse.inverse(n), self);
}

export const subtract = overload(null, null, subtract2, reducing(subtract2));