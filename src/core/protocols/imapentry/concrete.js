import {doto, type, comp, identity, constantly, overload, pre, signature, isString, isFunction} from "../../core.js";
import {IMapEntry} from "./instance.js";
import {specify, satisfies} from "../../types/protocol/concrete.js";
import {moniker} from "../../types/moniker/construct.js";

export const key = IMapEntry.key;
export const val = IMapEntry.val;

/*#if _CROSSFRAME

export const keying = pre(function keying(nm){
  return function(Type){
    return specify(IMapEntry, {
      key: constantly(moniker(nm)),
      val: constantly(Type)
    }, Type);
  }
}, signature(isString));

const is1 = comp(key, type);

function is2(self, type){
  return is1(self) === key(type) && self !== type;
}

export const is = overload(null, is1, is2);

export function ako(self, type){
  const proto = self ? self.__proto__ : null;
  return is2(self, type) || (proto && ako(proto, type));
}

//#else */

export const keying = pre(function keying(nm){
  return function(Type){
    return specify(IMapEntry, {
      key: constantly(Type),
      val: constantly(Type)
    }, Type);
  }
}, signature(isString));

export function is(self, constructor){
  return type(self) === constructor;
}

export function ako(self, constructor){
  return self instanceof constructor;
}

//#endif
