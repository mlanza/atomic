import {always, arity, identity, slice, reduce as _reduce} from '../core';
import {extend} from '../protocol';
import List from '../types/list';
import {EMPTY} from '../types/empty';
import Coll from '../protocols/coll';
import Seq from '../protocols/seq';
import Hash from '../protocols/hash';

export function seq(obj, ks, at){
  var pos = at || 0, keys = ks || Object.keys(obj), key = keys[pos];
  return pos < keys.length ? new List([key, obj[key]], function(){
    return seq(obj, keys, pos + 1);
  }) : EMPTY;
}

export function concat(){
  return _reduce(slice(arguments), Object.assign, {});
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

export function first(self){
  return Coll.reduce(Coll.first(seq(self)), Coll.append, {});
}

export function rest(self){
  return Coll.reduce(Coll.rest(seq(self)), Coll.append, {});
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

export function has(self, key){
  return self.hasOwnProperty(key);
}

export function get(self, key){
  return self[key];
}

export function set(self, key, value){
  var obj = Object.assign({}, self);
  obj[key] = value;
  return obj;
}

extend(Coll, Object, {
  empty: empty,
  isEmpty: isEmpty,
  toArray: toArray,
  toObject: identity,
  first: first,
  rest: rest,
  reduce: reduce,
  map: map,
  filter: filter,
  find: find,
  append: append,
  concat: concat
});

extend(Seq, Object, {
  seq: arity(1, seq)
});

extend(Hash, Object, {
  has: has,
  get: get,
  set: set
});