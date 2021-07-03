import {type, doto, constantly, overload, pre, post} from "../../core.js";
import {INamable} from "./instance.js";
import {specify} from "../../types/protocol/concrete.js";
import Symbol from "symbol";

export const name = INamable.name;

export function isSymbol(self){
  return typeof self === "symbol";
}

function hasSymbolicName(f, symbol){
  return typeof f === "function" && typeof symbol === "symbol";
}

//tool for overcoming cross-frame type checking
// see: https://github.com/mrdoob/three.js/issues/5886
// see: http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
export const what = post(function what(self){
  return self == null ? null : name(type(self));
}, isSymbol);

export const naming = pre(function naming(type, symbol){
  if (typeof name(type) !== "symbol") {
    doto(type, specify(INamable, {name: constantly(symbol)}));
  }
}, hasSymbolicName);
