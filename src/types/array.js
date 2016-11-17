import unbind from '../unbind';
import {slice, reverse, reduce, append as conj, identity, constantly, arity} from '../core';
export {slice, reverse, reduce, conj};
import {extend} from '../protocol';
import {EMPTY} from '../types/empty';
import Next from '../protocols/next';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Counted from '../protocols/counted';
import Indexed from '../protocols/indexed';
import Reduce from '../protocols/reduce';
import Emptyable from '../protocols/emptyable';
import Lookup from '../protocols/lookup';
import Associative from '../protocols/associative';
import Collection from '../protocols/collection';

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

function next(self){
  return self.length === 0 ? null : rest(self);
}

function hasKey(self, key){
  return key > -1 && key < self.length;
}

function assoc(self, key, value){
  var arr = slice(self);
  arr.splice(key, 1, value);
  return arr;
}

extend(Collection, Array, {
  conj: conj
});

extend(Lookup, Array, {
  lookup: nth
});

extend(Associative, Array, {
  assoc: assoc,
  hasKey: hasKey
});

extend(Emptyable, Array, {
  empty: constantly([])
});

extend(Seqable, Array, {
  seq: seq
});

extend(Next, Array, {
  next: next
});

extend(Seq, Array, {
  first: first,
  rest: rest
});

extend(Counted, Array, {
  count: count
});

extend(Indexed, Array, {
  nth: nth
});

extend(Reduce, Array, {
  reduce: reduce
});

export default Array;