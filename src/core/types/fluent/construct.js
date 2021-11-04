import {constructs} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Fluent(value){
  this.value = value;
}

Fluent.prototype[Symbol.toStringTag] = "Fluent";

export const fluent = thrush(constructs(Fluent));
