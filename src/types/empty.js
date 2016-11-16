import {identity, always, noop} from '../core';
import {extend} from '../protocol';
import Reduced from '../types/reduced';
import List from '../types/list';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import {deref} from '../protocols/deref';

export function Empty(){
}

export const EMPTY = new Empty();

export function append(self, value){
  return new List(value, always(self));
}

export function concat(self, other){
  return Coll.isEmpty(other) ? EMPTY : other;
}

export function reduce(){
  return deref(arguments[2]);
}

/*
extend(Coll, Empty, {
  empty: identity,
  isEmpty: always(true),
  toArray: always([]),
  toObject: always({}),
  first: always(null),
  rest: identity,
  initial: identity,
  append: append,
  concat: concat,
  flatten: identity,
  each: noop,
  reduce: reduce,
  map: identity,
  filter: identity,
  find: identity
});
*/

extend(Reduce, Empty, {
  reduce: reduce
});

extend(Seqable, Empty, {
  seq: always(null)
});

export default Empty;