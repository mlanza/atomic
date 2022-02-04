import {constructs} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";

export function Right(value){
  this.value = value;
}

Right.prototype[Symbol.toStringTag] = "Right";

export const right = thrush(constructs(Right));
