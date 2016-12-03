import unbind from '../unbind';
import {slice, partial, reduce, reduceKv, identity, constantly} from '../core';
import {detect, eq} from '../coll';
export {slice, reduce, reduceKv};
import {extend} from '../protocol';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Counted from '../protocols/counted';
import Indexed from '../protocols/indexed';
import Reduce from '../protocols/reduce';
import ReduceKv from '../protocols/reduce-kv';
import Emptyable from '../protocols/emptyable';
import Reversible from '../protocols/reversible';
import Lookup from '../protocols/lookup';
import Equiv from '../protocols/equiv';
import Associative from '../protocols/associative';
import Collection from '../protocols/collection';
import Append from '../protocols/append';
import Prepend from '../protocols/prepend';
import {EMPTY} from '../types/empty';
import DirectedSlice from '../types/directed-slice';
import {equivSeq} from '../coll';

export const join = unbind(Array.prototype.join);

export function rseq(self){
  return self.length ? new DirectedSlice(self, self.length - 1, 0) : self;
}

function first(self){
  return self[0];
}

function rest(self){
  return slice(self, 1);
}

function seq(self){
  return self.length === 0 ? null : self;
}

function count(self){
  return self.length;
}

function nth(self, n){
  return n < self.length ? self[n] : null;
}

function get(self, key){
  return self[key];
}

function hasKey(self, key){
  return key > -1 && key < self.length;
}

function assoc(self, key, value){
  var arr = slice(self);
  arr.splice(key, 1, value);
  return arr;
}

function dissoc(self, key){
  var arr = slice(self);
  arr.splice(key, 1);
  return arr;
}

function append(self, value){
  return self.concat([value]);
}

function prepend(self, value){
  return [value].concat(self);
}

function has(self, value){
  return detect(partial(eq, value), self);
}

export default extend(Array, Reversible, {
  rseq: rseq
}, Equiv, {
  equiv: equivSeq
}, Append, {
  append: append
}, Prepend, {
  prepend: prepend
}, Collection, {
  conj: append,
  has: has
}, Lookup, {
  get: get
}, Associative, {
  assoc: assoc,
  dissoc: dissoc,
  hasKey: hasKey
}, Emptyable, {
  empty: constantly([])
}, Seqable, {
  seq: seq
}, Seq, {
  first: first,
  rest: rest
}, Counted, {
  count: count
}, Indexed, {
  nth: nth
}, Reduce, {
  reduce: reduce
}, ReduceKv, {
  reduceKv: reduceKv
});