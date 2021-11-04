import {overload, constructs, partial} from "../../core.js";
import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Left(value){
  this.value = value;
}

Left.prototype[Symbol.toStringTag] = "Left";

const left1 = constructs(Left);
export const left = overload(null, left1, partial(thrush, left1));
