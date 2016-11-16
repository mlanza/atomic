import {always, arity, identity, slice, reduce as _reduce} from '../core';
import {extend} from '../protocol';
import List from '../types/list';
import {EMPTY} from '../types/empty';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Associative from '../protocols/associative';
import Reduce from '../protocols/reduce';
import Lookup from '../protocols/lookup';
import Emptyable from '../protocols/emptyable';
import Collection from '../protocols/collection';

export function seq(obj, ks, at){
  var pos = at || 0, keys = ks || Object.keys(obj), key = keys[pos];
  return pos < keys.length ? new List([key, obj[key]], function(){
    return seq(obj, keys, pos + 1);
  }) : null;
}

export function concat(){
  return _reduce(slice(arguments), Object.assign, {});
}

export const empty = always({});

export function reduce(self, f, init){
  return Reduce.reduce(seq(self), f, init);
}

export function first(self){
  return Seq.first(seq(self));
}

export function rest(self){
  return Seq.rest(seq(self));
}

export function hasKey(self, key){
  return self.hasOwnProperty(key);
}

export function lookup(self, key){
  return self[key];
}

export function assoc(self, key, value){
  var obj = Object.assign({}, self);
  obj[key] = value;
  return obj;
}

export function conj(self, pair){
  return assoc(self, pair[0], pair[1]);
}

extend(Collection, Object, {
  conj: conj
});

extend(Reduce, Object, {
  reduce: reduce
});

extend(Emptyable, Object, {
  empty: empty
});

extend(Seqable, Object, {
  seq: arity(1, seq)
});

extend(Lookup, Object, {
  lookup: lookup
});

extend(Associative, Object, {
  hasKey: hasKey,
  assoc: assoc,
});

export default Object;