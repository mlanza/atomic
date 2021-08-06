import {overload, partial} from "../../core.js";
import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";

export function Right(value){
  this.value = value;
}

function right1(value){
  return new Right(value);
}

export const right = overload(null, right1, partial(thrush, right1));
export const just = right;
