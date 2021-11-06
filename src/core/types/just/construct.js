import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";
import {none} from "../none/construct.js";
import Symbol from "symbol";

export function Just(value){
  this.value = value;
}

Just.prototype[Symbol.toStringTag] = "Just";

function just1(value){
  return value == null ? none : new Just(value);
}

export const just = thrush(just1);
export const opt = pipeline(just);
