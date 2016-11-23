import {identity, constantly} from '../core';
import {extend, def} from '../protocol';
import Seq from '../protocols/seq';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Collection from '../protocols/collection';
import Prepend from '../protocols/prepend';
import Counted from '../protocols/counted';
import Reduced from '../types/reduced';
import {prepend, count} from '../types/list';
import {EMPTY} from '../types/empty';
import {iterator} from '../coll';

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

export default extend(LazyList, Collection, {
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