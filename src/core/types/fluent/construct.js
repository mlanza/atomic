import {overload, partial, constructs} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Fluent(value){
  this.value = value;
}

Fluent.prototype[Symbol.toStringTag] = "Fluent";

const fluent1 = constructs(Fluent);

export const fluent = overload(null, fluent1, partial(thrush, fluent1));
