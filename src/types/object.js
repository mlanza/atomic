import {constantly, arity, identity} from '../core';
import {extend} from '../protocol';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Associative from '../protocols/associative';
import Reduce from '../protocols/reduce';
import Lookup from '../protocols/lookup';
import Emptyable from '../protocols/emptyable';
import Collection from '../protocols/collection';
import Append from '../protocols/append';
import {EMPTY} from '../types/empty';
import LazyList from '../types/lazy-list';
import IndexedSeq from '../types/indexed-seq';

function seq(obj, ks, at){
  if (obj && obj.hasOwnProperty("callee") && obj.hasOwnProperty("length")) return obj.length ? new IndexedSeq(obj) : null; //arguments object
  var pos = at || 0, keys = ks || Object.keys(obj), key = keys[pos];
  return pos < keys.length ? new LazyList([key, obj[key]], function(){
    return seq(obj, keys, pos + 1) || EMPTY;
  }) : null;
}

function reduce(self, f, init){
  return Reduce.reduce(seq(self), f, init);
}

function first(self){
  return Seq.first(seq(self));
}

function rest(self){
  return Seq.rest(seq(self));
}

function hasKey(self, key){
  return self.hasOwnProperty(key);
}

function get(self, key){
  return self[key];
}

function assoc(self, key, value){
  var obj = Object.assign({}, self);
  obj[key] = value;
  return obj;
}

function append(self, pair){
  return assoc(self, pair[0], pair[1]);
}

export default extend(Object, Collection, {
  conj: append
}, Append, {
  append: append
}, Reduce, {
  reduce: reduce
}, Emptyable, {
  empty: constantly({})
}, Seqable, {
  seq: arity(1, seq)
}, Lookup, {
  get: get
}, Associative, {
  hasKey: hasKey,
  assoc: assoc,
});