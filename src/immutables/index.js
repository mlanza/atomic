import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import * as imm from "immutable";
import {set} from "./types/set/construct.js";
import {map} from "./types/map/construct.js";
import {IHash} from "./protocols/ihash/instance.js";
import Symbol from "symbol";

export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
import * as p from "./protocols/concrete.js";

function memoize2(f, hash){
  const c = Symbol("cache");
  return function(self){
    const cache  = self[c] || map(),
          key    = hash.apply(self, arguments),
          result = _.contains(cache, key) ? _.get(cache, key) : f.apply(self, arguments);
    self[c] = _.assoc(cache, key, result);
    return result;
  }
}

function memoize1(f){
  return memoize2(f, function(self, ...args){
    return args;
  });
}

export const memoize = _.overload(null, memoize1, memoize2);

(function(){

  function persistent(self){
    return set(_.toArray(self));
  }

  _.doto(mut.TransientSet,
    _.implement(mut.IPersistent, {persistent}));

})();

const cache = Symbol.for("hashCode");

function cachedHashCode(){
  const result = this[cache] || p.hash(this);
  if (!Object.isFrozen(this) && this[cache] == null) {
    this[cache] = result;
  }
  return result;
}

function hashCode(){
  return p.hash(this);
}

function equals(other){
  return _.equiv(this, other);
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
  return _.implement(IHash, {hash});
}

export function hashed(hs){
  return _.reduce(function(h1, h2){
    return 3 * h1 + h2;
  }, 0, hs);
}

export function hashing(os){
  return hashed(_.map(p.hash, os));
}

(function(){

  function hash(self){
    return self.valueOf();
  }

  _.each(_.implement(IHash, {hash}),
    [Date]);

})();

(function(){

  _.each(_.implement(IHash, {hash: hashing}),
    [Array, _.Concatenated, _.List, _.EmptyList]);

})();

(function(){

  _.each(_.implement(IHash, {hash: _.constantly(imm.hash(null))}),
    [_.Nil]);

})();

(function(){

  const seed = _.generate(_.positives);
  const uniques = _.weakMap();

  function hash(self){
    if (!uniques.has(self)) {
      uniques.set(self, seed());
    }
    return uniques.get(self);
  }

  _.each(_.implement(IHash, {hash}),
    [Function]);

})();

(function(){

  function hash(self){
    return _.reduce(function(memo, key){
      return hashing([memo, key, _.get(self, key)]);
    }, 0, _.sort(_.keys(self)));
  }

  _.each(_.implement(IHash, {hash}),
    [Object, _.AssociativeSubset, _.Indexed, _.IndexedSeq]);

})();

(function(){

  _.each(_.implement(IHash, {hash: imm.hash}),
    [String, Number, Boolean]);

})();

(function(){

  function hash(self){
    return p.hash(self.id);
  }

  _.each(_.implement(IHash, {hash}), [_.GUID, _.UID]);

})();
