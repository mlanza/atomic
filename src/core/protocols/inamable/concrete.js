import {doto, constantly, overload, pre, post} from "../../core.js";
import {INamable} from "./instance.js";
import {specify} from "../../types/protocol/concrete.js";
import {comp} from "../../types/function/concrete.js";
import {Nil} from "../../types/nil/construct.js";
import Symbol from "symbol";

export const name = INamable.name;

export function isSymbol(self){
  return typeof self === "symbol";
}

function hasSymbolicName(f, symbol){
  return typeof f === "function" && typeof symbol === "symbol";
}

export function type(self){
  return self == null ? Nil : self.constructor;
}

//tool for overcoming cross-frame type checking
// see: https://github.com/mrdoob/three.js/issues/5886
// see: http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
const what1 = post(comp(name, type), isSymbol);

//e.g. what([], Array) === true
function what2(self, type){
  return what1(self) === name(type);
}

export const what = overload(null, what1, what2);

export const naming = pre(function naming(type, symbol){
  if (typeof name(type) !== "symbol") {
    doto(type, specify(INamable, {name: constantly(symbol)}));
  }
}, hasSymbolicName);
