import {constructs} from "../../core.js";
import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Maybe(value){
  this.value = value;
}

Maybe.prototype[Symbol.toStringTag] = "Maybe";

const maybe1 = constructs(Maybe);
export const maybe = thrush(maybe1);
export const opt = pipeline(maybe1);
