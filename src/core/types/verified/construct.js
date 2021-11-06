import {constructs, overload} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Verified(value, pred){
  this.value = value;
  this.pred = pred;
}

Verified.prototype[Symbol.toStringTag] = "Verified";

export function verified(value, pred){
  if (!pred(value)) {
    throw new Error("Initial state could not be verified.");
  }
  return new Verified(value, pred);
}

export const fluent = thrush(verified(?, function(value){
  return value !== undefined;
}));
