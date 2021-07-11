import {doto, comp, constantly, overload, pre, post, signature, isSymbol, isFunction} from "../../core.js";
import {INamable} from "./instance.js";
import {specify, satisfies} from "../../types/protocol/concrete.js";
import {Nil} from "../../types/nil/construct.js";
import Symbol from "symbol";

export const name = INamable.name;

export function type(self){
  return self == null ? Nil : self.constructor;
}

const what1 = post(comp(name, type), isSymbol);

//e.g. what([], Array) === true
function what2(self, type){
  return what1(self) === name(type);
}

export const what = overload(null, what1, what2);

export const naming = pre(function naming(type, symbol){
  if (!satisfies(INamable, type) || typeof name(type) !== "symbol") {
    doto(type, specify(INamable, {name: constantly(symbol)}));
  }
}, signature(isFunction, isSymbol));
