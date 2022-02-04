import {does} from "../../core.js";
import {satisfies} from "../../types/protocol/concrete.js";
import {IHashable} from "./instance.js";
import {IEquiv} from "../iequiv/instance.js";
import * as h from "hash";

const cache = Symbol("hashcode");

export function hash(self){
  const hash = satisfies(IHashable, "hash", self) || h.hash;
  if (typeof self === "object"){
    const stored = self[cache];
    if (stored) {
      return stored;
    } else {
      const hashcode = self[cache] = hash(self);
      Object.freeze(self); //Danger! Will Robinson.  The object must remain immutable!
      return hashcode;
    }
  } else {
    return hash(self);
  }
}

export function isValueObject(self){
  return (satisfies(IHashable, self) && satisfies(IEquiv, self)) || h.isValueObject(self);
}
