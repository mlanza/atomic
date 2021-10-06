import {overload, partial} from "../../core.js";
import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Maybe(value){
  this.value = value;
}

Maybe.prototype[Symbol.toStringTag] = "Maybe";

function maybe1(x){
  return new Maybe(x);
}

export const maybe = overload(null, maybe1, partial(thrush, maybe1));
export const opt = pipeline(maybe1);
