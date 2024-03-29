import {does} from "../../core.js";
import {satisfies} from "../../types/protocol/concrete.js";
import {IHashable} from "./instance.js";
import {IEquiv} from "../iequiv/instance.js";

const cache = Symbol("hashcode");

export function hashTag(){
  const tag = Math.random(0);
  return function(self){
    if (!self[cache]){
      self[cache] = tag;
    }
  }
}

export function hash(self){
  if (self == null) {
    return 0;
  } else if (self.hashCode){
    return self.hashCode();
  } else if (self[cache]) {
    return self[cache];
  }
  const hash = satisfies(IHashable, "hash", self);
  if (hash){
    const hashcode = hash(self);
    return Object.isFrozen(self) ? hashcode : (self[cache] = hashcode);
  } else {
    hashTag()(self);
    return self[cache];
  }
}

function _IsValueObject(maybeValue) { //from ImmutableJS
  return Boolean(maybeValue && typeof maybeValue.equals === 'function' && typeof maybeValue.hashCode === 'function');
}

export function isValueObject(self){
  return (satisfies(IHashable, self) && satisfies(IEquiv, self)) || _IsValueObject(self);
}
