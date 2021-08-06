import {doto, type, comp, constantly, overload, pre, signature, isSymbol, isFunction} from "../../core.js";
import {INamable} from "./instance.js";
import {specify, satisfies} from "../../types/protocol/concrete.js";
import Symbol from "symbol";

export const name = INamable.name;

export const naming = pre(function naming(type, symbol){
  doto(type, specify(INamable, {name: constantly(symbol)}));
}, signature(isFunction, isSymbol));

/*#if _CROSSFRAME

const is1 = comp(name, type);

function is2(self, type){
  return is1(self) === name(type) && self !== type;
}

export const is = overload(null, is1, is2);

export function ako(self, type){
  const proto = self ? self.__proto__ : null;
  return is2(self, type) || (proto && ako(proto, type));
}

//#else */

export function is(self, constructor){
  return type(self) === constructor;
}

export function ako(self, constructor){
  return self instanceof constructor;
}

//#endif
