import {identity, constantly, noop} from '../core';
import {extend} from '../protocol';
import Deref from '../protocols/deref';
import Next from '../protocols/next';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Emptyable from '../protocols/emptyable';
import Collection from '../protocols/collection';
import Reduced from '../types/reduced';
import LazyList from '../types/lazy-list';
import {conj} from '../types/list';

export function Empty(){
}

export const EMPTY = new Empty();

export function reduce(){
  return Deref.deref(arguments[2]);
}

export default extend(Empty, Collection, {
  conj: conj,
  cons: conj
}, Emptyable, {
  empty: identity
}, Reduce, {
  reduce: reduce
}, Seqable, {
  seq: constantly(null)
}, Next, {
  next: constantly(null)
}, Seq, {
  first: constantly(null),
  rest: identity
});