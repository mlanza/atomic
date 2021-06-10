import {overload} from "../../core.js";
import {IReduce, IFunctor} from "../../protocols.js";
import {isError} from "../error/construct.js";

export function Okay(value){
  this.value = value;
}

export function okay(x){
  return isError(x) ? x : new Okay(x);
}

export function isOkay(x){
  return x instanceof Okay;
}