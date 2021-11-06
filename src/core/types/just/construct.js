import {thrush, pipeline} from "../../protocols/ifunctor/concrete.js";
import {none} from "../none/construct.js";
import {is} from "../../protocols/imapentry/concrete.js";
import {None} from "../none/construct.js";
import Symbol from "symbol";

export function Just(value){
  this.value = value;
}

Just.prototype[Symbol.toStringTag] = "Just";

function maybe1(value){
  return value == null ? none : new Just(value);
}

export function isMaybe(obj){
  return is(obj, Just) || is(obj, None);
}

export const maybe = thrush(maybe1);
export const opt = pipeline(maybe1);
