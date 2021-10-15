import {IHash} from "./instance.js";
import {does} from "../../core.js";
import {implement, satisfies} from "../../types/protocol/concrete.js";
import {map, sort} from "../../types/lazy-seq/concrete.js";
import {keys} from "../../protocols/imap/concrete.js";
import {get} from "../../protocols/ilookup/concrete.js";
import {reduce} from "../ireduce.js";
import Symbol from "symbol";
import {hash as _hash} from "hash";
import {IEquiv} from "../iequiv/instance.js";
const cache = Symbol("hashcode");

export function hash(self){
  const h = satisfies(IHash, "hash", self) || _hash;
  if (typeof self === "object"){
    const stored = self[cache];
    if (stored) {
      return stored;
    } else {
      const hashcode = self[cache] = h(self);
      Object.freeze(self); //Danger! Will Robinson.  The object must remain immutable!
      return hashcode;
    }
  } else {
    return h(self);
  }
}

export function isValueObject(self){
  return satisfies(IHash, self) && satisfies(IEquiv, self);
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
