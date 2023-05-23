import {doto, does, type, comp, identity, constantly, overload, pre, signature, isString, isFunction} from "../../core.js";
import {IMapEntry} from "./instance.js";
import {specify, satisfies} from "../../types/protocol/concrete.js";
import {hashTag} from "../../protocols/ihashable/concrete"; //preassign hashTag to types; useful when lib is loaded crossrealm

export const key = IMapEntry.key;
export const val = IMapEntry.val;

/*#if _CROSSREALM

function uid() {
  const head = (Math.random() * 46656) | 0,
        tail = (Math.random() * 46656) | 0;
  return ("000" + head.toString(36)).slice(-3) + ("000" + tail.toString(36)).slice(-3);
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

function keyed(label){
  const id = uid();
  const key = `${label}-${id}`;
  return function(Type){
    return specify(IMapEntry, {
      key: constantly(key),
      val: constantly(Type)
    }, Type);
  }
}

export function keying(label){
  if (label && !isString(label)) {
    throw new Error("Label must be a string");
  }
  return does(keyed(label), hashTag(), label ? function(Type){
    Type[Symbol.toStringTag] = label;
  } : noop);
}

//#else */

export function is(self, constructor){
  return type(self) === constructor;
}

export function ako(self, constructor){
  return self instanceof constructor;
}

function unkeyed(Type){
  return specify(IMapEntry, {
    key: constantly(Type),
    val: constantly(Type)
  }, Type);
}

export function keying(label){
  if (label && !isString(label)) {
    throw new Error("Label must be a string");
  }
  return does(unkeyed, hashTag(), label ? function(Type){
    Type[Symbol.toStringTag] = label;
  } : noop);
}

//#endif
