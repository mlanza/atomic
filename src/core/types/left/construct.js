import {constructs} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";

export function Left(value){
  this.value = value;
}

Left.prototype[Symbol.toStringTag] = "Left";

export const left = thrush(constructs(Left));
