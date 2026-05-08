import {does, type, comp, identity, constantly, overload, pre, signature, isString, isFunction} from "../../core.js";
import {IMapEntry} from "./instance.js";
import {specify, satisfies} from "../../types/protocol/concrete.js";
import {hashTag} from "../../protocols/ihashable/concrete"; //preassign hashTag to types; useful when lib is loaded crossrealm

export const key = IMapEntry.key;
export const val = IMapEntry.val;

/*#if _CROSSREALM

const kind = Symbol("kind");

function uid(random = Math.random) {
  const head = (random() * 46656) | 0,
        tail = (random() * 46656) | 0;
  return ("000" + head.toString(36)).slice(-3) + ("000" + tail.toString(36)).slice(-3);
}

const is1 = type;

function is2(self, type){
  return is1(self)[kind] === type[kind] && self !== type;
}

export const is = overload(null, is1, is2);

export function ako(self, type){
  const proto = self ? self.__proto__ : null;
  return is2(self, type) || (proto && ako(proto, type));
}

function keyed(label, random = Math.random){
  const id = `${label}-${uid(random)}`;
  return function(Type){
    Type[kind] = id;
  }
}

export function keying(label, random = Math.random){
  if (!isString(label)) {
    throw new Error("Label must be a string");
  }
  return does(keyed(label, random), hashTag(), label ? function(Type){
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

export function keying(label, random = Math.random){
  if (!isString(label)) {
    throw new Error("Label must be a string");
  }
  return does(hashTag(random), label ? function(Type){
    Type[Symbol.toStringTag] = label;
  } : noop);
}

//#endif
