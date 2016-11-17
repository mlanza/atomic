import {identity, always, noop} from '../core';
import {extend} from '../protocol';
import Reduced from '../types/reduced';
import List from '../types/list';
import Next from '../protocols/next';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Emptyable from '../protocols/emptyable';
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

export const seq = always(null);
export const first = always(null);
export const next = always(null);
export const rest = identity;
export const empty = identity;

/*
extend(Coll, Empty, {
  append: append,
  concat: concat,
  flatten: identity,
});
*/

extend(Emptyable, Empty, {
  empty: empty
});

extend(Reduce, Empty, {
  reduce: reduce
});

extend(Seqable, Empty, {
  seq: seq
});

extend(Next, Empty, {
  next: next
});

extend(Seq, Empty, {
  first: first,
  rest: rest
});

export default Empty;