import {identity, constantly} from '../core';
import {extend, def} from '../protocol';
import Seq from '../protocols/seq';
import Next from '../protocols/next';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Collection from '../protocols/collection';
import Prepend from '../protocols/prepend';
import Deref from '../protocols/deref';
import Reduced from '../types/reduced';
import {EMPTY} from '../types/empty';

export function List(head, tail){
  this.head = head;
  this.tail = arguments.length > 1 ? tail : EMPTY;
}

export function list(head, tail){
  return new List(head, tail);
}

const empty = constantly(EMPTY);

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

function next(self){
  return Seqable.seq(self.tail);
}

function reduce(self, f, init){
  return init instanceof Reduced ? Deref.deref(init) : Reduce.reduce(self.tail, f, f(init, self.head));
}

export function prepend(self, value){
  return new List(value, self);
}

def(Collection, {conj: prepend})

export default extend(List, Collection, {
  conj: prepend
}, Prepend, {
  prepend: prepend
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