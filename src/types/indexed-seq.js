import {constantly} from '../core';
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
import DirectedSlice from '../types/directed-slice';
import {iterator, toArray} from '../coll';

export function IndexedSeq(indexed, begin){
  this.indexed = indexed;
  this.begin = begin < 0 ? 0 : begin || 0;
  this.length = this.indexed.length - this.begin;
}

IndexedSeq.prototype[Symbol.iterator] = function(){
  return iterator(this);
}

export function rseq(self){
  return self.indexed.length ? new DirectedSlice(self.indexed, self.indexed.length - 1, self.begin) : self;
}

const empty = constantly([]);

function first(self){
  return self.indexed[self.begin];
}

function rest(self){
  return self.length > 1 ? new IndexedSeq(self.indexed, self.begin + 1) : EMPTY;
}

function count(self){
  return self.length;
}

function nth(self, n){
  var i = self.begin + n;
  return i < self.indexed.length ? self.indexed[i] : null;
}

const get = nth;

function reduce(self, f, init) {
  var memo = init, len = self.length, indexed = self.indexed, begin = self.begin;
  for(var i = 0; i < len; i++) {
    if (memo instanceof Reduced)
      break;
    memo = f(memo, indexed[i + begin]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function reduceKv(self, f, init) {
  var memo = init, len = self.length, indexed = self.indexed, begin = self.begin;
  for(var i = 0; i < len; i++) {
    if (memo instanceof Reduced)
      break;
    memo = f(memo, i, indexed[i + begin]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

function seq(self){
  return self.length ? self : null;
}

function hasKey(self, key){
  return key > -1 && key < self.indexed.length - self.begin;
}

function assoc(self, key, value){
  var arr = slice(self.indexed, self.begin);
  arr.splice(key, 1, value);
  return arr;
}

function dissoc(self, key, value){
  var arr = slice(self.indexed, self.begin);
  arr.splice(key, 1);
  return arr;
}

function append(self, value){
  return Append.append(toArray(self), value);
}

function prepend(self, value){
  return Seqable.seq(self) ? new List(value, self) : new List(value);
}

export default extend(IndexedSeq, Reversible, {
  rseq: rseq
}, Append, {
  append: append
}, Prepend, {
  prepend: prepend
}, Collection, {
  conj: prepend
}, Emptyable, {
  empty: empty
}, Seqable, {
  seq: seq
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