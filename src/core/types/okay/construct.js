import {overload} from "../../core.js";
import {IReduce, IFunctor} from "../../protocols.js";
import {isError} from "../error/concrete.js";
import Symbol from "symbol";

export function Okay(value){
  this.value = value;
}

Okay.prototype[Symbol.toStringTag] = "Okay";

export function okay(x){
  return isError(x) ? x : new Okay(x);
}
