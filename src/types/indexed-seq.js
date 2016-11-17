import {identity, constantly, partial} from '../core';
import {extend} from '../protocol';
import {EMPTY} from '../types/empty';
import Reduced from '../types/reduced';
import List from '../types/list';
import Next from '../protocols/next';
import Seq from '../protocols/seq';
import Counted from '../protocols/counted';
import Indexed from '../protocols/indexed';
import Reduce from '../protocols/reduce';
import Seqable from '../protocols/seqable';
import Emptyable from '../protocols/emptyable';
import Lookup from '../protocols/lookup';
import Associative from '../protocols/associative';
import Collection from '../protocols/collection';
import Deref from '../protocols/deref';

export function IndexedSeq(indexed, start){
  this.indexed = indexed;
  this.start = start < 0 ? 0 : start || 0;
}

export function indexedSeq(indexed, start){
  return new IndexedSeq(indexed, start);
}

const empty = constantly(indexedSeq([]));

function next(self){
  var start = self.start + 1;
  return start < self.indexed.length ? new IndexedSeq(self.indexed, start) : null;
}

function first(self){
  return self.indexed[self.start];
}

function rest(self){
  var start = self.start + 1;
  return start < self.indexed.length ? new IndexedSeq(self.indexed, start) : EMPTY;
}

function count(self){
  return self.indexed.length - self.start;
}

function nth(self, n){
  var i = self.start + n;
  return i < self.indexed.length ? self.indexed[i] : null;
}

const get = nth;

function reduce(self, f, init) {
  var memo = init, len = self.indexed.length;
  for(var i = self.start; i < len; i++) {
    if (memo instanceof Reduced)
      break;
    memo = f(memo, self.indexed[i]);
  }
  return Deref.deref(memo);
}

function seq(self){
  return self.start < self.indexed.length ? self : nil;
}

function hasKey(self, key){
  return key > -1 && key < self.indexed.length - self.start;
}

function assoc(self, key, value){
  var arr = slice(self.indexed, self.start);
  arr.splice(key, 1, value);
  return arr;
}

function conj(self, value){
  return Seqable.seq(self) ? new List(value, self) : [value];
}

extend(Collection, IndexedSeq, {
  conj: conj
});

extend(Emptyable, IndexedSeq, {
  empty: empty
});

extend(Seqable, IndexedSeq, {
  seq: seq
});

extend(Next, IndexedSeq, {
  next: next
});

extend(Seq, IndexedSeq, {
  first: first,
  rest: rest
});

extend(Counted, IndexedSeq, {
  count: count
});

extend(Indexed, IndexedSeq, {
  nth: nth
});

extend(Lookup, IndexedSeq, {
  get: get
});

extend(Associative, IndexedSeq, {
  assoc: assoc,
  hasKey: hasKey
});

extend(Reduce, IndexedSeq, {
  reduce: reduce
});

export default IndexedSeq;