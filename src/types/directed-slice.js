import {constantly, identity, slice as _slice} from '../core';
import {extend} from '../protocol';
import Seq from '../protocols/seq';
import Counted from '../protocols/counted';
import Indexed from '../protocols/indexed';
import Reduce from '../protocols/reduce';
import ReduceKv from '../protocols/reduce-kv';
import Seqable from '../protocols/seqable';
import Emptyable from '../protocols/emptyable';
import Lookup from '../protocols/lookup';
import Associative from '../protocols/associative';
import Collection from '../protocols/collection';
import Append from '../protocols/append';
import Prepend from '../protocols/prepend';
import Reversible from '../protocols/reversible';
import {EMPTY} from '../types/empty';
import Reduced from '../types/reduced';
import List from '../types/list';
import {iterator, concat, into} from '../coll';

export function DirectedSlice(indexed, begin, end){
  this.indexed = indexed;
  this.begin = begin == null ? 0 : begin;
  this.end = end == null ? indexed.length - 1 : end;
  this.length = Math.abs(this.end - this.begin) + 1;
  this.step = this.begin < this.end ? 1 : -1;
}

DirectedSlice.prototype[Symbol.iterator] = function(){
  return iterator(this);
}

function rseq(self){
  return self.end === self.begin ? self : new DirectedSlice(self.indexed, self.end, self.begin);
}

export function slice(indexed, begin, end){
  return begin < end ? new DirectedSlice(indexed, begin, end) : EMPTY;
}

const empty = constantly([]);

function first(self){
  return self.indexed[self.begin];
}

function rest(self){
  return self.length > 1 ? new DirectedSlice(self.indexed, self.begin + self.step, self.end) : EMPTY;
}

function count(self){
  return self.length;
}

function nth(self, n){
  return n < self.length ? self.indexed[self.begin + (n * self.step)] : null;
}


function get(self, key){
  return self.indexed[key];
}

function reduce(self, f, init) {
  var memo = init, len = self.length, indexed = self.indexed, begin = self.begin, step = self.step;
  for(var i = 0; i < len; i++) {
    if (memo instanceof Reduced)
      break;
    memo = f(memo, indexed[begin + (i * step)]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function reduceKv(self, f, init) {
  var memo = init, len = self.length, indexed = self.indexed, begin = self.begin, step = self.step;
  for(var i = 0; i < len; i++) {
    if (memo instanceof Reduced)
      break;
    memo = f(memo, i, indexed[begin + (i * step)]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function hasKey(self, key){
  return key > -1 && key < self.length;
}

function assoc(self, key, value){
  // return into([], concat(take(key, self), [value], drop(key + 1, self))); //TODO take/drop protocol?
  var indexed = into([], self);
  indexed.splice(key, 1, value);
  return indexed;
}

function dissoc(self, key){
  //return into([], concat(take(key, self), drop(key + 1, self)));
  var indexed = into([], self);
  indexed.splice(key, 1);
  return indexed;
}

function append(self, value){
  return into([], self).concat([value]);
}

function prepend(self, value){
  return [value].concat(into([], self));
}

export default extend(DirectedSlice, Append, {
  append: append
}, Prepend, {
  prepend: prepend
}, Collection, {
  conj: prepend
}, Emptyable, {
  empty: empty
}, Seqable, {
  seq: identity
}, Seq, {
  first: first,
  rest: rest
}, Counted, {
  count: count
}, Indexed, {
  nth: nth
}, Lookup, {
  get: get
}, Associative, {
  assoc: assoc,
  dissoc: dissoc,
  hasKey: hasKey
}, Reduce, {
  reduce: reduce
}, ReduceKv, {
  reduceKv: reduceKv
});