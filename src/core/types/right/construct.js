import {constructs} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Right(value){
  this.value = value;
}

Right.prototype[Symbol.toStringTag] = "Right";

export const right = thrush(constructs(Right));
