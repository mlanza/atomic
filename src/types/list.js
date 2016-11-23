import {identity, constantly} from '../core';
import {extend, def} from '../protocol';
import Seq from '../protocols/seq';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Collection from '../protocols/collection';
import Prepend from '../protocols/prepend';
import Counted from '../protocols/counted';
import {Reduced, reduced} from '../types/reduced';
import {EMPTY} from '../types/empty';
import {iterator} from '../coll';

export function List(head, tail){
  this.head = head;
  this.tail = arguments.length > 1 ? tail : EMPTY;
}

List.prototype[Symbol.iterator] = function(){
  return iterator(this);
}

export function cons(head, tail){
  return new List(head, tail);
}

const empty = constantly(EMPTY);

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

function reduce(self, f, init){
  if (init instanceof Reduced) return init.valueOf();
  return Reduce.reduce(self.tail, f, f(init, self.head));
}

export function prepend(self, value){
  return new List(value, self);
}

export function count(self){
  var i = 0, coll = self;
  while(coll = Seqable.seq(coll)){
    i++;
    coll = Seq.rest(coll);
  }
  return i;
}

def(Collection, {conj: prepend})

export default extend(List, Collection, {
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