import {overload, partial} from "../../core.js";
import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";

export function Left(value){
  this.value = value;
}

export function left1(value){
  return new Left(value);
}

export const left = overload(null, left1, partial(thrush, left1));
