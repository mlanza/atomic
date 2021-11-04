import {overload, constructs, partial} from "../../core.js";
import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Right(value){
  this.value = value;
}

Right.prototype[Symbol.toStringTag] = "Right";

const right1 = constructs(Right);
export const right = overload(null, right1, partial(thrush, right1));
export const just = right;
