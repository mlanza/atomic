import {identity, constantly, noop, NIL, ZERO} from '../core';
import {extend} from '../protocol';
import Next from '../protocols/next';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Emptyable from '../protocols/emptyable';
import Collection from '../protocols/collection';
import Counted from '../protocols/counted';
import Prepend from '../protocols/prepend';
import Equiv from '../protocols/equiv';
import Reduced from '../types/reduced';
import LazyList from '../types/lazy-list';
import {prepend} from '../types/list';

export function Empty(){
}

export const EMPTY = new Empty();
export const count = ZERO;

function equiv(self, xs){
  return Counted.count(xs) === 0;
}

export function reduce(a, b, memo){
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export default extend(Empty, Equiv, {
  equiv: equiv
}, Counted, {
  count: count
}, Collection, {
  conj: prepend
}, Prepend, {
  prepend: prepend
}, Emptyable, {
  empty: identity
}, Reduce, {
  reduce: reduce
}, Seqable, {
  seq: NIL
}, Next, {
  next: NIL
}, Seq, {
  first: NIL,
  rest: identity
});