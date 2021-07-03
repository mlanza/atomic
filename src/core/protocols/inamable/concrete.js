import {type, doto, constantly, overload, pre} from "../../core.js";
import {INamable} from "./instance.js";
import {specify} from "../../types/protocol/concrete.js";
import Symbol from "symbol";

export const name = INamable.name;

//tool for overcoming cross-frame type checking
// see: https://github.com/mrdoob/three.js/issues/5886
// see: http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
export function what(self){
  return self == null ? null : name(type(self));
}

function hasSymbolicName(f, symbol){
  return typeof f === "function" && typeof symbol === "symbol";
}

export const naming = pre(function naming(type, symbol){
  if (typeof name(type) !== "symbol") {
    doto(type, specify(INamable, {name: constantly(symbol)}));
  }
}, hasSymbolicName);
