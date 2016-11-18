import {identity, constantly} from '../core';
import {extend, def} from '../protocol';
import Seq from '../protocols/seq';
import Next from '../protocols/next';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Collection from '../protocols/reduce';
import Deref from '../protocols/deref';
import Reduced from '../types/reduced';
import {EMPTY} from '../types/empty';

export function LazyList(head, tail){
  this.head = head;
  this.tail = tail;
}

export function lazyList(head, tail){
  return new LazyList(head, tail);
}

const empty = constantly(EMPTY);

function first(self){
  return self.head;
}

function rest(self){
  return self.tail();
}

function next(self){
  return Seqable.seq(self.tail());
}

function reduce(self, f, init){
  return init instanceof Reduced ? Deref.deref(init) : Reduce.reduce(self.tail(), f, f(init, self.head));
}

export function conj(self, value){
  return new LazyList(value, constantly(self));
}

def(Collection, {conj: conj, cons: conj})

export default extend(LazyList, Collection, {
  conj: conj,
  cons: conj
}, Emptyable, {
  empty: empty
}, Reduce, {
  reduce: reduce
}, Seqable, {
  seq: identity
}, Next, {
  next: next
}, Seq, {
  first: first,
  rest: rest
});