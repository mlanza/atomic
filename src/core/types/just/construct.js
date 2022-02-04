import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";
import {nothing} from "../nothing/construct.js";

export function Just(value){
  this.value = value;
}

Just.prototype[Symbol.toStringTag] = "Just";

function maybe1(value){
  return value == null ? nothing : new Just(value);
}

export const maybe = thrush(maybe1);
export const opt = pipeline(maybe1);
