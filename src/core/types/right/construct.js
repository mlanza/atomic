import {constructs} from "../../core.js";
import {thrush} from "../../protocols/ifunctor/concrete.js";
import {is} from "../../protocols/imapentry/concrete.js";
import {Left} from "../../types/left/construct.js";
import Symbol from "symbol";

export function Right(value){
  this.value = value;
}

Right.prototype[Symbol.toStringTag] = "Right";

export const right = thrush(constructs(Right));

export function isEither(obj){
  return is(obj, Right) || is(obj, Left);
}
