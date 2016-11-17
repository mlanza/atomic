import {identity, constantly} from '../core';
import {extend} from '../protocol';
import Seq from '../protocols/seq';
import Next from '../protocols/next';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Collection from '../protocols/reduce';
import Deref from '../protocols/deref';
import Reduced from '../types/reduced';
import {EMPTY} from '../types/empty';

export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

export function list(head, tail){
  return new List(head, tail);
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

function conj(self, value){
  return new List(value, constantly(self));
}

extend(Collection, List, {
  conj: conj
});

extend(Emptyable, List, {
  empty: empty
});

extend(Reduce, List, {
  reduce: reduce
});

extend(Seqable, List, {
  seq: identity
});

extend(Next, List, {
  next: next
});

extend(Seq, List, {
  first: first,
  rest: rest
});

export default List;