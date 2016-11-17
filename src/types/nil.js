import {identity, constantly, noop} from '../core';
import List from '../types/list';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Seq from '../protocols/seq';
import Next from '../protocols/next';
import Reduce from '../protocols/reduce';
import Deref from '../protocols/deref';
import Collection from '../protocols/collection';
import {extend} from '../protocol';
import {EMPTY} from '../types/empty.js';

export const rest = constantly(EMPTY);
export const first = constantly(null);
export const next = constantly(null);
export const deref = constantly(null);

export function set(self, key, value){
  return Hash.set({}, key, value);
}

export const has = constantly(false);

export function isNil(value){
  return null == value;
}

export function reduce(){
  return arguments[2];
}

export const hasKey = constantly(false);

export function assoc(self, key, value){
  var obj = {};
  obj[key] = value;
  return obj;
}

export function conj(self, value){
  return new List(value, constantly(EMPTY));
}

extend(Deref, null, {
  deref: deref
});

extend(Collection, null, {
  conj: conj
});

extend(Lookup, null, {
  lookup: lookup
});

extend(Associative, null, {
  assoc: assoc,
  hasKey: hasKey
});

extend(Emptyable, null, {
  seq: identity
});

extend(Seqable, null, {
  seq: identity
});

extend(reduce, null, {
  reduce: reduce
});

extend(Seq, null, {
  first: first,
  rest: rest
});

extend(Next, null, {
  next: next
});