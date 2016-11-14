import {always, arity, identity} from './core';
import {extend} from './protocol';
import Cons from './cons';
import Coll from './protocols/coll';
import Clone from './protocols/clone';
import Seq from './protocols/seq';
import Hash from './protocols/hash';

export function seq(obj, ks, at){
  var pos = at || 0, keys = ks || Object.keys(obj), key = keys[pos];
  return pos < keys.length ? new Cons([key, obj[key]], function(){
    return seq(obj, keys, pos + 1);
  }) : null;
}

export function append(self, pair){
  var kv = {};
  kv[pair[0]] = pair[1];
  return Object.assign({}, self, kv);
}

export const empty = always({});

export function toArray(self){
  return Coll.toArray(seq(self));
}

export function reduce(self, f, init){
  return Coll.reduce(seq(self), f, init);
}

export function map(self, f){
  return reduce(self, function(memo, pair){
    var mod = f(pair);
    memo[mod[0]] = mod[1];
    return memo;
  }, {});
}

export function filter(self, pred){
  return Coll.toObject(Coll.filter(seq(self), pred));
}

export function find(self, pred){
  return Coll.toObject(Coll.find(seq(self), pred));
}

export function isEmpty(self){
  return Object.keys(self).length === 0;
}

export function clone(self){
  return Object.assign({}, self);
}

export function has(self, key){
  return self.hasOwnProperty(key);
}

export function get(self, key){
  return self[key];
}

export function set(self, key, value){
  var cloned = clone(self);
  cloned[key] = value;
  return cloned;
}

extend(Coll, {
  empty: empty,
  isEmpty: isEmpty,
  toArray: toArray,
  toObject: identity,
  reduce: reduce,
  map: map,
  filter: filter,
  find: find,
  append: append
}, Object);

extend(Seq, {
  seq: arity(1, seq)
}, Object);

extend(Clone, {
  clone: clone
}, Object);

extend(Hash, {
  has: has,
  get: get,
  set: set
}, Object);