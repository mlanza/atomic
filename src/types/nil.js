import {identity, always, noop} from '../core';
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

export const rest = always(EMPTY);
export const first = always(null);
export const next = always(null);
export const deref = always(null);

export function set(self, key, value){
  return Hash.set({}, key, value);
}

export const has = always(false);

export function isNil(value){
  return null == value;
}

export function reduce(){
  return arguments[2];
}

export const hasKey = always(false);

export function assoc(self, key, value){
  var obj = {};
  obj[key] = value;
  return obj;
}

export function conj(self, value){
  return new List(value, always(EMPTY));
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