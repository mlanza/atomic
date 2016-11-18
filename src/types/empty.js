import {identity, constantly, noop} from '../core';
import {extend} from '../protocol';
import Next from '../protocols/next';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Emptyable from '../protocols/emptyable';
import Collection from '../protocols/collection';
import Prepend from '../protocols/prepend';
import Reduced from '../types/reduced';
import LazyList from '../types/lazy-list';
import {prepend} from '../types/list';

export function Empty(){
}

export const EMPTY = new Empty();

export function reduce(a, b, memo){
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export default extend(Empty, Collection, {
  conj: prepend
}, Prepend, {
  prepend: prepend
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