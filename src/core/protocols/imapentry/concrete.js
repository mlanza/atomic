import {doto, type, comp, identity, constantly, overload, pre, signature, isString, isFunction} from "../../core.js";
import {IMapEntry} from "./instance.js";
import {specify, satisfies} from "../../types/protocol/concrete.js";

export const key = IMapEntry.key;
export const val = IMapEntry.val;

function unkeyed(Type){
  return specify(IMapEntry, {
    key: constantly(Type),
    val: constantly(Type)
  }, Type);
}

/*#if _CROSSFRAME

function uid() {
  const head = (Math.random() * 46656) | 0,
        tail = (Math.random() * 46656) | 0;
  return ("000" + head.toString(36)).slice(-3) + ("000" + tail.toString(36)).slice(-3);
}

function _keying(named){
  const id = uid();
  const key = `${named}-${id}`;
  return function(Type){
    return specify(IMapEntry, {
      key: constantly(key),
      val: constantly(Type)
    }, Type);
  }
}

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

const _keying = constantly(unkeyed);

export function is(self, constructor){
  return type(self) === constructor;
}

export function ako(self, constructor){
  return self instanceof constructor;
}

//#endif

export const keying = overload(constantly(unkeyed), pre(_keying, signature(isString)));
