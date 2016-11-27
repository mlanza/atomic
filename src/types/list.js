import {identity, constantly, isIdentical} from '../core';
import {extend, extendProtocol} from '../protocol';
import {Seq} from '../protocols/seq';
import Emptyable from '../protocols/emptyable';
import {Seqable, seq} from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Collection from '../protocols/collection';
import Prepend from '../protocols/prepend';
import Counted from '../protocols/counted';
import Equiv from '../protocols/equiv';
import Indexed from '../protocols/indexed';
import Next from '../protocols/next';
import {Reduced, reduced} from '../types/reduced';
import {EMPTY} from '../types/empty';
import {iterator, equivSeq} from '../coll';

export function List(head, tail){
  this.head = head;
  this.tail = arguments.length > 1 ? tail : EMPTY;
}

List.prototype[Symbol.iterator] = function(){
  return iterator(this);
}

const empty = constantly(EMPTY);

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

function reduce(self, f, init){
  return init instanceof Reduced ? init.valueOf() : Reduce.reduce(self.tail, f, f(init, self.head));
}

export function prepend(self, value){
  return new List(value, self);
}

export function next(self){
  return self.tail === EMPTY ? null : self.tail;
}

export function count(self){
  const coll = next(self);
  return coll ? 1 : 1 + Counted.count(coll);
}

export function nth(self, n){
  if (n === 0) return self.head;
  const coll = next(self);
  return coll ? Indexed.nth(coll, n - 1) : null;
}

extendProtocol(Collection, {conj: prepend})

export default extend(List, Equiv, {
  equiv: equivSeq
}, Collection, {
  conj: prepend
}, Prepend, {
  prepend: prepend
}, Counted, {
  count: count
}, Indexed, {
  nth: nth
}, Next, {
  next: next
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