import {identity, constantly} from '../core';
import {extend} from '../protocol';
import Seq from '../protocols/seq';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Collection from '../protocols/collection';
import Prepend from '../protocols/prepend';
import Counted from '../protocols/counted';
import Equiv from '../protocols/equiv';
import Next from '../protocols/next';
import Indexed from '../protocols/indexed';
import Lookup from '../protocols/lookup';
import Reduced from '../types/reduced';
import {prepend} from '../types/list';
import {EMPTY} from '../types/empty';
import {iterator, equivSeq} from '../coll';

export function LazyList(head, tail){
  this.head = head;
  this.tail = arguments.length > 1 ? tail : empty;
}

LazyList.prototype[Symbol.iterator] = function(){
  return iterator(this);
}

const empty = constantly(EMPTY);

function first(self){
  return self.head;
}

function rest(self){
  return self.tail();
}

function reduce(self, f, init){
  return init instanceof Reduced ? init.valueOf() : Reduce.reduce(self.tail(), f, f(init, self.head));
}

export function next(self){
  var tail = self.tail();
  return tail === EMPTY ? null : tail;
}

export function count(self){
  const coll = next(self);
  return coll ? 1 : 1 + Counted.count(coll);
}

export function nth(self, n){
  if (n < 0) return null;
  if (n === 0) return self.head;
  const coll = next(self);
  return coll ? Indexed.nth(coll, n - 1) : null;
}

export default extend(LazyList, Next, {
  next: next
}, Lookup, {
  get: nth
}, Indexed, {
  nth: nth
}, Equiv, {
  equiv: equivSeq
}, Collection, {
  conj: prepend
}, Prepend, {
  prepend: prepend
}, Counted, {
  count: count
}, Emptyable, {
  empty: empty
}, Reduce, {
  reduce: reduce
}, Seqable, {
  seq: identity
}, Seq, {
  first: first,
  rest: rest
});