import {doto, overload, implement, generate, positives, weakMap, toArray, constantly, reduce, str, map, each, assoc, get, contains, keys, sort, IEquiv, ICounted, IMap} from "atomic/core";
import {GUID, AssociativeSubset, Concatenated, EmptyList, List, Indexed, IndexedSeq, Nil} from "atomic/core";
import {IPersistent, TransientSet} from "atomic/transients";
import {set} from "./types/set/construct.js";
import {map as _map} from "./types/map/construct.js";
import {IHash} from "./protocols/ihash/instance.js";
import Symbol from "symbol";
import * as imm from "immutable";

export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";

function memoize2(f, hash){
  const c = Symbol("cache");
  return function(self){
    const cache  = self[c] || _map(),
          key    = hash.apply(self, arguments),
          result = contains(cache, key) ? get(cache, key) : f.apply(self, arguments);
    self[c] = assoc(cache, key, result);
    return result;
  }
}

function memoize1(f){
  return memoize2(f, function(self, ...args){
    return args;
  });
}

export const memoize = overload(null, memoize1, memoize2);

(function(){

  function persistent(self){
    return set(toArray(self));
  }

  doto(TransientSet,
    implement(IPersistent, {persistent}));

})();

const cache = Symbol.for("hashCode");

function cachedHashCode(){
  const result = this[cache] || IHash.hash(this);
  if (!Object.isFrozen(this) && this[cache] == null) {
    this[cache] = result;
  }
  return result;
}

function hashCode(){
  return IHash.hash(this);
}

function equals(other){
  return IEquiv.equiv(this, other);
}

function addProp(obj, key, value){
  if (obj.hasOwnProperty(key)) {
    throw new Error("Property `" + key + "` already defined on " + obj.constructor.name + ".");
  } else {
    Object.defineProperty(obj, key, {
      value,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
}

// There be dragons! Integrate with Immutable. Object literals despite their use elsewhere are, in this world, immutable.
addProp(Object.prototype, "hashCode", cachedHashCode);
addProp(Object.prototype, "equals", equals);
addProp(Number.prototype, "hashCode", hashCode);
addProp(String.prototype, "hashCode", hashCode);

export function hashable(){
  function hash(self){
    const content = [self.constructor.name], keys = Object.keys(self);
    for(let key of keys){
      content.push(key, self[key]);
    }
    return hashing(content);
  }
  return implement(IHash, {hash});
}

export function hashed(hs){
  return reduce(function(h1, h2){
    return 3 * h1 + h2;
  }, 0, hs);
}

export function hashing(os){
  return hashed(map(IHash.hash, os));
}

(function(){

  function hash(self){
    return self.valueOf();
  }

  each(implement(IHash, {hash}),
    [Date]);

})();

(function(){

  each(implement(IHash, {hash: hashing}),
    [Array, Concatenated, List, EmptyList]);

})();

(function(){

  each(implement(IHash, {hash: constantly(imm.hash(null))}),
    [Nil]);

})();

(function(){

  const seed = generate(positives);
  const uniques = weakMap();

  function hash(self){
    if (!uniques.has(self)) {
      uniques.set(self, seed());
    }
    return uniques.get(self);
  }

  each(implement(IHash, {hash}),
    [Function]);

})();

(function(){

  function hash(self){
    return reduce(function(memo, key){
      return hashing([memo, key, get(self, key)]);
    }, 0, sort(keys(self)));
  }

  each(implement(IHash, {hash}),
    [Object, AssociativeSubset, Indexed, IndexedSeq]);

})();

(function(){

  each(implement(IHash, {hash: imm.hash}),
    [String, Number, Boolean]);

})();

(function(){

  function hash(self){
    return IHash.hash(self.id);
  }

  doto(GUID,
    implement(IHash, {hash}));

})();