import {does} from "../../core.js";
import {implement, satisfies} from "../../types/protocol/concrete.js";
import {IHashable} from "./instance.js";
import {IEquiv} from "../iequiv/instance.js";
import {map, sort} from "../../types/lazy-seq/concrete.js";
import {keys} from "../../protocols/imap/concrete.js";
import {get} from "../../protocols/ilookup/concrete.js";
import {reduce} from "../ireduce.js";
import Symbol from "symbol";
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

export function hashSeq(hs){
  return reduce(function(h1, h2){
    return 3 * h1 + h2;
  }, 0, map(hash, hs));
}

export function hashKeyed(self){
  return reduce(function(memo, key){
    return hashSeq([memo, key, get(self, key)]);
  }, 0, sort(keys(self)));
}
