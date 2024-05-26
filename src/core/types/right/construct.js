import {constructs} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";
import {left} from "../left/construct.js";

export function Right(value){
  this.value = value;
}

Right.prototype[Symbol.toStringTag] = "Right";

export const right = thrush(constructs(Right));

export function result(value){
  return value instanceof Error ? left(value) : right(value);
}
