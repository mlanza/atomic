import {constructs} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Okay(value){
  this.value = value;
}

Okay.prototype[Symbol.toStringTag] = "Okay";

export const okay = thrush(constructs(Okay));
