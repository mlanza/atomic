import {overload, partial} from "../../core.js";
import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";

export function Maybe(value){
  this.value = value;
}

function maybe1(x){
  return new Maybe(x);
}

export const maybe = overload(null, maybe1, partial(thrush, maybe1));
export const opt = pipeline(maybe1);
