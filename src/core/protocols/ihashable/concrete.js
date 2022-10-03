import {does} from "../../core.js";
import {satisfies} from "../../types/protocol/concrete.js";
import {IHashable} from "./instance.js";
import {IEquiv} from "../iequiv/instance.js";

const cache = Symbol("hashcode");

export function hashTag(){
  const tag = Math.random(0);
  return function(self){
    self[cache] = tag;
  }
}

export function hash(self){
  if (self == null) {
    return 0;
  } else if (self.hashCode){
    return self.hashCode();
  }
  const hash = satisfies(IHashable, "hash", self);
  if (hash){
    if (typeof self === "object"){
      const stored = self[cache];
      if (stored) {
        return stored;
      } else {
        const hashcode = self[cache] = hash(self);
        return hashcode;
      }
    } else {
      return hash(self);
    }
  } else {
    const stored = self[cache];
    if (stored) {
      return stored;
    } else {
      hashTag()(self);
      return self[cache];
    }
  }
}

function _IsValueObject(maybeValue) { //from ImmutableJS
  return Boolean(maybeValue && typeof maybeValue.equals === 'function' && typeof maybeValue.hashCode === 'function');
}

export function isValueObject(self){
  return (satisfies(IHashable, self) && satisfies(IEquiv, self)) || _IsValueObject(self);
}
