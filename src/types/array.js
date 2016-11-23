import unbind from '../unbind';
import {slice, reverse, reduce, reduceKV, identity, constantly} from '../core';
export {slice, reverse, reduce, reduceKV};
import {extend} from '../protocol';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Counted from '../protocols/counted';
import Indexed from '../protocols/indexed';
import Reduce from '../protocols/reduce';
import ReduceKV from '../protocols/reduce-kv';
import Emptyable from '../protocols/emptyable';
import Lookup from '../protocols/lookup';
import Associative from '../protocols/associative';
import Collection from '../protocols/collection';
import Append from '../protocols/append';
import Prepend from '../protocols/prepend';
import {EMPTY} from '../types/empty';

export const join = unbind(Array.prototype.join);

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

function hasKey(self, key){
  return key > -1 && key < self.length;
}

function assoc(self, key, value){
  var arr = slice(self);
  arr.splice(key, 1, value);
  return arr;
}

function append(self, value){
  return self.concat([value]);
}

function prepend(self, value){
  return [value].concat(self);
}

export default extend(Array, Append, {
  append: append
}, Prepend, {
  prepend: prepend
}, Collection, {
  conj: append
}, Lookup, {
  get: nth
}, Associative, {
  assoc: assoc,
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
}, ReduceKV, {
  reduceKV: reduceKV
});