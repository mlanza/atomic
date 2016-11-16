import unbind from '../unbind';
import {slice, reverse, reduce, map, filter, find, append, first, rest, initial, identity, always, arity} from '../core';
export {slice, reverse, reduce, map, filter, find, append, first, rest, initial, identity as toArray};
import {extend} from '../protocol';
import {EMPTY} from '../types/empty';
import {concat as _concat} from '../types/concat';
import List from '../types/list';
import Coll from '../protocols/coll';
import Seq from '../protocols/seq';
import Trim from '../protocols/trim';
import Hash from '../protocols/hash';

export const join = unbind(Array.prototype.join);
export const empty = always([]);

export function isEmpty(self){
  return self.length === 0;
}

export function concat(){
  return Coll.toArray(_concat.apply(this, arguments));
}

export function seq(self, at){
  var pos = at || 0;
  return pos < self.length ? new List(self[pos], function(){
    return seq(self, pos + 1);
  }) : EMPTY;
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

export function has(self, key){
  return key > -1 && key < self.length;
}

export function get(self, key){
  return self[key];
}

export function set(self, key, value){
  var arr = slice(self);
  arr.splice(key, 1, value);
  return arr;
}

extend(Hash, Array, {
  has: has,
  get: get,
  set: set
});

extend(Coll, Array, {
  empty: empty,
  isEmpty: isEmpty,
  toArray: identity,
  toObject: toObject,
  first: first,
  rest: rest,
  initial: initial,
  map: map,
  reduce: reduce,
  filter: filter,
  find: find,
  append: append,
  concat: concat
});

extend(Seq, Array, {
  seq: arity(1, seq)
});

extend(Trim, Array, {
  trim: trim
});