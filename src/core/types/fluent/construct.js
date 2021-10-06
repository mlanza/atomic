import {overload, partial} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Fluent(value){
  this.value = value;
}

Fluent.prototype[Symbol.toStringTag] = "Fluent";

function fluent1(value){
  return new Fluent(value);
}

export const fluent = overload(null, fluent1, partial(thrush, fluent1));
