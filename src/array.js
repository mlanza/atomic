import unbind from './unbind';
import {slice, reverse, reduce, map, filter, find, append, identity, always, arity} from './core';
export {slice, reverse, reduce, map, filter, find, append, identity as toArray};
import {extend} from './protocol';
import {Cons} from './cons';
import Coll from './protocols/coll';
import Seq from './protocols/seq';
import Trim from './protocols/trim';
import Clone from './protocols/clone';
import Hash from './protocols/hash';

export const join = unbind(Array.prototype.join);
export const empty = always([]);

export function isEmpty(self){
  return self.length === 0;
}

export function seq(self, at){
  var pos = at || 0;
  return pos < self.length ? new Cons(self[pos], function(){
    return seq(self, pos + 1);
  }) : null;
}

//TODO invent another type called Pairs or just use raw data?
export function toObject(self){
  return reduce(self, function(memo, pair){
    memo[pair[0]] = pair[1];
    return memo;
  }, {});
}

export function trim(self){
  return filter(self, identity);
}

export const clone = arity(1, slice);

export function has(self, key){
  return key > -1 && key < self.length;
}

export function get(self, key){
  return self[key];
}

export function set(self, key, value){
  var cloned = clone(self);
  cloned[key] = value;
  return cloned;
}

extend(Hash, {
  has: has,
  get: get,
  set: set
}, Array);

extend(Coll, {
  empty: empty,
  isEmpty: isEmpty,
  toArray: identity,
  toObject: toObject,
  map: map,
  reduce: reduce,
  filter: filter,
  find: find,
  append: append
}, Array);

extend(Seq, {
  seq: arity(1, seq)
}, Array);

extend(Trim, {
  trim: trim
}, Array);

extend(Clone, {
  clone: clone
}, Array);