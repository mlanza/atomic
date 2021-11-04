import {overload, constructs, partial} from "../../core.js";
import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";
import Symbol from "symbol";

export function Okay(value){
  this.value = value;
}

Okay.prototype[Symbol.toStringTag] = "Okay";

const okay1 = constructs(Okay);

export const okay = overload(null, okay1, partial(thrush, okay1));
